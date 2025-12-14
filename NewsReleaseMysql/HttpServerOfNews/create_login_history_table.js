const mysql = require('mysql');

// 创建数据库连接
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: '123456',
  database: 'newsrelease'
});

// 连接到数据库
connection.connect((err) => {
  if (err) {
    console.error('连接数据库失败: ' + err.stack);
    return;
  }
  console.log('成功连接到数据库，连接ID为 ' + connection.threadId);
  
  // 创建login_history表
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS login_history (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      username VARCHAR(255) NOT NULL,
      login_time DATETIME NOT NULL
    )
  `;
  
  connection.query(createTableQuery, (error, results, fields) => {
    if (error) {
      console.error('创建表失败: ' + error.stack);
      connection.end();
      return;
    }
    console.log('成功创建login_history表');
    connection.end();
  });
});