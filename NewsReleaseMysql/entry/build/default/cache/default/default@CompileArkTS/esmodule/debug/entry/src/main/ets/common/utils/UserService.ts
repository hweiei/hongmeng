import http from "@ohos:net.http";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import type { ContentType } from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import { User } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/User";
import { DatabaseHelper } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/DatabaseHelper";
// 定义响应数据类型
interface ResponseData {
    code: string;
    data: UserData | UserData[] | null;
    msg?: string;
}
interface RegisterResponseData {
    code: string;
    msg?: string;
}
interface UserData {
    id: number;
    name?: string;
    username?: string;
    password: string;
}
/**
 * 用户服务类，用于处理用户相关的网络请求和本地数据库操作
 */
export class UserService {
    private dbHelper: DatabaseHelper = DatabaseHelper.getInstance();
    /**
     * 用户登录
     * @param username 用户名
     * @param password 密码
     * @returns Promise<User | null>
     */
    async login(username: string, password: string): Promise<User | null> {
        try {
            // 首先尝试通过网络验证用户
            const networkUser = await this.networkLogin(username, password);
            if (networkUser) {
                // 网络验证成功，同步到本地数据库
                await this.syncUserToLocal(networkUser);
                return networkUser;
            }
        }
        catch (error) {
            console.warn('网络登录失败，尝试本地登录:', error);
            // 网络请求失败，尝试本地验证
        }
        // 网络验证失败，尝试本地验证
        return await this.localLogin(username, password);
    }
    /**
     * 网络登录验证
     * @param username 用户名
     * @param password 密码
     * @returns Promise<User | null>
     */
    private async networkLogin(username: string, password: string): Promise<User | null> {
        const url = `${Constants.SERVER}/users/login`;
        let httpRequest = http.createHttp();
        const response = await httpRequest.request(url, {
            method: http.RequestMethod.POST,
            readTimeout: Constants.HTTP_READ_TIMEOUT,
            header: {
                'Content-Type': "application/json"
            },
            connectTimeout: Constants.HTTP_READ_TIMEOUT,
            extraData: JSON.stringify({ username, password })
        });
        if (response.responseCode === 200) {
            const result = JSON.parse(`${response.result}`) as ResponseData;
            if (result.code === 'success' && result.data) {
                const userData = result.data as UserData;
                const user = new User(userData.name || userData.username || '', userData.password);
                user.id = userData.id;
                return user;
            }
        }
        return null;
    }
    /**
     * 本地登录验证
     * @param username 用户名
     * @param password 密码
     * @returns Promise<User | null>
     */
    private async localLogin(username: string, password: string): Promise<User | null> {
        const users = await this.dbHelper.queryAllUsers();
        const matchedUser = users.find(user => user.username === username && user.password === password);
        // 检查本地找到的用户是否仍然存在于后端数据库中
        if (matchedUser) {
            const isUserValid = await this.checkUserExistsInBackend(matchedUser.username);
            if (!isUserValid) {
                // 如果用户在后端不存在，则从本地数据库删除
                if (matchedUser.id) {
                    await this.dbHelper.deleteUser(matchedUser.id);
                }
                return null;
            }
        }
        return matchedUser || null;
    }
    /**
     * 检查用户是否存在于后端数据库
     * @param username 用户名
     * @returns Promise<boolean>
     */
    private async checkUserExistsInBackend(username: string): Promise<boolean> {
        try {
            const url = `${Constants.SERVER}/users/all`;
            let httpRequest = http.createHttp();
            const response = await httpRequest.request(url, {
                method: http.RequestMethod.GET,
                readTimeout: Constants.HTTP_READ_TIMEOUT,
                header: {
                    'Content-Type': "application/json"
                },
                connectTimeout: Constants.HTTP_READ_TIMEOUT
            });
            if (response.responseCode === 200) {
                const result = JSON.parse(`${response.result}`) as ResponseData;
                if (result.code === 'success' && result.data) {
                    const users = result.data as UserData[];
                    return users.some(user => user.username === username);
                }
            }
            return false;
        }
        catch (error) {
            console.error('检查用户是否存在于后端失败:', error);
            return false; // 出错时假设用户存在，避免误删本地数据
        }
    }
    /**
     * 同步用户信息到本地数据库
     * @param user 用户对象
     */
    private async syncUserToLocal(user: User): Promise<void> {
        try {
            const users = await this.dbHelper.queryAllUsers();
            const existingUser = users.find(u => u.username === user.username);
            if (existingUser) {
                // 更新现有用户
                await this.dbHelper.updateUser(user, existingUser.id as number);
            }
            else {
                // 添加新用户
                await this.dbHelper.insertUser(user);
            }
        }
        catch (error) {
            console.error('同步用户到本地数据库失败:', error);
        }
    }
    /**
     * 用户注册
     * @param username 用户名
     * @param password 密码
     * @returns Promise<boolean>
     */
    async register(username: string, password: string): Promise<boolean> {
        try {
            // 首先尝试网络注册
            const success = await this.networkRegister(username, password);
            if (success) {
                // 网络注册成功，同步到本地
                const user = new User(username, password);
                await this.dbHelper.insertUser(user);
                return true;
            }
            else {
                // 网络注册失败，返回false
                return false;
            }
        }
        catch (error) {
            console.error('网络注册失败:', error);
            // 将错误重新抛出，让调用者处理
            throw new Error((error as Error).message);
        }
    }
    /**
     * 网络注册
     * @param username 用户名
     * @param password 密码
     * @returns Promise<boolean>
     */
    private async networkRegister(username: string, password: string): Promise<boolean> {
        const url = `${Constants.SERVER}/users/register`;
        let httpRequest = http.createHttp();
        const response = await httpRequest.request(url, {
            method: http.RequestMethod.POST,
            readTimeout: Constants.HTTP_READ_TIMEOUT,
            header: {
                'Content-Type': "application/json"
            },
            connectTimeout: Constants.HTTP_READ_TIMEOUT,
            extraData: JSON.stringify({ username, password })
        });
        if (response.responseCode === 200) {
            const result = JSON.parse(`${response.result}`) as RegisterResponseData;
            if (result.code === 'success') {
                return true;
            }
            else if (result.msg) {
                // 如果有错误消息，抛出带有错误消息的异常
                throw new Error(result.msg);
            }
        }
        return false;
    }
    /**
     * 更新用户密码（同步更新本地和远程）
     * @param username 用户名
     * @param newPassword 新密码
     * @returns Promise<boolean>
     */
    async updatePassword(username: string, newPassword: string): Promise<boolean> {
        try {
            // 首先尝试通过网络更新密码
            const success = await this.networkUpdatePassword(username, newPassword);
            if (success) {
                // 网络更新成功，同步更新本地数据库
                await this.localUpdatePassword(username, newPassword);
                return true;
            }
            else {
                // 网络更新失败，返回false
                return false;
            }
        }
        catch (error) {
            console.error('网络更新密码失败:', error);
            // 将错误重新抛出，让调用者处理
            throw new Error((error as Error).message);
        }
    }
    /**
     * 网络更新密码
     * @param username 用户名
     * @param newPassword 新密码
     * @returns Promise<boolean>
     */
    private async networkUpdatePassword(username: string, newPassword: string): Promise<boolean> {
        // 注意：这是一个简化实现，实际项目中应该有更安全的密码重置机制
        const url = `${Constants.SERVER}/users/updatePassword`;
        let httpRequest = http.createHttp();
        const response = await httpRequest.request(url, {
            method: http.RequestMethod.PUT,
            readTimeout: Constants.HTTP_READ_TIMEOUT,
            header: {
                'Content-Type': "application/json"
            },
            connectTimeout: Constants.HTTP_READ_TIMEOUT,
            extraData: JSON.stringify({ username, newPassword })
        });
        if (response.responseCode === 200) {
            const result = JSON.parse(`${response.result}`) as ResponseData;
            return result.code === 'success';
        }
        return false;
    }
    /**
     * 本地更新密码
     * @param username 用户名
     * @param newPassword 新密码
     */
    private async localUpdatePassword(username: string, newPassword: string): Promise<void> {
        const users = await this.dbHelper.queryAllUsers();
        const user = users.find(u => u.username === username);
        if (user) {
            const updatedUser = new User(username, newPassword);
            updatedUser.id = user.id;
            await this.dbHelper.updateUser(updatedUser, user.id as number);
        }
        else {
            throw new Error('用户不存在');
        }
    }
}
