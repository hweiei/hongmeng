if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RefreshLayout_Params {
    refreshLoadingClass?: RefreshLoadingClass;
}
import type RefreshLoadingClass from '../viewmodel/RefreshLoadingClass';
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
export default class RefreshLayout extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__refreshLoadingClass = new SynchedPropertyNesedObjectPU(params.refreshLoadingClass, this, "refreshLoadingClass");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RefreshLayout_Params) {
        this.__refreshLoadingClass.set(params.refreshLoadingClass);
    }
    updateStateVars(params: RefreshLayout_Params) {
        this.__refreshLoadingClass.set(params.refreshLoadingClass);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__refreshLoadingClass.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__refreshLoadingClass.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __refreshLoadingClass: SynchedPropertyNesedObjectPU<RefreshLoadingClass>;
    get refreshLoadingClass() {
        return this.__refreshLoadingClass.get();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.clip(true);
            Row.width(Constants.FULL_PERCENT);
            Row.justifyContent(FlexAlign.Center);
            Row.height(this.refreshLoadingClass.heightValue);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create(this.refreshLoadingClass.imageSrc);
            Image.width({ "id": 16777280, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.height({ "id": 16777280, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.refreshLoadingClass.textValue);
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
