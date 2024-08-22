let data = {
    "avatar": "http://cos-cdn.xiaoqucloud.com/common/default_avatar/colorball.png",
    "nickname": "小猫9gEHqHWEDvpycc"
}

let arr = [];

let sql = `update user set ${Object.keys(data).map(el=>el+"=?").join()}, where uid = ?`;

console.log(sql);
