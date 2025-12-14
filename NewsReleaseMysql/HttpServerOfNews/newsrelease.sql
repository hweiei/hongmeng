/*
 Navicat Premium Data Transfer

 Source Server         : cjfoffice
 Source Server Type    : MySQL
 Source Server Version : 80030
 Source Host           : localhost:3306
 Source Schema         : newsrelease

 Target Server Type    : MySQL
 Target Server Version : 80030
 File Encoding         : 65001

 Date: 30/12/2024 11:29:45
*/

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
-- Table structure for news
-- ----------------------------
DROP TABLE IF EXISTS `news`;
CREATE TABLE `news`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `title` varchar(500)  NULL DEFAULT NULL,
  `content` text  NULL,
  `imagesUrl` varchar(1000)  NULL DEFAULT NULL,
  `source` varchar(255)  NULL DEFAULT NULL,
  `author` varchar(255) NULL DEFAULT NULL,
  PRIMARY KEY (`id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 15  ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of news
-- ----------------------------
INSERT INTO `news` VALUES (4, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '张三');
INSERT INTO `news` VALUES (5, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '李四');
INSERT INTO `news` VALUES (6, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '王五');
INSERT INTO `news` VALUES (7, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '赵六');
INSERT INTO `news` VALUES (8, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '钱七');
INSERT INTO `news` VALUES (9, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '孙八');
INSERT INTO `news` VALUES (10, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '周九');
INSERT INTO `news` VALUES (11, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '吴十');
INSERT INTO `news` VALUES (12, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '郑一');
INSERT INTO `news` VALUES (13, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '王二');
INSERT INTO `news` VALUES (14, '中考学子奔赴考场 市区这些路段绕行', '中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行中考学子奔赴考场 市区这些路段绕行', '/images/ic_yunnan.png', '2023年04月20日', '张三');
INSERT INTO `news` VALUES (15, 'test', 'test', '/images/1.jpg.jpg', '2024年12月30日', '测试用户');
INSERT INTO `news` VALUES (16, 'test2', 'test2', '/images/1.jpg.jpg', '2024年12月30日', '测试用户');

-- ----------------------------
-- Table structure for users
-- ----------------------------
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  UNIQUE INDEX `username`(`username`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 ROW_FORMAT = Dynamic;

-- ----------------------------
-- Records of users
-- ----------------------------
INSERT INTO `users` VALUES (1, 'admin', 'admin123');

SET FOREIGN_KEY_CHECKS = 1;
```