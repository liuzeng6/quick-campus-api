const router = require('koa-router')();
const axios = require("axios")
const { appid, secret } = require("../../config/mp.config");
const fs = require("fs/promises")
const grant_type = "authorization_code"
const mysql = require("../../service/database_module");
const webp = require('webp-converter');
webp.grant_permission();
const path = require('path');
const { clientURL } = require('../../config/server.config');
const { log } = require('console');
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
});

router.get("/uploads_files/:d1/:d2/zip", async (ctx) => {
    let { d1, d2 } = ctx.params;
    let _path = path.join(__dirname, "../../public/uploads_files", d1, d2);
    try {
        await fs.access(_path + '.webp');
        // console.log("从内存中读取");
        ctx.status = 302;
        ctx.redirect(clientURL + `${d1}/${d2}.webp`);
    } catch (e) {
        // 要进行处理
        console.log("压缩处理");
        let res = await webp.cwebp(_path, _path + '.webp', "-q 5", logging = "-v");
        ctx.status = 302;
        ctx.redirect(clientURL + `${d1}/${d2}.webp`);
    }
})

module.exports = router.routes();