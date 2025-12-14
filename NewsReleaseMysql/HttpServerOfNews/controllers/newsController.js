/*  controllers/newsController.js */
const dbFile = require('../model/NewsDataModel');
const NewsData = require('../model/NewsData');
const NewsFile = require('../model/NewsFile');

const YEAR = '年';
const MONTH = '月';
const DAY = '日';
const DEFAULT_PAGE_SIZE = 10;
const SUCCESS_CODE = 'success';

/**
 * Get news type list.
 *
 * @param req request
 * @param res response
 */
const getNewsType = (req, res) => {
  res.send({ code: SUCCESS_CODE, data: dbFile.newsType, msg: '' });
};

/**
 * Get news list by currentPage and pageSize.
 *
 * @param req request
 * @param res response
 */
const getNewsList = (req, res) => {
  let {currentPage = 1, pageSize = DEFAULT_PAGE_SIZE} = req.query;
  console.log({currentPage});
  console.log({pageSize});
  const mysql=require('mysql');
  var db=mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'newsrelease'
  });
  var sql="SELECT *, author as author FROM news order by source desc limit "+(currentPage-1)*pageSize+","+pageSize;
  console.log({sql});
  db.query(sql, (err, data)=>{
    if(err)
      console.log('出错了', err);

    else
      console.log('成功了');
    console.log(JSON.stringify(data));
    res.send({ code: SUCCESS_CODE, data: data, msg: '' });
  });
};



/**
 * Get news type list.
 *
 * @param req request
 * @param res response
 */
const getNewsFiles = (req, res) => {
  let {currentPage = 1, pageSize = DEFAULT_PAGE_SIZE} = req.query;
  console.log({currentPage});
  console.log({pageSize});
  const mysql=require('mysql');
  var db=mysql.createConnection({host: 'localhost', user: 'root', password: '123456', database: 'newsrelease'});
  var sql="SELECT *, author as author FROM news order by source desc limit "+(currentPage-1)*pageSize+","+pageSize;
  console.log({sql});
  db.query(sql, (err, data)=>{
    if(err)
      console.log('出错了', err);

    else
      console.log('成功了');
    console.log(JSON.stringify(data));
    res.send({ code: SUCCESS_CODE, data: data, msg: '' });
  });
};

/**
 * Post news data.
 *
 * @param req request
 * @param res response
 */

const addNews = (req, res) => {
  var news = req.body;
  let nowDate = new Date();
  let month = (nowDate.getMonth() + 1).toString().padStart(2, '0');
  let day = nowDate.getDate().toString().padStart(2, '0');
  let createDate = nowDate.getFullYear() + YEAR + month + MONTH + day + DAY;
  var imageFile = new NewsFile(dbFile.maxFileId, news.imagesUrl[0].url, 0, dbFile.maxNewsId);
  var newsData = new NewsData(dbFile.maxNewsId, news.title, news.content, [imageFile], createDate);
  const mysql=require('mysql');
  var db=mysql.createConnection({host: 'localhost', user: 'root', password: '123456', database: 'newsrelease'});
  // 获取当前登录用户作为作者
  const author = news.author || '匿名用户';
  console.log('Received news data:', news);
  console.log('Author:', author);
  var sql="insert into news(title,content,imagesUrl,source,author) values('"+news.title+"','"+news.content+"','"+news.imagesUrl[0].url+"','"+createDate+"','"+author+"')";
  console.log({sql});
  db.query(sql, (err, data)=>{
    if(err)
      console.log('出错了', err);
    else
      console.log('成功了');
    console.log(JSON.stringify(data));

  res.send({ code: SUCCESS_CODE, data: dbFile.newsDataArray, msg: '' });
  });
};

/**
 * Delete news by ID.
 *
 * @param req request
 * @param res response
 */
const deleteNews = (req, res) => {
  const newsId = req.params.id;
  console.log('删除新闻请求，新闻ID:', newsId);
  
  const mysql = require('mysql');
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '123456',
    database: 'newsrelease'
  });
  
  const sql = "DELETE FROM news WHERE id = ?";
  console.log('执行SQL:', sql, '参数:', newsId);
  
  db.query(sql, [newsId], (err, result) => {
    if (err) {
      console.log('删除新闻出错:', err);
      res.status(500).send({ code: 'error', data: null, msg: '删除失败: ' + err.message });
    } else {
      console.log('删除成功，影响行数:', result.affectedRows);
      if (result.affectedRows > 0) {
        res.send({ code: SUCCESS_CODE, data: null, msg: '删除成功' });
      } else {
        res.status(404).send({ code: 'error', data: null, msg: '新闻不存在' });
      }
    }
  });
};

module.exports = {
  getNewsType,
  getNewsList,
  getNewsFiles,
  addNews,
  deleteNews
}