const router = require('koa-router')();
const mysql = require("../../service/database_module");

// GET

// 获取快捷方式
router.get("/tools", async (ctx) => {
    let sql = `select * from tools where open = '1'`;
    let [res] = await mysql.db.query(sql);
    ctx.success(res);
});

// 获取学校信息
router.get("/college", async (ctx) => {
    let sql = `select * from edu`;
    let [res] = await mysql.db.query(sql);
    ctx.success(res);
});

// 获取初始化信息
router.get("/configs", async (ctx) => {
    ctx.success({
        spread: [{
            image: "/static/images/banner.png",
            url: "https://www.baidu.com"
        }],
        qc_code: "../../static/images/qc_code.jpg"
    });
})

module.exports = router.routes();