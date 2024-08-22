const config = {
    port: 3306,
    user: "root",
    password: "123456",
    host: "localhost",
    database: "quick-campus"
}
module.exports = process.env.USERNAME == "liu" ? config : {
    ...config,
    port: 3306,
    user: "root",
    password: "****",
    host: "rm-7xv1v9tum62935l670o.mysql.rds.aliyuncs.com",
    database: "quick-campus"
}