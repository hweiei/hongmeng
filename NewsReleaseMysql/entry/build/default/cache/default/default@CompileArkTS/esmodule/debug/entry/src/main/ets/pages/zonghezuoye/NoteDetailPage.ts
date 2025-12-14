if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NoteDetailPage_Params {
    noteId?: number;
    note?: NewsData;
    isFavorite?: boolean;
    imageUri?: string;
    comments?: Comment[];
    newComment?: string;
    isPosting?: boolean;
    currentUser?: User;
    context?;
    pref?;
}
import router from "@ohos:router";
import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
import { NewsData } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsData";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import type Comment from '../../models/Comment';
import CommentService from "@bundle:com.example.newsrelease/entry/ets/common/utils/CommentService";
import { CommentItem } from "@bundle:com.example.newsrelease/entry/ets/view/CommentItem";
import { GlobalContext } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/GlobalContext";
import { User } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/User";
class NoteDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__noteId = new ObservedPropertySimplePU(0, this, "noteId");
        this.__note = new ObservedPropertyObjectPU(new NewsData(), this, "note");
        this.__isFavorite = new ObservedPropertySimplePU(false, this, "isFavorite");
        this.__imageUri = new ObservedPropertySimplePU('', this, "imageUri");
        this.__comments = new ObservedPropertyObjectPU([], this, "comments");
        this.__newComment = new ObservedPropertySimplePU('', this, "newComment");
        this.__isPosting = new ObservedPropertySimplePU(false, this, "isPosting");
        this.__currentUser = new ObservedPropertyObjectPU(new User('', ''), this, "currentUser");
        this.context = this.getUIContext().getHostContext() as common.UIAbilityContext;
        this.pref = preferences.getPreferencesSync(this.context, { name: 'favoriteNotesPrefs' });
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NoteDetailPage_Params) {
        if (params.noteId !== undefined) {
            this.noteId = params.noteId;
        }
        if (params.note !== undefined) {
            this.note = params.note;
        }
        if (params.isFavorite !== undefined) {
            this.isFavorite = params.isFavorite;
        }
        if (params.imageUri !== undefined) {
            this.imageUri = params.imageUri;
        }
        if (params.comments !== undefined) {
            this.comments = params.comments;
        }
        if (params.newComment !== undefined) {
            this.newComment = params.newComment;
        }
        if (params.isPosting !== undefined) {
            this.isPosting = params.isPosting;
        }
        if (params.currentUser !== undefined) {
            this.currentUser = params.currentUser;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.pref !== undefined) {
            this.pref = params.pref;
        }
    }
    updateStateVars(params: NoteDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__noteId.purgeDependencyOnElmtId(rmElmtId);
        this.__note.purgeDependencyOnElmtId(rmElmtId);
        this.__isFavorite.purgeDependencyOnElmtId(rmElmtId);
        this.__imageUri.purgeDependencyOnElmtId(rmElmtId);
        this.__comments.purgeDependencyOnElmtId(rmElmtId);
        this.__newComment.purgeDependencyOnElmtId(rmElmtId);
        this.__isPosting.purgeDependencyOnElmtId(rmElmtId);
        this.__currentUser.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__noteId.aboutToBeDeleted();
        this.__note.aboutToBeDeleted();
        this.__isFavorite.aboutToBeDeleted();
        this.__imageUri.aboutToBeDeleted();
        this.__comments.aboutToBeDeleted();
        this.__newComment.aboutToBeDeleted();
        this.__isPosting.aboutToBeDeleted();
        this.__currentUser.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __noteId: ObservedPropertySimplePU<number>;
    get noteId() {
        return this.__noteId.get();
    }
    set noteId(newValue: number) {
        this.__noteId.set(newValue);
    }
    private __note: ObservedPropertyObjectPU<NewsData>;
    get note() {
        return this.__note.get();
    }
    set note(newValue: NewsData) {
        this.__note.set(newValue);
    }
    private __isFavorite: ObservedPropertySimplePU<boolean>;
    get isFavorite() {
        return this.__isFavorite.get();
    }
    set isFavorite(newValue: boolean) {
        this.__isFavorite.set(newValue);
    }
    private __imageUri: ObservedPropertySimplePU<string>;
    get imageUri() {
        return this.__imageUri.get();
    }
    set imageUri(newValue: string) {
        this.__imageUri.set(newValue);
    }
    private __comments: ObservedPropertyObjectPU<Comment[]>; // 评论列表
    get comments() {
        return this.__comments.get();
    }
    set comments(newValue: Comment[]) {
        this.__comments.set(newValue);
    }
    private __newComment: ObservedPropertySimplePU<string>; // 新评论内容
    get newComment() {
        return this.__newComment.get();
    }
    set newComment(newValue: string) {
        this.__newComment.set(newValue);
    }
    private __isPosting: ObservedPropertySimplePU<boolean>; // 是否正在提交评论
    get isPosting() {
        return this.__isPosting.get();
    }
    set isPosting(newValue: boolean) {
        this.__isPosting.set(newValue);
    }
    private __currentUser: ObservedPropertyObjectPU<User>; // 当前登录用户
    get currentUser() {
        return this.__currentUser.get();
    }
    set currentUser(newValue: User) {
        this.__currentUser.set(newValue);
    }
    private context;
    private pref;
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
        }
        catch (error) {
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
            }
            else {
                // 从收藏中移除
                favoriteList = favoriteList.filter(id => id !== this.noteId);
            }
            this.pref.putSync('favorites', favoriteList);
            this.pref.flushSync();
        }
        catch (error) {
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航栏
            Row.create();
            // 顶部导航栏
            Row.width('100%');
            // 顶部导航栏
            Row.height(50);
            // 顶部导航栏
            Row.alignSelf(ItemAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777288, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.margin({ top: 10, left: 20 });
            Image.onClick(() => {
                router.back();
            });
        }, Image);
        // 顶部导航栏
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 笔记内容区域（可滚动）
            Scroll.create();
            // 笔记内容区域（可滚动）
            Scroll.width('100%');
            // 笔记内容区域（可滚动）
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 笔记图片
            if (this.note.imagesUrl && this.note.imagesUrl.length > 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create(Constants.SERVER + (typeof this.note.imagesUrl === 'string' ? this.note.imagesUrl : this.note.imagesUrl[0]?.url || ''));
                        Image.width('100%');
                        Image.height(300);
                        Image.objectFit(ImageFit.Cover);
                        Image.margin({ bottom: 20 });
                    }, Image);
                });
            }
            // 笔记标题
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 笔记标题
            Text.create(this.note.title);
            // 笔记标题
            Text.fontSize(24);
            // 笔记标题
            Text.fontWeight(500);
            // 笔记标题
            Text.margin({ bottom: 10, left: 20, right: 20 });
            // 笔记标题
            Text.width('100%');
            // 笔记标题
            Text.textAlign(TextAlign.Start);
        }, Text);
        // 笔记标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 笔记来源
            Text.create(this.note.source);
            // 笔记来源
            Text.fontColor('#666');
            // 笔记来源
            Text.fontSize(14);
            // 笔记来源
            Text.margin({ bottom: 20, left: 20, right: 20 });
            // 笔记来源
            Text.width('100%');
            // 笔记来源
            Text.textAlign(TextAlign.Start);
        }, Text);
        // 笔记来源
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 收藏按钮和笔记内容
            Row.create();
            // 收藏按钮和笔记内容
            Row.width('100%');
            // 收藏按钮和笔记内容
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isFavorite ? '已收藏' : '收藏');
            Button.width(100);
            Button.height(32);
            Button.fontSize(14);
            Button.margin({ right: 20 });
            Button.type(ButtonType.Capsule);
            Button.backgroundColor(this.isFavorite ? '#ff5722' : '#f5f5f5');
            Button.fontColor(this.isFavorite ? Color.White : Color.Black);
            Button.onClick(() => {
                this.toggleFavorite();
            });
        }, Button);
        Button.pop();
        // 收藏按钮和笔记内容
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 笔记内容
            Text.create(this.note.content);
            // 笔记内容
            Text.fontSize(16);
            // 笔记内容
            Text.lineHeight(24);
            // 笔记内容
            Text.margin({ left: 20, right: 20, bottom: 20 });
            // 笔记内容
            Text.width('100%');
            // 笔记内容
            Text.textAlign(TextAlign.Start);
        }, Text);
        // 笔记内容
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评论区域标题
            Row.create();
            // 评论区域标题
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('评论 (' + this.comments.length + ')');
            Text.fontSize(18);
            Text.fontWeight(500);
            Text.margin({ left: 20, top: 20, bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        // 评论区域标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评论列表
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const comment = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    __Common__.create();
                    __Common__.margin({ left: 20, right: 20 });
                }, __Common__);
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new CommentItem(this, { comment: comment }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/zonghezuoye/NoteDetailPage.ets", line: 224, col: 13 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    comment: comment
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "CommentItem" });
                }
                __Common__.pop();
            };
            this.forEachUpdateFunction(elmtId, this.comments, forEachItemGenFunction, (item: Comment) => item.id.toString(), false, false);
        }, ForEach);
        // 评论列表
        ForEach.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 如果没有评论，显示提示
            if (this.comments.length === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('暂无评论，快来抢沙发吧');
                        Text.fontSize(14);
                        Text.fontColor('#999');
                        Text.margin({ top: 20, bottom: 20 });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
        // 笔记内容区域（可滚动）
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评论输入区域
            Column.create();
            // 评论输入区域
            Column.backgroundColor('#f8f8f8');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.strokeWidth(0.5);
            Divider.color('#eee');
            Divider.width('100%');
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(60);
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入评论内容', text: this.newComment });
            TextInput.layoutWeight(1);
            TextInput.height(40);
            TextInput.margin({ left: 20 });
            TextInput.onChange((value: string) => {
                this.newComment = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('发送');
            Button.width(60);
            Button.height(40);
            Button.margin({ left: 10, right: 20 });
            Button.enabled(!this.isPosting && this.newComment.trim() !== '');
            Button.type(ButtonType.Capsule);
            Button.onClick(() => {
                this.postComment();
            });
        }, Button);
        Button.pop();
        Row.pop();
        // 评论输入区域
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "NoteDetailPage";
    }
}
registerNamedRoute(() => new NoteDetailPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/zonghezuoye/NoteDetailPage", pageFullPath: "entry/src/main/ets/pages/zonghezuoye/NoteDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
