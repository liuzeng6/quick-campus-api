const path = require("path");
const config = {
    baseURL: "http://localhost/",
    port: 3000,
    dev: true,
    DEBUG: true, //开启后错误信息统一返回Unknown error
    koaBodyConfig: {
        multipart: true,
        formidable: {
            keepExtensions: true,
            uploadDir: path.join(__dirname, "../uploads_files"),
            maxFieldsSize: 3 * 1024 * 1024
        },
    },
    PAGESIZE: 15
}
module.exports = process.env.USERNAME == "liu" ? config : {
    ...config,
    dev: false,
    DEBUG: false
}