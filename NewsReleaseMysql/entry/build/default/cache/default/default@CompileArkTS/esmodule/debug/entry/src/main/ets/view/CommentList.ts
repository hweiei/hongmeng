if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CommentList_Params {
    comments?: CommentData[];
}
import type { CommentData } from '../viewmodel/CommentData';
import CommentItem from "@bundle:com.example.newsrelease/entry/ets/view/CommentItem";
export default class CommentList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.comments = [];
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CommentList_Params) {
        if (params.comments !== undefined) {
            this.comments = params.comments;
        }
    }
    updateStateVars(params: CommentList_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private comments: CommentData[];
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const comment = _item;
                {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        if (isInitialRender) {
                            let componentCall = new CommentItem(this, { comment: comment }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/CommentList.ets", line: 11, col: 9 });
                            ViewPU.create(componentCall);
                            let paramsLambda = () => {
                                return {
                                    comment: comment
                                };
                            };
                            componentCall.paramsGenerator_ = paramsLambda;
                        }
                        else {
                            this.updateStateVarsOfChildByElmtId(elmtId, {});
                        }
                    }, { name: "CommentItem" });
                }
            };
            this.forEachUpdateFunction(elmtId, this.comments, forEachItemGenFunction, (comment: CommentData) => comment.id.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
