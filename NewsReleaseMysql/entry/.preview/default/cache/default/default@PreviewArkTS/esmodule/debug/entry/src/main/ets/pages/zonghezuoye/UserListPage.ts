if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface UserListPage_Params {
    users?: User[];
    isLoading?: boolean;
    selectedUser?: User | null;
    showEditDialog?: boolean;
    newPassword?: string;
    showPasswordError?: boolean;
    context?;
    dbHelper?;
}
import promptAction from "@ohos:promptAction";
import router from "@ohos:router";
import type common from "@ohos:app.ability.common";
import { DatabaseHelper } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/DatabaseHelper";
import { User } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/User";
class UserListPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__users = new ObservedPropertyObjectPU([], this, "users");
        this.__isLoading = new ObservedPropertySimplePU(true, this, "isLoading");
        this.__selectedUser = new ObservedPropertyObjectPU(null, this, "selectedUser");
        this.__showEditDialog = new ObservedPropertySimplePU(false, this, "showEditDialog");
        this.__newPassword = new ObservedPropertySimplePU('', this, "newPassword");
        this.__showPasswordError = new ObservedPropertySimplePU(false, this, "showPasswordError");
        this.context = getContext(this) as common.UIAbilityContext;
        this.dbHelper = DatabaseHelper.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: UserListPage_Params) {
        if (params.users !== undefined) {
            this.users = params.users;
        }
        if (params.isLoading !== undefined) {
            this.isLoading = params.isLoading;
        }
        if (params.selectedUser !== undefined) {
            this.selectedUser = params.selectedUser;
        }
        if (params.showEditDialog !== undefined) {
            this.showEditDialog = params.showEditDialog;
        }
        if (params.newPassword !== undefined) {
            this.newPassword = params.newPassword;
        }
        if (params.showPasswordError !== undefined) {
            this.showPasswordError = params.showPasswordError;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.dbHelper !== undefined) {
            this.dbHelper = params.dbHelper;
        }
    }
    updateStateVars(params: UserListPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__users.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoading.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedUser.purgeDependencyOnElmtId(rmElmtId);
        this.__showEditDialog.purgeDependencyOnElmtId(rmElmtId);
        this.__newPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__showPasswordError.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__users.aboutToBeDeleted();
        this.__isLoading.aboutToBeDeleted();
        this.__selectedUser.aboutToBeDeleted();
        this.__showEditDialog.aboutToBeDeleted();
        this.__newPassword.aboutToBeDeleted();
        this.__showPasswordError.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 用户列表状态
    private __users: ObservedPropertyObjectPU<User[]>;
    get users() {
        return this.__users.get();
    }
    set users(newValue: User[]) {
        this.__users.set(newValue);
    }
    private __isLoading: ObservedPropertySimplePU<boolean>;
    get isLoading() {
        return this.__isLoading.get();
    }
    set isLoading(newValue: boolean) {
        this.__isLoading.set(newValue);
    }
    private __selectedUser: ObservedPropertyObjectPU<User | null>;
    get selectedUser() {
        return this.__selectedUser.get();
    }
    set selectedUser(newValue: User | null) {
        this.__selectedUser.set(newValue);
    }
    private __showEditDialog: ObservedPropertySimplePU<boolean>;
    get showEditDialog() {
        return this.__showEditDialog.get();
    }
    set showEditDialog(newValue: boolean) {
        this.__showEditDialog.set(newValue);
    }
    private __newPassword: ObservedPropertySimplePU<string>;
    get newPassword() {
        return this.__newPassword.get();
    }
    set newPassword(newValue: string) {
        this.__newPassword.set(newValue);
    }
    private __showPasswordError: ObservedPropertySimplePU<boolean>;
    get showPasswordError() {
        return this.__showPasswordError.get();
    }
    set showPasswordError(newValue: boolean) {
        this.__showPasswordError.set(newValue);
    }
    // 获取应用上下文
    private context;
    private dbHelper;
    // 页面显示时加载用户列表
    async onPageShow() {
        try {
            await this.dbHelper.initialize(this.context);
            this.loadUsers();
        }
        catch (err) {
            console.error('数据库初始化失败:', err);
            promptAction.showToast({ message: '数据库连接失败' });
            this.isLoading = false;
        }
    }
    // 页面隐藏时关闭数据库连接
    onPageHide(): void {
        this.dbHelper.close();
    }
    // 加载用户列表
    private async loadUsers() {
        try {
            this.isLoading = true;
            this.users = await this.dbHelper.queryAllUsers();
            this.isLoading = false;
        }
        catch (err) {
            console.error('加载用户列表失败:', err);
            promptAction.showToast({ message: '加载用户列表失败' });
            this.isLoading = false;
        }
    }
    // 删除用户
    private async deleteUser(userId: number) {
        try {
            const rowsDeleted = await this.dbHelper.deleteUser(userId);
            if (rowsDeleted > 0) {
                promptAction.showToast({ message: '用户删除成功' });
                this.loadUsers(); // 重新加载用户列表
            }
            else {
                promptAction.showToast({ message: '用户删除失败' });
            }
        }
        catch (err) {
            console.error('删除用户失败:', err);
            promptAction.showToast({ message: '删除用户失败' });
        }
    }
    // 打开编辑对话框
    private openEditDialog(user: User) {
        this.selectedUser = user;
        this.newPassword = '';
        this.showPasswordError = false;
        this.showEditDialog = true;
    }
    // 关闭编辑对话框
    private closeEditDialog() {
        this.showEditDialog = false;
        this.selectedUser = null;
    }
    // 验证密码
    private validatePassword(): boolean {
        const passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/;
        if (!passwordPattern.test(this.newPassword)) {
            this.showPasswordError = true;
            return false;
        }
        else {
            this.showPasswordError = false;
            return true;
        }
    }
    // 更新用户密码
    private async updateUserPassword() {
        if (!this.selectedUser || !this.validatePassword()) {
            return;
        }
        try {
            const updatedUser = new User(this.selectedUser.username, this.newPassword);
            updatedUser.id = this.selectedUser.id;
            const rowsUpdated = await this.dbHelper.updateUser(updatedUser, this.selectedUser.id as number);
            if (rowsUpdated > 0) {
                promptAction.showToast({ message: '密码更新成功' });
                this.closeEditDialog();
                this.loadUsers(); // 重新加载用户列表
            }
            else {
                promptAction.showToast({ message: '密码更新失败' });
            }
        }
        catch (err) {
            console.error('更新密码失败:', err);
            promptAction.showToast({ message: '更新密码失败' });
        }
    }
    // 退出登录
    private logout() {
        router.pushUrl({ url: 'pages/zonghezuoye/LoginPage' });
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(124:5)", "entry");
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(125:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮区域
            Image.create({ "id": 16777299, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(127:9)", "entry");
            // 返回按钮区域
            Image.width(24);
            // 返回按钮区域
            Image.height(24);
            // 返回按钮区域
            Image.margin({ top: 10, left: 20 });
            // 返回按钮区域
            Image.onClick(() => {
                router.back(); // 返回到上一页
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 页面标题和退出按钮
            Row.create({ space: 20 });
            Row.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(138:7)", "entry");
            // 页面标题和退出按钮
            Row.width('100%');
            // 页面标题和退出按钮
            Row.padding({ top: 20, left: 20, right: 20 });
            // 页面标题和退出按钮
            Row.justifyContent(FlexAlign.SpaceBetween);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户管理');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(139:9)", "entry");
            Text.fontSize(22);
            Text.fontWeight('bold');
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel('退出登录');
            Button.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(143:9)", "entry");
            Button.backgroundColor('#F5222D');
            Button.fontColor('#FFFFFF');
            Button.padding({ left: 15, right: 15 });
            Button.onClick(() => {
                this.logout();
            });
        }, Button);
        Button.pop();
        // 页面标题和退出按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 用户列表
            if (this.isLoading) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 加载中提示
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(158:9)", "entry");
                        // 加载中提示
                        Column.margin({ top: 100 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Progress.create({ value: 50, total: 100, type: ProgressType.Capsule });
                        Progress.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(159:11)", "entry");
                        Progress.width(40);
                        Progress.height(40);
                        Progress.color('#1890FF');
                    }, Progress);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('加载中...');
                        Text.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(164:11)", "entry");
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.margin({ top: 10 });
                    }, Text);
                    Text.pop();
                    // 加载中提示
                    Column.pop();
                });
            }
            else if (this.users.length === 0) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 空列表提示
                        Text.create('暂无用户数据');
                        Text.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(172:9)", "entry");
                        // 空列表提示
                        Text.fontSize(16);
                        // 空列表提示
                        Text.fontColor('#666666');
                        // 空列表提示
                        Text.margin({ top: 100 });
                    }, Text);
                    // 空列表提示
                    Text.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        // 用户列表
                        List.create();
                        List.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(178:9)", "entry");
                        // 用户列表
                        List.width('100%');
                        // 用户列表
                        List.margin({ top: 20 });
                    }, List);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        ForEach.create();
                        const forEachItemGenFunction = _item => {
                            const user = _item;
                            {
                                const itemCreation = (elmtId, isInitialRender) => {
                                    ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                                    itemCreation2(elmtId, isInitialRender);
                                    if (!isInitialRender) {
                                        ListItem.pop();
                                    }
                                    ViewStackProcessor.StopGetAccessRecording();
                                };
                                const itemCreation2 = (elmtId, isInitialRender) => {
                                    ListItem.create(deepRenderFunction, true);
                                    ListItem.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(180:13)", "entry");
                                };
                                const deepRenderFunction = (elmtId, isInitialRender) => {
                                    itemCreation(elmtId, isInitialRender);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Row.create({ space: 10 });
                                        Row.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(181:15)", "entry");
                                        Row.padding(15);
                                        Row.backgroundColor('#FFFFFF');
                                        Row.borderRadius(10);
                                        Row.margin({ left: 15, right: 15, top: 10 });
                                        Row.shadow({ radius: 5, color: '#00000010', offsetX: 0, offsetY: 2 });
                                    }, Row);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 5 });
                                        Column.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(182:17)", "entry");
                                        Column.flexGrow(1);
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`用户名: ${user.username}`);
                                        Text.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(183:19)", "entry");
                                        Text.fontSize(16);
                                        Text.fontWeight('500');
                                    }, Text);
                                    Text.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Text.create(`用户ID: ${user.id}`);
                                        Text.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(187:19)", "entry");
                                        Text.fontSize(12);
                                        Text.fontColor('#666666');
                                    }, Text);
                                    Text.pop();
                                    Column.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Column.create({ space: 10 });
                                        Column.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(193:17)", "entry");
                                    }, Column);
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Button.createWithLabel('修改密码');
                                        Button.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(194:19)", "entry");
                                        Button.backgroundColor('#1890FF');
                                        Button.fontColor('#FFFFFF');
                                        Button.padding({ left: 15, right: 15 });
                                        Button.onClick(() => {
                                            this.openEditDialog(user);
                                        });
                                    }, Button);
                                    Button.pop();
                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                        Button.createWithLabel('删除');
                                        Button.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(202:19)", "entry");
                                        Button.backgroundColor('#F5222D');
                                        Button.fontColor('#FFFFFF');
                                        Button.padding({ left: 15, right: 15 });
                                        Button.onClick(() => {
                                            this.deleteUser(user.id as number);
                                        });
                                    }, Button);
                                    Button.pop();
                                    Column.pop();
                                    Row.pop();
                                    ListItem.pop();
                                };
                                this.observeComponentCreation2(itemCreation2, ListItem);
                                ListItem.pop();
                            }
                        };
                        this.forEachUpdateFunction(elmtId, this.users, forEachItemGenFunction, (user: User) => user.id?.toString() || '', false, false);
                    }, ForEach);
                    ForEach.pop();
                    // 用户列表
                    List.pop();
                });
            }
        }, If);
        If.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 修改密码对话框
            if (this.showEditDialog && this.selectedUser) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(225:9)", "entry");
                        Column.width('80%');
                        Column.padding(20);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(10);
                        Column.shadow({ radius: 10, color: '#00000030', offsetX: 0, offsetY: 5 });
                        Column.position({ x: '10%', y: '30%' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(`修改 ${this.selectedUser.username} 的密码`);
                        Text.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(226:11)", "entry");
                        Text.fontSize(18);
                        Text.fontWeight('bold');
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '请输入新密码', text: this.newPassword });
                        TextInput.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(231:11)", "entry");
                        TextInput.borderRadius(6);
                        TextInput.width('100%');
                        TextInput.height(45);
                        TextInput.type(InputType.Password);
                        TextInput.padding({ left: 20 });
                        TextInput.backgroundColor(this.showPasswordError ? '#FFEBEE' : '');
                        TextInput.onChange((value: string) => {
                            this.newPassword = value;
                            this.showPasswordError = false;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.showPasswordError ? '密码长度需为6-20位字母、数字或特殊字符' : '');
                        Text.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(243:11)", "entry");
                        Text.fontSize(12);
                        Text.fontColor('#F44336');
                        Text.margin({ top: 5 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 15 });
                        Row.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(248:11)", "entry");
                        Row.margin({ top: 20 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(249:13)", "entry");
                        Button.backgroundColor('#FFFFFF');
                        Button.border({ width: 1, color: '#CCCCCC' });
                        Button.fontColor('#333333');
                        Button.width('50%');
                        Button.onClick(() => {
                            this.closeEditDialog();
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确认');
                        Button.debugLine("entry/src/main/ets/pages/zonghezuoye/UserListPage.ets(258:13)", "entry");
                        Button.backgroundColor('#1890FF');
                        Button.fontColor('#FFFFFF');
                        Button.width('50%');
                        Button.onClick(() => {
                            this.updateUserPassword();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "UserListPage";
    }
}
registerNamedRoute(() => new UserListPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/zonghezuoye/UserListPage", pageFullPath: "entry/src/main/ets/pages/zonghezuoye/UserListPage", integratedHsp: "false", moduleType: "followWithHap" });
