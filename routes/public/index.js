const router = require('koa-router')();
const axios = require("axios")
const { appid, secret } = require("../../config/mp.config");
const grant_type = "authorization_code"
router.get("/weixin/openid", async (ctx) => {
    let { code } = ctx.query;
    let { data } = await axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${appid}&secret=${secret}&js_code=${code}&grant_type=${grant_type}`);
    if (data.openid) {
        ctx.success(data.openid)
    } else {
        ctx.fail("获取失败");
    }
})

module.exports = router.routes()