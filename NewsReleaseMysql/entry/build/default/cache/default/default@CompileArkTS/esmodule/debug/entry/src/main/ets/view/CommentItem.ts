if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface CommentItem_Params {
    comment?: Comment;
}
import Comment from "@bundle:com.example.newsrelease/entry/ets/models/Comment";
export class CommentItem extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.comment = new Comment();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: CommentItem_Params) {
        if (params.comment !== undefined) {
            this.comment = params.comment;
        }
    }
    updateStateVars(params: CommentItem_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
    }
    aboutToBeDeleted() {
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private comment: Comment;
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.padding({ top: 10, bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 使用mine_normal图片作为头像
            Image.create({ "id": 16777319, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 使用mine_normal图片作为头像
            Image.width(40);
            // 使用mine_normal图片作为头像
            Image.height(40);
            // 使用mine_normal图片作为头像
            Image.margin({ right: 10 });
            // 使用mine_normal图片作为头像
            Image.borderRadius(20);
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.layoutWeight(1);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名和时间
            Row.create();
            // 用户名和时间
            Row.width('100%');
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.comment.username);
            Text.fontSize(14);
            Text.fontWeight(500);
            Text.fontColor('#333');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.comment.createTime);
            Text.fontSize(12);
            Text.fontColor('#999');
        }, Text);
        Text.pop();
        // 用户名和时间
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 评论内容
            Text.create(this.comment.content);
            // 评论内容
            Text.fontSize(14);
            // 评论内容
            Text.fontColor('#333');
            // 评论内容
            Text.textAlign(TextAlign.Start);
            // 评论内容
            Text.width('100%');
            // 评论内容
            Text.margin({ top: 5 });
        }, Text);
        // 评论内容
        Text.pop();
        Column.pop();
        Row.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
