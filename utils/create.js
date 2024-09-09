const shortid = require("js-shortid");
const prefix = '小猫'
module.exports = {
    nickname() {
        return `${prefix}${shortid.gen()}`;
    }
}