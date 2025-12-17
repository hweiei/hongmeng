var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController');

// 用户登录路由
router.post('/login', express.json(), userController.login);

// 用户注册路由
router.post('/register', express.json(), userController.register);

// 获取所有用户（测试用）
router.get('/all', userController.getAllUsers);

// 删除用户路由
router.delete('/:id', userController.deleteUser);

// 获取登录历史
router.get('/login-history', userController.getLoginHistory);

// 更新用户密码路由
router.put('/updatePassword', express.json(), userController.updatePassword);

// 获取用户详细信息
router.get('/profile/:id', userController.getUserProfile);

// 更新用户详细信息
router.put('/profile/:id', express.json(), userController.updateUserProfile);

module.exports = router;