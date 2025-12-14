if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface SwiperFun_Params {
}
interface IndexPage_Params {
    message?: string;
}
import router from "@ohos:router";
class IndexPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__message = new ObservedPropertySimplePU('欢迎使用此应用', this, "message");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: IndexPage_Params) {
        if (params.message !== undefined) {
            this.message = params.message;
        }
    }
    updateStateVars(params: IndexPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__message.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__message.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __message: ObservedPropertySimplePU<string>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: string) {
        this.__message.set(newValue);
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create({ space: 25 });
            Column.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(68:7)", "entry");
            Column.width('100%');
            Column.alignItems(HorizontalAlign.Center);
            Column.backgroundColor('#F8F8F8');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主内容列布局，设置元素间距
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(70:9)", "entry");
            // 主内容列布局，设置元素间距
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题区域
            Text.create('综合平台');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(72:11)", "entry");
            // 标题区域
            Text.fontSize(28);
            // 标题区域
            Text.fontWeight(FontWeight.Bold);
            // 标题区域
            Text.fontColor('#1890FF');
            // 标题区域
            Text.margin({ top: 30 });
        }, Text);
        // 标题区域
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.message);
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(78:11)", "entry");
            Text.fontSize(16);
            Text.fontColor('#666666');
            Text.margin({ top: 10 });
        }, Text);
        Text.pop();
        // 主内容列布局，设置元素间距
        Column.pop();
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 轮播图组件
                    SwiperFun(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/zonghezuoye/IndexPage.ets", line: 86, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {};
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "SwiperFun" });
        }
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能按钮区域
            Column.create({ space: 20 });
            Column.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(89:9)", "entry");
            // 功能按钮区域
            Column.margin({ top: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('立即注册');
            Button.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(90:11)", "entry");
            Button.type(ButtonType.Capsule);
            Button.width('80%');
            Button.height(50);
            Button.backgroundColor('#1890FF');
            Button.fontColor(Color.White);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/zonghezuoye/RegisterPage' });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('立即登录');
            Button.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(100:11)", "entry");
            Button.type(ButtonType.Capsule);
            Button.width('80%');
            Button.height(50);
            Button.backgroundColor('#52C41A');
            Button.fontColor(Color.White);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/zonghezuoye/LoginPage' });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('用户管理');
            Button.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(109:11)", "entry");
            Button.type(ButtonType.Capsule);
            Button.width('80%');
            Button.height(50);
            Button.backgroundColor('#722ED1');
            Button.fontColor(Color.White);
            Button.onClick(() => {
                router.pushUrl({ url: 'pages/zonghezuoye/UserListPage' });
            });
        }, Button);
        Button.pop();
        // 功能按钮区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部信息
            Text.create('© 2025 移动应用开发');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(122:9)", "entry");
            // 底部信息
            Text.fontSize(12);
            // 底部信息
            Text.fontColor('#999999');
            // 底部信息
            Text.margin({ top: 50, bottom: 30 });
        }, Text);
        // 底部信息
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "IndexPage";
    }
}
class SwiperFun extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: SwiperFun_Params) {
    }
    updateStateVars(params: SwiperFun_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 创建轮播容器
            Swiper.create();
            Swiper.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(142:5)", "entry");
            // 创建轮播容器
            Swiper.width('90%');
            // 创建轮播容器
            Swiper.height(240);
            // 创建轮播容器
            Swiper.margin({ top: 20 });
            // 创建轮播容器
            Swiper.loop(true);
            // 创建轮播容器
            Swiper.autoPlay(true);
            // 创建轮播容器
            Swiper.interval(3000);
            // 创建轮播容器
            Swiper.indicator(// 设置指示器样式
            new DotIndicator()
                .itemWidth(12)
                .itemHeight(12)
                .selectedItemWidth(20)
                .selectedItemHeight(12)
                .color('#DDDDDD')
                .selectedColor('#1890FF'));
            // 创建轮播容器
            Swiper.onChange((index: number) => {
                console.log("当前轮播索引:", index);
            });
        }, Swiper);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 循环渲染三张图片
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const index = _item;
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Column.create();
                    Column.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(145:9)", "entry");
                    Column.padding(20);
                    Column.backgroundColor(Color.White);
                }, Column);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Image.create({ "id": -1, "type": -1, params: [`app.media.${index}`], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
                    Image.debugLine("entry/src/main/ets/pages/zonghezuoye/IndexPage.ets(146:11)", "entry");
                    Image.objectFit(ImageFit.Cover);
                    Image.width('100%');
                    Image.height(180);
                }, Image);
                Column.pop();
            };
            this.forEachUpdateFunction(elmtId, [1, 2, 3], forEachItemGenFunction);
        }, ForEach);
        // 循环渲染三张图片
        ForEach.pop();
        // 创建轮播容器
        Swiper.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
registerNamedRoute(() => new IndexPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/zonghezuoye/IndexPage", pageFullPath: "entry/src/main/ets/pages/zonghezuoye/IndexPage", integratedHsp: "false", moduleType: "followWithHap" });
