const router = require('koa-router')();
const authorization = require("../middleware/authorization");

const fs = require('fs');
const path = require('path');

function getDirectories(directoryPath) {
  const files = fs.readdirSync(directoryPath);
  const directories = [];

  for (const file of files) {
    const filePath = path.join(directoryPath, file);
    const stats = fs.statSync(filePath);

    if (stats.isDirectory()) {
      directories.push(file);
    }
  }

  return directories;
}

let routes = getDirectories(path.join(__dirname));
router.use(authorization);
routes.forEach(el => {
  router.use(`/${el}`, require(`./${el}/index.js`));
});

module.exports = router.routes();

