const router = require('koa-router')();
const mysql = require("../../service/database_module");
let { PAGESIZE, baseURL } = require("../../config/server.config");
let { getTime } = require("../../utils/time");

// GET

//搜索帖子
router.get("/search/topics", async (ctx) => {
    let { keyword, page = 1, pageSize = PAGESIZE } = ctx.query;
    let start = (page - 1) * pageSize;
    let sql = `
        SELECT
            T.*,
            JSON_OBJECT( 'avatar', U.avatar, 'id', U.id, 'nickname', U.nickname) AS user 
        FROM
            topic AS T
            LEFT JOIN USER AS U ON U.id = T.uid 
        WHERE
            T.is_block = 0 and (T.content like ? or T.title like ?) and T.createtime != 0
        ORDER BY createtime desc
        LIMIT ${start},${pageSize}
    `;
    if (keyword) {
        keyword = `%${keyword}%`
        let [res] = await mysql.db.query(sql, [keyword, keyword]);
        res = res.map(el => {
            el.images = JSON.parse(el.images);
            el.is_block = el.is_block.data
            return el;
        })
        ctx.success(res);
    } else {
        ctx.fail("请携带参数");
    }
})
// 获取全部帖子
router.get("/topics", async (ctx) => {
    let { pageSize = PAGESIZE, page = 1, tag_id } = ctx.query;
    let start = (page - 1) * pageSize;
    let sql = `
        SELECT
            T.*,
            JSON_OBJECT( 'avatar', U.avatar, 'id', U.id, 'nickname', U.nickname) AS user 
        FROM
            topic AS T
            LEFT JOIN USER AS U ON U.id = T.uid 
        WHERE
            T.is_block = 0 and T.createtime != 0 ${tag_id ? `and tag_id = '${tag_id}'` : ""} 
        ORDER BY createtime desc
        LIMIT ${start},${pageSize}
    `;
    let [res] = await mysql.db.query(sql);
    res = res.map(el => {
        el.images = JSON.parse(el.images);
        el.is_block = el.is_block.data
        return el;
    })
    ctx.success(res);
});

// 获取帖子详情
router.get("/topics/:id", async (ctx) => {
    let { id } = ctx.params;

    if (((isNaN(Number(id))))) {
        ctx.fail("ID必须是数字");
        return false;
    }

    let sql = `
        SELECT
                T.*,
                JSON_OBJECT( 'avatar', U.avatar, 'id', U.id, 'nickname', U.nickname) AS user 
        FROM
                topic AS T
                LEFT JOIN USER AS U ON U.id = T.uid 
        WHERE
                T.is_block = 0 and T.id = ? and U.is_black = 0
    `;

    let [res] = await mysql.db.query(sql, [id]);
    if (res.length) {
        res = res.map(el => {
            el.images = JSON.parse(el.images);
            el.is_block = false;
            el.user.is_block = false;
            return el;
        })[0]
        ctx.success(res);
    } else {
        ctx.fail("帖子不存在获取已经被删除！");
    }
});

// 获取评论详情
router.get('/topics/comments/:id', async (ctx) => {
    let { id } = ctx.params;
    // sort = 1 表示按照时间排序 sort = 2表示按照热度排序
    let { sort = 1 } = ctx.query;
    if ((isNaN(Number(sort)) || (sort != 1 && sort != 2))) {
        ctx.fail("参数错误");
        return false;
    }
    if (((isNaN(Number(id))))) {
        ctx.fail("ID必须是数字");
        return false;
    }
    let sql = `
        SELECT
            C.*,
            JSON_OBJECT( 'avatar', U.avatar, 'id', U.id, 'nickname', U.nickname ) AS 'user',
            if(ISNULL(RC.id),"[]",CONCAT(
                '[',
                GROUP_CONCAT(
                    JSON_OBJECT(
                        'content',
                        RC.content,
                        "createtime",
                        RC.createtime,
                        "id",
                        RC.id,
                        "like_number",
                        RC.like_number,
                        'user',
                        JSON_OBJECT( 'avatar', RU.avatar, 'id', RU.id, 'nickname', RU.nickname ) 
                    )),
                ']' 
            )) as replies
        FROM
            COMMENT AS C
            LEFT JOIN COMMENT AS RC ON C.id = RC.rid and RC.is_block = 0
            LEFT JOIN USER as RU ON RC.uid = RU.id
            LEFT JOIN USER AS U ON C.uid = U.id 
        WHERE
            C.tid = ?
            AND C.is_block = 0 
            AND C.rid = 0 
        ORDER BY
            ${sort == 2 ? `C.like_number,C.createtime` : `C.createtime,C.like_number`}  
        `;
    let [res] = await mysql.db.query(sql, [id]);
    if (res.length) {
        res = res.map(el => {
            el.replies = JSON.parse(el.replies);
            el.reply_number = el.replies.length;
            el.is_block = false;
            el.user.is_block = false;
            return el;
        })
        ctx.success(res);
    } else {
        ctx.fail("帖子不存在获取已经被删除！");
    }
})

// 获取帖子标签
router.get("/tags", async (ctx) => {
    let sql = `select id,tag from classify where open='1'`;
    let [res] = await mysql.db.query(sql);
    ctx.success(res);
});

// 获取十大热榜
router.get('/popular/topics', async (ctx) => {
    let sql = `select * from popular`;
    let [res] = await mysql.db.query(sql);
    ctx.success(res);
});

// 获取本人发布的帖子
router.get('/my/topics', async (ctx) => {
    let uid = ctx.id;
    let sql = `
        SELECT
                T.*,
                JSON_OBJECT( 'avatar', U.avatar, 'id', U.id, 'nickname', U.nickname) AS user 
        FROM
                topic AS T
                LEFT JOIN USER AS U ON U.id = T.uid 
        WHERE
                T.is_block = 0 and T.uid = ? and U.is_black = 0
    `;
    let [res] = await mysql.db.query(sql, [uid]);
    res = res.map(el => {
        el.images = JSON.parse(el.images);
        return el;
    })
    ctx.success(res)
})

// 获取本人收藏的帖子
router.get('/my/collect/topics', async (ctx) => {
    let uid = ctx.id;
    let sql = `
        SELECT
            T.*,
            JSON_OBJECT( 'avatar', U.avatar, 'id', U.id, 'nickname', U.nickname ) AS user 
        FROM
            collect AS C
            LEFT JOIN user AS U ON u.id = C.uid
            LEFT JOIN topic AS T ON C.uid = T.id
        where C.uid = ? and C.createtime != 0
    `;
    let [res] = await mysql.db.query(sql, [uid]);
    res = res.map(el => {
        el.images = JSON.parse(el.images);
        return el;
    })
    ctx.success(res);
});

// 获取点赞我的
router.get('/my/likeds', async (ctx) => {
    let uid = ctx.id;
    let { page = 1, pageSize = PAGESIZE } = ctx.query;
    let start = (page - 1) * pageSize;
    let sql = `
        SELECT
            P.*,
            T.title,
            JSON_OBJECT( 'avatar', U.avatar, 'id', U.id, 'nickname', U.nickname ) AS 'user'
        FROM
            praise AS P
            LEFT JOIN USER AS U ON P.uid = U.id 
            LEFT JOIN topic AS T on T.id = P.tid 
        WHERE
            tid IN ( SELECT id FROM topic WHERE uid = ? )
        ORDER BY createtime DESC 
        LIMIT ${start},${pageSize};
    `;
    let [res] = await mysql.db.query(sql, [uid, uid]);
    ctx.success(res);
});

// 获取用户发帖/点赞/评论/收藏总数
router.get("/my/statistic", async (ctx) => {
    let uid = ctx.id;
    let collection_count, commented_count, liked_count, topic_count;
    [[{ collection_count }]] = await mysql.db.query(`select count(*) as collection_count from collect where uid = ?`, [uid]);
    // 收藏数量
    [[{ commented_count }]] = await mysql.db.query(`select count(*) as commented_count from comment where uid = ?`, [uid]);
    // 评论数量
    [[{ liked_count }]] = await mysql.db.query(`select count(*) as liked_count from praise where uid = ?`, [uid]);
    // 收到的点赞数量
    [[{ topic_count }]] = await mysql.db.query(`select count(*) as topic_count from topic where uid = ?`, [uid]);
    // 帖子数量
    ctx.success({
        collection_count, commented_count, liked_count, topic_count
    })
});

// 获取收到的回复和评论
router.get("/my/replieds", async (ctx) => {
    let uid = ctx.id;
    let { page = 1, pageSize = PAGESIZE } = ctx.query;
    let start = (page - 1) * pageSize;
    let sql = `
        SELECT
            C.*,
            RC.content AS source_review,
            JSON_OBJECT( 'avatar', U.avatar, 'id', U.id, 'nickname', U.nickname ) AS 'user' 
        FROM
            COMMENT AS C
            LEFT JOIN USER AS U ON U.id = C.uid
            LEFT JOIN COMMENT AS RC ON RC.rid = C.id 
        WHERE
            C.tid IN ( SELECT id FROM topic WHERE uid = ? ) 
            AND C.uid != ? 
        ORDER BY
            createtime DESC 
            LIMIT ${start},${pageSize}
    `;
    let [res] = await mysql.db.query(sql, [uid, uid]);
    ctx.success(res);
});

//POST 

// 快捷举报
router.post("/report/:id", async (ctx) => {
    let stamp = getTime();
    let uid = ctx.id;
    let { remark = "快捷举报", reported_id, reported_type } = ctx.request.body;
    if (remark && reported_id && reported_type) {
        let sql = `insert into reports value(0,?,?,?,?,?)`;
        let [res] = await mysql.db.query(sql, [remark, reported_id, reported_type, stamp, uid])
        if (res.affectedRows) {
            ctx.success("操作成功")
        } else {
            ctx.fail("操作失败");
        }
    } else {
        ctx.fail("传入的参数不对!");
        return false;
    }
});

// 回复评论
router.post("/replies", async (ctx) => {
    let stamp = getTime();
    let uid = ctx.id;
    let { content, comment_id, topic_id } = ctx.request.body;
    if (comment_id != undefined && topic_id && content) {
        let sql = `insert into comment value(0,?,?,0,?,?,0,0,?)`;
        let [res] = await mysql.db.query(sql, [topic_id, uid, content, stamp, comment_id])
        if (res.affectedRows) {
            ctx.success("操作成功")
        } else {
            ctx.fail("操作失败");
        }
    } else {
        ctx.fail("传入的参数不对!");
        return false;
    }
});

// 点赞帖子
router.post('/like/topics/:tid', async (ctx) => {
    let stamp = getTime();
    let uid = ctx.id;
    let { tid } = ctx.params;
    tid = Number(tid)
    if (((isNaN(tid)))) {
        ctx.fail("ID必须是数字");
        return false;
    }
    let sql = "select * from praise where uid = ? and tid = ?";
    let [data] = await mysql.db.query(sql, [uid, tid]);
    if (!data.length) {
        let [res] = await mysql.db.query(`insert into praise value(0,?,0,?,?,0)`, [uid, tid, stamp]);
        await mysql.db.query(`update topic set like_number = like_number+1 where id = ?`, [tid]);
        if (res.affectedRows) {
            ctx.success("操作成功")
        } else {
            ctx.fail("操作失败");
        }
    } else {
        ctx.fail("你已经点赞过了");
    }
});

// 点赞评论
router.post('/like/comments/:cid', async (ctx) => {
    let stamp = getTime();
    let uid = ctx.id;
    let { cid } = ctx.params;
    cid = Number(cid)
    if (((isNaN(cid)))) {
        ctx.fail("ID必须是数字");
        return false;
    }
    let sql = "select * from praise where uid = ? and cid = ?";
    let [data] = await mysql.db.query(sql, [uid, cid]);
    if (!data.length) {
        let [res] = await mysql.db.query(`insert into praise value(0,?,?,0,?,0)`, [uid, cid, stamp]);
        await mysql.db.query(`update comment set like_number = like_number+1 where id = ?`, [cid]);
        if (res.affectedRows) {
            ctx.success("操作成功")
        } else {
            ctx.fail("操作失败");
        }
    } else {
        ctx.fail("你已经点赞过了");
    }
});

// 发布帖子
router.post("/topics/publish", async (ctx) => {
    let stamp = getTime();
    let uid = ctx.id;
    let { content, resources, tag_id, title, eid = 0 } = ctx.request.body;
    resources = JSON.stringify(resources);
    if (content && resources && tag_id && title) {
        let sql = `INSERT INTO topic value(0,?,?,?,?,?,0,0,0,?,0,?)`;
        let [res] = await mysql.db.query(sql, [uid, title, stamp, content, resources, tag_id, eid]);
        if (res.affectedRows) {
            ctx.success({ id: res.insertId });
        } else {
            ctx.fail("发布失败");
        }
    } else {
        ctx.fail("参数错误");
    }
})

// 上传图片
router.post("/single/resources", async (ctx) => {
    let file = ctx.request.files.file;
    let filename = file.newFilename;
    let mimetypes = { image: 1, video: 2 }
    let type = mimetypes[file.mimetype.split('/')[0]] || 1;
    let url = baseURL + filename;
    let stamp = getTime();
    let uid = ctx.id;
    let sql = `INSERT INTO resources VALUE(0,?,?,?,?,?)`;
    let [res] = await mysql.db.query(sql, [stamp, uid, filename, url, type]);
    if (res.affectedRows) {
        ctx.success({ filename, url, id: res.insertId });
    } else {
        ctx.fail("操作失败");
    }
});

// 收藏帖子
router.post("/collect/topics/:tid", async (ctx) => {
    let uid = ctx.id;
    let { tid } = ctx.request.params;
    let stamp = getTime();
    tid = Number(tid);
    if (isNaN(tid)) {
        ctx.fail("ID必须是数字");
        return false;
    }
    let sql = `select * from collect where tid = ? and uid =? and createtime !=0`;
    let [res] = await mysql.db.query(sql, [tid, uid]);
    if (!res.length) {
        let [data] = await mysql.db.query(`insert into collect value(0,?,?,?)`, [uid, tid, stamp]);
        if (data.affectedRows) {
            ctx.success("操作成功");
        } else {
            ctx.fail("操作失败");
        }
    } else {
        ctx.fail("你已经收藏过该帖子了");
    }
})

// PUT

// 已读点赞我的
router.put('/my/likeds', async (ctx) => {
    let uid = ctx.id;
    let sql = `
        UPDATE praise 
        SET \`read\` = '1'
        WHERE
            uid = ?
    `;
    let [res] = await mysql.db.query(sql, [uid]);
    ctx.success("操作成功");
});

// 已读评论我的
router.put('/my/replieds', async (ctx) => {
    let uid = ctx.id;
    let sql = `
        UPDATE comment 
        SET \`read\` = '1'
        WHERE
            uid = ?
    `;
    let [res] = await mysql.db.query(sql, [uid]);
    ctx.success("操作成功");
});

// DELETE

// 删除收藏的帖子
router.delete('/my/collect/topics/:tid', async (ctx) => {
    let uid = ctx.id;
    let { tid } = ctx.params;
    if (((isNaN(Number(tid))))) {
        ctx.fail("ID必须是数字");
        return false;
    }
    let sql = `update collect set createtime = 0 where uid = ? and tid = ?`;
    let [res] = await mysql.db.query(sql, [uid, tid]);
    if (res.affectedRows) {
        ctx.success("操作成功");
    } else {
        ctx.success("删除失败，请检查该帖子是否属于你");
    }
});

// 删除发布的帖子
router.delete("/my/publish/topics/:tid", async (ctx) => {
    let uid = ctx.id;
    let { tid } = ctx.params;
    if (((isNaN(Number(tid))))) {
        ctx.fail("ID必须是数字");
        return false;
    }
    let sql = `update topic set createtime = 0 where uid = ? and id = ?`;
    let [res] = await mysql.db.query(sql, [uid, tid]);
    if (res.affectedRows) {
        ctx.success("操作成功");
    } else {
        ctx.success("删除失败，请检查该帖子是否属于你");
    }
});

// 取消点赞帖子
router.delete('/like/topics/:tid', async (ctx) => {
    let uid = ctx.id;
    let { tid } = ctx.params;
    tid = Number(tid)
    if (((isNaN(tid)))) {
        ctx.fail("ID必须是数字");
        return false;
    }

    let sql = "select * from praise where uid = ? and tid = ?";
    let [data] = await mysql.db.query(sql, [uid, tid]);
    if (data.length) {
        let [res] = await mysql.db.query(`delete from praise where uid = ? and tid = ? `, [uid, tid]);
        await mysql.db.query(`update topic set like_number = like_number - 1 where id = ?`, [tid]);
        if (res.affectedRows) {
            ctx.success("操作成功")
        } else {
            ctx.fail("操作失败");
        }
    } else {
        ctx.fail("你没有点赞过该帖子");
    }
});

// 取消点赞评论
router.delete('/like/comments/:cid', async (ctx) => {
    let uid = ctx.id;
    let { cid } = ctx.params;
    cid = Number(cid)
    if (((isNaN(cid)))) {
        ctx.fail("ID必须是数字");
        return false;
    }
    let sql = "select * from praise where uid = ? and cid = ?";
    let [data] = await mysql.db.query(sql, [uid, cid]);
    if (data.length) {
        let [res] = await mysql.db.query(`delete from praise where uid = ? and cid = ? `, [uid, cid]);
        await mysql.db.query(`update comment set like_number = like_number+1 where id = ?`, [cid]);
        if (res.affectedRows) {
            ctx.success("操作成功")
        } else {
            ctx.fail("操作失败");
        }
    } else {
        ctx.fail("你没有点赞过该评论");
    }
});

// 删除自己的评论
router.delete("/replies/:cid", async (ctx) => {
    let uid = ctx.id;
    let { cid } = ctx.request.params;
    cid = Number(cid)
    if (((isNaN(cid)))) {
        ctx.fail("ID必须是数字");
        return false;
    }
    let sql = `delete from comment  where uid = ? and id =?`;

    let [res] = await mysql.db.query(sql, [uid, cid]);
    if (res.affectedRows) {
        ctx.success("删除成功")
    } else {
        ctx.fail("删除失败，请检查该评论是否是自己发表的");
    }
});


module.exports = router.routes();