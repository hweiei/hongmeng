if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface FailureLayout_Params {
    reloadAction?;
}
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
export default class FailureLayout extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.reloadAction = () => { };
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: FailureLayout_Params) {
        if (params.reloadAction !== undefined) {
            this.reloadAction = params.reloadAction;
        }
    }
    updateStateVars(params: FailureLayout_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private reloadAction;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/view/FailureLayout.ets(23:5)", "entry");
            Column.width(Constants.FULL_PERCENT);
            Column.height(Constants.FULL_PERCENT);
            Column.justifyContent(FlexAlign.Center);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777255, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/view/FailureLayout.ets(24:7)", "entry");
            Image.height({ "id": 16777290, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.width({ "id": 16777290, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777228, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/view/FailureLayout.ets(27:7)", "entry");
            Text.opacity({ "id": 16777291, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontSize({ "id": 16777297, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontColor({ "id": 16777265, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.margin({ top: { "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create({ "id": 16777222, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.debugLine("entry/src/main/ets/view/FailureLayout.ets(32:7)", "entry");
            Text.opacity({ "id": 16777291, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontSize({ "id": 16777297, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.fontColor({ "id": 16777258, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.padding({ "id": 16777277, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.onClick(this.reloadAction);
        }, Text);
        Text.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
