import { router } from '@kit.ArkUI';
import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { NewsData } from '../../viewmodel/NewsData';
import Constants from '../../common/constants/Constants';
import Comment from '../../models/Comment';
import CommentService from '../../common/utils/CommentService';
import { CommentItem } from '../../view/CommentItem';
import { GlobalContext } from '../../viewmodel/GlobalContext';
import { User } from './User';

@Entry
@Component
struct NoteDetailPage {
  @State private noteId: number = 0;
  @State private note: NewsData = new NewsData();
  @State private isFavorite: boolean = false;
  @State private imageUri: string = '';
  @State private comments: Comment[] = []; // 评论列表
  @State private newComment: string = ''; // 新评论内容
  @State private isPosting: boolean = false; // 是否正在提交评论
  @State private currentUser: User = new User('', ''); // 当前登录用户
  
  private context = this.getUIContext().getHostContext() as common.UIAbilityContext;
  private pref = preferences.getPreferencesSync(this.context, { name: 'favoriteNotesPrefs' });

  aboutToAppear(): void {
    // 获取路由参数
    const params = router.getParams();
    if (params) {
      // 获取笔记数据
      const noteData = params as NewsData;
      this.note = noteData;
      
      // 获取笔记ID（这里我们使用标题+内容作为唯一标识）
      this.noteId = this.generateNoteId(noteData);
      
      // 加载收藏状态
      this.loadFavoriteStatus();
      
      // 加载评论列表
      this.loadComments();
      
      // 获取当前登录用户
      const user = GlobalContext.getContext().getObject('loggedInUser') as User | undefined;
      if (user) {
        this.currentUser = user;
      }
    }
  }

  // 生成笔记的唯一ID（简单实现，实际项目中可能需要更复杂的逻辑）
  private generateNoteId(note: NewsData): number {
    // 使用标题和内容生成一个简单的哈希值作为ID
    const str = note.title + note.content;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash);
  }

  // 加载收藏状态
  private loadFavoriteStatus(): void {
    try {
      const favoriteList = this.pref.getSync('favorites', []) as Array<number>;
      this.isFavorite = favoriteList.includes(this.noteId);
    } catch (error) {
      console.error('加载收藏状态失败:', error);
      this.isFavorite = false;
    }
  }

  // 保存收藏状态
  private saveFavoriteStatus(): void {
    try {
      let favoriteList = this.pref.getSync('favorites', []) as Array<number>;
      
      if (this.isFavorite) {
        // 添加到收藏
        if (!favoriteList.includes(this.noteId)) {
          favoriteList.push(this.noteId);
        }
      } else {
        // 从收藏中移除
        favoriteList = favoriteList.filter(id => id !== this.noteId);
      }
      
      this.pref.putSync('favorites', favoriteList);
      this.pref.flushSync();
    } catch (error) {
      console.error('保存收藏状态失败:', error);
    }
  }

  // 切换收藏状态
  private toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.saveFavoriteStatus();
  }

  // 加载评论列表
  private loadComments(): void {
    CommentService.getCommentsByNewsId(this.note.id)
      .then((comments: Comment[]) => {
        this.comments = comments;
      })
      .catch((error: string) => {
        console.error('获取评论列表失败:', error);
      });
  }

  // 提交评论
  private postComment(): void {
    if (!this.newComment.trim()) {
      // 评论内容为空不提交
      return;
    }

    this.isPosting = true;
    // 使用当前登录用户的用户名，如果没有则使用"匿名用户"
    const username = this.currentUser && this.currentUser.username ? this.currentUser.username : '匿名用户';
    
    CommentService.addComment(this.note.id, username, this.newComment)
      .then((comment: Comment) => {
        // 添加成功后更新评论列表
        this.comments = [...this.comments, comment];
        this.newComment = ''; // 清空输入框
        this.isPosting = false;
      })
      .catch((error: string) => {
        console.error('发表评论失败:', error);
        this.isPosting = false;
        // 可以在这里添加错误提示
      });
  }

  build() {
    Column() {
      // 顶部导航栏
      Row() {
        Image($r('app.media.ic_back'))
          .width(24)
          .height(24)
          .margin({ top: 10, left: 20 })
          .onClick(() => {
            router.back();
          })
      }
      .width('100%')
      .height(50)
      .alignSelf(ItemAlign.Start)

      // 笔记内容区域（可滚动）
      Scroll() {
        Column() {
          // 笔记图片
          if (this.note.imagesUrl && this.note.imagesUrl.length > 0) {
            Image(Constants.SERVER + (typeof this.note.imagesUrl === 'string' ? this.note.imagesUrl : this.note.imagesUrl[0]?.url || ''))
              .width('100%')
              .height(300)
              .objectFit(ImageFit.Cover)
              .margin({ bottom: 20 })
          }

          // 笔记标题
          Text(this.note.title)
            .fontSize(24)
            .fontWeight(500)
            .margin({ bottom: 10, left: 20, right: 20 })
            .width('100%')
            .textAlign(TextAlign.Start)

          // 笔记来源
          Text(this.note.source)
            .fontColor('#666')
            .fontSize(14)
            .margin({ bottom: 20, left: 20, right: 20 })
            .width('100%')
            .textAlign(TextAlign.Start)

          // 收藏按钮和笔记内容
          Row() {
            Blank()
            
            Button(this.isFavorite ? '已收藏' : '收藏')
              .width(100)
              .height(32)
              .fontSize(14)
              .margin({ right: 20 })
              .type(ButtonType.Capsule)
              .backgroundColor(this.isFavorite ? '#ff5722' : '#f5f5f5')
              .fontColor(this.isFavorite ? Color.White : Color.Black)
              .onClick(() => {
                this.toggleFavorite();
              })
          }
          .width('100%')
          .margin({ bottom: 20 })

          // 笔记内容
          Text(this.note.content)
            .fontSize(16)
            .lineHeight(24)
            .margin({ left: 20, right: 20, bottom: 20 })
            .width('100%')
            .textAlign(TextAlign.Start)
          
          // 评论区域标题
          Row() {
            Text('评论 (' + this.comments.length + ')')
              .fontSize(18)
              .fontWeight(500)
              .margin({ left: 20, top: 20, bottom: 10 })
            
            Blank()
          }
          .width('100%')
          
          // 评论列表
          ForEach(this.comments, (comment: Comment) => {
            CommentItem({ comment: comment })
              .margin({ left: 20, right: 20 })
          }, (item: Comment) => item.id.toString())
          
          // 如果没有评论，显示提示
          if (this.comments.length === 0) {
            Text('暂无评论，快来抢沙发吧')
              .fontSize(14)
              .fontColor('#999')
              .margin({ top: 20, bottom: 20 })
          }
        }
        .width('100%')
      }
      .width('100%')
      .layoutWeight(1)

      // 评论输入区域
      Column() {
        Divider()
          .strokeWidth(0.5)
          .color('#eee')
          .width('100%')
        
        Row() {
          TextInput({ placeholder: '请输入评论内容', text: this.newComment })
            .layoutWeight(1)
            .height(40)
            .margin({ left: 20 })
            .onChange((value: string) => {
              this.newComment = value;
            })
          
          Button('发送')
            .width(60)
            .height(40)
            .margin({ left: 10, right: 20 })
            .enabled(!this.isPosting && this.newComment.trim() !== '')
            .type(ButtonType.Capsule)
            .onClick(() => {
              this.postComment();
            })
        }
        .width('100%')
        .height(60)
        .alignItems(VerticalAlign.Center)
      }
      .backgroundColor('#f8f8f8')
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Color.White)
  }
}