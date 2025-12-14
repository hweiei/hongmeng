import http from "@ohos:net.http";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import type { ContentType } from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import { User } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/User";
import { DatabaseHelper } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/DatabaseHelper";
// 定义响应数据类型
interface ResponseData {
    code: string;
    data: UserData | null;
}
interface RegisterResponseData {
    code: string;
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
                const userData = result.data;
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
        return matchedUser || null;
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
        }
        catch (error) {
            console.error('网络注册失败:', error);
        }
        // 网络注册失败，只保存到本地
        try {
            const user = new User(username, password);
            const result = await this.dbHelper.insertUser(user);
            return result > 0;
        }
        catch (error) {
            console.error('本地注册失败:', error);
            return false;
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
            return result.code === 'success';
        }
        return false;
    }
}
