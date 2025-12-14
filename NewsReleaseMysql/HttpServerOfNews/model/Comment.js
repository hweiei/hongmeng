/* Comment Model */
class Comment {
    constructor(id, newsId, username, content, createTime) {
        this.id = id || 0;
        this.newsId = newsId || 0;
        this.username = username || '';
        this.content = content || '';
        this.createTime = createTime || new Date().toISOString();
    }
}

module.exports = Comment;