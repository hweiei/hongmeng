if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoadMoreLayout_Params {
    loadMoreLayoutClass?: RefreshLoadingClass;
}
import type RefreshLoadingClass from '../viewmodel/RefreshLoadingClass';
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
export default class LoadMoreLayout extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__loadMoreLayoutClass = new SynchedPropertyNesedObjectPU(params.loadMoreLayoutClass, this, "loadMoreLayoutClass");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoadMoreLayout_Params) {
        this.__loadMoreLayoutClass.set(params.loadMoreLayoutClass);
    }
    updateStateVars(params: LoadMoreLayout_Params) {
        this.__loadMoreLayoutClass.set(params.loadMoreLayoutClass);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__loadMoreLayoutClass.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__loadMoreLayoutClass.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __loadMoreLayoutClass: SynchedPropertyNesedObjectPU<RefreshLoadingClass>;
    get loadMoreLayoutClass() {
        return this.__loadMoreLayoutClass.get();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/view/LoadMoreLayout.ets(27:5)", "entry");
            Row.clip(true);
            Row.width(Constants.FULL_PERCENT);
            Row.justifyContent(FlexAlign.Center);
            Row.height(this.loadMoreLayoutClass.heightValue);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.loadMoreLayoutClass.imageSrc);
            Image.debugLine("entry/src/main/ets/view/LoadMoreLayout.ets(28:7)", "entry");
            Image.width({ "id": 16777293, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.height({ "id": 16777293, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.loadMoreLayoutClass.textValue);
            Text.debugLine("entry/src/main/ets/view/LoadMoreLayout.ets(32:7)", "entry");
            Text.margin({ left: { "id": 16777292, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" } });
            Text.fontSize({ "id": 16777297, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Text.textAlign(TextAlign.Center);
        }, Text);
        Text.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
