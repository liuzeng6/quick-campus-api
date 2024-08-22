const {DEBUG} = require("../config/server.config");
module.exports = function routerResponse(option = {}) {
    return async function (ctx, next) {
        ctx.success = function (data, msg) {
            ctx.body = {
                code: option.successCode || 1,
                msg: msg || "success",
                data: data
            }
        }

        ctx.fail = function (msg, code) {
            ctx.body = {
                code: code || option.failCode || 0,
                msg: (DEBUG?msg:"Unknown error") || option.successMsg || 'fail',
            }
            console.log(ctx.body)
        }
        await next();
    }

}