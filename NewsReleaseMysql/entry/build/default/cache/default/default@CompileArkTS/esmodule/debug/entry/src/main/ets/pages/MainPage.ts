if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface MainPage_Params {
    tabBarArray?: NewsTypeBean[];
    currentIndex?: number;
}
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import NewsList from "@bundle:com.example.newsrelease/entry/ets/view/NewsList";
import router from "@ohos:router";
import NewsTypeViewModel from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsTypeViewModel";
import type NewsTypeBean from '../viewmodel/NewsTypeModel';
import { GlobalContext } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/GlobalContext";
class MainPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__tabBarArray = new ObservedPropertyObjectPU(NewsTypeViewModel.getDefaultTypeList(), this, "tabBarArray");
        this.__currentIndex = new ObservedPropertySimplePU(0, this, "currentIndex");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: MainPage_Params) {
        if (params.tabBarArray !== undefined) {
            this.tabBarArray = params.tabBarArray;
        }
        if (params.currentIndex !== undefined) {
            this.currentIndex = params.currentIndex;
        }
    }
    updateStateVars(params: MainPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__tabBarArray.purgeDependencyOnElmtId(rmElmtId);
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__tabBarArray.aboutToBeDeleted();
        this.__currentIndex.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __tabBarArray: ObservedPropertyObjectPU<NewsTypeBean[]>;
    get tabBarArray() {
        return this.__tabBarArray.get();
    }
    set tabBarArray(newValue: NewsTypeBean[]) {
        this.__tabBarArray.set(newValue);
    }
    private __currentIndex: ObservedPropertySimplePU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    aboutToAppear() {
        // 请求新闻分类
        NewsTypeViewModel.getNewsTypeList().then((typeList: NewsTypeBean[]) => {
            this.tabBarArray = typeList;
        });
    }
    onPageShow() {
        if (GlobalContext.getContext().getObject('isBackRouter') === true) {
            GlobalContext.getContext().setObject('isBackRouter', false);
            let tempIndex = this.currentIndex;
            this.currentIndex = -1;
            this.currentIndex = tempIndex;
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Stack.create({ alignContent: Alignment.BottomEnd });
        }, Stack);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(Constants.FULL_PERCENT);
            Column.height(Constants.FULL_PERCENT);
            Column.backgroundColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            __Common__.create();
            __Common__.layoutWeight(1);
        }, __Common__);
        {
            this.observeComponentCreation2((elmtId, isInitialRender) => {
                if (isInitialRender) {
                    let componentCall = new 
                    // 内容区域
                    NewsList(this, { index: this.currentIndex, currentIndex: this.__currentIndex }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 38, col: 9 });
                    ViewPU.create(componentCall);
                    let paramsLambda = () => {
                        return {
                            index: this.currentIndex,
                            currentIndex: this.currentIndex
                        };
                    };
                    componentCall.paramsGenerator_ = paramsLambda;
                }
                else {
                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                }
            }, { name: "NewsList" });
        }
        __Common__.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 底部导航栏
            Row.create();
            // 底部导航栏
            Row.height(60);
            // 底部导航栏
            Row.backgroundColor({ "id": 16777258, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 底部导航栏
            Row.border({
                width: 1,
                color: { "id": 16777251, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                style: BorderStyle.Solid
            });
            // 底部导航栏
            Row.shadow({ radius: 6, color: '#1F000000', offsetX: 0, offsetY: -2 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 全部标签
            Column.create();
            // 全部标签
            Column.layoutWeight(1);
            // 全部标签
            Column.justifyContent(FlexAlign.Center);
            // 全部标签
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.tabBarArray[0]?.name || "全部");
            Text.fontSize(16);
            Text.fontWeight(this.currentIndex === 0 ? 600 : 400);
            Text.fontColor(this.currentIndex === 0 ? { "id": 16777250, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } : { "id": 16777253, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.onClick(() => {
                this.currentIndex = 0;
            });
        }, Text);
        Text.pop();
        // 全部标签
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 发布按钮
            Column.create();
            // 发布按钮
            Column.layoutWeight(1);
            // 发布按钮
            Column.justifyContent(FlexAlign.Center);
            // 发布按钮
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777317, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.width(56);
            Image.height(56);
            Image.objectFit(ImageFit.Contain);
            Image.onClick(() => {
                router.pushUrl({ url: Constants.NEWS_EDIT_PAGE });
            });
        }, Image);
        // 发布按钮
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 我的标签
            Column.create();
            // 我的标签
            Column.layoutWeight(1);
            // 我的标签
            Column.justifyContent(FlexAlign.Center);
            // 我的标签
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.tabBarArray[1]?.name || "我的");
            Text.fontSize(16);
            Text.fontWeight(this.currentIndex === 1 ? 600 : 400);
            Text.fontColor(this.currentIndex === 1 ? { "id": 16777250, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } : { "id": 16777253, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.onClick(() => {
                this.currentIndex = 1;
                router.pushUrl({ url: 'pages/zonghezuoye/ProfilePage' });
            });
        }, Text);
        Text.pop();
        // 我的标签
        Column.pop();
        // 底部导航栏
        Row.pop();
        Column.pop();
        Stack.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "MainPage";
    }
}
registerNamedRoute(() => new MainPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/MainPage", pageFullPath: "entry/src/main/ets/pages/MainPage", integratedHsp: "false", moduleType: "followWithHap" });
