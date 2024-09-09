// let data = {
//     "avatar": "http://cos-cdn.xiaoqucloud.com/common/default_avatar/colorball.png",
//     "nickname": "小猫9gEHqHWEDvpycc"
// }

const axios = require("axios");

// let arr = [];

// let sql = `update user set ${Object.keys(data).map(el=>el+"=?").join()}, where uid = ?`;

// console.log(sql);



// const shortid = require("js-shortid");
// console.log(shortid.gen());


axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=wx06f45464518f0963&secret=17d579c2e70b244474eccefce83dcdde&js_code=0b3tg3ll2IXu7e4EyYol2tdrfd4tg3lR&grant_type=authorization_code`).then(res=>{
    console.log(res);
})