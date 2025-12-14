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
        // Request news category.
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
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MainPage.ets(34:5)", "entry");
            Column.width(Constants.FULL_PERCENT);
            Column.height(Constants.FULL_PERCENT);
            Column.backgroundColor({ "id": 16777263, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
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
                    NewsList(this, { index: this.currentIndex, currentIndex: this.__currentIndex }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/pages/MainPage.ets", line: 36, col: 7 });
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
            Row.debugLine("entry/src/main/ets/pages/MainPage.ets(40:7)", "entry");
            // 底部导航栏
            Row.height(50);
            // 底部导航栏
            Row.backgroundColor({ "id": 16777266, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 底部导航栏
            Row.border({
                width: 1,
                color: { "id": 16777259, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                style: BorderStyle.Solid
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 全部标签
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MainPage.ets(42:9)", "entry");
            // 全部标签
            Column.layoutWeight(1);
            // 全部标签
            Column.justifyContent(FlexAlign.Center);
            // 全部标签
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.tabBarArray[0]?.name || "全部");
            Text.debugLine("entry/src/main/ets/pages/MainPage.ets(43:11)", "entry");
            Text.fontSize(15);
            Text.fontWeight(this.currentIndex === 0 ? 600 : 400);
            Text.fontColor(this.currentIndex === 0 ? { "id": 16777258, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } : { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
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
            Column.debugLine("entry/src/main/ets/pages/MainPage.ets(56:9)", "entry");
            // 发布按钮
            Column.layoutWeight(1);
            // 发布按钮
            Column.justifyContent(FlexAlign.Center);
            // 发布按钮
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777252, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/MainPage.ets(57:11)", "entry");
            Image.width(48);
            Image.height(48);
            Image.onClick(() => {
                router.pushUrl({ url: Constants.NEWS_EDIT_PAGE });
            });
        }, Image);
        // 发布按钮
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 我的标签
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/MainPage.ets(69:9)", "entry");
            // 我的标签
            Column.layoutWeight(1);
            // 我的标签
            Column.justifyContent(FlexAlign.Center);
            // 我的标签
            Column.alignItems(HorizontalAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.tabBarArray[1]?.name || "我的");
            Text.debugLine("entry/src/main/ets/pages/MainPage.ets(70:11)", "entry");
            Text.fontSize(15);
            Text.fontWeight(this.currentIndex === 1 ? 600 : 400);
            Text.fontColor(this.currentIndex === 1 ? { "id": 16777258, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } : { "id": 16777261, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.onClick(() => {
                this.currentIndex = 1;
            });
        }, Text);
        Text.pop();
        // 我的标签
        Column.pop();
        // 底部导航栏
        Row.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "MainPage";
    }
}
registerNamedRoute(() => new MainPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/MainPage", pageFullPath: "entry/src/main/ets/pages/MainPage", integratedHsp: "false", moduleType: "followWithHap" });
