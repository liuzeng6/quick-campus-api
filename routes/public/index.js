const router = require('koa-router')();
const axios = require("axios")
const { appid, secret } = require("../../config/mp.config");
const grant_type = "authorization_code"
const mysql = require("../../service/database_module");
router.get("/weixin/openid", async (ctx) => {
    let { code } = ctx.query;
    let { data } = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=${grant_type}`);
    if (data.openid) {
        console.log(data);
        let openid = data.openid;
        let sql = `select openid from auth where openid = ?`;
        let [res] = await mysql.db.query(sql, [openid]);
        if (!res.length) {
            mysql.db.query(`insert into auth value(0,?)`, [openid]);
        }
        ctx.success(openid);
    } else {
        ctx.fail("获取失败");
    }
})

router.get("/weixin/oauth", async (ctx) => {
    let { code } = ctx.query;
    let sql = `select openid from auth where openid = ?`;
    let [res] = await mysql.db.query(sql, [code]);
    if (res.length) {
        ctx.success("ok");
    } else {
        ctx.fail("失败");
    }
})

module.exports = router.routes()