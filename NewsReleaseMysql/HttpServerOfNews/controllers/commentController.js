/* controllers/commentController.js */
const Comment = require('../model/Comment');

const SUCCESS_CODE = 'success';
const ERROR_CODE = 'error';

/**
 * 添加评论
 *
 * @param req request
 * @param res response
 */
const addComment = (req, res) => {
    try {
        const { newsId, username, content } = req.body;
        
        // 验证参数
        if (!newsId || !username || !content) {
            return res.status(400).send({
                code: ERROR_CODE,
                data: null,
                msg: '缺少必要参数'
            });
        }

        // 连接数据库
        const mysql = require('mysql');
        const db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'newsrelease'
        });

        // 插入评论到数据库 (create_time 字段会自动填充)
        const insertSql = "INSERT INTO comments (news_id, username, content) VALUES (?, ?, ?)";
        db.query(insertSql, [newsId, username, content], (err, result) => {
            if (err) {
                console.error('添加评论失败:', err);
                console.error('SQL语句:', insertSql);
                console.error('参数:', [newsId, username, content]);
                return res.status(500).send({
                    code: ERROR_CODE,
                    data: null,
                    msg: '服务器内部错误: ' + err.message
                });
            }

            // 返回新插入的评论
            const newComment = new Comment(result.insertId, parseInt(newsId), username, content, new Date().toISOString());
            
            res.send({
                code: SUCCESS_CODE,
                data: newComment,
                msg: '评论成功'
            });
        });

        // 关闭数据库连接
        db.end();
    } catch (error) {
        console.error('添加评论失败:', error);
        res.status(500).send({
            code: ERROR_CODE,
            data: null,
            msg: '服务器内部错误: ' + error.message
        });
    }
};

/**
 * 获取指定新闻的评论列表
 *
 * @param req request
 * @param res response
 */
const getCommentsByNewsId = (req, res) => {
    try {
        const { newsId } = req.query;
        
        if (!newsId) {
            return res.status(400).send({
                code: ERROR_CODE,
                data: null,
                msg: '缺少新闻ID参数'
            });
        }

        // 连接数据库
        const mysql = require('mysql');
        const db = mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '123456',
            database: 'newsrelease'
        });

        // 查询指定新闻的评论
        const selectSql = "SELECT id, news_id, username, content, create_time FROM comments WHERE news_id = ? ORDER BY create_time ASC";
        db.query(selectSql, [newsId], (err, results) => {
            if (err) {
                console.error('获取评论列表失败:', err);
                console.error('SQL语句:', selectSql);
                console.error('参数:', [newsId]);
                return res.status(500).send({
                    code: ERROR_CODE,
                    data: null,
                    msg: '服务器内部错误: ' + err.message
                });
            }

            // 转换结果为Comment对象数组
            const comments = results.map(row => {
                // 处理日期格式
                let createTime = new Date().toISOString();
                if (row.create_time) {
                    createTime = new Date(row.create_time).toISOString();
                }
                
                return new Comment(
                    row.id,
                    row.news_id,
                    row.username,
                    row.content,
                    createTime
                );
            });

            res.send({
                code: SUCCESS_CODE,
                data: comments,
                msg: ''
            });
        });

        // 关闭数据库连接
        db.end();
    } catch (error) {
        console.error('获取评论列表失败:', error);
        res.status(500).send({
            code: ERROR_CODE,
            data: null,
            msg: '服务器内部错误: ' + error.message
        });
    }
};

module.exports = {
    addComment,
    getCommentsByNewsId
};