// 定义评论数据模型
export class Comment {
    id: number = 0; // 本地自增ID
    content: string = '';
    commenterBackendUserId: string = ''; // 关联后端用户ID
    noteId: number = 0; // 本地笔记ID
    createdAt: string = ''; // 创建时间
    constructor(content: string = '', commenterBackendUserId: string = '', noteId: number = 0, createdAt: string = '') {
        this.content = content;
        this.commenterBackendUserId = commenterBackendUserId;
        this.noteId = noteId;
        this.createdAt = createdAt;
    }
    toString(): string {
        return `Comment{id:${this.id}, content:"${this.content}", commenterBackendUserId:"${this.commenterBackendUserId}", noteId:${this.noteId}, createdAt:"${this.createdAt}"}`;
    }
}
