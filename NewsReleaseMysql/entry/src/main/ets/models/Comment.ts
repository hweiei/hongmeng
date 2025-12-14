/**
 * 评论数据模型
 */
export class Comment {
    /**
     * 评论ID
     */
    id: number = 0;
    
    /**
     * 新闻ID
     */
    newsId: number = 0;
    
    /**
     * 用户名
     */
    username: string = '';
    
    /**
     * 评论内容
     */
    content: string = '';
    
    /**
     * 创建时间
     */
    createTime: string = '';
}

export default Comment;