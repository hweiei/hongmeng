if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SplashScreenPage_Params {
    loadingText?: string;
    timeoutId?: number | null;
}
import router from "@ohos:router";
class SplashScreenPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__loadingText = new ObservedPropertySimplePU('正在加载...', this, "loadingText");
        this.timeoutId = null;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SplashScreenPage_Params) {
        if (params.loadingText !== undefined) {
            this.loadingText = params.loadingText;
        }
        if (params.timeoutId !== undefined) {
            this.timeoutId = params.timeoutId;
        }
    }
    updateStateVars(params: SplashScreenPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__loadingText.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__loadingText.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __loadingText: ObservedPropertySimplePU<string>;
    get loadingText() {
        return this.__loadingText.get();
    }
    set loadingText(newValue: string) {
        this.__loadingText.set(newValue);
    }
    private timeoutId: number | null;
    aboutToAppear(): void {
        // 设置3秒后自动跳转到IndexPage
        this.timeoutId = setTimeout(() => {
            router.replaceUrl({ url: 'pages/zonghezuoye/IndexPage' });
        }, 3000);
    }
    onWillUnmount(): void {
        // 组件销毁前清理定时器
        if (this.timeoutId !== null) {
            clearTimeout(this.timeoutId);
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 启动画面占据全屏
            Flex.create({ direction: FlexDirection.Column, alignItems: ItemAlign.Center, justifyContent: FlexAlign.Center });
            // 启动画面占据全屏
            Flex.width('100%');
            // 启动画面占据全屏
            Flex.height('100%');
            // 启动画面占据全屏
            Flex.backgroundColor('#F8F8F8');
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Logo或应用图标（如果有的话）
            Image.create({ "id": 16777319, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // Logo或应用图标（如果有的话）
            Image.width(120);
            // Logo或应用图标（如果有的话）
            Image.height(120);
            // Logo或应用图标（如果有的话）
            Image.objectFit(ImageFit.Contain);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 应用名称
            Text.create('综合平台');
            // 应用名称
            Text.fontSize(32);
            // 应用名称
            Text.fontWeight(FontWeight.Bold);
            // 应用名称
            Text.fontColor('#1890FF');
        }, Text);
        // 应用名称
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 加载提示文本
            Text.create(this.loadingText);
            // 加载提示文本
            Text.fontSize(16);
            // 加载提示文本
            Text.fontColor('#666666');
        }, Text);
        // 加载提示文本
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 加载进度条
            Row.create();
            // 加载进度条
            Row.width(60);
            // 加载进度条
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = (_item, index: number) => {
                const item = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Blank.create();
                    Context.animation({
                        duration: 1000,
                        curve: Curve.EaseInOut,
                        delay: index * 300,
                        iterations: -1,
                        playMode: PlayMode.Alternate
                    });
                    Blank.width(10);
                    Blank.height(10);
                    Blank.backgroundColor('#1890FF');
                    Blank.borderRadius(5);
                    Context.animation(null);
                }, Blank);
                Blank.pop();
            };
            this.forEachUpdateFunction(elmtId, Array.from({ length: 3 }), forEachItemGenFunction, (item: undefined, index: number) => {
                return index.toString();
            }, true, true);
        }, ForEach);
        ForEach.pop();
        // 加载进度条
        Row.pop();
        Column.pop();
        // 启动画面占据全屏
        Flex.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "SplashScreenPage";
    }
}
registerNamedRoute(() => new SplashScreenPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/zonghezuoye/SplashScreenPage", pageFullPath: "entry/src/main/ets/pages/zonghezuoye/SplashScreenPage", integratedHsp: "false", moduleType: "followWithHap" });
