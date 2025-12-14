var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');

var indexRouter = require('./routes/index');
var filesRouter = require('./routes/files');
var newsRouter = require('./routes/news');
var commentsRouter = require('./routes/comments');
var usersRouter = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
// 配置中间件
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileUpload());
// 配置路由
app.use('/images',express.static('images'));
app.use('/', indexRouter);
app.use('/files', filesRouter);
app.use('/news', newsRouter);
app.use('/comments', commentsRouter);
app.use('/users', usersRouter);
// 错误处理
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});
// 启动服务器
app.listen(9588, () => {
  console.log('服务器启动成功！');
});

module.exports = app;