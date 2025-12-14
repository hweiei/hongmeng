// 数据库配置文件
const mysql = require('mysql');

// 创建数据库连接池
// 注意：你需要根据实际情况修改用户名和密码
const pool = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',      // 修改为你的MySQL用户名
  password: '123456',      // 修改为你的MySQL密码
  database: 'newsrelease'
});

// 执行查询的辅助函数
const query = (sql, values) => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        reject(err);
        return;
      }
      
      connection.query(sql, values, (error, results) => {
        connection.release();
        
        if (error) {
          reject(error);
          return;
        }
        
        resolve(results);
      });
    });
  });
};

module.exports = {
  query
};