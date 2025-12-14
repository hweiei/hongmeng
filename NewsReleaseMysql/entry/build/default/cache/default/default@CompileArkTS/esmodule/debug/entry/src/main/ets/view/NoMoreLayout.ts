if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NoMoreLayout_Params {
}
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
export default class NoMoreLayout extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NoMoreLayout_Params) {
    }
    updateStateVars(params: NoMoreLayout_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width(Constants.FULL_PERCENT);
            Row.justifyContent(FlexAlign.Center);
            Row.height(Constants.CUSTOM_LAYOUT_HEIGHT);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777227, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.margin({ left: { "id": 16777279, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
            Text.fontSize({ "id": 16777284, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
