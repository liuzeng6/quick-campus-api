const path = require("path");
const fs = require("fs");
const { getDate } = require("../utils/time");
const config = {
    clientURL: "http://localhost:3000/uploads_files/",
    baseURL: "http://static.cymmc.top/uploads_files/",
    port: 3000,
    dev: true,
    DEBUG: true, //开启后错误信息统一返回Unknown error
    koaBodyConfig: {
        multipart: true,
        // encoding: "gzip",
        formidable: {
            keepExtensions: true,
            uploadDir: path.join(__dirname, "../public/uploads_files"),
            maxFieldsSize: 10 * 1024 * 1024,
            onFileBegin: (name, file) => {
                const dirName = getDate();
                const dir = path.join(__dirname, `../public/uploads_files/${dirName}`);
                if (!fs.existsSync(dir)) {
                    fs.mkdirSync(dir);
                }
                file.filepath = `${dir}/${file.newFilename}`
                file.path = `${dir}/${file.newFilename}`;
                file.newFilename = `${dirName}/${file.newFilename}`;
            },
        },
        
    },
    PAGESIZE: 15
}
module.exports = process.env.USERNAME == "liu" ? config : {
    ...config,
    clientURL: "https://cymmc.top:3000/uploads_files/",
    dev: false,
    DEBUG: false
}