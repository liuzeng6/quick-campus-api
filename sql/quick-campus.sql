/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 80031
 Source Host           : localhost:3306
 Source Schema         : quick-campus

 Target Server Type    : MySQL
 Target Server Version : 80031
 File Encoding         : 65001

 Date: 22/08/2024 21:01:55
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for classify
-- ----------------------------
DROP TABLE IF EXISTS `classify`;
CREATE TABLE `classify`  (
  `id` int NOT NULL AUTO_INCREMENT COMMENT '分类id',
  `tag` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '分类名称',
  `open` bit(1) NOT NULL DEFAULT b'1' COMMENT '是否启用 1表示开启 0表示关闭',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 7 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of classify
-- ----------------------------
INSERT INTO `classify` VALUES (1, '二手闲置', b'1');
INSERT INTO `classify` VALUES (2, '打听求助', b'1');
INSERT INTO `classify` VALUES (3, '分享生活', b'1');
INSERT INTO `classify` VALUES (4, '吐槽爆料', b'1');
INSERT INTO `classify` VALUES (5, '恋爱交友', b'1');
INSERT INTO `classify` VALUES (6, '拼车拼单', b'1');

-- ----------------------------
-- Table structure for collect
-- ----------------------------
DROP TABLE IF EXISTS `collect`;
CREATE TABLE `collect`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL COMMENT '用户ID',
  `tid` int NOT NULL COMMENT '帖子ID',
  `createtime` int NOT NULL COMMENT '创建时间 时间为0表示被删除',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of collect
-- ----------------------------
INSERT INTO `collect` VALUES (1, 1, 1, 11223);
INSERT INTO `collect` VALUES (2, 1, 2, 1723811115);
INSERT INTO `collect` VALUES (3, 1, 3, 1724241433);

-- ----------------------------
-- Table structure for comment
-- ----------------------------
DROP TABLE IF EXISTS `comment`;
CREATE TABLE `comment`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `tid` int NOT NULL COMMENT '主题ID',
  `uid` int NOT NULL COMMENT '用户ID（跟哪个用户关联）',
  `read` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否已读 0表示未读 1表示已读',
  `content` varchar(512) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '内容',
  `createtime` int NOT NULL COMMENT '发布时间',
  `like_number` int NOT NULL DEFAULT 0 COMMENT '点赞数',
  `is_block` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否被删除',
  `rid` int NOT NULL DEFAULT 0 COMMENT '是否是回复别人的评论',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of comment
-- ----------------------------
INSERT INTO `comment` VALUES (2, 1, 2, 0, '神经的要死 真的有病', 1723811115, 2, 1, 2);
INSERT INTO `comment` VALUES (4, 1, 2, 0, '小丑降临', 1723811114, 0, 0, 1);
INSERT INTO `comment` VALUES (5, 1, 1, 1, '是让人感到给对方', 232424, 0, 0, 0);
INSERT INTO `comment` VALUES (6, 14730, 1, 0, '波子牛逼', 1723973295, 0, 0, 37324);
INSERT INTO `comment` VALUES (7, 14730, 1, 0, '波子牛逼', 1723973823, 0, 0, 37324);
INSERT INTO `comment` VALUES (8, 14730, 1, 0, '波子牛逼', 1724240288, 0, 0, 0);

-- ----------------------------
-- Table structure for edu
-- ----------------------------
DROP TABLE IF EXISTS `edu`;
CREATE TABLE `edu`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `gid` int NOT NULL COMMENT '分类ID',
  `name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '学校名称',
  `logo` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '学校标志',
  `shortname` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '简称',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 3 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of edu
-- ----------------------------
INSERT INTO `edu` VALUES (1, 1, '长沙幼儿师范高等专科学校', 'https://ts2.cn.mm.bing.net/th?id=ODL.22d3fd7a9887735c2ce8624c59031381&w=80&h=80&c=1&vt=9&bgcl=d3beb4&r=0&o=6&pid=5.1', '幼儿师范');
INSERT INTO `edu` VALUES (2, 1, '长沙卫生职业技术学院', 'https://ts4.cn.mm.bing.net/th?id=ODLS.13ad924f-32c3-4125-8ce6-4eb03667fe8f&w=32&h=32&qlt=90&pcl=fffffa&o=6&pid=1.2', '卫生职院');

-- ----------------------------
-- Table structure for edu_group
-- ----------------------------
DROP TABLE IF EXISTS `edu_group`;
CREATE TABLE `edu_group`  (
  `id` int NOT NULL,
  `zone` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '区域，片区',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of edu_group
-- ----------------------------
INSERT INTO `edu_group` VALUES (1, '香山大学城');

-- ----------------------------
-- Table structure for popular
-- ----------------------------
DROP TABLE IF EXISTS `popular`;
CREATE TABLE `popular`  (
  `id` int NOT NULL,
  `tid` int NOT NULL COMMENT '帖子ID',
  `title` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '标题',
  `score` int NOT NULL COMMENT '热度',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of popular
-- ----------------------------
INSERT INTO `popular` VALUES (1, 5, '啊哈哈哈', 6789);

-- ----------------------------
-- Table structure for praise
-- ----------------------------
DROP TABLE IF EXISTS `praise`;
CREATE TABLE `praise`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL COMMENT '用户ID',
  `cid` int NOT NULL COMMENT '评论ID',
  `tid` int NOT NULL COMMENT '帖子ID',
  `createtime` int NOT NULL COMMENT '点赞时间',
  `read` tinyint NOT NULL DEFAULT 0 COMMENT '是否已读',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 20 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of praise
-- ----------------------------
INSERT INTO `praise` VALUES (2, 2, 0, 2, 24346, 0);
INSERT INTO `praise` VALUES (9, 1, 3, 0, 1723975537, 0);

-- ----------------------------
-- Table structure for reports
-- ----------------------------
DROP TABLE IF EXISTS `reports`;
CREATE TABLE `reports`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `remark` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '备注',
  `reported_id` int NOT NULL COMMENT '被举报的id',
  `type` tinyint NOT NULL COMMENT '1表示举报帖子',
  `createtime` int NOT NULL COMMENT '表示举报时间',
  `uid` int NOT NULL COMMENT '用户id',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `uid`(`uid`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 8 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of reports
-- ----------------------------
INSERT INTO `reports` VALUES (1, '快捷举报', 1, 1, 1723811115, 1);
INSERT INTO `reports` VALUES (2, '快捷举报', 14268, 1, 1723819669, 1);
INSERT INTO `reports` VALUES (7, '快捷举报', 14268, 1, 1723820152, 1);
INSERT INTO `reports` VALUES (8, '快捷举报', 14268, 1, 1723823583, 1);

-- ----------------------------
-- Table structure for resources
-- ----------------------------
DROP TABLE IF EXISTS `resources`;
CREATE TABLE `resources`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `createtime` int NOT NULL COMMENT '上传时间',
  `uid` int NOT NULL COMMENT '用户ID',
  `filename` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '文件名',
  `url` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '访问地址',
  `type` int NOT NULL DEFAULT 1 COMMENT '1表示图片 2表示视频',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 5 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of resources
-- ----------------------------
INSERT INTO `resources` VALUES (1, 1111, 1, '1.jpg', 'http://localhost:8080/1.jpg', 1);
INSERT INTO `resources` VALUES (2, 1111, 1, '1.jpg', 'http://localhost:8080/1.jpg', 1);
INSERT INTO `resources` VALUES (3, 1724235888, 1, 'f69fbe60b9cab8a93de6da000.yalijuda.com_9382ff95c1fe640e4a5516c63aa5733_Qr1kLdvagu.jpg', 'http://localhost/f69fbe60b9cab8a93de6da000.yalijuda.com_9382ff95c1fe640e4a5516c63aa5733_Qr1kLdvagu.jpg', 1);
INSERT INTO `resources` VALUES (4, 1724235921, 1, '72c298ed20013624d458d6e00.yalijuda.com_9382ff95c1fe640e4a5516c63aa5733_Qr1kLdvagu.jpg', 'http://localhost/72c298ed20013624d458d6e00.yalijuda.com_9382ff95c1fe640e4a5516c63aa5733_Qr1kLdvagu.jpg', 1);
INSERT INTO `resources` VALUES (5, 1724236714, 1, '3ede5cc3e60104da4625a9200.png', 'http://localhost/3ede5cc3e60104da4625a9200.png', 1);

-- ----------------------------
-- Table structure for tools
-- ----------------------------
DROP TABLE IF EXISTS `tools`;
CREATE TABLE `tools`  (
  `id` int NOT NULL,
  `name` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '显示文字',
  `wechat_app_id` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '跳转的appid',
  `path` varchar(128) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '跳转的页面',
  `icon_url` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '显示的图片',
  `navigate_mode` tinyint NOT NULL DEFAULT 3 COMMENT '跳转模式',
  `icon_source` tinyint NOT NULL DEFAULT 2 COMMENT '1表示本地图片 2表示网络图片',
  `open` bit(1) NOT NULL DEFAULT b'1' COMMENT '是否开启 1表示开启 0表示关闭',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of tools
-- ----------------------------
INSERT INTO `tools` VALUES (1, '实时公交', 'wxd7cf36728ee9afb6', 'pages/webview/index?url=https://qj.720pai.cn/tour/6a6a32538101a437&name=长沙幼儿师范高等专科学校', 'http://cos-cdn.xiaoqucloud.com/production/platform/XA00000j/de180fac6cf5512f2f70bda5e4edfa1a.png', 3, 2, b'1');

-- ----------------------------
-- Table structure for topic
-- ----------------------------
DROP TABLE IF EXISTS `topic`;
CREATE TABLE `topic`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `uid` int NOT NULL COMMENT '用户id（谁发布的）',
  `title` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '帖子标题',
  `createtime` int NOT NULL COMMENT '发布时间',
  `content` text CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '内容',
  `images` varchar(1024) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '[]' COMMENT '图片',
  `is_block` bit(1) NOT NULL DEFAULT b'0' COMMENT '是否被删除',
  `like_number` int NOT NULL DEFAULT 0 COMMENT '点赞量',
  `views` int NOT NULL DEFAULT 0 COMMENT '浏览量',
  `tag_id` int NOT NULL COMMENT '标签ID',
  `comment_number` int NOT NULL DEFAULT 0 COMMENT '评论量',
  `eid` int NOT NULL DEFAULT 0 COMMENT '学校ID,0表示所有可见',
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `title`(`title`) USING BTREE,
  FULLTEXT INDEX `content`(`content`)
) ENGINE = InnoDB AUTO_INCREMENT = 6 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of topic
-- ----------------------------
INSERT INTO `topic` VALUES (1, 1, '长高了', 1723746227, '不要狗叫', '[]', b'0', 1, 0, 1, 0, 0);
INSERT INTO `topic` VALUES (2, 1, '标题', 1723746227, '内容2', '[]', b'0', 0, 0, 2, 0, 0);
INSERT INTO `topic` VALUES (3, 1, '课表还没出来', 1724236918, '都快开学了，课表还没出来，长卫你到底想干嘛', '[1, 3]', b'0', 0, 0, 1, 0, 0);
INSERT INTO `topic` VALUES (4, 1, '课表还没出来', 1724237022, '都快开学了，课表还没出来，长卫你到底想干嘛', '[1,3]', b'0', 0, 0, 1, 0, 0);
INSERT INTO `topic` VALUES (5, 1, '课表还没出来', 0, '都快开学了，课表还没出来，长卫你到底想干嘛', '[1,3]', b'0', 0, 0, 1, 0, 0);

-- ----------------------------
-- Table structure for user
-- ----------------------------
DROP TABLE IF EXISTS `user`;
CREATE TABLE `user`  (
  `id` int NOT NULL AUTO_INCREMENT,
  `token` varchar(64) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户凭证',
  `nickname` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL COMMENT '用户名',
  `password` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT '' COMMENT '密码',
  `avatar` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NOT NULL DEFAULT 'http://cos-cdn.xiaoqucloud.com/common/default_avatar/peach.png' COMMENT '头像',
  `is_certificated` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否认证',
  `gender` tinyint(1) NOT NULL DEFAULT 0 COMMENT '性别 0表示男 1表示女',
  `createtime` int NOT NULL COMMENT '创建时间',
  `is_black` tinyint(1) NOT NULL DEFAULT 0 COMMENT '是否被封禁',
  `name` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '姓名',
  `eid` int NULL DEFAULT NULL COMMENT '学校ID',
  `grade` int NULL DEFAULT NULL COMMENT '年级',
  `major` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '专业',
  `picture` varchar(255) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '认证图片',
  `pass` tinyint(1) NULL DEFAULT NULL COMMENT '是否通过',
  `wechat` varchar(32) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '微信号',
  `mobile` varchar(16) CHARACTER SET utf8mb3 COLLATE utf8mb3_general_ci NULL DEFAULT NULL COMMENT '手机号',
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 4 CHARACTER SET = utf8mb3 COLLATE = utf8mb3_general_ci ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of user
-- ----------------------------
INSERT INTO `user` VALUES (1, 'OoPvL6mSXGJ7crsbcYCPBTDI91dK86IN', '用户一', '', 'http://cos-cdn.xiaoqucloud.com/common/default_avatar/colorball.png', 0, 0, 1723746227, 0, '刘大师', NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `user` VALUES (2, '123', '用户二', '', 'http://cos-cdn.xiaoqucloud.com/common/default_avatar/peach.png', 0, 0, 1723746227, 0, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);
INSERT INTO `user` VALUES (3, '123', '用户三', '', 'http://cos-cdn.xiaoqucloud.com/common/default_avatar/peach.png', 0, 0, 1723746227, 1, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL);

SET FOREIGN_KEY_CHECKS = 1;
