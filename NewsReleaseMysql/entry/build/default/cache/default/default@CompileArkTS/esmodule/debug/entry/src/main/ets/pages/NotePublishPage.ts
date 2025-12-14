if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NotePublishPage_Params {
    title?: string;
    content?: string;
    imageUri?: string;
    isSubmitting?: boolean;
    isUploading?: boolean;
    noteViewModel?: NoteViewModel;
}
import promptAction from "@ohos:promptAction";
import router from "@ohos:router";
import { GlobalContext } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/GlobalContext";
import type { User } from './zonghezuoye/User';
import NoteViewModel from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NoteViewModel";
import { fileSelect, fileUpload } from "@bundle:com.example.newsrelease/entry/ets/common/utils/FileUtil";
import type ResponseResult from '../viewmodel/ResponseResult';
import { showToast } from "@bundle:com.example.newsrelease/entry/ets/common/utils/ToastUtil";
class NotePublishPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__title = new ObservedPropertySimplePU('', this, "title");
        this.__content = new ObservedPropertySimplePU('', this, "content");
        this.__imageUri = new ObservedPropertySimplePU('', this, "imageUri");
        this.__isSubmitting = new ObservedPropertySimplePU(false, this, "isSubmitting");
        this.__isUploading = new ObservedPropertySimplePU(false, this, "isUploading");
        this.noteViewModel = new NoteViewModel();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NotePublishPage_Params) {
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
        if (params.isUploading !== undefined) {
            this.isUploading = params.isUploading;
        }
        if (params.noteViewModel !== undefined) {
            this.noteViewModel = params.noteViewModel;
        }
    }
    updateStateVars(params: NotePublishPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__title.purgeDependencyOnElmtId(rmElmtId);
        this.__content.purgeDependencyOnElmtId(rmElmtId);
        this.__imageUri.purgeDependencyOnElmtId(rmElmtId);
        this.__isSubmitting.purgeDependencyOnElmtId(rmElmtId);
        this.__isUploading.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__title.aboutToBeDeleted();
        this.__content.aboutToBeDeleted();
        this.__imageUri.aboutToBeDeleted();
        this.__isSubmitting.aboutToBeDeleted();
        this.__isUploading.aboutToBeDeleted();
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
    private __imageUri: ObservedPropertySimplePU<string>; // 添加图片URI状态
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
    private __isUploading: ObservedPropertySimplePU<boolean>; // 添加上传状态
    get isUploading() {
        return this.__isUploading.get();
    }
    set isUploading(newValue: boolean) {
        this.__isUploading.set(newValue);
    }
    private noteViewModel: NoteViewModel;
    aboutToAppear(): void {
        const loggedInUser: User | undefined = GlobalContext.getContext().getObject('loggedInUser') as User | undefined;
        if (!loggedInUser || !loggedInUser.id) {
            promptAction.showToast({ message: '请先登录' });
            router.back();
        }
    }
    // 选择图片
    selectImage() {
        fileSelect().then((uri: string) => {
            this.imageUri = uri || '';
        });
    }
    // 上传笔记数据
    async uploadNoteData() {
        // 表单验证：检查标题是否为空
        if (this.title === '') {
            showToast('请输入标题');
            return;
        }
        // 表单验证：检查内容是否为空
        if (this.content === '') {
            showToast('请输入内容');
            return;
        }
        const loggedInUser: User | undefined = GlobalContext.getContext().getObject('loggedInUser') as User | undefined;
        if (!loggedInUser || !loggedInUser.id) {
            showToast('请先登录');
            return;
        }
        // 设置上传状态为true，显示上传进度
        this.isUploading = true;
        // 如果有图片则先上传图片
        let imagesUrl: string[] = [];
        if (this.imageUri) {
            try {
                console.log('开始上传图片:', this.imageUri);
                const serverData: ResponseResult = await fileUpload(getContext(this), this.imageUri);
                console.log('图片上传成功:', serverData);
                imagesUrl = [serverData.data as string];
            }
            catch (error) {
                // 上传图片文件失败处理
                console.error('上传图片失败:', JSON.stringify(error));
                this.isUploading = false;
                showToast('图片上传失败');
                return;
            }
        }
        // 保存笔记数据到本地数据库
        try {
            console.log('开始保存笔记到数据库');
            const success: boolean = await this.noteViewModel.addNote(this.title, this.content, loggedInUser.id, imagesUrl);
            console.log('保存笔记结果:', success);
            if (success) {
                // 上传成功，重置上传状态
                this.isUploading = false;
                // 设置返回路由标识
                GlobalContext.getContext().setObject('isBackRouter', true);
                // 返回上一页
                router.back();
            }
            else {
                // 保存笔记失败处理
                this.isUploading = false;
                showToast('发布失败');
            }
        }
        catch (error) {
            // 保存笔记失败处理
            console.error('保存笔记失败:', JSON.stringify(error));
            this.isUploading = false;
            showToast('发布失败');
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create();
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.padding({
                left: 0,
                right: 0,
                bottom: 0
            });
            Column.height('100%');
            Column.justifyContent(FlexAlign.SpaceBetween);
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图片选择区域
            Column.create();
            // 图片选择区域
            Column.layoutWeight(1);
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
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题输入框
            TextInput.create({ placeholder: '请输入标题' });
            // 标题输入框
            TextInput.fontSize(18);
            // 标题输入框
            TextInput.placeholderFont({ size: 18 });
            // 标题输入框
            TextInput.margin({
                top: 12,
                left: 12,
                right: 12
            });
            // 标题输入框
            TextInput.fontColor('#333333');
            // 标题输入框
            TextInput.backgroundColor('#FFFFFF');
            // 标题输入框
            TextInput.onChange((value: string) => {
                this.title = value;
            });
            // 标题输入框
            TextInput.width('100%');
            // 标题输入框
            TextInput.height(50);
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 内容输入框
            TextArea.create({ placeholder: '分享你的想法...' });
            // 内容输入框
            TextArea.placeholderFont({ size: 16 });
            // 内容输入框
            TextArea.fontColor('#333333');
            // 内容输入框
            TextArea.height(150);
            // 内容输入框
            TextArea.fontSize(16);
            // 内容输入框
            TextArea.margin({
                top: 12,
                left: 12,
                right: 12
            });
            // 内容输入框
            TextArea.padding(12);
            // 内容输入框
            TextArea.backgroundColor('#FFFFFF');
            // 内容输入框
            TextArea.onChange((value: string) => {
                this.content = value;
            });
        }, TextArea);
        // 图片选择区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发布按钮
            Button.createWithLabel('发布');
            // 发布按钮
            Button.fontSize(18);
            // 发布按钮
            Button.height(48);
            // 发布按钮
            Button.width('90%');
            // 发布按钮
            Button.margin({
                bottom: 12,
                top: 12
            });
            // 发布按钮
            Button.onClick(() => this.uploadNoteData());
            // 发布按钮
            Button.backgroundColor('#FF6B6B');
            // 发布按钮
            Button.fontColor('#FFFFFF');
        }, Button);
        // 发布按钮
        Button.pop();
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 上传过程中显示上传进度布局
            if (this.isUploading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.height('100%');
                        Column.justifyContent(FlexAlign.Center);
                        Column.backgroundColor('#000000AA');
                        Column.position({ x: 0, y: 0 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('发布中...');
                        Text.fontSize(16);
                        Text.fontColor('#FFFFFF');
                    }, Text);
                    Text.pop();
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
    static getEntryName(): string {
        return "NotePublishPage";
    }
}
registerNamedRoute(() => new NotePublishPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/NotePublishPage", pageFullPath: "entry/src/main/ets/pages/NotePublishPage", integratedHsp: "false", moduleType: "followWithHap" });
