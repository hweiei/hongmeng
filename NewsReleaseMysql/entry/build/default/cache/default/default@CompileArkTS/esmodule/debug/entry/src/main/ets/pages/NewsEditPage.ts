if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NewsEditPage_Params {
    title?: string;
    content?: string;
    imageUri?: string;
    isSubmitting?: boolean;
    newsViewModel?;
}
import router from "@ohos:router";
import { fileSelect, fileUpload } from "@bundle:com.example.newsrelease/entry/ets/common/utils/FileUtil";
import { NewsFile, NewsData } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsData";
import newsViewModel from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsViewModel";
import { showToast } from "@bundle:com.example.newsrelease/entry/ets/common/utils/ToastUtil";
import type ResponseResult from '../viewmodel/ResponseResult';
import { GlobalContext } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/GlobalContext";
import type { User } from './zonghezuoye/User';
class NewsEditPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__title = new ObservedPropertySimplePU('', this, "title");
        this.__content = new ObservedPropertySimplePU('', this, "content");
        this.__imageUri = new ObservedPropertySimplePU('', this, "imageUri");
        this.__isSubmitting = new ObservedPropertySimplePU(false, this, "isSubmitting");
        this.newsViewModel = newsViewModel;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NewsEditPage_Params) {
        if (params.title !== undefined) {
            this.title = params.title;
        }
        if (params.content !== undefined) {
            this.content = params.content;
        }
        if (params.imageUri !== undefined) {
            this.imageUri = params.imageUri;
        }
        if (params.isSubmitting !== undefined) {
            this.isSubmitting = params.isSubmitting;
        }
        if (params.newsViewModel !== undefined) {
            this.newsViewModel = params.newsViewModel;
        }
    }
    updateStateVars(params: NewsEditPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__content.purgeDependencyOnElmtId(rmElmtId);
        this.__imageUri.purgeDependencyOnElmtId(rmElmtId);
        this.__isSubmitting.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__content.aboutToBeDeleted();
        this.__imageUri.aboutToBeDeleted();
        this.__isSubmitting.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __title: ObservedPropertySimplePU<string>;
    get title() {
        return this.__title.get();
    }
    set title(newValue: string) {
        this.__title.set(newValue);
    }
    private __content: ObservedPropertySimplePU<string>;
    get content() {
        return this.__content.get();
    }
    set content(newValue: string) {
        this.__content.set(newValue);
    }
    private __imageUri: ObservedPropertySimplePU<string>;
    get imageUri() {
        return this.__imageUri.get();
    }
    set imageUri(newValue: string) {
        this.__imageUri.set(newValue);
    }
    private __isSubmitting: ObservedPropertySimplePU<boolean>;
    get isSubmitting() {
        return this.__isSubmitting.get();
    }
    set isSubmitting(newValue: boolean) {
        this.__isSubmitting.set(newValue);
    }
    private newsViewModel;
    aboutToAppear(): void {
        const loggedInUser: User | undefined = GlobalContext.getContext().getObject('loggedInUser') as User | undefined;
        if (!loggedInUser || !loggedInUser.id) {
            showToast('请先登录');
            router.back();
        }
    }
    selectImage() {
        fileSelect().then((uri: string) => {
            this.imageUri = uri || '';
        });
    }
    async publishNews(): Promise<void> {
        if (!this.title.trim()) {
            showToast('请输入标题');
            return;
        }
        if (!this.content.trim()) {
            showToast('请输入内容');
            return;
        }
        if (!this.imageUri) {
            showToast('请选择图片');
            return;
        }
        const loggedInUser: User | undefined = GlobalContext.getContext().getObject('loggedInUser') as User | undefined;
        if (!loggedInUser || !loggedInUser.id) {
            showToast('请先登录');
            return;
        }
        this.isSubmitting = true;
        try {
            // 首先上传图片
            let imageUrl: string = '';
            if (this.imageUri) {
                const serverData: ResponseResult = await fileUpload(getContext(this), this.imageUri);
                imageUrl = serverData.data as string;
            }
            // 构造新闻文件对象
            let newsFile = new NewsFile();
            newsFile.id = 0;
            newsFile.url = imageUrl;
            newsFile.type = 0;
            newsFile.newsId = 0;
            // 构造新闻数据对象
            let newsData: NewsData = new NewsData();
            newsData.title = this.title.trim();
            newsData.content = this.content.trim();
            newsData.imagesUrl = [newsFile]; // 赋值NewsFile数组
            newsData.source = loggedInUser.username;
            newsData.author = loggedInUser.username;
            // 上传新闻数据
            await this.newsViewModel.uploadNews(newsData);
            showToast('发布成功');
            GlobalContext.getContext().setObject('isBackRouter', true);
            router.back();
        }
        catch (error) {
            console.error('发布新闻失败:', JSON.stringify(error));
            showToast('发布失败');
        }
        finally {
            this.isSubmitting = false;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 顶部导航
            Row.create();
            // 顶部导航
            Row.width('100%');
            // 顶部导航
            Row.height(56);
            // 顶部导航
            Row.padding({ left: 16, right: 16 });
            // 顶部导航
            Row.backgroundColor('#FFFFFF');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('取消');
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.onClick(() => {
                router.back();
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('发布笔记');
            Text.fontSize(18);
            Text.fontWeight(FontWeight.Bold);
            Text.layoutWeight(1);
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('发布');
            Button.fontSize(14);
            Button.height(32);
            Button.backgroundColor(this.isSubmitting ? '#CCCCCC' : '#FF6B6B');
            Button.enabled(!this.isSubmitting);
            Button.onClick(() => {
                this.publishNews();
            });
        }, Button);
        Button.pop();
        // 顶部导航
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 表单区域
            Column.create();
            // 表单区域
            Column.padding(20);
            // 表单区域
            Column.layoutWeight(1);
            // 表单区域
            Column.backgroundColor('#FFFFFF');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图片选择区域
            Column.create();
            // 图片选择区域
            Column.width('100%');
            // 图片选择区域
            Column.margin({ bottom: 20 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.height(200);
            Row.borderRadius(20);
            Row.backgroundColor('#FFFFFF');
            Row.padding(12);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.imageUri ? this.imageUri : { "id": 16777287, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.width('100%');
            Image.height(200);
            Image.objectFit(ImageFit.Cover);
            Image.onClick(() => this.selectImage());
            Image.clip(true);
            Image.borderRadius(20);
        }, Image);
        Row.pop();
        // 图片选择区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: '请输入标题（必填）', text: this.title });
            TextInput.fontSize(20);
            TextInput.fontWeight(FontWeight.Bold);
            TextInput.width('100%');
            TextInput.height(56);
            TextInput.backgroundColor('#FFFFFF');
            TextInput.onChange((value: string) => {
                this.title = value;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Divider.create();
            Divider.color('#F0F0F0');
            Divider.margin({ top: 8, bottom: 8 });
        }, Divider);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextArea.create({ placeholder: '分享你的想法...', text: this.content });
            TextArea.fontSize(16);
            TextArea.width('100%');
            TextArea.layoutWeight(1);
            TextArea.backgroundColor('#FFFFFF');
            TextArea.onChange((value: string) => {
                this.content = value;
            });
        }, TextArea);
        // 表单区域
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "NewsEditPage";
    }
}
registerNamedRoute(() => new NewsEditPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/NewsEditPage", pageFullPath: "entry/src/main/ets/pages/NewsEditPage", integratedHsp: "false", moduleType: "followWithHap" });
