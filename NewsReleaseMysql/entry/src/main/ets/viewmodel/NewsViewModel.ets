/*
 *  Copyright (c) 2023 Huawei Device Co., Ltd.
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *  http://www.apache.org/licenses/LICENSE-2.0
 *  Unless required by applicable law or agreed to in writing, software
 *  distributed under the License is distributed on an "AS IS" BASIS,
 *  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *  See the License for the specific language governing permissions and
 *  limitations under the License.
 */

import { NewsData } from './NewsData';
import ResponseResult from './ResponseResult';
import Constants from '../common/constants/Constants';
import { httpRequestGet, httpRequestPost } from '../common/utils/HttpUtil';
import Logger from '../common/utils/Logger';

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
          resolve(data.data);                         // 返回成功的数据
        } else {
          Logger.error('getNewsList failed', JSON.stringify(data));  // 记录错误日志
          reject($r('app.string.page_none_msg'));     // 返回错误提示
        }
      }).catch((err: Error) => {
        Logger.error('getNewsList failed', JSON.stringify(err));    // 记录异常日志
        reject($r('app.string.http_error_message'));  // 返回网络错误提示
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
          resolve(result.data);                        // 返回成功的数据
        } else {
          reject($r('app.string.upload_error_message')); // 返回上传错误提示
        }
      }).catch((err: Error) => {
        Logger.error('uploadNews failed', JSON.stringify(err));     // 记录异常日志
        reject($r('app.string.upload_error_message'));  // 返回上传错误提示
      });
    });
  }
}

// 创建NewsViewModel实例
let newsViewModel = new NewsViewModel();

// 导出NewsViewModel实例
export default newsViewModel as NewsViewModel;