const mysql = require('../service/database_module');
const create = require('../utils/create');
const { getTime } = require("../utils/time");
module.exports = async (ctx, next) => {
    let token = ctx.headers.authorization;
    console.log(token, ctx.path);
    if (token) {
        let sql = `select * from user where token = ?`;
        let [[res]] = await ctx.db.query(sql, [token]);
        if (res) {
            ctx.id = res.id;
            await next();
        } else {
            let sql = `insert into user(id,token,nickname,\`password\`,avatar,is_certificated,gender,createtime,is_black) value(0,?,?,?,?,0,0,?,0)`
            let nickname = create.nickname();
            let password = ``;
            let avatar = `http://cos-cdn.xiaoqucloud.com/common/default_avatar/peach.png`;
            let createtime = getTime();
            let [res] = await mysql.db.query(sql, [token, nickname, password, avatar, createtime]);
            ctx.body = {
                msg: "register"
            }
        }
    } else {
        ctx.fail("请添加Authorization头");
    }
}