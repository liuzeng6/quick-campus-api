// 导入 Koa、Koa Router、Koa Static 和 Koa Bodyparser
const Koa = require('koa');
const Router = require('koa-router');
const static = require('koa-static');
const { koaBody } = require("koa-body");
const path = require('path');
const fs = require("fs/promises");
const cors = require("@koa/cors");
const mysql = require('mysql2/promise'); // 或使用你选择的数据库库
const routerResponse = require("./middleware/routerResponse.js");


// 引入服务器相关配置
const { koaBodyConfig, port: PORT } = require("./config/server.config.js");
const databaseConfig = require("./config/database.config.js");

// 数据库中转模块
const databaseModule = require("./service/database_module");

// 创建数据库连接
const pool = mysql.createPool(databaseConfig);
pool.getConnection().then(db => {
    // 加入到中转模块
    databaseModule.db = db;
    // 加入到app实例上
    app.context.db = db;
});

// 创建 Koa 实例
const app = new Koa();
const router = new Router();

// 配置统一响应
app.use(routerResponse());
// 配置跨域
app.use(cors());
// 配置静态文件路由
app.use(static(path.join(__dirname, "public")));
// 解析 POST 请求的数据
app.use(koaBody(koaBodyConfig));
// 使用路由中间件
app.use(require("./middleware/errorHandler"));
// 错误处理中间件
app.use(router.routes())
// 启动服务器
router.use(require("./routes/public/index"));
router.use(require("./routes/index.js"));

app.listen(PORT, () => {
    console.log(`服务器正在运行在 http://localhost:${PORT}`);
});
