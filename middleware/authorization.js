module.exports = async (ctx, next) => {
    let token = ctx.headers.authorization;
    if (token) {
        let sql = `select * from user where token = ?`;
        let [[res]] = await ctx.db.query(sql, [token]);
        if (res) {
            ctx.id = res.id;
            await next();
        } else {
            ctx.fail("没有找到对应的用户");
        }
    } else {
        ctx.fail("请添加Authorization头");
    }
}