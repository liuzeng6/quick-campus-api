module.exports = async (ctx, next) => {
    try {
        await next();
    } catch (e) {
        console.log(e);
        ctx.fail("服务器内部错误",500);
    }
    if (ctx.status == 404) {
        ctx.fail("找不到文件", 404);
    }
}