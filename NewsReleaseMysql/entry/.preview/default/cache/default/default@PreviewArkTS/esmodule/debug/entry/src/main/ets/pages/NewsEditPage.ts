if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NewsEditPage_Params {
    // 新闻标题
    title?: string;
    // 新闻内容
    content?: string;
    imageUri?: string;
    isUploading?: boolean;
}
import router from "@ohos:router";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import { fileSelect, fileUpload } from "@bundle:com.example.newsrelease/entry/ets/common/utils/FileUtil";
import { NewsFile, NewsData } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsData";
import NewsViewModel from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsViewModel";
import { showToast } from "@bundle:com.example.newsrelease/entry/ets/common/utils/ToastUtil";
import UploadingLayout from "@bundle:com.example.newsrelease/entry/ets/view/UploadingLayout";
import type ResponseResult from '../viewmodel/ResponseResult';
import { GlobalContext } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/GlobalContext";
class NewsEditPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.title = '';
        this.content = '';
        this.__imageUri = new ObservedPropertySimplePU('', this, "imageUri");
        this.__isUploading = new ObservedPropertySimplePU(false, this, "isUploading");
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
        if (params.isUploading !== undefined) {
            this.isUploading = params.isUploading;
        }
    }
    updateStateVars(params: NewsEditPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__imageUri.purgeDependencyOnElmtId(rmElmtId);
        this.__isUploading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__imageUri.aboutToBeDeleted();
        this.__isUploading.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 新闻标题
    private title: string;
    // 新闻内容
    private content: string;
    // 选择的图片URI
    private __imageUri: ObservedPropertySimplePU<string>;
    get imageUri() {
        return this.__imageUri.get();
    }
    set imageUri(newValue: string) {
        this.__imageUri.set(newValue);
    }
    // 是否正在上传状态
    private __isUploading: ObservedPropertySimplePU<boolean>;
    get isUploading() {
        return this.__isUploading.get();
    }
    set isUploading(newValue: boolean) {
        this.__isUploading.set(newValue);
    }
    /**
     * 选择图片文件
     * 通过文件选择器选择要上传的图片
     */
    selectImage() {
        fileSelect().then((uri: string) => {
            this.imageUri = uri || '';
        });
    }
    /**
     * 上传新闻数据
     * 包含表单验证、图片上传和新闻信息发布
     */
    uploadNewsData() {
        // 表单验证：检查标题是否为空
        if (this.title === '') {
            showToast({ "id": 16777232, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            return;
        }
        // 表单验证：检查内容是否为空
        if (this.content === '') {
            showToast({ "id": 16777230, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            return;
        }
        // 表单验证：检查是否选择了图片
        if (this.imageUri === '') {
            showToast({ "id": 16777231, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            return;
        }
        // 设置上传状态为true，显示上传进度
        this.isUploading = true;
        // 首先上传图片文件
        let serverData = fileUpload(getContext(this), this.imageUri);
        serverData.then((data: ResponseResult) => {
            // 获取上传后的图片URL
            let imageUrl = data.data;
            // 构造新闻文件对象
            let newsFile = new NewsFile();
            newsFile.id = 0;
            newsFile.url = imageUrl;
            newsFile.type = 0;
            newsFile.newsId = 0;
            // 构造新闻数据对象
            let newsData: NewsData = new NewsData();
            newsData.title = this.title;
            newsData.content = this.content;
            newsData.imagesUrl = [newsFile];
            // 调用NewsViewModel上传新闻数据
            NewsViewModel.uploadNews(newsData).then(() => {
                // 上传成功，重置上传状态
                this.isUploading = false;
                // 设置返回路由标识
                GlobalContext.getContext().setObject('isBackRouter', true);
                // 返回上一页
                router.back();
            }).catch(() => {
                // 上传新闻数据失败处理
                this.isUploading = false;
                showToast({ "id": 16777250, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            });
        }).catch(() => {
            // 上传图片文件失败处理
            this.isUploading = false;
            showToast({ "id": 16777250, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
            Stack.debugLine("entry/src/main/ets/pages/NewsEditPage.ets(116:5)", "entry");
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Navigation.create(new NavPathStack(), { moduleName: "entry", pagePath: "entry/src/main/ets/pages/NewsEditPage", isUserCreateStack: false });
            Navigation.debugLine("entry/src/main/ets/pages/NewsEditPage.ets(117:7)", "entry");
            Navigation.height(Constants.FULL_PERCENT);
            Navigation.title("发布笔记");
            Navigation.titleMode(NavigationTitleMode.Mini);
            Navigation.backgroundColor({ "id": 16777263, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Navigation);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/NewsEditPage.ets(118:9)", "entry");
            Column.padding({
                left: 0,
                right: 0,
                bottom: 0
            });
            Column.height(Constants.FULL_PERCENT);
            Column.justifyContent(FlexAlign.SpaceBetween);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 小红书风格的发布页面
            // 图片选择区域
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/NewsEditPage.ets(121:11)", "entry");
            // 小红书风格的发布页面
            // 图片选择区域
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/NewsEditPage.ets(122:13)", "entry");
            Row.width('100%');
            Row.height(200);
            Row.borderRadius(20);
            Row.backgroundColor({ "id": 16777266, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Row.padding({ "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.imageUri ? this.imageUri : { "id": 16777267, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/NewsEditPage.ets(123:15)", "entry");
            Image.width('100%');
            Image.height(200);
            Image.objectFit(ImageFit.Cover);
            Image.onClick(() => this.selectImage());
            Image.clip(true);
            Image.borderRadius(20);
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题输入框
            TextInput.create({ placeholder: { "id": 16777249, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
            TextInput.debugLine("entry/src/main/ets/pages/NewsEditPage.ets(138:13)", "entry");
            // 标题输入框
            TextInput.fontSize({ "id": 16777297, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 标题输入框
            TextInput.placeholderFont({ size: { "id": 16777297, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
            // 标题输入框
            TextInput.margin({
                top: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                left: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                right: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }
            });
            // 标题输入框
            TextInput.fontColor({ "id": 16777265, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 标题输入框
            TextInput.backgroundColor({ "id": 16777266, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 标题输入框
            TextInput.onChange((value: string) => {
                this.title = value;
            });
            // 标题输入框
            TextInput.width(Constants.FULL_PERCENT);
            // 标题输入框
            TextInput.height({ "id": 16777285, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容输入框
            TextArea.create({ placeholder: { "id": 16777223, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
            TextArea.debugLine("entry/src/main/ets/pages/NewsEditPage.ets(155:13)", "entry");
            // 内容输入框
            TextArea.placeholderFont({ size: { "id": 16777297, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
            // 内容输入框
            TextArea.fontColor({ "id": 16777265, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 内容输入框
            TextArea.height(150);
            // 内容输入框
            TextArea.fontSize({ "id": 16777297, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 内容输入框
            TextArea.margin({
                top: { "id": 16777292, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                left: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                right: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }
            });
            // 内容输入框
            TextArea.padding({ "id": 16777292, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 内容输入框
            TextArea.backgroundColor({ "id": 16777266, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 内容输入框
            TextArea.onChange((value: string) => {
                this.content = value;
            });
        }, TextArea);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
            Blank.debugLine("entry/src/main/ets/pages/NewsEditPage.ets(171:13)", "entry");
        }, Blank);
        Blank.pop();
        // 小红书风格的发布页面
        // 图片选择区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发布按钮
            Button.createWithLabel({ "id": 16777240, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Button.debugLine("entry/src/main/ets/pages/NewsEditPage.ets(176:11)", "entry");
            // 发布按钮
            Button.fontSize({ "id": 16777297, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 发布按钮
            Button.height({ "id": 16777294, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 发布按钮
            Button.width('90%');
            // 发布按钮
            Button.margin({
                bottom: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                top: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }
            });
            // 发布按钮
            Button.onClick(() => this.uploadNewsData());
            // 发布按钮
            Button.backgroundColor({ "id": 16777258, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 发布按钮
            Button.fontColor({ "id": 16777266, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Button);
        // 发布按钮
        Button.pop();
        Column.pop();
        Navigation.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 上传过程中显示上传进度布局
            if (this.isUploading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new UploadingLayout(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/NewsEditPage.ets", line: 203, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "UploadingLayout" });
                    }
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
    static getEntryName(): string {
        return "NewsEditPage";
    }
}
registerNamedRoute(() => new NewsEditPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/NewsEditPage", pageFullPath: "entry/src/main/ets/pages/NewsEditPage", integratedHsp: "false", moduleType: "followWithHap" });
