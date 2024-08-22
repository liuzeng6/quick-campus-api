const router = require('koa-router')();
const mysql = require("../../service/database_module");

let getUserInfo = async (uid) => {
    let sql = `SELECT id,nickname,avatar,is_certificated,name,grade,major,wechat,mobile FROM user where id  = ?`
    let [[res]] = await mysql.db.query(sql, [uid]);
    return res;
}

let setUserInfo = async (uid, data) => {
    let { nickname, avatar, is_certificated, name, grade, major, wechat, mobile } = data;
    let sql = `update user set ${Object.keys(data).map(el => el += '=?').join()} where id = ?`
    let args = Object.values(data);
    args.push(uid);
    let [res] = await mysql.db.query(sql, args);
    return Boolean(res.affectedRows)
}

// GET

// 获取用户信息
router.get("/profile", async (ctx) => {
    let res = await getUserInfo(ctx.id);
    ctx.success(res);
});

// 获取小黑屋用户
router.get("/blacklist", async (ctx) => {
    let [res] = await mysql.db.query(`select id,nickname,avatar from user where is_black = 1`);
    res = res.map(el => {
        el.cause = "因违反社区规范被处以一周封禁的处罚";
        return el
    })
    ctx.success(res)
});

// POST

// 用户注册
router.post("/register", async (ctx) => {
    let { uniqueID } = ctx.request.body;
    let sql = `insert into user value(0,?,?,?)`
});
// PUT

// 更改用户信息
router.put("/profile", async (ctx) => {
    let uid = ctx.id;
    if (uid) {
        if (await setUserInfo(ctx.id, ctx.request.body)) {
            let res = await getUserInfo(ctx.id);
            ctx.success(res, "修改成功");
        } else {
            let res = await getUserInfo(ctx.id);
            ctx.fail(res, "修改失败")
        }
    } else {
        ctx.fail("有必填项没填");
    }
});



module.exports = router.routes();