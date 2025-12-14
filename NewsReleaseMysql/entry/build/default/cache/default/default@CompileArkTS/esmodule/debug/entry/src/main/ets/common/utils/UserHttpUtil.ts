import http from "@ohos:net.http";
import type { User } from '../../pages/zonghezuoye/User';
import ResponseResult from "@bundle:com.example.newsrelease/entry/ets/viewmodel/ResponseResult";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import type { ContentType } from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
/**
 * 用户注册接口
 *
 * @param user 用户信息
 * @returns 返回Promise<ResponseResult>，包含服务器响应结果
 */
export function registerUser(user: User): Promise<ResponseResult> {
    const url = 'http://localhost:9588/users/register';
    return httpRequest(url, http.RequestMethod.POST, user);
}
/**
 * 用户登录接口
 *
 * @param user 用户信息
 * @returns 返回Promise<ResponseResult>，包含服务器响应结果
 */
export function loginUser(user: User): Promise<ResponseResult> {
    const url = 'http://localhost:9588/users/login';
    return httpRequest(url, http.RequestMethod.POST, user);
}
/**
 * 发起HTTP请求到指定URL
 *
 * @param url 发起HTTP请求的URL地址
 * @param method 请求方法(GET/POST等)
 * @param params 请求附带的数据(可选)
 * @returns 返回Promise<ResponseResult>，包含服务器响应结果
 */
function httpRequest(url: string, method: http.RequestMethod, params?: User): Promise<ResponseResult> {
    // 创建HTTP请求对象
    let httpRequest = http.createHttp();
    // 发送HTTP请求
    let responseResult = httpRequest.request(url, {
        method: method,
        readTimeout: Constants.HTTP_READ_TIMEOUT,
        header: {
            'Content-Type': "application/json" // 设置请求头为JSON格式
        },
        connectTimeout: Constants.HTTP_READ_TIMEOUT,
        extraData: params // 请求附带的数据
    });
    // 创建响应结果对象
    let serverData = new ResponseResult();
    // 处理响应数据并返回
    return responseResult.then((value: http.HttpResponse) => {
        // 检查HTTP响应码是否为200(成功)
        if (value.responseCode === Constants.HTTP_CODE_200) {
            // 获取响应结果数据
            let result = `${value.result}`;
            // 解析JSON格式的响应数据
            let resultJson: ResponseResult = JSON.parse(result);
            // 检查服务器返回的业务状态码是否成功
            if (resultJson.code === Constants.SERVER_CODE_SUCCESS) {
                serverData.data = resultJson.data; // 设置响应数据
            }
            serverData.code = resultJson.code; // 设置业务状态码
            serverData.msg = resultJson.msg; // 设置响应消息
        }
        else {
            // HTTP响应码非200时设置错误消息
            serverData.msg = `HTTP错误: ${value.responseCode}`;
        }
        return serverData;
    }).catch((error: Object) => {
        // 请求异常时设置错误消息
        serverData.msg = `网络请求失败: ${JSON.stringify(error)}`;
        return serverData;
    });
}
