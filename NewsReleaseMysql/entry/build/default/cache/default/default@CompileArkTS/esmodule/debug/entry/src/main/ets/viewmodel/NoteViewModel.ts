import { Note } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/Note";
import { Comment } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/Comment";
import { User } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/User";
import { DatabaseHelper } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/DatabaseHelper";
// 笔记+用户组合类型
export class NoteWithUser {
    note: Note;
    user: User;
    constructor(note: Note, user: User) {
        this.note = note;
        this.user = user;
    }
}
// 评论+用户组合类型
export class CommentWithUser {
    comment: Comment;
    user: User;
    constructor(comment: Comment, user: User) {
        this.comment = comment;
        this.user = user;
    }
}
export default class NoteViewModel {
    private dbHelper: DatabaseHelper = DatabaseHelper.getInstance();
    // 添加笔记
    async addNote(title: string, content: string, userId: number, imagesUrl: string[] = []): Promise<boolean> {
        console.log('准备添加笔记:', { title, content, userId, imagesUrl });
        const note = new Note(title, content, userId, imagesUrl);
        console.log('创建的note对象:', note);
        const result: number = await this.dbHelper.insertNote(note);
        console.log('插入笔记结果:', result);
        return result > 0;
    }
    // 获取所有笔记（带作者信息）
    async getAllNotesWithUsers(): Promise<NoteWithUser[]> {
        console.log('开始获取所有笔记');
        const notes: Note[] = await this.dbHelper.queryAllNotes();
        console.log('查询到的笔记数量:', notes.length);
        const users: User[] = await this.dbHelper.queryAllUsers();
        console.log('查询到的用户数量:', users.length);
        const result: NoteWithUser[] = [];
        for (const note of notes) {
            console.log('处理笔记:', note);
            const user: User | undefined = users.find((u: User) => u.id === note.userId);
            if (user) {
                result.push(new NoteWithUser(note, user));
            }
            else {
                const defaultUser = new User('未知用户', '');
                defaultUser.id = note.userId;
                result.push(new NoteWithUser(note, defaultUser));
            }
        }
        console.log('最终返回的笔记数量:', result.length);
        return result;
    }
    // 获取指定用户的笔记
    async getNotesByUserId(userId: number): Promise<Note[]> {
        return await this.dbHelper.queryNotesByUserId(userId);
    }
    // 获取指定用户的笔记（带作者信息）
    async getNotesByUserIdWithUser(userId: number): Promise<NoteWithUser[]> {
        const notes: Note[] = await this.dbHelper.queryNotesByUserId(userId);
        const user: User | null = await this.dbHelper.queryUserById(userId);
        const result: NoteWithUser[] = [];
        if (user) {
            for (const note of notes) {
                result.push(new NoteWithUser(note, user));
            }
        }
        return result;
    }
    // 根据ID获取笔记
    async getNoteById(noteId: number): Promise<Note | null> {
        return await this.dbHelper.queryNoteById(noteId);
    }
    // 删除笔记
    async deleteNote(noteId: number): Promise<boolean> {
        const result: number = await this.dbHelper.deleteNote(noteId);
        return result > 0;
    }
    // 添加评论
    async addComment(content: string, noteId: number, userId: number): Promise<boolean> {
        const comment = new Comment(content, noteId, userId);
        const result: number = await this.dbHelper.insertComment(comment);
        return result > 0;
    }
    // 获取笔记的所有评论（带评论者信息）
    async getCommentsByNoteIdWithUsers(noteId: number): Promise<CommentWithUser[]> {
        const comments: Comment[] = await this.dbHelper.queryCommentsByNoteId(noteId);
        const users: User[] = await this.dbHelper.queryAllUsers();
        const result: CommentWithUser[] = [];
        for (const comment of comments) {
            const user: User | undefined = users.find((u: User) => u.id === comment.userId);
            if (user) {
                result.push(new CommentWithUser(comment, user));
            }
            else {
                const defaultUser = new User('未知用户', '');
                defaultUser.id = comment.userId;
                result.push(new CommentWithUser(comment, defaultUser));
            }
        }
        return result;
    }
    // 删除评论
    async deleteComment(commentId: number): Promise<boolean> {
        const result: number = await this.dbHelper.deleteComment(commentId);
        return result > 0;
    }
}
