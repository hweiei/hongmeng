var express = require('express');
var router = express.Router();
const newsController = require('../controllers/newsController');

router.get('/getNewsType', newsController.getNewsType);

router.get('/getNewsList', newsController.getNewsList);

router.get('/getNewsFiles', newsController.getNewsFiles);

router.post('/addNews', newsController.addNews);

// 添加删除新闻的路由
router.delete('/deleteNews/:id', newsController.deleteNews);

module.exports = router;