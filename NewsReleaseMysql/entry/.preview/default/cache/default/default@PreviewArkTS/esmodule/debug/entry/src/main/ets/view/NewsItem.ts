if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NewsItem_Params {
    newsData?: NewsData;
}
import { NewsData } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsData";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
export default class NewsItem extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.newsData = new NewsData();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NewsItem_Params) {
        if (params.newsData !== undefined) {
            this.newsData = params.newsData;
        }
    }
    updateStateVars(params: NewsItem_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private newsData: NewsData;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/NewsItem.ets(27:5)", "entry");
            Column.backgroundColor({ "id": 16777266, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Column.borderRadius({ "id": 16777286, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 图片展示区域（小红书风格以图片为主）
            Image.create(Constants.SERVER + this.newsData.imagesUrl);
            Image.debugLine("entry/src/main/ets/view/NewsItem.ets(29:7)", "entry");
            // 图片展示区域（小红书风格以图片为主）
            Image.objectFit(ImageFit.Cover);
            // 图片展示区域（小红书风格以图片为主）
            Image.aspectRatio(0.8);
            // 图片展示区域（小红书风格以图片为主）
            Image.clip(true);
            // 图片展示区域（小红书风格以图片为主）
            Image.width('100%');
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 标题和内容区域
            Column.create();
            Column.debugLine("entry/src/main/ets/view/NewsItem.ets(36:7)", "entry");
            // 标题和内容区域
            Column.padding({
                left: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                right: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                bottom: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                top: { "id": 16777292, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newsData?.title);
            Text.debugLine("entry/src/main/ets/view/NewsItem.ets(37:9)", "entry");
            Text.fontSize({ "id": 16777297, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontColor({ "id": 16777265, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.maxLines(2);
            Text.lineHeight({ "id": 16777298, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontFamily({ "id": 16777225, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.fontWeight(Constants.TITLE_FONT_WEIGHT);
            Text.width('100%');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newsData?.content);
            Text.debugLine("entry/src/main/ets/view/NewsItem.ets(47:9)", "entry");
            Text.fontSize({ "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontFamily({ "id": 16777224, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.opacity(Constants.DESC_OPACITY);
            Text.fontColor({ "id": 16777265, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.lineHeight({ "id": 16777280, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.width('100%');
            Text.maxLines(3);
            Text.fontWeight(Constants.DESC_FONT_WEIGHT);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
            Text.margin({ top: { "id": 16777292, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 来源信息
            Row.create();
            Row.debugLine("entry/src/main/ets/view/NewsItem.ets(60:9)", "entry");
            // 来源信息
            Row.width('100%');
            // 来源信息
            Row.margin({ top: { "id": 16777292, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.newsData?.source);
            Text.debugLine("entry/src/main/ets/view/NewsItem.ets(61:11)", "entry");
            Text.fontSize({ "id": 16777296, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontColor({ "id": 16777262, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 添加一些互动元素（点赞、评论等占位符）
            Blank.create();
            Blank.debugLine("entry/src/main/ets/view/NewsItem.ets(66:11)", "entry");
        }, Blank);
        // 添加一些互动元素（点赞、评论等占位符）
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/NewsItem.ets(68:11)", "entry");
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('❤');
            Text.debugLine("entry/src/main/ets/view/NewsItem.ets(69:13)", "entry");
            Text.fontSize(16);
            Text.margin({ right: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('💬');
            Text.debugLine("entry/src/main/ets/view/NewsItem.ets(73:13)", "entry");
            Text.fontSize(16);
        }, Text);
        Text.pop();
        Row.pop();
        // 来源信息
        Row.pop();
        // 标题和内容区域
        Column.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
