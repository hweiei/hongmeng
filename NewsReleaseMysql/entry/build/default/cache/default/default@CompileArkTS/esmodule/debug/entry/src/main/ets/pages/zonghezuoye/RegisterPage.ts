if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface RegisterPage_Params {
    username?: string;
    password?: string;
    confirmPassword?: string;
    email?: string;
    phone?: string;
    gender?: string;
    hobbies?: Array<string>;
    isAgreed?: boolean;
    showPasswordError?: boolean;
    showPasswordError_confirm?: boolean;
    showEmailError?: boolean;
    showPhoneError?: boolean;
    showUsernameError?: boolean;
    showError?: string;
    usernamePattern?;
    passwordPattern?;
    emailPattern?;
    phonePattern?;
    dbHelper?;
    users?: User[];
    selectedUserId?: number;
}
import promptAction from "@ohos:promptAction";
import router from "@ohos:router";
import { DatabaseHelper } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/DatabaseHelper";
import type { User } from './User';
import type common from "@ohos:app.ability.common";
import { UserService } from "@bundle:com.example.newsrelease/entry/ets/common/utils/UserService";
class RegisterPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__username = new ObservedPropertySimplePU('', this, "username");
        this.__password = new ObservedPropertySimplePU('', this, "password");
        this.__confirmPassword = new ObservedPropertySimplePU('', this, "confirmPassword");
        this.__email = new ObservedPropertySimplePU('', this, "email");
        this.__phone = new ObservedPropertySimplePU('', this, "phone");
        this.__gender = new ObservedPropertySimplePU('male', this, "gender");
        this.__hobbies = new ObservedPropertyObjectPU([], this, "hobbies");
        this.__isAgreed = new ObservedPropertySimplePU(false, this, "isAgreed");
        this.__showPasswordError = new ObservedPropertySimplePU(false, this, "showPasswordError");
        this.__showPasswordError_confirm = new ObservedPropertySimplePU(false, this, "showPasswordError_confirm");
        this.__showEmailError = new ObservedPropertySimplePU(false, this, "showEmailError");
        this.__showPhoneError = new ObservedPropertySimplePU(false, this, "showPhoneError");
        this.__showUsernameError = new ObservedPropertySimplePU(false, this, "showUsernameError");
        this.__showError = new ObservedPropertySimplePU('请检查是否有未填写的信息！', this, "showError");
        this.usernamePattern = /^[a-zA-Z0-9]{4,16}$/;
        this.passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/;
        this.emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        this.phonePattern = /^1[3-9]\d{9}$/;
        this.dbHelper = DatabaseHelper.getInstance();
        this.__users = new ObservedPropertyObjectPU([], this, "users");
        this.__selectedUserId = new ObservedPropertySimplePU(0, this, "selectedUserId");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: RegisterPage_Params) {
        if (params.username !== undefined) {
            this.username = params.username;
        }
        if (params.password !== undefined) {
            this.password = params.password;
        }
        if (params.confirmPassword !== undefined) {
            this.confirmPassword = params.confirmPassword;
        }
        if (params.email !== undefined) {
            this.email = params.email;
        }
        if (params.phone !== undefined) {
            this.phone = params.phone;
        }
        if (params.gender !== undefined) {
            this.gender = params.gender;
        }
        if (params.hobbies !== undefined) {
            this.hobbies = params.hobbies;
        }
        if (params.isAgreed !== undefined) {
            this.isAgreed = params.isAgreed;
        }
        if (params.showPasswordError !== undefined) {
            this.showPasswordError = params.showPasswordError;
        }
        if (params.showPasswordError_confirm !== undefined) {
            this.showPasswordError_confirm = params.showPasswordError_confirm;
        }
        if (params.showEmailError !== undefined) {
            this.showEmailError = params.showEmailError;
        }
        if (params.showPhoneError !== undefined) {
            this.showPhoneError = params.showPhoneError;
        }
        if (params.showUsernameError !== undefined) {
            this.showUsernameError = params.showUsernameError;
        }
        if (params.showError !== undefined) {
            this.showError = params.showError;
        }
        if (params.usernamePattern !== undefined) {
            this.usernamePattern = params.usernamePattern;
        }
        if (params.passwordPattern !== undefined) {
            this.passwordPattern = params.passwordPattern;
        }
        if (params.emailPattern !== undefined) {
            this.emailPattern = params.emailPattern;
        }
        if (params.phonePattern !== undefined) {
            this.phonePattern = params.phonePattern;
        }
        if (params.dbHelper !== undefined) {
            this.dbHelper = params.dbHelper;
        }
        if (params.users !== undefined) {
            this.users = params.users;
        }
        if (params.selectedUserId !== undefined) {
            this.selectedUserId = params.selectedUserId;
        }
    }
    updateStateVars(params: RegisterPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__username.purgeDependencyOnElmtId(rmElmtId);
        this.__password.purgeDependencyOnElmtId(rmElmtId);
        this.__confirmPassword.purgeDependencyOnElmtId(rmElmtId);
        this.__email.purgeDependencyOnElmtId(rmElmtId);
        this.__phone.purgeDependencyOnElmtId(rmElmtId);
        this.__gender.purgeDependencyOnElmtId(rmElmtId);
        this.__hobbies.purgeDependencyOnElmtId(rmElmtId);
        this.__isAgreed.purgeDependencyOnElmtId(rmElmtId);
        this.__showPasswordError.purgeDependencyOnElmtId(rmElmtId);
        this.__showPasswordError_confirm.purgeDependencyOnElmtId(rmElmtId);
        this.__showEmailError.purgeDependencyOnElmtId(rmElmtId);
        this.__showPhoneError.purgeDependencyOnElmtId(rmElmtId);
        this.__showUsernameError.purgeDependencyOnElmtId(rmElmtId);
        this.__showError.purgeDependencyOnElmtId(rmElmtId);
        this.__users.purgeDependencyOnElmtId(rmElmtId);
        this.__selectedUserId.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__username.aboutToBeDeleted();
        this.__password.aboutToBeDeleted();
        this.__confirmPassword.aboutToBeDeleted();
        this.__email.aboutToBeDeleted();
        this.__phone.aboutToBeDeleted();
        this.__gender.aboutToBeDeleted();
        this.__hobbies.aboutToBeDeleted();
        this.__isAgreed.aboutToBeDeleted();
        this.__showPasswordError.aboutToBeDeleted();
        this.__showPasswordError_confirm.aboutToBeDeleted();
        this.__showEmailError.aboutToBeDeleted();
        this.__showPhoneError.aboutToBeDeleted();
        this.__showUsernameError.aboutToBeDeleted();
        this.__showError.aboutToBeDeleted();
        this.__users.aboutToBeDeleted();
        this.__selectedUserId.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 用户输入状态变量
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
    private __confirmPassword: ObservedPropertySimplePU<string>;
    get confirmPassword() {
        return this.__confirmPassword.get();
    }
    set confirmPassword(newValue: string) {
        this.__confirmPassword.set(newValue);
    }
    private __email: ObservedPropertySimplePU<string>;
    get email() {
        return this.__email.get();
    }
    set email(newValue: string) {
        this.__email.set(newValue);
    }
    private __phone: ObservedPropertySimplePU<string>;
    get phone() {
        return this.__phone.get();
    }
    set phone(newValue: string) {
        this.__phone.set(newValue);
    }
    private __gender: ObservedPropertySimplePU<string>; // 性别选择
    get gender() {
        return this.__gender.get();
    }
    set gender(newValue: string) {
        this.__gender.set(newValue);
    }
    private __hobbies: ObservedPropertyObjectPU<Array<string>>;
    get hobbies() {
        return this.__hobbies.get();
    }
    set hobbies(newValue: Array<string>) {
        this.__hobbies.set(newValue);
    }
    // 表单验证错误状态
    private __isAgreed: ObservedPropertySimplePU<boolean>;
    get isAgreed() {
        return this.__isAgreed.get();
    }
    set isAgreed(newValue: boolean) {
        this.__isAgreed.set(newValue);
    }
    private __showPasswordError: ObservedPropertySimplePU<boolean>; // 密码错误
    get showPasswordError() {
        return this.__showPasswordError.get();
    }
    set showPasswordError(newValue: boolean) {
        this.__showPasswordError.set(newValue);
    }
    private __showPasswordError_confirm: ObservedPropertySimplePU<boolean>; // 密码错误
    get showPasswordError_confirm() {
        return this.__showPasswordError_confirm.get();
    }
    set showPasswordError_confirm(newValue: boolean) {
        this.__showPasswordError_confirm.set(newValue);
    }
    private __showEmailError: ObservedPropertySimplePU<boolean>; // 邮箱错误
    get showEmailError() {
        return this.__showEmailError.get();
    }
    set showEmailError(newValue: boolean) {
        this.__showEmailError.set(newValue);
    }
    private __showPhoneError: ObservedPropertySimplePU<boolean>; // 手机号错误
    get showPhoneError() {
        return this.__showPhoneError.get();
    }
    set showPhoneError(newValue: boolean) {
        this.__showPhoneError.set(newValue);
    }
    private __showUsernameError: ObservedPropertySimplePU<boolean>; // 用户名错误
    get showUsernameError() {
        return this.__showUsernameError.get();
    }
    set showUsernameError(newValue: boolean) {
        this.__showUsernameError.set(newValue);
    }
    private __showError: ObservedPropertySimplePU<string>;
    get showError() {
        return this.__showError.get();
    }
    set showError(newValue: string) {
        this.__showError.set(newValue);
    }
    // 表单验证正则表达式
    private readonly usernamePattern;
    private readonly passwordPattern;
    // 长度在6-20个字符之间
    // 只能包含字母、数字和特殊符号（!@#$%^&*）
    private readonly emailPattern;
    private readonly phonePattern;
    // 使用单例模式获取数据库实例
    private dbHelper;
    private __users: ObservedPropertyObjectPU<User[]>;
    get users() {
        return this.__users.get();
    }
    set users(newValue: User[]) {
        this.__users.set(newValue);
    }
    private __selectedUserId: ObservedPropertySimplePU<number>;
    get selectedUserId() {
        return this.__selectedUserId.get();
    }
    set selectedUserId(newValue: number) {
        this.__selectedUserId.set(newValue);
    }
    async onPageShow() {
        try {
            const context = getContext(this) as common.UIAbilityContext;
            await this.dbHelper.initialize(context); // 传入页面上下文
            this.users = await this.dbHelper.queryAllUsers();
            console.log('数据库初始化成功，当前用户数：', this.users.length);
        }
        catch (err) {
            console.error('页面初始化数据库失败：', err);
            promptAction.showToast({ message: '数据库连接失败' });
        }
    }
    onPageHide(): void {
        this.dbHelper.close();
    }
    // async updateUser(user:User,userId:number)
    // {
    //   const rowsUpdated=await this.dbHelper.updateUser(user,userId);
    //   if (rowsUpdated > 0) {
    //     this.users = await this.dbHelper.queryAllUsers();
    //   }
    // }
    // async addUser(username: string, password: string): Promise<boolean> {
    //   try {
    //     const user = new User(username, password);
    //     const result = await this.dbHelper.insertUser(user);
    //     return result !== -1; // 根据实际返回值调整判断逻辑
    //   } catch (error) {
    //     console.error('添加用户失败:', error);
    //     return false;
    //   }
    // }
    private async register() {
        if (!this.validateForm()) {
            promptAction.showToast({ message: this.showError });
            return;
        }
        // 显示注册中提示
        promptAction.showToast({
            message: '注册中...',
            duration: 1000
        });
        // 使用 UserService 进行混合注册
        const userService = new UserService();
        const success = await userService.register(this.username, this.password);
        if (success) {
            promptAction.showToast({ message: '注册成功！', duration: 1500 });
            // 跳回登录页，并传递用户名密码
            router.pushUrl({
                url: 'pages/zonghezuoye/LoginPage',
                params: { username: this.username, password: this.password }
            });
        }
        else {
            promptAction.showToast({ message: '注册失败，请重试' });
            console.error('用户注册失败');
        }
    }
    // 验证用户名
    private validateUsername(): void {
        this.showUsernameError = !this.username ||
            this.username.length < 4 ||
            this.username.length > 16 ||
            !this.usernamePattern.test(this.username);
        // .test是匹配，不匹配返回false
    }
    // 验证密码
    private validatePassword(): void {
        this.showPasswordError = this.password.length > 0 && !this.passwordPattern.test(this.password);
    }
    // 当密码符合规则时：
    // this.passwordPattern.test(this.password) // 返回 true
    // !this.passwordPattern.test(this.password) // 返回 false 取反
    // 此时 showPasswordError 被设置为 false（无错误）
    // 当密码不符合规则时：
    // this.passwordPattern.test(this.password) // 返回 false
    // !this.passwordPattern.test(this.password) // 返回 true
    // 此时 showPasswordError 被设置为 true（有错误）
    // 验证确认密码
    private validateConfirmPassword(): void {
        this.showPasswordError_confirm = this.confirmPassword.length > 0 &&
            (this.password !== this.confirmPassword || !this.passwordPattern.test(this.password));
    }
    // 验证邮箱
    private validateEmail(): void {
        this.showEmailError = !this.email || !this.emailPattern.test(this.email);
    }
    // 验证手机号
    private validatePhone(): void {
        this.showPhoneError = this.phone.length > 0 && !this.phonePattern.test(this.phone);
    }
    // 验证整个表单
    private validateForm(): boolean {
        this.validateUsername();
        this.validatePassword();
        this.validateConfirmPassword();
        this.validateEmail();
        this.validatePhone();
        return !this.showUsernameError &&
            !this.showPasswordError &&
            !this.showPasswordError_confirm &&
            !this.showEmailError;
    }
    // 表单验证返回值，表单验证成功返回true
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 主容器列布局
            Column.create({});
            // 主容器列布局
            Column.width('100%');
            // 主容器列布局
            Column.height('100%');
            // 主容器列布局
            Column.backgroundColor('#F8F9FA');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 行布局
            Row.create();
            // 行布局
            Row.width('100%');
            // 行布局
            Row.justifyContent(FlexAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 返回按钮区域
            Image.create({ "id": 16777288, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
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
        // 行布局
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 页面标题
            Text.create('用户注册');
            // 页面标题
            Text.fontSize(22);
            // 页面标题
            Text.fontWeight(500);
            // 页面标题
            Text.margin({ top: 30, bottom: 40 });
        }, Text);
        // 页面标题
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 表单输入区域
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名输入框
            TextInput.create({ placeholder: '用户名', text: this.username });
            // 用户名输入框
            TextInput.width('88%');
            // 用户名输入框
            TextInput.height(45);
            // 用户名输入框
            TextInput.borderRadius(6);
            // 用户名输入框
            TextInput.padding({ left: 20 });
            // 用户名输入框
            TextInput.onChange((value: string) => {
                this.username = value;
                this.validateUsername(); // 确保格式正确
            });
            // 用户名输入框
            TextInput.backgroundColor(this.showUsernameError ? '#FFEBEE' : '');
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名错误提示
            Text.create(this.showUsernameError ? '用户名长度需为4-16字符' : '');
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
            // 密码输入框
            TextInput.create({ placeholder: '设置密码', text: this.password });
            // 密码输入框
            TextInput.width('88%');
            // 密码输入框
            TextInput.height(45);
            // 密码输入框
            TextInput.borderRadius(6);
            // 密码输入框
            TextInput.onChange((value: string) => {
                this.password = value;
                this.validatePassword();
            });
            // 密码输入框
            TextInput.type(InputType.Password);
            // 密码输入框
            TextInput.margin({ top: 5 });
            // 密码输入框
            TextInput.padding({ left: 20 });
            // 密码输入框
            TextInput.backgroundColor(this.showPasswordError ? '#FFEBEE' : '');
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 密码错误提示
            Text.create(this.showPasswordError ? '密码长度需为6-20字符' : '');
            // 密码错误提示
            Text.fontSize(12);
            // 密码错误提示
            Text.fontColor('#F44336');
            // 密码错误提示
            Text.margin({ top: 5 });
        }, Text);
        // 密码错误提示
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 确认密码输入框
            TextInput.create({ placeholder: '确认密码', text: this.confirmPassword });
            // 确认密码输入框
            TextInput.width('88%');
            // 确认密码输入框
            TextInput.height(45);
            // 确认密码输入框
            TextInput.borderRadius(6);
            // 确认密码输入框
            TextInput.type(InputType.Password);
            // 确认密码输入框
            TextInput.margin({ top: 5 });
            // 确认密码输入框
            TextInput.padding({ left: 20 });
            // 确认密码输入框
            TextInput.onChange((value: string) => {
                this.confirmPassword = value;
                this.validateConfirmPassword();
            });
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 确认密码错误提示
            Text.create(this.showPasswordError_confirm ? '两次密码不一致' : '');
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
            // 邮箱输入框
            TextInput.create({ placeholder: '电子邮箱', text: this.email });
            // 邮箱输入框
            TextInput.width('88%');
            // 邮箱输入框
            TextInput.height(45);
            // 邮箱输入框
            TextInput.margin({ top: 5 });
            // 邮箱输入框
            TextInput.borderRadius(6);
            // 邮箱输入框
            TextInput.padding({ left: 20 });
            // 邮箱输入框
            TextInput.onChange((value: string) => {
                this.email = value;
                this.validateEmail(); // 确保格式正确
            });
            // 邮箱输入框
            TextInput.backgroundColor(this.showEmailError ? '#FFEBEE' : '');
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 邮箱错误提示
            Text.create(this.showEmailError ? '请输入正确的邮箱格式' : '');
            // 邮箱错误提示
            Text.fontSize(12);
            // 邮箱错误提示
            Text.fontColor('#F44336');
            // 邮箱错误提示
            Text.margin({ top: 5 });
        }, Text);
        // 邮箱错误提示
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手机号输入框
            TextInput.create({ placeholder: '手机号码（可选）', text: this.phone });
            // 手机号输入框
            TextInput.onChange((value: string) => {
                this.phone = value;
                this.validatePhone();
            });
            // 手机号输入框
            TextInput.width('88%');
            // 手机号输入框
            TextInput.height(45);
            // 手机号输入框
            TextInput.margin({ top: 5 });
            // 手机号输入框
            TextInput.borderRadius(6);
            // 手机号输入框
            TextInput.padding({ left: 20 });
            // 手机号输入框
            TextInput.backgroundColor(this.showPhoneError ? '#FFEBEE' : '');
            // 手机号输入框
            TextInput.borderColor(this.showPhoneError ? '#F44336' : '');
        }, TextInput);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手机号错误提示
            Text.create(this.showPhoneError ? '请输入正确的手机号格式' : '');
            // 手机号错误提示
            Text.fontSize(12);
            // 手机号错误提示
            Text.fontColor('#F44336');
            // 手机号错误提示
            Text.margin({ top: 5 });
        }, Text);
        // 手机号错误提示
        Text.pop();
        // 表单输入区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // Radio性别选择区域
            Row.create();
            // Radio性别选择区域
            Row.margin({ top: 5 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('性别：');
            Text.fontSize(16);
            Text.margin({ right: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Radio.create({ value: 'male', group: 'gender' });
            Radio.checked(this.gender == 'male');
            Radio.margin({ left: 10 });
            Radio.onChange(() => {
                this.gender = 'male';
            });
        }, Radio);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('男');
            Text.fontSize(16);
            Text.margin({ left: 5 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Radio.create({ value: 'female', group: 'gender' });
            Radio.checked(this.gender === 'female');
            Radio.margin({ left: 10 });
            Radio.onChange(() => {
                this.gender = 'female';
            });
        }, Radio);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('女');
            Text.fontSize(16);
            Text.margin({ left: 5 });
        }, Text);
        Text.pop();
        // Radio性别选择区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 兴趣爱好选择区域
            Column.create();
            // 兴趣爱好选择区域
            Column.margin({ top: 15 });
            // 兴趣爱好选择区域
            Column.width('90%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('兴趣爱好：');
            Text.fontSize(16);
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Flex.create({ justifyContent: FlexAlign.SpaceEvenly });
        }, Flex);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Checkbox.create({ name: '编程', group: 'checkboxGroup' });
            Checkbox.select(false);
            Checkbox.selectedColor("#409EFF");
            Checkbox.shape(CheckBoxShape.ROUNDED_SQUARE);
            Checkbox.onChange((value: boolean) => {
                console.info('Checkbox1 change is' + value);
            });
        }, Checkbox);
        Checkbox.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('编程');
            Text.fontSize(20);
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Checkbox.create({ name: '阅读', group: 'checkboxGroup' });
            Checkbox.select(false);
            Checkbox.selectedColor("#409EFF");
            Checkbox.shape(CheckBoxShape.ROUNDED_SQUARE);
            Checkbox.onChange((value: boolean) => {
                console.info('Checkbox2 change is' + value);
            });
        }, Checkbox);
        Checkbox.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('阅读');
            Text.fontSize(20);
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Checkbox.create({ name: '运动', group: 'checkboxGroup' });
            Checkbox.select(false);
            Checkbox.selectedColor("#409EFF");
            Checkbox.shape(CheckBoxShape.ROUNDED_SQUARE);
            Checkbox.onChange((value: boolean) => {
                console.info('Checkbox2 change is' + value);
            });
        }, Checkbox);
        Checkbox.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('运动');
            Text.fontSize(20);
            Text.margin({ top: 2 });
        }, Text);
        Text.pop();
        Flex.pop();
        // 兴趣爱好选择区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户协议同意区域
            Row.create();
            // 用户协议同意区域
            Row.margin({ top: 25 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Checkbox.create();
            Checkbox.onChange((value: boolean) => {
                this.isAgreed = value;
            });
        }, Checkbox);
        Checkbox.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('同意《用户协议》');
            Text.fontColor('#409EFF');
            Text.margin({ left: 10 });
        }, Text);
        Text.pop();
        // 用户协议同意区域
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 注册按钮
            Button.createWithLabel('立即注册', { type: ButtonType.Capsule });
            // 注册按钮
            Button.width('90%');
            // 注册按钮
            Button.height(45);
            // 注册按钮
            Button.onClick(async () => {
                console.log(`注册：${this.username}/${this.password}`);
                if (!this.isAgreed) {
                    promptAction.showToast({
                        message: '请同意用户协议'
                    });
                    return;
                }
                this.register();
            });
            // 注册按钮
            Button.margin({ top: 30 });
        }, Button);
        // 注册按钮
        Button.pop();
        // 主容器列布局
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "RegisterPage";
    }
}
registerNamedRoute(() => new RegisterPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/zonghezuoye/RegisterPage", pageFullPath: "entry/src/main/ets/pages/zonghezuoye/RegisterPage", integratedHsp: "false", moduleType: "followWithHap" });
