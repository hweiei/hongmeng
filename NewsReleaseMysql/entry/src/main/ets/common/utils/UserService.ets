import http from '@ohos.net.http';
import { BusinessError } from '@kit.BasicServicesKit';
import { promptAction } from '@kit.ArkUI';

// 定义响应数据接口
interface BaseResponse {
  code: string;
  msg: string;
  data?: object;
}

export interface LoginData {
  id: number;
  username: string;
  password: string;
}

interface LoginResponse extends BaseResponse {
  data?: LoginData;
}

export class UserService {
  private readonly BASE_URL: string = 'http://172.17.75.16:9588'; // 后端服务地址

  /**
   * 用户注册方法
   * @param username 用户名
   * @param password 密码
   * @returns Promise<boolean> 注册是否成功
   */
  async register(username: string, password: string, email?: string, phone?: string, fullName?: string): Promise<boolean> {
    let httpRequest = http.createHttp();
    
    return new Promise<boolean>((resolve, reject) => {
      httpRequest.request(
        `${this.BASE_URL}/users/register`,
        {
          method: http.RequestMethod.POST,
          header: { 'Content-Type': 'application/json' },
          extraData: JSON.stringify({ 
            username: username, 
            password: password,
            email: email || '',
            phone: phone || '',
            fullName: fullName || ''
          }),
          readTimeout: 50000,
          connectTimeout: 50000
        },
        (err: BusinessError, data: http.HttpResponse) => {
          if (!err) {
            console.info('注册请求成功:' + JSON.stringify(data));
            try {
              if (data && data.result) {
                let result: BaseResponse;
                if (typeof data.result === 'string') {
                  result = JSON.parse(data.result) as BaseResponse;
                } else {
                  result = data.result as BaseResponse;
                }
                
                if (result && result.code === 'success') {
                  resolve(true);
                } else {
                  const errorMsg = result ? (result.msg || '未知错误') : '响应数据为空';
                  reject(new Error(errorMsg));
                }
              } else {
                reject(new Error('响应数据格式错误'));
              }
            } catch (parseError) {
              console.error('解析响应数据失败:', parseError);
              reject(new Error('数据解析失败: ' + (parseError as Error).message));
            }
          } else {
            console.error('注册请求失败:' + JSON.stringify(err));
            const errorMsg = err.message || '未知网络错误';
            reject(new Error(errorMsg));
          }
          httpRequest.destroy();
        }
      );
    });
  }

  /**
   * 用户登录方法
   * @param username 用户名
   * @param password 密码
   * @returns Promise<LoginData | null> 登录结果
   */
  async login(username: string, password: string): Promise<LoginData | null> {
    let httpRequest = http.createHttp();
    
    return new Promise<LoginData | null>((resolve, reject) => {
      httpRequest.request(
        `${this.BASE_URL}/users/login`,
        {
          method: http.RequestMethod.POST,
          header: { 'Content-Type': 'application/json' },
          extraData: JSON.stringify({ username: username, password: password }),
          readTimeout: 50000,
          connectTimeout: 50000
        },
        (err: BusinessError, data: http.HttpResponse) => {
          if (!err) {
            console.info('登录请求成功:' + JSON.stringify(data));
            try {
              if (data && data.result) {
                let result: LoginResponse;
                if (typeof data.result === 'string') {
                  result = JSON.parse(data.result) as LoginResponse;
                } else {
                  result = data.result as LoginResponse;
                }
                
                if (result && result.code === 'success' && result.data) {
                  resolve(result.data);
                } else {
                  const errorMsg = result ? (result.msg || '未知错误') : '响应数据为空';
                  reject(new Error(errorMsg));
                }
              } else {
                reject(new Error('响应数据格式错误'));
              }
            } catch (parseError) {
              console.error('解析响应数据失败:', parseError);
              reject(new Error('数据解析失败: ' + (parseError as Error).message));
            }
          } else {
            console.error('登录请求失败:' + JSON.stringify(err));
            const errorMsg = err.message || '未知网络错误';
            reject(new Error(errorMsg));
          }
          httpRequest.destroy();
        }
      );
    });
  }

  /**
   * 更新用户密码
   * @param username 用户名
   * @param newPassword 新密码
   * @returns Promise<boolean> 是否更新成功
   */
  async updatePassword(username: string, newPassword: string): Promise<boolean> {
    let httpRequest = http.createHttp();
    
    return new Promise<boolean>((resolve, reject) => {
      httpRequest.request(
        `${this.BASE_URL}/users/updatePassword`,
        {
          method: http.RequestMethod.PUT,
          header: { 'Content-Type': 'application/json' },
          extraData: JSON.stringify({ username: username, newPassword: newPassword }),
          readTimeout: 50000,
          connectTimeout: 50000
        },
        (err: BusinessError, data: http.HttpResponse) => {
          if (!err) {
            console.info('更新密码请求成功:' + JSON.stringify(data));
            try {
              if (data && data.result) {
                let result: BaseResponse;
                if (typeof data.result === 'string') {
                  result = JSON.parse(data.result) as BaseResponse;
                } else {
                  result = data.result as BaseResponse;
                }
                
                if (result && result.code === 'success') {
                  resolve(true);
                } else {
                  const errorMsg = result ? (result.msg || '未知错误') : '响应数据为空';
                  reject(new Error(errorMsg));
                }
              } else {
                reject(new Error('响应数据格式错误'));
              }
            } catch (parseError) {
              console.error('解析响应数据失败:', parseError);
              reject(new Error('数据解析失败: ' + (parseError as Error).message));
            }
          } else {
            console.error('更新密码请求失败:' + JSON.stringify(err));
            const errorMsg = err.message || '未知网络错误';
            reject(new Error(errorMsg));
          }
          httpRequest.destroy();
        }
      );
    });
  }
}