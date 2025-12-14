if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NewsItem_Params {
    newsData?: NewsData;
    isFavorite?: boolean;
    noteId?: number;
    showDeleteConfirm?: boolean;
    context?;
    pref?;
}
import { NewsData } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsData";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import router from "@ohos:router";
import promptAction from "@ohos:promptAction";
import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
import http from "@ohos:net.http";
// 定义后端响应数据类型
interface BackendResponse {
    code: string;
    msg: string;
    data?: object | null;
}
export default class NewsItem extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.newsData = new NewsData();
        this.__isFavorite = new ObservedPropertySimplePU(false, this, "isFavorite");
        this.__noteId = new ObservedPropertySimplePU(0, this, "noteId");
        this.__showDeleteConfirm = new ObservedPropertySimplePU(false, this, "showDeleteConfirm");
        this.context = getContext(this) as common.UIAbilityContext;
        this.pref = preferences.getPreferencesSync(this.context, { name: 'favoriteNotesPrefs' });
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NewsItem_Params) {
        if (params.newsData !== undefined) {
            this.newsData = params.newsData;
        }
        if (params.isFavorite !== undefined) {
            this.isFavorite = params.isFavorite;
        }
        if (params.noteId !== undefined) {
            this.noteId = params.noteId;
        }
        if (params.showDeleteConfirm !== undefined) {
            this.showDeleteConfirm = params.showDeleteConfirm;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.pref !== undefined) {
            this.pref = params.pref;
        }
    }
    updateStateVars(params: NewsItem_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__isFavorite.purgeDependencyOnElmtId(rmElmtId);
        this.__noteId.purgeDependencyOnElmtId(rmElmtId);
        this.__showDeleteConfirm.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__isFavorite.aboutToBeDeleted();
        this.__noteId.aboutToBeDeleted();
        this.__showDeleteConfirm.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private newsData: NewsData;
    private __isFavorite: ObservedPropertySimplePU<boolean>;
    get isFavorite() {
        return this.__isFavorite.get();
    }
    set isFavorite(newValue: boolean) {
        this.__isFavorite.set(newValue);
    }
    private __noteId: ObservedPropertySimplePU<number>;
    get noteId() {
        return this.__noteId.get();
    }
    set noteId(newValue: number) {
        this.__noteId.set(newValue);
    }
    private __showDeleteConfirm: ObservedPropertySimplePU<boolean>; // 是否显示删除确认对话框
    get showDeleteConfirm() {
        return this.__showDeleteConfirm.get();
    }
    set showDeleteConfirm(newValue: boolean) {
        this.__showDeleteConfirm.set(newValue);
    }
    // 用于获取应用上下文
    private context;
    private pref;
    aboutToAppear(): void {
        // 生成笔记ID
        this.noteId = this.generateNoteId(this.newsData);
        // 加载收藏状态
        this.loadFavoriteStatus();
    }
    // 生成笔记的唯一ID
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
    // 切换收藏状态
    private toggleFavorite(): void {
        this.isFavorite = !this.isFavorite;
        this.saveFavoriteStatus();
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
    // 删除笔记
    private deleteNote(): void {
        // 显示确认对话框
        this.showDeleteConfirm = true;
    }
    // 确认删除
    private confirmDelete(): void {
        // 发送删除请求到后端
        this.sendDeleteRequest(this.newsData.id);
        this.showDeleteConfirm = false;
    }
    // 取消删除
    private cancelDelete(): void {
        this.showDeleteConfirm = false;
    }
    // 发送删除请求到后端
    private sendDeleteRequest(noteId: number): void {
        let httpRequest = http.createHttp();
        const baseUrl = "http://172.17.75.16:9588"; // 后端服务地址
        const url = `${baseUrl}/news/deleteNews/${noteId}`;
        console.log('发送删除请求到:', url);
        httpRequest.request(url, {
            method: http.RequestMethod.DELETE,
            header: { 'Content-Type': 'application/json' },
            readTimeout: 50000,
            connectTimeout: 50000
        }, (err, data) => {
            console.log('删除请求回调执行');
            console.log('错误信息:', JSON.stringify(err));
            console.log('响应数据:', JSON.stringify(data));
            if (!err) {
                console.info('删除请求成功:' + JSON.stringify(data));
                try {
                    let responseData: BackendResponse = { code: '', msg: '' };
                    if (typeof data.result === 'string') {
                        try {
                            responseData = JSON.parse(data.result) as BackendResponse;
                        }
                        catch (parseErr) {
                            console.error('JSON解析失败:', parseErr);
                            promptAction.showToast({ message: '数据解析失败' });
                            return;
                        }
                    }
                    else {
                        responseData = data.result as BackendResponse;
                    }
                    console.log('解析后的响应数据:', JSON.stringify(responseData));
                    if (responseData && responseData.code === 'success') {
                        console.log("笔记删除成功");
                        promptAction.showToast({ message: '笔记删除成功' });
                        // 可以在这里添加刷新列表的逻辑
                    }
                    else {
                        const errorMsg = responseData ? (responseData.msg || '未知错误') : '响应数据为空';
                        console.error('后端返回错误:', errorMsg);
                        promptAction.showToast({ message: '删除失败: ' + errorMsg });
                    }
                }
                catch (parseError) {
                    console.error('解析响应数据失败:', parseError);
                    promptAction.showToast({ message: '数据解析失败: ' + (parseError as Error).message });
                }
            }
            else {
                console.error('请求失败:' + JSON.stringify(err));
                const errorMsg = err.message || '未知网络错误';
                promptAction.showToast({ message: '删除请求失败: ' + errorMsg });
            }
            httpRequest.destroy();
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.backgroundColor({ "id": 16777258, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Column.borderRadius({ "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Column.onClick(() => {
                // 点击整个卡片跳转到详情页
                router.pushUrl({
                    url: 'pages/zonghezuoye/NoteDetailPage',
                    params: this.newsData
                });
            });
            Column.shadow({ radius: 6, color: '#1F000000', offsetX: 0, offsetY: 2 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图片展示区域（小红书风格以图片为主）
            // 修复imagesUrl显示问题，兼容后端返回的不同格式
            Image.create(Constants.SERVER + (typeof this.newsData.imagesUrl === 'string' ? this.newsData.imagesUrl : (this.newsData.imagesUrl && this.newsData.imagesUrl.length > 0 ? this.newsData.imagesUrl[0]?.url : '')));
            // 图片展示区域（小红书风格以图片为主）
            // 修复imagesUrl显示问题，兼容后端返回的不同格式
            Image.objectFit(ImageFit.Cover);
            // 图片展示区域（小红书风格以图片为主）
            // 修复imagesUrl显示问题，兼容后端返回的不同格式
            Image.aspectRatio(0.8);
            // 图片展示区域（小红书风格以图片为主）
            // 修复imagesUrl显示问题，兼容后端返回的不同格式
            Image.clip(true);
            // 图片展示区域（小红书风格以图片为主）
            // 修复imagesUrl显示问题，兼容后端返回的不同格式
            Image.width('100%');
            // 图片展示区域（小红书风格以图片为主）
            // 修复imagesUrl显示问题，兼容后端返回的不同格式
            Image.onClick(() => {
                // 点击图片跳转到详情页
                router.pushUrl({
                    url: 'pages/zonghezuoye/NoteDetailPage',
                    params: this.newsData
                });
            });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题和内容区域
            Column.create();
            // 标题和内容区域
            Column.padding({
                left: { "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                right: { "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                bottom: { "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                top: { "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newsData?.title);
            Text.fontSize({ "id": 16777284, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontColor({ "id": 16777257, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.maxLines(2);
            Text.lineHeight({ "id": 16777285, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontFamily({ "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.fontWeight(Constants.TITLE_FONT_WEIGHT);
            Text.layoutWeight(1);
            Text.onClick(() => {
                // 点击标题跳转到详情页
                router.pushUrl({
                    url: 'pages/zonghezuoye/NoteDetailPage',
                    params: this.newsData
                });
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 删除按钮（仅在详情页显示）
            Image.create({ "id": 16777289, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 删除按钮（仅在详情页显示）
            Image.width(20);
            // 删除按钮（仅在详情页显示）
            Image.height(20);
            // 删除按钮（仅在详情页显示）
            Image.margin({ left: 10 });
            // 删除按钮（仅在详情页显示）
            Image.onClick(() => {
                this.deleteNote();
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newsData?.content);
            Text.fontSize({ "id": 16777266, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontFamily({ "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.opacity(Constants.DESC_OPACITY);
            Text.fontColor({ "id": 16777257, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.lineHeight({ "id": 16777267, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.width('100%');
            Text.maxLines(3);
            Text.fontWeight(Constants.DESC_FONT_WEIGHT);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.margin({ top: { "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
            Text.onClick(() => {
                // 点击内容跳转到详情页
                router.pushUrl({
                    url: 'pages/zonghezuoye/NoteDetailPage',
                    params: this.newsData
                });
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 来源信息和互动元素
            Row.create();
            // 来源信息和互动元素
            Row.width('100%');
            // 来源信息和互动元素
            Row.margin({ top: { "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newsData?.source ?? '');
            Text.fontSize({ "id": 16777283, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontColor({ "id": 16777254, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('发布者: ' + (this.newsData?.author ?? '未知'));
            Text.fontSize({ "id": 16777283, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontColor({ "id": 16777254, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Text);
        Text.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加一些互动元素（点赞、评论、收藏）
            Blank.create();
        }, Blank);
        // 添加一些互动元素（点赞、评论、收藏）
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 收藏按钮
            if (this.isFavorite) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('❤');
                        Text.fontSize(16);
                        Text.margin({ right: 10 });
                        Text.fontColor('#ff5722');
                        Text.onClick(() => {
                            this.toggleFavorite();
                        });
                    }, Text);
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('♡');
                        Text.fontSize(16);
                        Text.margin({ right: 10 });
                        Text.fontColor('#999');
                        Text.onClick(() => {
                            this.toggleFavorite();
                        });
                    }, Text);
                    Text.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('💬');
            Text.fontSize(16);
        }, Text);
        Text.pop();
        Row.pop();
        // 来源信息和互动元素
        Row.pop();
        // 标题和内容区域
        Column.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 删除确认对话框
            if (this.showDeleteConfirm) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('80%');
                        Column.padding(20);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(10);
                        Column.shadow({ radius: 10, color: '#00000030', offsetX: 0, offsetY: 5 });
                        Column.position({ x: '10%', y: '30%' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('确认删除');
                        Text.fontSize(18);
                        Text.fontWeight(FontWeight.Bold);
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('确定要删除这篇笔记吗？此操作不可撤销。');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 15 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('N');
                        Button.backgroundColor('#FFFFFF');
                        Button.border({ width: 1, color: '#CCCCCC' });
                        Button.fontColor('#333333');
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.fontSize(14);
                        Button.onClick(() => {
                            this.cancelDelete();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('Y');
                        Button.backgroundColor('#F5222D');
                        Button.fontColor('#FFFFFF');
                        Button.layoutWeight(1);
                        Button.height(40);
                        Button.fontSize(14);
                        Button.onClick(() => {
                            this.confirmDelete();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
