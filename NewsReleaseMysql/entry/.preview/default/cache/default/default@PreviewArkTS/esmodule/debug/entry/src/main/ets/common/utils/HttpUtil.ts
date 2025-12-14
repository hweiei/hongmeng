import http from "@ohos:net.http";
import type { NewsData } from '../../viewmodel/NewsData';
import ResponseResult from "@bundle:com.example.newsrelease/entry/ets/viewmodel/ResponseResult";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import type { ContentType } from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
/**
 * 发起HTTP GET请求到指定URL
 *
 * @param url 发起HTTP请求的URL地址
 * @returns 返回Promise<ResponseResult>，包含服务器响应结果
 */
export function httpRequestGet(url: string) {
    return httpRequest(url, http.RequestMethod.GET);
}
/**
 * 发起HTTP POST请求到指定URL
 *
 * @param url 发起HTTP请求的URL地址
 * @param newsData 请求附带的数据
 * @returns 返回Promise<ResponseResult>，包含服务器响应结果
 */
export function httpRequestPost(url: string, newsData: NewsData) {
    return httpRequest(url, http.RequestMethod.POST, newsData);
}
/**
 * 发起HTTP请求到指定URL
 *
 * @param url 发起HTTP请求的URL地址
 * @param method 请求方法(GET/POST等)
 * @param params 请求附带的数据(可选)
 * @returns 返回Promise<ResponseResult>，包含服务器响应结果
 */
function httpRequest(url: string, method: http.RequestMethod, params?: NewsData): Promise<ResponseResult> {
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
            serverData.msg = `${{ "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }}&${value.responseCode}`;
        }
        return serverData;
    }).catch(() => {
        // 请求异常时设置错误消息
        serverData.msg = { "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" };
        return serverData;
    });
}
