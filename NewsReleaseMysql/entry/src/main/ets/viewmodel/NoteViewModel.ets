import { DatabaseHelper } from '../pages/zonghezuoye/DatabaseHelper';
import { Note } from '../pages/zonghezuoye/Note';
import { Comment } from '../pages/zonghezuoye/Comment';
import { User } from '../pages/zonghezuoye/User';

export class NoteWithUser {
  note: Note;
  user: User;

  constructor(note: Note, user: User) {
    this.note = note;
    this.user = user;
  }
}

export default class NoteViewModel {
  private dbHelper: DatabaseHelper = DatabaseHelper.getInstance();

  // 获取所有笔记及其作者信息
  async getAllNotesWithUsers(): Promise<NoteWithUser[]> {
    try {
      // 获取所有笔记
      const notes = await this.dbHelper.queryAllNotes();
      
      // 获取所有用户
      const users = await this.dbHelper.queryAllUsers();
      
      // 将笔记与其作者关联
      const notesWithUsers: NoteWithUser[] = [];
      for (const note of notes) {
        const user = users.find(u => u.id === note.userId);
        if (user) {
          notesWithUsers.push(new NoteWithUser(note, user));
        }
      }
      
      return notesWithUsers;
    } catch (error) {
      console.error('获取笔记和用户信息失败:', error);
      return [];
    }
  }

  // 获取指定用户的笔记
  async getNotesByUserId(userId: number): Promise<Note[]> {
    try {
      return await this.dbHelper.queryNotesByUserId(userId);
    } catch (error) {
      console.error('获取用户笔记失败:', error);
      return [];
    }
  }

  // 添加新笔记
  async addNote(title: string, content: string, userId: number): Promise<boolean> {
    try {
      const note = new Note(title, content, userId);
      const result = await this.dbHelper.insertNote(note);
      return result > 0;
    } catch (error) {
      console.error('添加笔记失败:', error);
      return false;
    }
  }

  // 获取指定笔记的评论
  async getCommentsByNoteId(noteId: number): Promise<Comment[]> {
    try {
      return await this.dbHelper.queryCommentsByNoteId(noteId);
    } catch (error) {
      console.error('获取评论失败:', error);
      return [];
    }
  }

  // 添加评论
  async addComment(content: string, userId: number, noteId: number): Promise<boolean> {
    try {
      const comment = new Comment(content, userId, noteId);
      const result = await this.dbHelper.insertComment(comment);
      return result > 0;
    } catch (error) {
      console.error('添加评论失败:', error);
      return false;
    }
  }
}