var express = require('express');
var router = express.Router();
const commentController = require('../controllers/commentController');

// 添加评论
router.post('/addComment', commentController.addComment);

// 获取指定新闻的评论列表
router.get('/getCommentsByNewsId', commentController.getCommentsByNewsId);

module.exports = router;