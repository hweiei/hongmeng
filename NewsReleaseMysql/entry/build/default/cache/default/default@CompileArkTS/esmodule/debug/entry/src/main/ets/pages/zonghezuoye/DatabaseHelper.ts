import relationalStore from "@ohos:data.relationalStore";
import { User } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/User";
import type common from "@ohos:app.ability.common";
export class DatabaseHelper {
    private rdbStore: relationalStore.RdbStore | null = null;
    private static DB_NAME = 'myDatabase.db';
    private static TABLE_NAME = 'users';
    private static instance: DatabaseHelper;
    // 单例模式
    public static getInstance(): DatabaseHelper {
        if (!DatabaseHelper.instance) {
            DatabaseHelper.instance = new DatabaseHelper();
        }
        return DatabaseHelper.instance;
    }
    // 初始化数据库
    async initialize(context: common.UIAbilityContext) {
        const config: relationalStore.StoreConfig = {
            name: DatabaseHelper.DB_NAME,
            securityLevel: relationalStore.SecurityLevel.S1 // 安全级别
        };
        const SQL_CREATE_TABLE = `
      CREATE TABLE IF NOT EXISTS ${DatabaseHelper.TABLE_NAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        password TEXT NOT NULL
      )`;
        try {
            this.rdbStore = await relationalStore.getRdbStore(context, config);
            await this.rdbStore.executeSql(SQL_CREATE_TABLE);
        }
        catch (err) {
            console.error('数据库初始化失败:', err);
        }
    }
    // 插入用户
    async insertUser(user: User): Promise<number> {
        if (!this.rdbStore) {
            console.error('数据库未初始化或连接失败');
            return -1;
        }
        const valueBucket: relationalStore.ValuesBucket = {
            'name': user.username,
            'password': user.password,
        };
        try {
            console.log('准备插入用户数据:', JSON.stringify(valueBucket));
            const result = await this.rdbStore.insert(DatabaseHelper.TABLE_NAME, valueBucket);
            console.log('插入成功，返回ID:', result);
            return result;
        }
        catch (err) {
            console.error('插入失败，错误详情:', err);
            return -1;
        }
    }
    // 查询所有用户
    async queryAllUsers(): Promise<User[]> {
        if (!this.rdbStore)
            return [];
        const predicates = new relationalStore.RdbPredicates(DatabaseHelper.TABLE_NAME);
        try {
            const resultSet = await this.rdbStore.query(predicates, ['id', 'name', "password"]);
            const users: User[] = [];
            while (resultSet.goToNextRow()) {
                const user = new User(resultSet.getString(resultSet.getColumnIndex('name')), resultSet.getString(resultSet.getColumnIndex('password')));
                user.id = resultSet.getLong(resultSet.getColumnIndex('id'));
                users.push(user);
            }
            resultSet.close();
            return users;
        }
        catch (err) {
            console.error('查询失败:', err);
            return [];
        }
    }
    // 更新用户
    async updateUser(user: User, userId: number): Promise<number> {
        console.log('更新用户，用户ID:', userId, '用户数据:', JSON.stringify(user));
        if (!this.rdbStore || !userId)
            return -1;
        const valueBucket: relationalStore.ValuesBucket = {
            'name': user.username,
            'password': user.password,
        };
        const predicates = new relationalStore.RdbPredicates(DatabaseHelper.TABLE_NAME)
            .equalTo('id', userId);
        try {
            const result = await this.rdbStore.update(valueBucket, predicates);
            console.log('更新成功，影响行数:', result);
            return result;
        }
        catch (err) {
            console.error('更新失败:', err);
            return -1;
        }
    }
    // 删除用户
    async deleteUser(userId: number): Promise<number> {
        console.log('删除用户，用户ID:', userId);
        if (!this.rdbStore) {
            console.log('数据库未初始化');
            return -1;
        }
        const predicates = new relationalStore.RdbPredicates(DatabaseHelper.TABLE_NAME)
            .equalTo('id', userId);
        try {
            console.log('执行删除操作');
            const result = await this.rdbStore.delete(predicates);
            console.log('删除成功，影响行数:', result);
            return result;
        }
        catch (err) {
            console.error('删除失败:', err);
            return -1;
        }
    }
    // 关闭数据库
    async close() {
        if (this.rdbStore) {
            await this.rdbStore.close();
            this.rdbStore = null;
        }
    }
}
