import type { NewsData } from './NewsData';
import type ResponseResult from './ResponseResult';
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import { httpRequestGet, httpRequestPost } from "@bundle:com.example.newsrelease/entry/ets/common/utils/HttpUtil";
import Logger from "@bundle:com.example.newsrelease/entry/ets/common/utils/Logger";
/**
 * 新闻数据视图模型类
 * 提供新闻数据的获取和上传功能
 */
class NewsViewModel {
    /**
     * 从服务器获取新闻列表数据
     *
     * @param currentPage 当前页码
     * @param pageSize 每页数据条数
     * @return Promise<NewsData[]> 返回新闻数据数组的Promise
     */
    getNewsList(currentPage: number, pageSize: number): Promise<NewsData[]> {
        return new Promise(async (resolve: Function, reject: Function) => {
            // 构建请求URL
            let url = `${Constants.SERVER}/${Constants.GET_NEWS_LIST}`;
            url += '?currentPage=' + currentPage + '&pageSize=' + pageSize;
            // 发起GET请求获取新闻列表
            httpRequestGet(url).then((data: ResponseResult) => {
                // 检查服务器返回的业务状态码是否成功
                if (data.code === Constants.SERVER_CODE_SUCCESS) {
                    resolve(data.data); // 返回成功的数据
                }
                else {
                    Logger.error('getNewsList failed', JSON.stringify(data)); // 记录错误日志
                    reject({ "id": 16777226, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }); // 返回错误提示
                }
            }).catch((err: Error) => {
                Logger.error('getNewsList failed', JSON.stringify(err)); // 记录异常日志
                reject({ "id": 16777224, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }); // 返回网络错误提示
            });
        });
    }
    /**
     * 上传新闻数据到服务器
     *
     * @param newsData 要上传的新闻数据
     * @returns Promise<NewsData[]> 返回上传后新闻数据数组的Promise
     */
    uploadNews(newsData: NewsData): Promise<NewsData[]> {
        return new Promise((resolve: Function, reject: Function) => {
            // 构建请求URL
            let url = `${Constants.SERVER}/${Constants.UPLOAD_NEWS}`;
            // 发起POST请求上传新闻数据
            httpRequestPost(url, newsData).then((result: ResponseResult) => {
                // 检查服务器返回的业务状态码是否成功
                if (result && result.code === Constants.SERVER_CODE_SUCCESS) {
                    resolve(result.data); // 返回成功的数据
                }
                else {
                    reject({ "id": 16777248, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }); // 返回上传错误提示
                }
            }).catch((err: Error) => {
                Logger.error('uploadNews failed', JSON.stringify(err)); // 记录异常日志
                reject({ "id": 16777248, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }); // 返回上传错误提示
            });
        });
    }
}
// 创建NewsViewModel实例
let newsViewModel = new NewsViewModel();
// 导出NewsViewModel实例
export default newsViewModel as NewsViewModel;
