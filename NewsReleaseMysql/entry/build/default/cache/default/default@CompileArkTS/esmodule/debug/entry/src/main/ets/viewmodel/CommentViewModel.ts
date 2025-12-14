import type { Comment } from '../models/Comment';
import type ResponseResult from './ResponseResult';
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import { httpRequestGet, httpRequestPost } from "@bundle:com.example.newsrelease/entry/ets/common/utils/HttpUtil";
import Logger from "@bundle:com.example.newsrelease/entry/ets/common/utils/Logger";
class CommentViewModel {
    /**
     * 添加评论
     * @param comment 评论对象
     * @returns Promise<Comment> 返回添加的评论
     */
    addComment(comment: Comment): Promise<Comment> {
        return new Promise((resolve: (value: Comment) => void, reject: (reason: string) => void) => {
            const url = `${Constants.SERVER}/comments/addComment`;
            httpRequestPost(url, comment).then((result: ResponseResult) => {
                if (result && result.code === Constants.SERVER_CODE_SUCCESS) {
                    const data = result.data as Comment;
                    resolve(data);
                }
                else {
                    reject(result.msg?.toString() || '评论添加失败');
                }
            }).catch((err: Error) => {
                Logger.error('addComment failed', JSON.stringify(err));
                reject('评论添加失败');
            });
        });
    }
    /**
     * 根据新闻ID获取评论列表
     * @param newsId 新闻ID
     * @returns Promise<Comment[]> 返回评论列表
     */
    getCommentsByNewsId(newsId: number): Promise<Comment[]> {
        return new Promise((resolve: (value: Comment[]) => void, reject: (reason: string) => void) => {
            const url = `${Constants.SERVER}/comments/getCommentsByNewsId?newsId=${newsId}`;
            httpRequestGet(url).then((result: ResponseResult) => {
                if (result && result.code === Constants.SERVER_CODE_SUCCESS) {
                    const data = result.data as Comment[];
                    resolve(data);
                }
                else {
                    reject(result.msg?.toString() || '评论加载失败');
                }
            }).catch((err: Error) => {
                Logger.error('getCommentsByNewsId failed', JSON.stringify(err));
                reject('评论加载失败');
            });
        });
    }
}
let commentViewModel = new CommentViewModel();
export default commentViewModel as CommentViewModel;
