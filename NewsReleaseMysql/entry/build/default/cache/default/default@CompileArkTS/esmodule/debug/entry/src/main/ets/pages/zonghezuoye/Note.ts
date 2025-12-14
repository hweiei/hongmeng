// 定义笔记数据模型
export class Note {
    id: number = 0; // 本地自增ID
    title: string = '';
    content: string = '';
    imagesUrl: string[] = [];
    source: string = '';
    authorBackendUserId: string = ''; // 关联后端用户ID
    createdAt: string = ''; // 创建时间
    constructor(title: string = '', content: string = '', imagesUrl: string[] = [], source: string = '', authorBackendUserId: string = '', createdAt: string = '') {
        this.title = title;
        this.content = content;
        this.imagesUrl = imagesUrl;
        this.source = source;
        this.authorBackendUserId = authorBackendUserId;
        this.createdAt = createdAt;
    }
    toString(): string {
        return `Note{id:${this.id}, title:"${this.title}", content:"${this.content}", authorBackendUserId:"${this.authorBackendUserId}", createdAt:"${this.createdAt}"}`;
    }
}
