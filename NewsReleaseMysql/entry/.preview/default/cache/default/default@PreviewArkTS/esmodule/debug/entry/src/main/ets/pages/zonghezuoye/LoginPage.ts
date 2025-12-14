if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface LoginPage_Params {
    username?: string;
    password?: string;
    rememberMe?: boolean;
    showPasswordError?: boolean;
    showAccountList?: boolean;
    users?: User[];
    showUsernameError?: boolean;
    context?;
    preferences?;
    dbHelper?;
    usernamePattern?;
    passwordPattern?;
}
import promptAction from "@ohos:promptAction";
import router from "@ohos:router";
import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
import { DatabaseHelper } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/DatabaseHelper";
import type { User } from './User';
class LoginPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__rememberMe = new ObservedPropertySimplePU(false, this, "rememberMe");
        this.__showPasswordError = new ObservedPropertySimplePU(false, this, "showPasswordError");
        this.__showAccountList = new ObservedPropertySimplePU(false, this, "showAccountList");
        this.__users = new SynchedPropertyObjectOneWayPU(params.users, this, "users");
        this.__showUsernameError = new ObservedPropertySimplePU(false, this, "showUsernameError");
        this.context = this.getUIContext()
            .getHostContext() as common.UIAbilityContext;
        this.preferences = preferences
            .getPreferencesSync(this.context, { name: 'Setting' });
        this.dbHelper = DatabaseHelper.getInstance();
        this.usernamePattern = /^[a-zA-Z0-9]{4,16}$/;
        this.passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: LoginPage_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.rememberMe !== undefined) {
            this.rememberMe = params.rememberMe;
        }
        if (params.showPasswordError !== undefined) {
            this.showPasswordError = params.showPasswordError;
        }
        if (params.showAccountList !== undefined) {
            this.showAccountList = params.showAccountList;
        }
        if (params.users === undefined) {
            this.__users.set([]);
        }
        if (params.showUsernameError !== undefined) {
            this.showUsernameError = params.showUsernameError;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.preferences !== undefined) {
            this.preferences = params.preferences;
        }
        if (params.dbHelper !== undefined) {
            this.dbHelper = params.dbHelper;
        }
        if (params.usernamePattern !== undefined) {
            this.usernamePattern = params.usernamePattern;
        }
        if (params.passwordPattern !== undefined) {
            this.passwordPattern = params.passwordPattern;
        }
    }
    updateStateVars(params: LoginPage_Params) {
        this.__users.reset(params.users);
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__rememberMe.purgeDependencyOnElmtId(rmElmtId);
        this.__showPasswordError.purgeDependencyOnElmtId(rmElmtId);
        this.__showAccountList.purgeDependencyOnElmtId(rmElmtId);
        this.__users.purgeDependencyOnElmtId(rmElmtId);
        this.__showUsernameError.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__rememberMe.aboutToBeDeleted();
        this.__showPasswordError.aboutToBeDeleted();
        this.__showAccountList.aboutToBeDeleted();
        this.__users.aboutToBeDeleted();
        this.__showUsernameError.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 登录表单状态变量
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __password: ObservedPropertySimplePU<string>;
    get password() {
        return this.__password.get();
    }
    set password(newValue: string) {
        this.__password.set(newValue);
    }
    private __rememberMe: ObservedPropertySimplePU<boolean>;
    get rememberMe() {
        return this.__rememberMe.get();
    }
    set rememberMe(newValue: boolean) {
        this.__rememberMe.set(newValue);
    }
    private __showPasswordError: ObservedPropertySimplePU<boolean>;
    get showPasswordError() {
        return this.__showPasswordError.get();
    }
    set showPasswordError(newValue: boolean) {
        this.__showPasswordError.set(newValue);
    }
    private __showAccountList: ObservedPropertySimplePU<boolean>;
    get showAccountList() {
        return this.__showAccountList.get();
    }
    set showAccountList(newValue: boolean) {
        this.__showAccountList.set(newValue);
    }
    private __users: SynchedPropertySimpleOneWayPU<User[]>;
    get users() {
        return this.__users.get();
    }
    set users(newValue: User[]) {
        this.__users.set(newValue);
    }
    private __showUsernameError: ObservedPropertySimplePU<boolean>;
    get showUsernameError() {
        return this.__showUsernameError.get();
    }
    set showUsernameError(newValue: boolean) {
        this.__showUsernameError.set(newValue);
    }
    // 获取应用上下文和偏好设置实例
    private context;
    private preferences;
    private dbHelper;
    async deleteUser(userId: number) {
        const rowsDeleted = await this.dbHelper.deleteUser(userId);
        if (rowsDeleted > 0) {
            this.users = await this.dbHelper.queryAllUsers();
        }
    }
    onPageHide(): void {
        this.dbHelper.close();
    }
    async updateUser(user: User, userId: number) {
        const rowsUpdated = await this.dbHelper.updateUser(user, userId);
        if (rowsUpdated > 0) {
            this.users = await this.dbHelper.queryAllUsers();
        }
    }
    // 页面初始化时从偏好设置加载保存的账号信息
    aboutToAppear(): void {
        //从首选项读取保存的用户名和密码信息
        let savepassword = this.preferences.getSync('password', '');
        let saveusername = this.preferences.getSync('account', '');
        // 将所获取到的用户名和密码信息信息保存到组件状态变量 username和 password 中
        this.password = savepassword.toString(); //状态变量
        this.username = saveusername.toString(); //状态变量
    }
    // 页面显示时处理路由传参
    async onPageShow() {
        try {
            const context = getContext(this) as common.UIAbilityContext;
            await this.dbHelper.initialize(context);
            this.users = await this.dbHelper.queryAllUsers();
            const params = this.getUIContext().getRouter()
                .getParams() as Record<string, string | undefined>;
            if (params) {
                this.username = params['username'] || '';
                this.password = params['password'] ?? '';
            }
        }
        catch (err) {
            console.error('数据库初始化失败:', err);
        }
    }
    // 表单验证正则表达式
    // 用户名验证规则：4-16位字母或数字
    private readonly usernamePattern;
    private readonly passwordPattern;
    // 密码验证规则：6-20位字母、数字或特殊字符
    // 验证表单输入合法性
    private validateForm(): boolean {
        this.showPasswordError = this.password.length > 0 && !this.passwordPattern.test(this.password);
        return this.username.length > 0 && this.password.length > 0 && !this.showPasswordError;
    }
    /**
     * 登录处理函数
     */
    private async login(): Promise<void> {
        // 验证表单
        if (!this.validateForm()) {
            promptAction.showToast({
                message: '用户名或密码不能为空'
            });
            return;
        }
        // 查询数据库验证用户信息
        const users2 = await this.dbHelper.queryAllUsers();
        console.log('数据库中的所有用户:', JSON.stringify(users2, null, 2));
        console.log('尝试登录的用户:', JSON.stringify({
            username: this.username,
            password: this.password
        }, null, 2));
        const matchedUser = users2.find(user => user.username === this.username && user.password === this.password);
        if (matchedUser) {
            // 登录成功
            promptAction.showToast({
                message: '登录成功',
                duration: 2000
            });
            // 跳转到列表页面
            this.getUIContext().getRouter().pushUrl({ url: 'pages/zonghezuoye/ListPage' });
            // 根据"记住我"选项处理用户信息存储
            if (this.rememberMe) {
                this.preferences.putSync('account', this.username);
                this.preferences.putSync('password', this.password);
                this.preferences.flush();
            }
            else {
                this.preferences.deleteSync('account');
                this.preferences.deleteSync('password');
                this.preferences.flush();
            }
        }
        else {
            // 登录失败
            promptAction.showToast({
                message: '用户名或密码错误',
                duration: 2000
            });
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主页面列布局
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(141:5)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(142:7)", "entry");
            Row.width('100%');
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777299, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(143:9)", "entry");
            Image.width(24);
            Image.height(24);
            Image.margin({ top: 10, left: 20 });
            Image.onClick(() => {
                router.back(); // 返回到上一页
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录标题
            Text.create('用户登录');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(155:7)", "entry");
            // 登录标题
            Text.fontSize(22);
            // 登录标题
            Text.fontWeight(500);
            // 登录标题
            Text.margin({ top: 30, bottom: 40 });
        }, Text);
        // 登录标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名输入框
            TextInput.create({ placeholder: "用户名/邮箱", text: this.username });
            TextInput.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(161:7)", "entry");
            // 用户名输入框
            TextInput.borderRadius(6);
            // 用户名输入框
            TextInput.width('88%');
            // 用户名输入框
            TextInput.height(45);
            // 用户名输入框
            TextInput.onChange((value: string) => {
                this.username = value;
                this.showUsernameError = this.username.length > 0 &&
                    !this.users.some(user => user.username === this.username);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码输入框
            TextInput.create({ placeholder: "请输入密码", text: this.password });
            TextInput.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(174:9)", "entry");
            // 密码输入框
            TextInput.width('88%');
            // 密码输入框
            TextInput.height('45');
            // 密码输入框
            TextInput.borderRadius(6);
            // 密码输入框
            TextInput.type(InputType.Password);
            // 密码输入框
            TextInput.margin({ top: 20 });
            // 密码输入框
            TextInput.padding({ left: 20 });
            // 密码输入框
            TextInput.onChange((value: string) => {
                this.password = value;
                this.validateForm();
            });
            // 密码输入框
            TextInput.onChange(value => this.password = value);
            // 密码输入框
            TextInput.backgroundColor(this.showPasswordError ? '#FFEBEE' : '');
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码错误提示信息
            Text.create(this.showPasswordError ? '密码长度需为6-20字符' : '');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(190:9)", "entry");
            // 密码错误提示信息
            Text.fontSize(12);
            // 密码错误提示信息
            Text.fontColor('#F44336');
            // 密码错误提示信息
            Text.margin({ top: 5 });
        }, Text);
        // 密码错误提示信息
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 记住我选项
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(196:9)", "entry");
            // 记住我选项
            Row.width('100%');
            // 记住我选项
            Row.justifyContent(FlexAlign.Start);
            // 记住我选项
            Row.margin({ left: '15%', top: 15, bottom: 0 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Toggle.create({ type: ToggleType.Checkbox, isOn: this.rememberMe });
            Toggle.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(197:11)", "entry");
            Toggle.onChange(val => this.rememberMe = val);
        }, Toggle);
        Toggle.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('记住我');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(199:11)", "entry");
            Text.fontSize(14);
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        // 记住我选项
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录按钮
            Button.createWithLabel('立即登录');
            Button.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(208:9)", "entry");
            // 登录按钮
            Button.backgroundColor('#409EFF');
            // 登录按钮
            Button.width('90%');
            // 登录按钮
            Button.margin({ top: 20 });
            // 登录按钮
            Button.padding(15);
            // 登录按钮
            Button.fontSize(20);
            // 登录按钮
            Button.onClick(() => {
                this.login();
            });
        }, Button);
        // 登录按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 忘记密码和新用户注册链接
            Flex.create({ justifyContent: FlexAlign.SpaceBetween });
            Flex.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(220:9)", "entry");
            // 忘记密码和新用户注册链接
            Flex.height('100%');
            // 忘记密码和新用户注册链接
            Flex.width('100%');
            // 忘记密码和新用户注册链接
            Flex.padding(20);
            // 忘记密码和新用户注册链接
            Flex.backgroundColor(Color.White);
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('忘记密码');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(221:11)", "entry");
            Text.fontColor('#409EFF');
            Text.onClick(() => {
                router.pushUrl({ url: 'pages/zonghezuoye/ForgetPage' });
            });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('新用户注册');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/LoginPage.ets(226:11)", "entry");
            Text.fontColor('#409EFF');
            Text.onClick(() => {
                router.pushUrl({ url: 'pages/zonghezuoye/RegisterPage' });
            });
        }, Text);
        Text.pop();
        // 忘记密码和新用户注册链接
        Flex.pop();
        // 主页面列布局
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "LoginPage";
    }
}
registerNamedRoute(() => new LoginPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/zonghezuoye/LoginPage", pageFullPath: "entry/src/main/ets/pages/zonghezuoye/LoginPage", integratedHsp: "false", moduleType: "followWithHap" });
