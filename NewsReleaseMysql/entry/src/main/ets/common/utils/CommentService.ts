import http from '@ohos.net.http';
import Comment from '../../models/Comment';


// 定义响应数据类型
interface ResultData {
    code?: string;
    data?: object | null;
    msg?: string;
}

interface HttpResponse {
    result?: ResultData;
}

interface CommentItem {
    id: number;
    news_id: number;
    username: string;
    content: string;
    create_time: string;
}

interface DataObject {
    id: number;
}

// 定义请求数据类型
interface RequestData {
    newsId: number;
    username: string;
    content: string;
}

export default class CommentService {
    /**
     * 添加评论
     * @param newsId 新闻ID
     * @param username 用户名
     * @param content 评论内容
     * @returns Promise<Comment>
     */
    static async addComment(newsId: number, username: string, content: string): Promise<Comment> {
        return new Promise((resolve, reject) => {
            let httpRequest = http.createHttp();
            const requestData: RequestData = {
                newsId: newsId,
                username: username,
                content: content
            };
            
            console.info('发送评论请求数据:', JSON.stringify(requestData));

            // 发送POST请求
            httpRequest.request(
                "http://172.17.75.16:3000" + '/comments/addComment',
                {
                    method: http.RequestMethod.POST,
                    extraData: requestData,
                    header: { 'Content-Type': 'application/json' }
                },
                (err, data) => {
                    if (!err) {
                        console.info('评论请求成功:', JSON.stringify(data));
                        
                        // 处理响应数据
                        let responseText = '';
                        if (typeof data.result === 'string') {
                            responseText = data.result;
                        } else if (data.result && typeof data.result === 'object') {
                            responseText = JSON.stringify(data.result);
                        }
                        
                        console.info('响应体文本:', responseText);
                        
                        // 解析JSON
                        try {
                            const responseJson: object = JSON.parse(responseText);
                            const responseData: HttpResponse = { result: responseJson };
                            
                            if (responseData.result && responseData.result.code === 'success') {
                                const resultData: ResultData = responseData.result;
                                if (resultData.data && typeof resultData.data === 'object' && resultData.data !== null) {
                                    const dataObj: DataObject = resultData.data as DataObject;
                                    const comment = new Comment();
                                    comment.id = dataObj.id;
                                    comment.newsId = newsId;
                                    comment.username = username;
                                    comment.content = content;
                                    comment.createTime = new Date().toLocaleString();
                                    resolve(comment);
                                } else {
                                    reject('添加评论失败: 数据格式错误');
                                }
                            } else {
                                // 从响应中提取错误信息
                                const errorMsg = responseData.result?.msg || '服务器返回错误';
                                reject('添加评论失败: ' + errorMsg);
                            }
                        } catch (parseError) {
                            console.error('解析响应数据失败:', parseError);
                            reject('解析响应数据失败');
                        }
                    } else {
                        console.error('评论请求失败:', err);
                        reject('网络请求失败，请检查网络连接');
                    }
                    
                    // 销毁HTTP请求对象
                    httpRequest.destroy();
                }
            );
        });
    }
    
    /**
     * 获取指定新闻的评论列表
     * @param newsId 新闻ID
     * @returns Promise<Comment[]>
     */
    static async getCommentsByNewsId(newsId: number): Promise<Comment[]> {
        return new Promise((resolve, reject) => {
            let httpRequest = http.createHttp();
            
            // 发送GET请求
            httpRequest.request(
                "http://172.17.75.16:3000" + '/comments/getCommentsByNewsId?newsId=' + newsId,
                {
                    method: http.RequestMethod.GET,
                    header: { 'Content-Type': 'application/json' }
                },
                (err, data) => {
                    if (!err) {
                        console.info('获取评论列表请求成功:', JSON.stringify(data));
                        
                        // 处理响应数据
                        let responseText = '';
                        if (typeof data.result === 'string') {
                            responseText = data.result;
                        } else if (data.result && typeof data.result === 'object') {
                            responseText = JSON.stringify(data.result);
                        }
                        
                        console.info('响应体文本:', responseText);
                        
                        // 解析JSON
                        try {
                            const responseJson: object = JSON.parse(responseText);
                            const responseData: HttpResponse = { result: responseJson };
                            
                            if (responseData.result && responseData.result.code === 'success') {
                                const comments: Comment[] = [];
                                if (responseData.result.data && Array.isArray(responseData.result.data)) {
                                    const dataArray: Array<object | null> = responseData.result.data;
                                    dataArray.forEach((item: object | null) => {
                                        if (item && typeof item === 'object' && item !== null) {
                                            const commentItem: CommentItem = item as CommentItem;
                                            const comment = new Comment();
                                            comment.id = commentItem.id;
                                            comment.newsId = commentItem.news_id;
                                            comment.username = commentItem.username;
                                            comment.content = commentItem.content;
                                            comment.createTime = commentItem.create_time;
                                            comments.push(comment);
                                        }
                                    });
                                }
                                resolve(comments);
                            } else {
                                // 从响应中提取错误信息
                                const errorMsg = responseData.result?.msg || '服务器返回错误';
                                reject('获取评论列表失败: ' + errorMsg);
                            }
                        } catch (parseError) {
                            console.error('解析响应数据失败:', parseError);
                            reject('解析响应数据失败');
                        }
                    } else {
                        console.error('获取评论列表请求失败:', err);
                        reject('网络请求失败，请检查网络连接');
                    }
                    
                    // 销毁HTTP请求对象
                    httpRequest.destroy();
                }
            );
        });
    }
}