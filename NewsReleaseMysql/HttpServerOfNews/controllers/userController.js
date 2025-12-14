const db = require('../config/db');

// 用户登录
exports.login = async (req, res) => {
    const { username, password } = req.body;
    
    console.log('登录请求:', { username, password });
    
    try {
        // 查询匹配的用户 (适配实际的数据库表结构)
        const results = await db.query(
            'SELECT id, username, password FROM users WHERE username = ? AND password = ?', 
            [username, password]
        );
        
        console.log('数据库查询结果:', results);
        
        if (results.length > 0) {
            // 登录成功
            const user = results[0];
            console.log('登录成功:', user);
            
            // 记录登录历史
            try {
                await db.query(
                    'INSERT INTO login_history (user_id, username, login_time) VALUES (?, ?, NOW())',
                    [user.id, user.username]
                );
                console.log('登录历史记录成功');
            } catch (historyError) {
                console.error('记录登录历史失败:', historyError);
            }
            
            res.json({
                code: 'success',
                msg: '登录成功',
                data: {
                    id: user.id,
                    username: user.username,
                    password: user.password
                }
            });
        } else {
            // 登录失败
            console.log('登录失败: 用户名或密码错误');
            res.status(401).json({
                code: 'error',
                msg: '用户名或密码错误',
                data: null
            });
        }
    } catch (error) {
        console.error('登录错误:', error);
        res.status(500).json({
            code: 'error',
            msg: '服务器内部错误: ' + error.message,
            data: null
        });
    }
};

// 用户注册
exports.register = async (req, res) => {
    const { username, password } = req.body;
    
    console.log('注册请求:', { username, password });
    
    try {
        // 检查用户名是否已存在 (适配实际的数据库表结构)
        const existingUsers = await db.query(
            'SELECT id FROM users WHERE username = ?', 
            [username]
        );
        
        console.log('检查用户名是否存在:', existingUsers);
        
        if (existingUsers.length > 0) {
            console.log('注册失败: 用户名已存在');
            res.status(400).json({
                code: 'error',
                msg: '用户名已存在',
                data: null
            });
            return;
        }
        
        // 创建新用户 (适配实际的数据库表结构)
        console.log('正在插入新用户');
        const result = await db.query(
            'INSERT INTO users (username, password) VALUES (?, ?)', 
            [username, password]
        );
        
        console.log('插入结果:', result);
        
        res.json({
            code: 'success',
            msg: '注册成功',
            data: {
                id: result.insertId,
                username: username
            }
        });
    } catch (error) {
        console.error('注册错误:', error);
        res.status(500).json({
            code: 'error',
            msg: '服务器内部错误: ' + error.message,
            data: null
        });
    }
};

// 获取所有用户（用于测试）
exports.getAllUsers = async (req, res) => {
    try {
        const users = await db.query('SELECT id, username FROM users');
        console.log('获取所有用户:', users);
        res.json({
            code: 'success',
            msg: '获取用户列表成功',
            data: users
        });
    } catch (error) {
        console.error('获取用户列表错误:', error);
        res.status(500).json({
            code: 'error',
            msg: '服务器内部错误: ' + error.message,
            data: null
        });
    }
};

// 删除用户
exports.deleteUser = async (req, res) => {
    const userId = req.params.id;
    
    console.log('删除用户请求，用户ID:', userId);
    
    try {
        // 开始事务处理
        await db.query('BEGIN');
        
        try {
            // 删除用户的登录历史记录
            await db.query('DELETE FROM login_history WHERE user_id = ?', [userId]);
            console.log('用户登录历史记录已删除');
            
            // 删除指定ID的用户
            const result = await db.query('DELETE FROM users WHERE id = ?', [userId]);
            
            // 提交事务
            await db.query('COMMIT');
            
            console.log('删除结果:', result);
            
            if (result.affectedRows > 0) {
                // 删除成功
                res.json({
                    code: 'success',
                    msg: '用户删除成功',
                    data: null
                });
            } else {
                // 用户不存在
                await db.query('ROLLBACK');
                res.status(404).json({
                    code: 'error',
                    msg: '用户不存在',
                    data: null
                });
            }
        } catch (error) {
            // 回滚事务
            await db.query('ROLLBACK');
            throw error;
        }
    } catch (error) {
        console.error('删除用户错误:', error);
        res.status(500).json({
            code: 'error',
            msg: '服务器内部错误: ' + error.message,
            data: null
        });
    }
};

// 获取登录历史
exports.getLoginHistory = async (req, res) => {
    try {
        // 获取最近的登录历史，只返回仍然存在的用户
        const history = await db.query(`
            SELECT lh.user_id as id, lh.username, MAX(lh.login_time) as latest_login
            FROM login_history lh
            INNER JOIN users u ON lh.user_id = u.id
            GROUP BY lh.user_id, lh.username
            ORDER BY latest_login DESC
        `);
        
        // 处理结果，只返回id和username字段以匹配前端期望的数据结构
        const processedHistory = history.map(item => ({
            id: item.id,
            username: item.username
        }));
        
        console.log('获取登录历史:', processedHistory);
        res.json({
            code: 'success',
            msg: '获取登录历史成功',
            data: processedHistory
        });
    } catch (error) {
        console.error('获取登录历史错误:', error);
        res.status(500).json({
            code: 'error',
            msg: '服务器内部错误: ' + error.message,
            data: null
        });
    }
};

// 更新用户密码
exports.updatePassword = async (req, res) => {
    const { username, newPassword } = req.body;
    
    console.log('更新密码请求:', { username, newPassword });
    
    try {
        // 检查用户是否存在
        const users = await db.query(
            'SELECT id FROM users WHERE username = ?', 
            [username]
        );
        
        console.log('检查用户是否存在:', users);
        
        if (users.length === 0) {
            console.log('更新密码失败: 用户不存在');
            res.status(404).json({
                code: 'error',
                msg: '用户不存在',
                data: null
            });
            return;
        }
        
        // 更新用户密码
        console.log('正在更新用户密码');
        const result = await db.query(
            'UPDATE users SET password = ? WHERE username = ?', 
            [newPassword, username]
        );
        
        console.log('更新结果:', result);
        
        if (result.affectedRows > 0) {
            res.json({
                code: 'success',
                msg: '密码更新成功',
                data: null
            });
        } else {
            res.status(500).json({
                code: 'error',
                msg: '密码更新失败',
                data: null
            });
        }
    } catch (error) {
        console.error('更新密码错误:', error);
        res.status(500).json({
            code: 'error',
            msg: '服务器内部错误: ' + error.message,
            data: null
        });
    }
};