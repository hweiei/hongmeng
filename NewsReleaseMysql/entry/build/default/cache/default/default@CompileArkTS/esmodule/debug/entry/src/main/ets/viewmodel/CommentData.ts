export class CommentData {
    id: number = 0;
    newsId: number = 0;
    username: string = '';
    content: string = '';
    createTime: string = '';
    constructor();
    constructor(id: number, newsId: number, username: string, content: string, createTime: string);
    constructor(id?: number, newsId?: number, username?: string, content?: string, createTime?: string) {
        if (id !== undefined && newsId !== undefined && username !== undefined && content !== undefined && createTime !== undefined) {
            this.id = id;
            this.newsId = newsId;
            this.username = username;
            this.content = content;
            this.createTime = createTime;
        }
    }
}
