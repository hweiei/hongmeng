/*
 Navicat Premium Data Transfer

 Source Server         : localhost
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
-- Table structure for login_history
-- ----------------------------
DROP TABLE IF EXISTS `login_history`;
CREATE TABLE `login_history`  (
  `id` int(0) NOT NULL AUTO_INCREMENT,
  `user_id` int(0) NOT NULL,
  `username` varchar(255) NOT NULL,
  `login_time` datetime NOT NULL,
  PRIMARY KEY (`id`) USING BTREE,
  INDEX `user_id`(`user_id`) USING BTREE
) ENGINE = InnoDB AUTO_INCREMENT = 1 ROW_FORMAT = Dynamic;

SET FOREIGN_KEY_CHECKS = 1;