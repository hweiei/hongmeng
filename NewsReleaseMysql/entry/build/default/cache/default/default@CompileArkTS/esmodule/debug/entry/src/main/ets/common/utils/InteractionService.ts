import http from "@ohos:net.http";
export interface InteractionStatus {
    liked: boolean;
    favorited: boolean;
}
export interface LikeResponse {
    liked: boolean;
}
export interface FavoriteResponse {
    favorited: boolean;
}
interface SuccessResponse<T> {
    code: string;
    msg: string;
    data: T;
}
interface CountData {
    count: number;
}
export class InteractionService {
    private static BASE_URL = 'http://127.0.0.1:9588/interactions';
    /**
     * 点赞或取消点赞新闻
     * @param userId 用户ID
     * @param newsId 新闻ID
     * @returns 点赞结果
     */
    static async toggleLike(userId: number, newsId: number): Promise<LikeResponse> {
        return new Promise((resolve, reject) => {
            let httpRequest = http.createHttp();
            httpRequest.request(`${this.BASE_URL}/like`, {
                method: http.RequestMethod.POST,
                header: { 'Content-Type': 'application/json' },
                readTimeout: 50000,
                connectTimeout: 50000,
                extraData: JSON.stringify({ userId, newsId })
            }, (err, data) => {
                if (!err) {
                    try {
                        const response = JSON.parse(data.result as string) as SuccessResponse<LikeResponse>;
                        if (response.code === 'success') {
                            resolve(response.data);
                        }
                        else {
                            reject(new Error(response.msg || '点赞失败'));
                        }
                    }
                    catch (parseError) {
                        reject(new Error('数据解析失败'));
                    }
                }
                else {
                    reject(new Error(err.message || '网络请求失败'));
                }
                httpRequest.destroy();
            });
        });
    }
    /**
     * 收藏或取消收藏新闻
     * @param userId 用户ID
     * @param newsId 新闻ID
     * @returns 收藏结果
     */
    static async toggleFavorite(userId: number, newsId: number): Promise<FavoriteResponse> {
        return new Promise((resolve, reject) => {
            let httpRequest = http.createHttp();
            httpRequest.request(`${this.BASE_URL}/favorite`, {
                method: http.RequestMethod.POST,
                header: { 'Content-Type': 'application/json' },
                readTimeout: 50000,
                connectTimeout: 50000,
                extraData: JSON.stringify({ userId, newsId })
            }, (err, data) => {
                if (!err) {
                    try {
                        const response = JSON.parse(data.result as string) as SuccessResponse<FavoriteResponse>;
                        if (response.code === 'success') {
                            resolve(response.data);
                        }
                        else {
                            reject(new Error(response.msg || '收藏失败'));
                        }
                    }
                    catch (parseError) {
                        reject(new Error('数据解析失败'));
                    }
                }
                else {
                    reject(new Error(err.message || '网络请求失败'));
                }
                httpRequest.destroy();
            });
        });
    }
    /**
     * 获取用户对新闻的交互状态
     * @param userId 用户ID
     * @param newsId 新闻ID
     * @returns 交互状态
     */
    static async getInteractionStatus(userId: number, newsId: number): Promise<InteractionStatus> {
        return new Promise((resolve, reject) => {
            let httpRequest = http.createHttp();
            httpRequest.request(`${this.BASE_URL}/status?userId=${userId}&newsId=${newsId}`, {
                method: http.RequestMethod.GET,
                header: { 'Content-Type': 'application/json' },
                readTimeout: 50000,
                connectTimeout: 50000
            }, (err, data) => {
                if (!err) {
                    try {
                        const response = JSON.parse(data.result as string) as SuccessResponse<InteractionStatus>;
                        if (response.code === 'success') {
                            resolve(response.data);
                        }
                        else {
                            reject(new Error(response.msg || '获取状态失败'));
                        }
                    }
                    catch (parseError) {
                        reject(new Error('数据解析失败'));
                    }
                }
                else {
                    reject(new Error(err.message || '网络请求失败'));
                }
                httpRequest.destroy();
            });
        });
    }
    /**
     * 获取新闻的点赞数
     * @param newsId 新闻ID
     * @returns 点赞数
     */
    static async getLikeCount(newsId: number): Promise<number> {
        return new Promise((resolve, reject) => {
            let httpRequest = http.createHttp();
            httpRequest.request(`${this.BASE_URL}/like-count?newsId=${newsId}`, {
                method: http.RequestMethod.GET,
                header: { 'Content-Type': 'application/json' },
                readTimeout: 50000,
                connectTimeout: 50000
            }, (err, data) => {
                if (!err) {
                    try {
                        const response = JSON.parse(data.result as string) as SuccessResponse<CountData>;
                        if (response.code === 'success') {
                            resolve(response.data.count);
                        }
                        else {
                            reject(new Error(response.msg || '获取点赞数失败'));
                        }
                    }
                    catch (parseError) {
                        reject(new Error('数据解析失败'));
                    }
                }
                else {
                    reject(new Error(err.message || '网络请求失败'));
                }
                httpRequest.destroy();
            });
        });
    }
}
