if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ForgetPasswordPage_Params {
    username?: string;
    verificationCode?: string;
    newPassword?: string;
    confirmPassword?: string;
    step?: number;
    showUsernameError?: boolean;
    showVerificationError?: boolean;
    showPasswordError?: boolean;
    showConfirmError?: boolean;
    countdown?: number;
    buttonText?: string;
    isButtonDisabled?: boolean;
    countdownTimer?: number | null;
    context?;
    dbHelper?;
    generatedCode?: string;
    usernamePattern?;
    passwordPattern?;
}
import promptAction from "@ohos:promptAction";
import router from "@ohos:router";
import type common from "@ohos:app.ability.common";
import { DatabaseHelper } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/DatabaseHelper";
import { User } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/User";
class ForgetPasswordPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__verificationCode = new ObservedPropertySimplePU('', this, "verificationCode");
        this.__newPassword = new ObservedPropertySimplePU('', this, "newPassword");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__step = new ObservedPropertySimplePU(1, this, "step");
        this.__showUsernameError = new ObservedPropertySimplePU(false, this, "showUsernameError");
        this.__showVerificationError = new ObservedPropertySimplePU(false, this, "showVerificationError");
        this.__showPasswordError = new ObservedPropertySimplePU(false, this, "showPasswordError");
        this.__showConfirmError = new ObservedPropertySimplePU(false, this, "showConfirmError");
        this.__countdown = new ObservedPropertySimplePU(0, this, "countdown");
        this.__buttonText = new ObservedPropertySimplePU('获取验证码', this, "buttonText");
        this.__isButtonDisabled = new ObservedPropertySimplePU(false, this, "isButtonDisabled");
        this.countdownTimer = null;
        this.context = getContext(this) as common.UIAbilityContext;
        this.dbHelper = DatabaseHelper.getInstance();
        this.generatedCode = '';
        this.usernamePattern = /^[a-zA-Z0-9]{4,16}$/;
        this.passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/;
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ForgetPasswordPage_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.verificationCode !== undefined) {
            this.verificationCode = params.verificationCode;
        }
        if (params.newPassword !== undefined) {
            this.newPassword = params.newPassword;
        }
        if (params.confirmPassword !== undefined) {
            this.confirmPassword = params.confirmPassword;
        }
        if (params.step !== undefined) {
            this.step = params.step;
        }
        if (params.showUsernameError !== undefined) {
            this.showUsernameError = params.showUsernameError;
        }
        if (params.showVerificationError !== undefined) {
            this.showVerificationError = params.showVerificationError;
        }
        if (params.showPasswordError !== undefined) {
            this.showPasswordError = params.showPasswordError;
        }
        if (params.showConfirmError !== undefined) {
            this.showConfirmError = params.showConfirmError;
        }
        if (params.countdown !== undefined) {
            this.countdown = params.countdown;
        }
        if (params.buttonText !== undefined) {
            this.buttonText = params.buttonText;
        }
        if (params.isButtonDisabled !== undefined) {
            this.isButtonDisabled = params.isButtonDisabled;
        }
        if (params.countdownTimer !== undefined) {
            this.countdownTimer = params.countdownTimer;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.dbHelper !== undefined) {
            this.dbHelper = params.dbHelper;
        }
        if (params.generatedCode !== undefined) {
            this.generatedCode = params.generatedCode;
        }
        if (params.usernamePattern !== undefined) {
            this.usernamePattern = params.usernamePattern;
        }
        if (params.passwordPattern !== undefined) {
            this.passwordPattern = params.passwordPattern;
        }
    }
    updateStateVars(params: ForgetPasswordPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__verificationCode.purgeDependencyOnElmtId(rmElmtId);
        this.__newPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__step.purgeDependencyOnElmtId(rmElmtId);
        this.__showUsernameError.purgeDependencyOnElmtId(rmElmtId);
        this.__showVerificationError.purgeDependencyOnElmtId(rmElmtId);
        this.__showPasswordError.purgeDependencyOnElmtId(rmElmtId);
        this.__showConfirmError.purgeDependencyOnElmtId(rmElmtId);
        this.__countdown.purgeDependencyOnElmtId(rmElmtId);
        this.__buttonText.purgeDependencyOnElmtId(rmElmtId);
        this.__isButtonDisabled.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__verificationCode.aboutToBeDeleted();
        this.__newPassword.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__step.aboutToBeDeleted();
        this.__showUsernameError.aboutToBeDeleted();
        this.__showVerificationError.aboutToBeDeleted();
        this.__showPasswordError.aboutToBeDeleted();
        this.__showConfirmError.aboutToBeDeleted();
        this.__countdown.aboutToBeDeleted();
        this.__buttonText.aboutToBeDeleted();
        this.__isButtonDisabled.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 页面状态变量
    private __username: ObservedPropertySimplePU<string>;
    get username() {
        return this.__username.get();
    }
    set username(newValue: string) {
        this.__username.set(newValue);
    }
    private __verificationCode: ObservedPropertySimplePU<string>;
    get verificationCode() {
        return this.__verificationCode.get();
    }
    set verificationCode(newValue: string) {
        this.__verificationCode.set(newValue);
    }
    private __newPassword: ObservedPropertySimplePU<string>;
    get newPassword() {
        return this.__newPassword.get();
    }
    set newPassword(newValue: string) {
        this.__newPassword.set(newValue);
    }
    private __confirmPassword: ObservedPropertySimplePU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(newValue: string) {
        this.__confirmPassword.set(newValue);
    }
    private __step: ObservedPropertySimplePU<number>; // 1: 验证身份, 2: 重置密码
    get step() {
        return this.__step.get();
    }
    set step(newValue: number) {
        this.__step.set(newValue);
    }
    private __showUsernameError: ObservedPropertySimplePU<boolean>;
    get showUsernameError() {
        return this.__showUsernameError.get();
    }
    set showUsernameError(newValue: boolean) {
        this.__showUsernameError.set(newValue);
    }
    private __showVerificationError: ObservedPropertySimplePU<boolean>;
    get showVerificationError() {
        return this.__showVerificationError.get();
    }
    set showVerificationError(newValue: boolean) {
        this.__showVerificationError.set(newValue);
    }
    private __showPasswordError: ObservedPropertySimplePU<boolean>;
    get showPasswordError() {
        return this.__showPasswordError.get();
    }
    set showPasswordError(newValue: boolean) {
        this.__showPasswordError.set(newValue);
    }
    private __showConfirmError: ObservedPropertySimplePU<boolean>;
    get showConfirmError() {
        return this.__showConfirmError.get();
    }
    set showConfirmError(newValue: boolean) {
        this.__showConfirmError.set(newValue);
    }
    private __countdown: ObservedPropertySimplePU<number>;
    get countdown() {
        return this.__countdown.get();
    }
    set countdown(newValue: number) {
        this.__countdown.set(newValue);
    }
    private __buttonText: ObservedPropertySimplePU<string>;
    get buttonText() {
        return this.__buttonText.get();
    }
    set buttonText(newValue: string) {
        this.__buttonText.set(newValue);
    }
    private __isButtonDisabled: ObservedPropertySimplePU<boolean>;
    get isButtonDisabled() {
        return this.__isButtonDisabled.get();
    }
    set isButtonDisabled(newValue: boolean) {
        this.__isButtonDisabled.set(newValue);
    }
    // 定时器引用
    private countdownTimer: number | null;
    // 获取应用上下文和偏好设置实例
    private context;
    private dbHelper;
    private generatedCode: string; // 生成的验证码
    // 页面初始化时初始化数据库
    async onPageShow() {
        try {
            await this.dbHelper.initialize(this.context);
        }
        catch (err) {
            console.error('数据库初始化失败:', err);
            promptAction.showToast({ message: '数据库连接失败' });
        }
    }
    // 页面隐藏时关闭数据库连接并清理定时器
    onPageHide(): void {
        this.dbHelper.close();
        if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
        }
    }
    // 表单验证正则表达式
    private readonly usernamePattern;
    private readonly passwordPattern;
    // 生成随机验证码
    private generateVerificationCode(): string {
        const code = Math.floor(100000 + Math.random() * 900000).toString();
        this.generatedCode = code;
        console.log('生成的验证码:', code);
        return code;
    }
    // 开始倒计时
    private startCountdown() {
        this.countdown = 60;
        this.isButtonDisabled = true;
        this.countdownTimer = setInterval(() => {
            this.countdown--;
            this.buttonText = `${this.countdown}秒后重新获取`;
            if (this.countdown <= 0) {
                clearInterval(this.countdownTimer!);
                this.countdownTimer = null;
                this.buttonText = '获取验证码';
                this.isButtonDisabled = false;
            }
        }, 1000);
    }
    // 获取验证码
    private async getVerificationCode() {
        // 验证用户名
        if (!this.usernamePattern.test(this.username)) {
            this.showUsernameError = true;
            promptAction.showToast({
                message: '请输入正确的用户名'
            });
            return;
        }
        // 检查用户是否存在
        const users = await this.dbHelper.queryAllUsers();
        const userExists = users.some(user => user.username === this.username);
        if (!userExists) {
            this.showUsernameError = true;
            promptAction.showToast({
                message: '用户名不存在'
            });
            return;
        }
        // 生成验证码
        this.generateVerificationCode();
        // 模拟发送验证码
        promptAction.showToast({
            message: `验证码已发送，请注意查收: ${this.generatedCode}`
        });
        // 开始倒计时
        this.startCountdown();
    }
    // 验证验证码
    private verifyCode(): boolean {
        if (this.verificationCode !== this.generatedCode) {
            this.showVerificationError = true;
            promptAction.showToast({
                message: '验证码错误'
            });
            return false;
        }
        this.showVerificationError = false;
        return true;
    }
    // 验证密码
    private validatePassword(): boolean {
        let isValid = true;
        // 验证新密码
        if (!this.passwordPattern.test(this.newPassword)) {
            this.showPasswordError = true;
            isValid = false;
        }
        else {
            this.showPasswordError = false;
        }
        // 验证确认密码
        if (this.confirmPassword !== this.newPassword) {
            this.showConfirmError = true;
            isValid = false;
        }
        else {
            this.showConfirmError = false;
        }
        if (!isValid) {
            promptAction.showToast({
                message: '请检查密码输入'
            });
        }
        return isValid;
    }
    // 更新密码
    private async updatePassword() {
        if (!this.validatePassword()) {
            return;
        }
        try {
            // 查询用户
            const users = await this.dbHelper.queryAllUsers();
            const user = users.find(user => user.username === this.username);
            if (user) {
                // 创建新的 User 实例而不是直接修改原对象
                const updatedUser = new User(this.username, this.newPassword);
                updatedUser.id = user.id;
                // 更新密码
                const rowsUpdated = await this.dbHelper.updateUser(updatedUser, user.id as number);
                if (rowsUpdated > 0) {
                    promptAction.showToast({
                        message: '密码重置成功',
                        duration: 2000
                    });
                    // 返回登录页面
                    setTimeout(() => {
                        router.back();
                    }, 2000);
                }
                else {
                    promptAction.showToast({
                        message: '密码重置失败，请重试'
                    });
                }
            }
            else {
                promptAction.showToast({
                    message: '用户不存在'
                });
            }
        }
        catch (err) {
            console.error('更新密码失败:', err);
            promptAction.showToast({
                message: '密码重置失败，请重试'
            });
        }
    }
    // 第一步：验证身份
    private buildStep1(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('验证身份');
            Text.fontSize(22);
            Text.fontWeight(500);
            Text.margin({ top: 30, bottom: 40 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: "请输入用户名", text: this.username });
            TextInput.borderRadius(6);
            TextInput.width('88%');
            TextInput.height(45);
            TextInput.padding({ left: 20 });
            TextInput.onChange((value: string) => {
                this.username = value;
                this.showUsernameError = this.username.length > 0 && !this.usernamePattern.test(this.username);
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名错误提示
            Text.create(this.showUsernameError ? '用户名格式错误' : '');
            // 用户名错误提示
            Text.fontSize(12);
            // 用户名错误提示
            Text.fontColor('#F44336');
            // 用户名错误提示
            Text.margin({ top: 5 });
        }, Text);
        // 用户名错误提示
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 验证码输入框和获取按钮
            Row.create({ space: 10 });
            // 验证码输入框和获取按钮
            Row.width('88%');
            // 验证码输入框和获取按钮
            Row.margin({ top: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            TextInput.create({ placeholder: "请输入验证码", text: this.verificationCode });
            TextInput.borderRadius(6);
            TextInput.width('60%');
            TextInput.height(45);
            TextInput.padding({ left: 20 });
            TextInput.onChange((value: string) => {
                this.verificationCode = value;
                this.showVerificationError = false;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.buttonText);
            Button.backgroundColor(this.isButtonDisabled ? '#CCCCCC' : '#409EFF');
            Button.width('40%');
            Button.height(45);
            Button.fontSize(14);
            Button.enabled(!this.isButtonDisabled && this.username !== '');
            Button.onClick(() => {
                this.getVerificationCode();
            });
        }, Button);
        Button.pop();
        // 验证码输入框和获取按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 验证码错误提示
            Text.create(this.showVerificationError ? '验证码错误' : '');
            // 验证码错误提示
            Text.fontSize(12);
            // 验证码错误提示
            Text.fontColor('#F44336');
            // 验证码错误提示
            Text.margin({ top: 5 });
        }, Text);
        // 验证码错误提示
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 下一步按钮
            Button.createWithLabel('下一步');
            // 下一步按钮
            Button.backgroundColor('#409EFF');
            // 下一步按钮
            Button.width('90%');
            // 下一步按钮
            Button.margin({ top: 40 });
            // 下一步按钮
            Button.padding(15);
            // 下一步按钮
            Button.fontSize(20);
            // 下一步按钮
            Button.onClick(() => {
                if (this.verifyCode()) {
                    this.step = 2; // 进入第二步：重置密码
                }
            });
        }, Button);
        // 下一步按钮
        Button.pop();
        Column.pop();
    }
    // 第二步：重置密码
    private buildStep2(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('重置密码');
            Text.fontSize(22);
            Text.fontWeight(500);
            Text.margin({ top: 30, bottom: 40 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 新密码输入框
            TextInput.create({ placeholder: "请输入新密码", text: this.newPassword });
            // 新密码输入框
            TextInput.borderRadius(6);
            // 新密码输入框
            TextInput.width('88%');
            // 新密码输入框
            TextInput.height(45);
            // 新密码输入框
            TextInput.padding({ left: 20 });
            // 新密码输入框
            TextInput.type(InputType.Password);
            // 新密码输入框
            TextInput.onChange((value: string) => {
                this.newPassword = value;
                this.showPasswordError = this.newPassword.length > 0 && !this.passwordPattern.test(this.newPassword);
                this.showConfirmError = this.confirmPassword !== '' && this.confirmPassword !== this.newPassword;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 新密码错误提示
            Text.create(this.showPasswordError ? '密码长度需为6-20字符' : '');
            // 新密码错误提示
            Text.fontSize(12);
            // 新密码错误提示
            Text.fontColor('#F44336');
            // 新密码错误提示
            Text.margin({ top: 5 });
        }, Text);
        // 新密码错误提示
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 确认密码输入框
            TextInput.create({ placeholder: "请再次输入新密码", text: this.confirmPassword });
            // 确认密码输入框
            TextInput.borderRadius(6);
            // 确认密码输入框
            TextInput.width('88%');
            // 确认密码输入框
            TextInput.height(45);
            // 确认密码输入框
            TextInput.padding({ left: 20 });
            // 确认密码输入框
            TextInput.type(InputType.Password);
            // 确认密码输入框
            TextInput.margin({ top: 20 });
            // 确认密码输入框
            TextInput.onChange((value: string) => {
                this.confirmPassword = value;
                this.showConfirmError = this.confirmPassword !== this.newPassword;
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 确认密码错误提示
            Text.create(this.showConfirmError ? '两次输入的密码不一致' : '');
            // 确认密码错误提示
            Text.fontSize(12);
            // 确认密码错误提示
            Text.fontColor('#F44336');
            // 确认密码错误提示
            Text.margin({ top: 5 });
        }, Text);
        // 确认密码错误提示
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 重置密码按钮
            Button.createWithLabel('重置密码');
            // 重置密码按钮
            Button.backgroundColor('#409EFF');
            // 重置密码按钮
            Button.width('90%');
            // 重置密码按钮
            Button.margin({ top: 40 });
            // 重置密码按钮
            Button.padding(15);
            // 重置密码按钮
            Button.fontSize(20);
            // 重置密码按钮
            Button.onClick(() => {
                this.updatePassword();
            });
        }, Button);
        // 重置密码按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮
            Button.createWithLabel('返回');
            // 返回按钮
            Button.backgroundColor('#FFFFFF');
            // 返回按钮
            Button.border({ width: 1, color: '#409EFF' });
            // 返回按钮
            Button.fontColor('#409EFF');
            // 返回按钮
            Button.width('90%');
            // 返回按钮
            Button.margin({ top: 20 });
            // 返回按钮
            Button.padding(15);
            // 返回按钮
            Button.fontSize(20);
            // 返回按钮
            Button.onClick(() => {
                this.step = 1; // 返回第一步
            });
        }, Button);
        // 返回按钮
        Button.pop();
        Column.pop();
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor(Color.White);
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777288, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.width(24);
            Image.height(24);
            Image.margin({ top: 10, left: 20 });
            Image.onClick(() => {
                router.back(); // 返回到上一页
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 根据当前步骤显示不同内容
            if (this.step === 1) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.buildStep1.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.buildStep2.bind(this)();
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
        return "ForgetPasswordPage";
    }
}
registerNamedRoute(() => new ForgetPasswordPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/zonghezuoye/ForgetPage", pageFullPath: "entry/src/main/ets/pages/zonghezuoye/ForgetPage", integratedHsp: "false", moduleType: "followWithHap" });
