if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProfilePage_Params {
    currentUser?: User;
    showDeleteConfirm?: boolean;
    loginHistory?: User[];
    isLoadingHistory?: boolean;
    showHistoryDropdown?: boolean;
    userProfile?: UserProfileData;
    isLoadingProfile?: boolean;
    isEditingFullName?: boolean;
    isEditingEmail?: boolean;
    isEditingPhone?: boolean;
    isEditingBio?: boolean;
    tempFullName?: string;
    tempEmail?: string;
    tempPhone?: string;
    tempBio?: string;
    context?;
    dbHelper?;
}
import promptAction from "@ohos:promptAction";
import router from "@ohos:router";
import type common from "@ohos:app.ability.common";
import { DatabaseHelper } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/DatabaseHelper";
import { User } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/User";
import { GlobalContext } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/GlobalContext";
import http from "@ohos:net.http";
// 定义后端响应数据类型
interface UserData {
    id: number;
    username: string;
}
interface BackendResponse {
    code: string;
    msg: string;
    data?: UserData[] | null;
}
interface DeleteResponse {
    code: string;
    msg: string;
}
// 定义用户详细信息接口
interface UserProfileData {
    id: number;
    username: string;
    fullName: string;
    email: string;
    phone: string;
    avatarUrl: string;
    bio: string;
}
interface UserProfileResponse {
    code: string;
    msg: string;
    data?: UserProfileData | null;
}
interface UpdateProfileResponse {
    code: string;
    msg: string;
}
class ProfilePage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__currentUser = new ObservedPropertyObjectPU(new User('', ''), this, "currentUser");
        this.__showDeleteConfirm = new ObservedPropertySimplePU(false, this, "showDeleteConfirm");
        this.__loginHistory = new ObservedPropertyObjectPU([], this, "loginHistory");
        this.__isLoadingHistory = new ObservedPropertySimplePU(true, this, "isLoadingHistory");
        this.__showHistoryDropdown = new ObservedPropertySimplePU(false, this, "showHistoryDropdown");
        this.__userProfile = new ObservedPropertyObjectPU({
            id: 0,
            username: '',
            fullName: '',
            email: '',
            phone: '',
            avatarUrl: '',
            bio: ''
        }, this, "userProfile");
        this.__isLoadingProfile = new ObservedPropertySimplePU(true, this, "isLoadingProfile");
        this.__isEditingFullName = new ObservedPropertySimplePU(false, this, "isEditingFullName");
        this.__isEditingEmail = new ObservedPropertySimplePU(false, this, "isEditingEmail");
        this.__isEditingPhone = new ObservedPropertySimplePU(false, this, "isEditingPhone");
        this.__isEditingBio = new ObservedPropertySimplePU(false, this, "isEditingBio");
        this.__tempFullName = new ObservedPropertySimplePU('', this, "tempFullName");
        this.__tempEmail = new ObservedPropertySimplePU('', this, "tempEmail");
        this.__tempPhone = new ObservedPropertySimplePU('', this, "tempPhone");
        this.__tempBio = new ObservedPropertySimplePU('', this, "tempBio");
        this.context = getContext(this) as common.UIAbilityContext;
        this.dbHelper = DatabaseHelper.getInstance();
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProfilePage_Params) {
        if (params.currentUser !== undefined) {
            this.currentUser = params.currentUser;
        }
        if (params.showDeleteConfirm !== undefined) {
            this.showDeleteConfirm = params.showDeleteConfirm;
        }
        if (params.loginHistory !== undefined) {
            this.loginHistory = params.loginHistory;
        }
        if (params.isLoadingHistory !== undefined) {
            this.isLoadingHistory = params.isLoadingHistory;
        }
        if (params.showHistoryDropdown !== undefined) {
            this.showHistoryDropdown = params.showHistoryDropdown;
        }
        if (params.userProfile !== undefined) {
            this.userProfile = params.userProfile;
        }
        if (params.isLoadingProfile !== undefined) {
            this.isLoadingProfile = params.isLoadingProfile;
        }
        if (params.isEditingFullName !== undefined) {
            this.isEditingFullName = params.isEditingFullName;
        }
        if (params.isEditingEmail !== undefined) {
            this.isEditingEmail = params.isEditingEmail;
        }
        if (params.isEditingPhone !== undefined) {
            this.isEditingPhone = params.isEditingPhone;
        }
        if (params.isEditingBio !== undefined) {
            this.isEditingBio = params.isEditingBio;
        }
        if (params.tempFullName !== undefined) {
            this.tempFullName = params.tempFullName;
        }
        if (params.tempEmail !== undefined) {
            this.tempEmail = params.tempEmail;
        }
        if (params.tempPhone !== undefined) {
            this.tempPhone = params.tempPhone;
        }
        if (params.tempBio !== undefined) {
            this.tempBio = params.tempBio;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.dbHelper !== undefined) {
            this.dbHelper = params.dbHelper;
        }
    }
    updateStateVars(params: ProfilePage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentUser.purgeDependencyOnElmtId(rmElmtId);
        this.__showDeleteConfirm.purgeDependencyOnElmtId(rmElmtId);
        this.__loginHistory.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoadingHistory.purgeDependencyOnElmtId(rmElmtId);
        this.__showHistoryDropdown.purgeDependencyOnElmtId(rmElmtId);
        this.__userProfile.purgeDependencyOnElmtId(rmElmtId);
        this.__isLoadingProfile.purgeDependencyOnElmtId(rmElmtId);
        this.__isEditingFullName.purgeDependencyOnElmtId(rmElmtId);
        this.__isEditingEmail.purgeDependencyOnElmtId(rmElmtId);
        this.__isEditingPhone.purgeDependencyOnElmtId(rmElmtId);
        this.__isEditingBio.purgeDependencyOnElmtId(rmElmtId);
        this.__tempFullName.purgeDependencyOnElmtId(rmElmtId);
        this.__tempEmail.purgeDependencyOnElmtId(rmElmtId);
        this.__tempPhone.purgeDependencyOnElmtId(rmElmtId);
        this.__tempBio.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentUser.aboutToBeDeleted();
        this.__showDeleteConfirm.aboutToBeDeleted();
        this.__loginHistory.aboutToBeDeleted();
        this.__isLoadingHistory.aboutToBeDeleted();
        this.__showHistoryDropdown.aboutToBeDeleted();
        this.__userProfile.aboutToBeDeleted();
        this.__isLoadingProfile.aboutToBeDeleted();
        this.__isEditingFullName.aboutToBeDeleted();
        this.__isEditingEmail.aboutToBeDeleted();
        this.__isEditingPhone.aboutToBeDeleted();
        this.__isEditingBio.aboutToBeDeleted();
        this.__tempFullName.aboutToBeDeleted();
        this.__tempEmail.aboutToBeDeleted();
        this.__tempPhone.aboutToBeDeleted();
        this.__tempBio.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __currentUser: ObservedPropertyObjectPU<User>; // 默认空用户
    get currentUser() {
        return this.__currentUser.get();
    }
    set currentUser(newValue: User) {
        this.__currentUser.set(newValue);
    }
    private __showDeleteConfirm: ObservedPropertySimplePU<boolean>;
    get showDeleteConfirm() {
        return this.__showDeleteConfirm.get();
    }
    set showDeleteConfirm(newValue: boolean) {
        this.__showDeleteConfirm.set(newValue);
    }
    private __loginHistory: ObservedPropertyObjectPU<User[]>; // 登录历史记录
    get loginHistory() {
        return this.__loginHistory.get();
    }
    set loginHistory(newValue: User[]) {
        this.__loginHistory.set(newValue);
    }
    private __isLoadingHistory: ObservedPropertySimplePU<boolean>;
    get isLoadingHistory() {
        return this.__isLoadingHistory.get();
    }
    set isLoadingHistory(newValue: boolean) {
        this.__isLoadingHistory.set(newValue);
    }
    private __showHistoryDropdown: ObservedPropertySimplePU<boolean>; // 控制下拉列表显示状态
    get showHistoryDropdown() {
        return this.__showHistoryDropdown.get();
    }
    set showHistoryDropdown(newValue: boolean) {
        this.__showHistoryDropdown.set(newValue);
    }
    private __userProfile: ObservedPropertyObjectPU<UserProfileData>; // 用户详细信息
    get userProfile() {
        return this.__userProfile.get();
    }
    set userProfile(newValue: UserProfileData) {
        this.__userProfile.set(newValue);
    }
    private __isLoadingProfile: ObservedPropertySimplePU<boolean>;
    get isLoadingProfile() {
        return this.__isLoadingProfile.get();
    }
    set isLoadingProfile(newValue: boolean) {
        this.__isLoadingProfile.set(newValue);
    }
    // 编辑状态变量
    private __isEditingFullName: ObservedPropertySimplePU<boolean>;
    get isEditingFullName() {
        return this.__isEditingFullName.get();
    }
    set isEditingFullName(newValue: boolean) {
        this.__isEditingFullName.set(newValue);
    }
    private __isEditingEmail: ObservedPropertySimplePU<boolean>;
    get isEditingEmail() {
        return this.__isEditingEmail.get();
    }
    set isEditingEmail(newValue: boolean) {
        this.__isEditingEmail.set(newValue);
    }
    private __isEditingPhone: ObservedPropertySimplePU<boolean>;
    get isEditingPhone() {
        return this.__isEditingPhone.get();
    }
    set isEditingPhone(newValue: boolean) {
        this.__isEditingPhone.set(newValue);
    }
    private __isEditingBio: ObservedPropertySimplePU<boolean>;
    get isEditingBio() {
        return this.__isEditingBio.get();
    }
    set isEditingBio(newValue: boolean) {
        this.__isEditingBio.set(newValue);
    }
    private __tempFullName: ObservedPropertySimplePU<string>;
    get tempFullName() {
        return this.__tempFullName.get();
    }
    set tempFullName(newValue: string) {
        this.__tempFullName.set(newValue);
    }
    private __tempEmail: ObservedPropertySimplePU<string>;
    get tempEmail() {
        return this.__tempEmail.get();
    }
    set tempEmail(newValue: string) {
        this.__tempEmail.set(newValue);
    }
    private __tempPhone: ObservedPropertySimplePU<string>;
    get tempPhone() {
        return this.__tempPhone.get();
    }
    set tempPhone(newValue: string) {
        this.__tempPhone.set(newValue);
    }
    private __tempBio: ObservedPropertySimplePU<string>;
    get tempBio() {
        return this.__tempBio.get();
    }
    set tempBio(newValue: string) {
        this.__tempBio.set(newValue);
    }
    private context;
    private dbHelper;
    async aboutToAppear() {
        console.log("ProfilePage aboutToAppear");
        // 从全局上下文中获取当前用户信息
        const user = GlobalContext.getContext().getObject('loggedInUser') as User | undefined;
        if (user) {
            this.currentUser = user;
            console.log("获取到当前用户:", user.toString());
            // 加载用户详细信息
            await this.loadUserProfile();
        }
        else {
            console.log("未获取到当前用户");
        }
        // 初始化数据库
        try {
            console.log("开始初始化数据库");
            await this.dbHelper.initialize(this.context);
            console.log("数据库初始化成功");
            // 加载登录历史
            await this.loadLoginHistory();
        }
        catch (err) {
            console.error("数据库初始化失败:", err);
        }
    }
    // 加载用户详细信息
    private async loadUserProfile() {
        try {
            this.isLoadingProfile = true;
            await this.fetchUserProfileFromBackend();
            this.isLoadingProfile = false;
        }
        catch (err) {
            console.error('加载用户详细信息失败:', err);
            promptAction.showToast({ message: '加载用户信息失败' });
            this.isLoadingProfile = false;
        }
    }
    // 从后端获取用户详细信息
    private async fetchUserProfileFromBackend() {
        if (!this.currentUser.id) {
            console.log("用户ID无效");
            // 即使用户ID无效，也要设置isLoadingProfile为false
            this.isLoadingProfile = false;
            return;
        }
        let httpRequest = http.createHttp();
        // 使用实际的IP地址替换localhost，确保在设备上可以访问
        const baseUrl = "http://172.17.75.16:9588"; // 可以根据实际情况修改为开发机的实际IP
        console.log('开始发送请求到:', `${baseUrl}/users/profile/${this.currentUser.id}`);
        httpRequest.request(`${baseUrl}/users/profile/${this.currentUser.id}`, {
            method: http.RequestMethod.GET,
            header: { 'Content-Type': 'application/json' },
            readTimeout: 50000,
            connectTimeout: 50000
        }, (err, data) => {
            console.log('获取用户信息网络请求回调执行');
            console.log('错误信息:', JSON.stringify(err));
            console.log('响应数据:', JSON.stringify(data));
            if (!err) {
                console.info('后端用户信息请求成功:' + JSON.stringify(data));
                try {
                    // 检查响应数据是否存在
                    if (!data || !data.result) {
                        console.error('响应数据为空或格式不正确');
                        promptAction.showToast({ message: '响应数据格式错误' });
                        this.isLoadingProfile = false;
                        return;
                    }
                    // 尝试解析响应数据
                    let responseData: UserProfileResponse | undefined;
                    if (typeof data.result === 'string') {
                        try {
                            responseData = JSON.parse(data.result) as UserProfileResponse;
                        }
                        catch (parseErr) {
                            console.error('JSON解析失败:', parseErr);
                            promptAction.showToast({ message: '数据解析失败' });
                            this.isLoadingProfile = false;
                            return;
                        }
                    }
                    else {
                        responseData = data.result as UserProfileResponse;
                    }
                    console.log('解析后的响应数据:', JSON.stringify(responseData));
                    if (responseData && responseData.code === 'success' && responseData.data) {
                        // 解析用户数据
                        this.userProfile = responseData.data;
                        console.log('解析后的用户信息:', JSON.stringify(this.userProfile));
                    }
                    else {
                        const errorMsg = responseData ? (responseData.msg || '未知错误') : '响应数据为空';
                        console.error('后端返回错误:', errorMsg);
                        // 即使出现错误，也更新加载状态
                        if (errorMsg !== '用户不存在') {
                            promptAction.showToast({ message: '获取用户信息失败: ' + errorMsg });
                        }
                    }
                }
                catch (parseError) {
                    console.error('解析响应数据失败:', parseError);
                    promptAction.showToast({ message: '数据解析失败: ' + (parseError as Error).message });
                }
            }
            else {
                console.error('请求失败:' + JSON.stringify(err));
                const errorMsg = err.message || '未知网络错误';
                promptAction.showToast({ message: '网络请求失败: ' + errorMsg });
            }
            this.isLoadingProfile = false;
            httpRequest.destroy();
        });
    }
    // 更新用户详细信息到后端
    private async updateUserProfileToBackend() {
        if (!this.currentUser.id) {
            console.log("用户ID无效");
            promptAction.showToast({ message: '用户信息异常' });
            return;
        }
        let httpRequest = http.createHttp();
        const baseUrl = "http://172.17.75.16:9588";
        console.log('开始发送更新请求到:', `${baseUrl}/users/profile/${this.currentUser.id}`);
        httpRequest.request(`${baseUrl}/users/profile/${this.currentUser.id}`, {
            method: http.RequestMethod.PUT,
            header: { 'Content-Type': 'application/json' },
            extraData: JSON.stringify({
                fullName: this.userProfile.fullName,
                email: this.userProfile.email,
                phone: this.userProfile.phone,
                avatarUrl: this.userProfile.avatarUrl,
                bio: this.userProfile.bio
            }),
            readTimeout: 50000,
            connectTimeout: 50000
        }, (err, data) => {
            console.log('更新用户信息网络请求回调执行');
            console.log('错误信息:', JSON.stringify(err));
            console.log('响应数据:', JSON.stringify(data));
            if (!err) {
                console.info('后端更新用户信息请求成功:' + JSON.stringify(data));
                try {
                    // 检查响应数据是否存在
                    if (!data || !data.result) {
                        console.error('响应数据为空或格式不正确');
                        promptAction.showToast({ message: '响应数据格式错误' });
                        return;
                    }
                    // 尝试解析响应数据
                    let responseData: UpdateProfileResponse | undefined;
                    if (typeof data.result === 'string') {
                        try {
                            responseData = JSON.parse(data.result) as UpdateProfileResponse;
                        }
                        catch (parseErr) {
                            console.error('JSON解析失败:', parseErr);
                            promptAction.showToast({ message: '数据解析失败' });
                            return;
                        }
                    }
                    else {
                        responseData = data.result as UpdateProfileResponse;
                    }
                    console.log('解析后的响应数据:', JSON.stringify(responseData));
                    if (responseData && responseData.code === 'success') {
                        console.log('用户信息更新成功');
                        promptAction.showToast({ message: '信息更新成功' });
                        // 重新加载用户信息
                        this.loadUserProfile();
                    }
                    else {
                        const errorMsg = responseData ? (responseData.msg || '未知错误') : '响应数据为空';
                        console.error('后端返回错误:', errorMsg);
                        promptAction.showToast({ message: '更新失败: ' + errorMsg });
                    }
                }
                catch (parseError) {
                    console.error('解析响应数据失败:', parseError);
                    promptAction.showToast({ message: '数据解析失败: ' + (parseError as Error).message });
                }
            }
            else {
                console.error('请求失败:' + JSON.stringify(err));
                const errorMsg = err.message || '未知网络错误';
                promptAction.showToast({ message: '网络请求失败: ' + errorMsg });
            }
            httpRequest.destroy();
        });
    }
    // 开始编辑姓名
    private startEditFullName() {
        this.tempFullName = this.userProfile.fullName;
        this.isEditingFullName = true;
    }
    // 保存姓名
    private saveFullName() {
        if (this.tempFullName !== this.userProfile.fullName) {
            this.userProfile.fullName = this.tempFullName;
            this.updateUserProfileToBackend();
        }
        this.isEditingFullName = false;
    }
    // 取消编辑姓名
    private cancelEditFullName() {
        this.isEditingFullName = false;
    }
    // 开始编辑邮箱
    private startEditEmail() {
        this.tempEmail = this.userProfile.email;
        this.isEditingEmail = true;
    }
    // 保存邮箱
    private saveEmail() {
        if (this.tempEmail !== this.userProfile.email) {
            this.userProfile.email = this.tempEmail;
            this.updateUserProfileToBackend();
        }
        this.isEditingEmail = false;
    }
    // 取消编辑邮箱
    private cancelEditEmail() {
        this.isEditingEmail = false;
    }
    // 开始编辑手机号
    private startEditPhone() {
        this.tempPhone = this.userProfile.phone;
        this.isEditingPhone = true;
    }
    // 保存手机号
    private savePhone() {
        if (this.tempPhone !== this.userProfile.phone) {
            this.userProfile.phone = this.tempPhone;
            this.updateUserProfileToBackend();
        }
        this.isEditingPhone = false;
    }
    // 取消编辑手机号
    private cancelEditPhone() {
        this.isEditingPhone = false;
    }
    // 开始编辑个人简介
    private startEditBio() {
        this.tempBio = this.userProfile.bio;
        this.isEditingBio = true;
    }
    // 保存个人简介
    private saveBio() {
        if (this.tempBio !== this.userProfile.bio) {
            this.userProfile.bio = this.tempBio;
            this.updateUserProfileToBackend();
        }
        this.isEditingBio = false;
    }
    // 取消编辑个人简介
    private cancelEditBio() {
        this.isEditingBio = false;
    }
    // 加载登录历史
    private async loadLoginHistory() {
        try {
            this.isLoadingHistory = true;
            // 从后端获取登录历史
            await this.fetchLoginHistoryFromBackend();
            this.isLoadingHistory = false;
        }
        catch (err) {
            console.error('加载登录历史失败:', err);
            promptAction.showToast({ message: '加载登录历史失败' });
            this.isLoadingHistory = false;
        }
    }
    // 从后端获取登录历史
    private async fetchLoginHistoryFromBackend() {
        let httpRequest = http.createHttp();
        // 使用实际的IP地址替换localhost，确保在设备上可以访问
        const baseUrl = "http://172.17.75.16:9588"; // 可以根据实际情况修改为开发机的实际IP
        console.log('开始发送请求到:', `${baseUrl}/users/login-history`);
        httpRequest.request(`${baseUrl}/users/login-history`, {
            method: http.RequestMethod.GET,
            header: { 'Content-Type': 'application/json' },
            readTimeout: 50000,
            connectTimeout: 50000
        }, (err, data) => {
            console.log('网络请求回调执行');
            console.log('错误信息:', JSON.stringify(err));
            console.log('响应数据:', JSON.stringify(data));
            if (!err) {
                console.info('后端登录历史请求成功:' + JSON.stringify(data));
                try {
                    // 检查响应数据是否存在
                    if (!data || !data.result) {
                        console.error('响应数据为空或格式不正确');
                        promptAction.showToast({ message: '响应数据格式错误' });
                        return;
                    }
                    // 尝试解析响应数据
                    let responseData: BackendResponse | undefined;
                    if (typeof data.result === 'string') {
                        try {
                            responseData = JSON.parse(data.result) as BackendResponse;
                        }
                        catch (parseErr) {
                            console.error('JSON解析失败:', parseErr);
                            promptAction.showToast({ message: '数据解析失败' });
                            return;
                        }
                    }
                    else {
                        responseData = data.result as BackendResponse;
                    }
                    console.log('解析后的响应数据:', JSON.stringify(responseData));
                    if (responseData && responseData.code === 'success' && responseData.data) {
                        // 解析用户数据
                        const usersData = responseData.data;
                        this.loginHistory = usersData.map((userData) => {
                            const user = new User(userData.username, '');
                            user.id = userData.id;
                            return user;
                        });
                        console.log('解析后的登录历史:', JSON.stringify(this.loginHistory));
                    }
                    else {
                        const errorMsg = responseData ? (responseData.msg || '未知错误') : '响应数据为空';
                        console.error('后端返回错误:', errorMsg);
                        promptAction.showToast({ message: '获取登录历史失败: ' + errorMsg });
                    }
                }
                catch (parseError) {
                    console.error('解析响应数据失败:', parseError);
                    promptAction.showToast({ message: '数据解析失败: ' + parseError.message });
                }
            }
            else {
                console.error('请求失败:' + JSON.stringify(err));
                const errorMsg = err.message || '未知网络错误';
                promptAction.showToast({ message: '网络请求失败: ' + errorMsg });
            }
            httpRequest.destroy();
        });
    }
    // 切换用户
    private switchUser(user: User) {
        console.log("切换用户到:", user.toString());
        // 首先验证用户是否仍然存在于后端
        this.validateUserExists(user).then((exists) => {
            if (exists) {
                // 更新全局上下文中的用户信息
                GlobalContext.getContext().setObject('loggedInUser', user);
                // 更新当前用户状态
                this.currentUser = user;
                // 加载新用户的详细信息
                this.loadUserProfile();
                // 显示切换成功的提示
                promptAction.showToast({ message: `已切换到用户: ${user.username}` });
            }
            else {
                // 用户不存在，从登录历史中移除
                this.loginHistory = this.loginHistory.filter(u => u.id !== user.id);
                promptAction.showToast({ message: '该用户已注销，无法切换' });
            }
        });
    }
    // 验证用户是否仍然存在于后端
    private async validateUserExists(user: User): Promise<boolean> {
        return new Promise((resolve) => {
            let httpRequest = http.createHttp();
            const baseUrl = "http://172.17.75.16:9588";
            const url = `${baseUrl}/users/all`;
            httpRequest.request(url, {
                method: http.RequestMethod.GET,
                header: { 'Content-Type': 'application/json' },
                readTimeout: 50000,
                connectTimeout: 50000
            }, (err, data) => {
                if (!err && data && data.result) {
                    try {
                        let responseData: BackendResponse | undefined;
                        if (typeof data.result === 'string') {
                            responseData = JSON.parse(data.result) as BackendResponse;
                        }
                        else {
                            responseData = data.result as BackendResponse;
                        }
                        if (responseData && responseData.code === 'success' && responseData.data) {
                            const usersData = responseData.data as UserData[];
                            const userExists = usersData.some(u => u.id === user.id && u.username === user.username);
                            resolve(userExists);
                        }
                        else {
                            resolve(false);
                        }
                    }
                    catch (error) {
                        console.error('验证用户存在性时解析数据失败:', error);
                        resolve(false);
                    }
                }
                else {
                    console.error('验证用户存在性时请求失败:', err);
                    resolve(false);
                }
                httpRequest.destroy();
            });
        });
    }
    // 退出登录
    private logout() {
        console.log("执行退出登录操作");
        // 清除全局用户信息
        GlobalContext.getContext().setObject('loggedInUser', new User('', '')); // 设置为空用户
        // 跳转到登录页面
        router.pushUrl({ url: 'pages/zonghezuoye/LoginPage' });
    }
    // 注销账户（从后端删除用户）
    private async deleteAccount() {
        console.log("执行注销账户操作，用户信息:", this.currentUser.toString());
        try {
            // 确保有有效的用户ID
            if (!this.currentUser.id) {
                console.log("用户ID无效");
                promptAction.showToast({ message: '用户信息异常' });
                return;
            }
            // 从后端删除用户
            const success = await this.deleteUserFromBackend(this.currentUser.id);
            // 如果后端删除成功，也删除本地数据库中的用户数据
            if (success) {
                await this.deleteUserFromLocal(this.currentUser.id, this.currentUser.username);
            }
        }
        catch (err) {
            console.error('注销账户失败:', err);
            promptAction.showToast({ message: '注销账户失败: ' + JSON.stringify(err) });
        }
        finally {
            // 无论成功与否都关闭确认对话框
            this.showDeleteConfirm = false;
            // 重新加载登录历史
            await this.loadLoginHistory();
        }
    }
    // 从后端删除用户
    private async deleteUserFromBackend(userId: number): Promise<boolean> {
        return new Promise((resolve) => {
            let httpRequest = http.createHttp();
            // 使用实际的IP地址替换localhost
            const baseUrl = "http://172.17.75.16:9588"; // 可以根据实际情况修改为开发机的实际IP
            // 构造删除用户的请求URL
            const url = `${baseUrl}/users/${userId}`;
            console.log('开始发送删除请求到:', url);
            httpRequest.request(url, {
                method: http.RequestMethod.DELETE,
                header: { 'Content-Type': 'application/json' },
                readTimeout: 50000,
                connectTimeout: 50000
            }, (err, data) => {
                console.log('删除用户请求回调执行');
                console.log('错误信息:', JSON.stringify(err));
                console.log('响应数据:', JSON.stringify(data));
                if (!err) {
                    console.info('删除用户请求成功:' + JSON.stringify(data));
                    try {
                        // 检查响应数据是否存在
                        if (!data || !data.result) {
                            console.error('删除用户响应数据为空或格式不正确');
                            promptAction.showToast({ message: '删除响应数据格式错误' });
                            resolve(false);
                            return;
                        }
                        // 尝试解析响应数据
                        let responseData: DeleteResponse | undefined;
                        if (typeof data.result === 'string') {
                            try {
                                responseData = JSON.parse(data.result) as DeleteResponse;
                            }
                            catch (parseErr) {
                                console.error('JSON解析失败:', parseErr);
                                promptAction.showToast({ message: '删除响应数据解析失败' });
                                resolve(false);
                                return;
                            }
                        }
                        else {
                            responseData = data.result as DeleteResponse;
                        }
                        console.log('解析后的删除响应数据:', JSON.stringify(responseData));
                        if (responseData && responseData.code === 'success') {
                            console.log("账户注销成功");
                            promptAction.showToast({ message: '账户注销成功' });
                            // 如果删除的是当前用户，则清除全局用户信息并跳转到登录页
                            if (userId === this.currentUser.id) {
                                GlobalContext.getContext().setObject('loggedInUser', new User('', '')); // 设置为空用户
                                router.pushUrl({ url: 'pages/zonghezuoye/LoginPage' });
                            }
                            resolve(true);
                        }
                        else {
                            const errorMsg = responseData ? (responseData.msg || '未知错误') : '响应数据为空';
                            console.error('后端返回错误:', errorMsg);
                            promptAction.showToast({ message: '账户注销失败: ' + errorMsg });
                            resolve(false);
                        }
                    }
                    catch (parseError) {
                        console.error('解析响应数据失败:', parseError);
                        promptAction.showToast({ message: '删除数据解析失败: ' + parseError.message });
                        resolve(false);
                    }
                }
                else {
                    console.error('请求失败:' + JSON.stringify(err));
                    const errorMsg = err.message || '未知网络错误';
                    promptAction.showToast({ message: '删除请求失败: ' + errorMsg });
                    resolve(false);
                }
                httpRequest.destroy();
            });
        });
    }
    // 从本地数据库删除用户
    private async deleteUserFromLocal(userId: number, username: string): Promise<void> {
        try {
            console.log('开始从本地数据库删除用户，用户ID:', userId);
            // 方式1: 通过用户ID删除
            const rowsDeletedById = await this.dbHelper.deleteUser(userId);
            console.log('通过ID删除用户，影响行数:', rowsDeletedById);
            // 如果通过ID删除失败，尝试通过用户名删除
            if (rowsDeletedById === 0) {
                console.log('通过ID删除失败，尝试通过用户名删除:', username);
                // 查询所有用户找到匹配的用户
                const users = await this.dbHelper.queryAllUsers();
                const userToDelete = users.find(user => user.username === username);
                if (userToDelete && userToDelete.id) {
                    const rowsDeletedByName = await this.dbHelper.deleteUser(userToDelete.id);
                    console.log('通过用户名删除用户，影响行数:', rowsDeletedByName);
                }
            }
        }
        catch (err) {
            console.error('从本地数据库删除用户失败:', err);
            // 不抛出错误，因为即使本地删除失败，后端已经删除成功
        }
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
            Column.height('100%');
            Column.backgroundColor('#F5F5F5');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('100%');
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
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 页面标题
            Row.create();
            // 页面标题
            Row.width('100%');
            // 页面标题
            Row.padding({ top: 20, left: 20, right: 20 });
            // 页面标题
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人主页');
            Text.fontSize(22);
            Text.fontWeight('bold');
        }, Text);
        Text.pop();
        // 页面标题
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Scroll.create();
            Scroll.layoutWeight(1);
        }, Scroll);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户信息展示区域
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 使用mine_normal.png作为用户头像
            Image.create({ "id": 16777319, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            // 使用mine_normal.png作为用户头像
            Image.width(80);
            // 使用mine_normal.png作为用户头像
            Image.height(80);
            // 使用mine_normal.png作为用户头像
            Image.objectFit(ImageFit.Contain);
            // 使用mine_normal.png作为用户头像
            Image.margin({ top: 30, bottom: 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名
            Text.create(this.currentUser.username || '未知用户');
            // 用户名
            Text.fontSize(18);
            // 用户名
            Text.fontWeight('500');
            // 用户名
            Text.margin({ bottom: 30 });
        }, Text);
        // 用户名
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 个人信息详情
            Column.create();
            // 个人信息详情
            Column.width('90%');
            // 个人信息详情
            Column.padding(20);
            // 个人信息详情
            Column.backgroundColor('#FFFFFF');
            // 个人信息详情
            Column.borderRadius(10);
            // 个人信息详情
            Column.shadow({ radius: 5, color: '#00000010', offsetX: 0, offsetY: 2 });
            // 个人信息详情
            Column.margin({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人信息');
            Text.fontSize(16);
            Text.fontWeight('bold');
            Text.textAlign(TextAlign.Start);
            Text.margin({ bottom: 15 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户ID
            Row.create();
            // 用户ID
            Row.width('100%');
            // 用户ID
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户ID:');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.width('30%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.currentUser.id ? this.currentUser.id.toString() : '未知'}`);
            Text.fontSize(14);
            Text.width('70%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        // 用户ID
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 用户名
            Row.create();
            // 用户名
            Row.width('100%');
            // 用户名
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('用户名:');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.width('30%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.currentUser.username || '未知');
            Text.fontSize(14);
            Text.width('70%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        // 用户名
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 姓名
            Row.create();
            // 姓名
            Row.width('100%');
            // 姓名
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('姓名:');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.width('30%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isEditingFullName) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('70%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.userProfile.fullName || '未设置');
                        Text.fontSize(14);
                        Text.width('60%');
                        Text.textAlign(TextAlign.Start);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777288, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
                        Image.width(16);
                        Image.height(16);
                        Image.onClick(() => {
                            this.startEditFullName();
                        });
                    }, Image);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('70%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '请输入姓名', text: this.tempFullName });
                        TextInput.width('100%');
                        TextInput.height(30);
                        TextInput.borderRadius(4);
                        TextInput.onChange((value: string) => {
                            this.tempFullName = value;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.margin({ top: 5 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.fontSize(12);
                        Button.backgroundColor('#CCCCCC');
                        Button.onClick(() => {
                            this.cancelEditFullName();
                        });
                        Button.margin({ right: 10 });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('保存');
                        Button.fontSize(12);
                        Button.backgroundColor('#007DFF');
                        Button.fontColor('#FFFFFF');
                        Button.onClick(() => {
                            this.saveFullName();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 姓名
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 邮箱
            Row.create();
            // 邮箱
            Row.width('100%');
            // 邮箱
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('邮箱:');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.width('30%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isEditingEmail) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('70%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.userProfile.email || '未设置');
                        Text.fontSize(14);
                        Text.width('60%');
                        Text.textAlign(TextAlign.Start);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777288, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
                        Image.width(16);
                        Image.height(16);
                        Image.onClick(() => {
                            this.startEditEmail();
                        });
                    }, Image);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('70%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '请输入邮箱', text: this.tempEmail });
                        TextInput.width('100%');
                        TextInput.height(30);
                        TextInput.borderRadius(4);
                        TextInput.onChange((value: string) => {
                            this.tempEmail = value;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.margin({ top: 5 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.fontSize(12);
                        Button.backgroundColor('#CCCCCC');
                        Button.onClick(() => {
                            this.cancelEditEmail();
                        });
                        Button.margin({ right: 10 });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('保存');
                        Button.fontSize(12);
                        Button.backgroundColor('#007DFF');
                        Button.fontColor('#FFFFFF');
                        Button.onClick(() => {
                            this.saveEmail();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 邮箱
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 手机号
            Row.create();
            // 手机号
            Row.width('100%');
            // 手机号
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('手机号:');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.width('30%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isEditingPhone) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('70%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.userProfile.phone || '未设置');
                        Text.fontSize(14);
                        Text.width('60%');
                        Text.textAlign(TextAlign.Start);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777288, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
                        Image.width(16);
                        Image.height(16);
                        Image.onClick(() => {
                            this.startEditPhone();
                        });
                    }, Image);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('70%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextInput.create({ placeholder: '请输入手机号', text: this.tempPhone });
                        TextInput.width('100%');
                        TextInput.height(30);
                        TextInput.borderRadius(4);
                        TextInput.onChange((value: string) => {
                            this.tempPhone = value;
                        });
                    }, TextInput);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.margin({ top: 5 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.fontSize(12);
                        Button.backgroundColor('#CCCCCC');
                        Button.onClick(() => {
                            this.cancelEditPhone();
                        });
                        Button.margin({ right: 10 });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('保存');
                        Button.fontSize(12);
                        Button.backgroundColor('#007DFF');
                        Button.fontColor('#FFFFFF');
                        Button.onClick(() => {
                            this.savePhone();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 手机号
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 个人简介
            Row.create();
            // 个人简介
            Row.width('100%');
            // 个人简介
            Row.margin({ bottom: 10 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('个人简介:');
            Text.fontSize(14);
            Text.fontColor('#666666');
            Text.width('30%');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (!this.isEditingBio) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.width('70%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create(this.userProfile.bio || '未设置');
                        Text.fontSize(14);
                        Text.width('60%');
                        Text.textAlign(TextAlign.Start);
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Image.create({ "id": 16777288, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
                        Image.width(16);
                        Image.height(16);
                        Image.onClick(() => {
                            this.startEditBio();
                        });
                    }, Image);
                    Row.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('70%');
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        TextArea.create({ placeholder: '请输入个人简介', text: this.tempBio });
                        TextArea.width('100%');
                        TextArea.height(60);
                        TextArea.borderRadius(4);
                        TextArea.onChange((value: string) => {
                            this.tempBio = value;
                        });
                    }, TextArea);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create();
                        Row.margin({ top: 5 });
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.fontSize(12);
                        Button.backgroundColor('#CCCCCC');
                        Button.onClick(() => {
                            this.cancelEditBio();
                        });
                        Button.margin({ right: 10 });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('保存');
                        Button.fontSize(12);
                        Button.backgroundColor('#007DFF');
                        Button.fontColor('#FFFFFF');
                        Button.onClick(() => {
                            this.saveBio();
                        });
                    }, Button);
                    Button.pop();
                    Row.pop();
                    Column.pop();
                });
            }
        }, If);
        If.pop();
        // 个人简介
        Row.pop();
        // 个人信息详情
        Column.pop();
        // 用户信息展示区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 登录历史记录（下拉列表形式）
            Column.create();
            // 登录历史记录（下拉列表形式）
            Column.width('90%');
            // 登录历史记录（下拉列表形式）
            Column.backgroundColor('#FFFFFF');
            // 登录历史记录（下拉列表形式）
            Column.borderRadius(10);
            // 登录历史记录（下拉列表形式）
            Column.shadow({ radius: 5, color: '#00000010', offsetX: 0, offsetY: 2 });
            // 登录历史记录（下拉列表形式）
            Column.margin({ bottom: 30 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.width('90%');
            Row.padding({ top: 15, bottom: 15 });
            Row.onClick(() => {
                this.showHistoryDropdown = !this.showHistoryDropdown;
                // 每次展开时重新加载数据
                if (this.showHistoryDropdown) {
                    this.loadLoginHistory();
                }
            });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('登录历史');
            Text.fontSize(16);
            Text.fontWeight('bold');
            Text.textAlign(TextAlign.Start);
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Blank.create();
        }, Blank);
        Blank.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 展开/收起图标
            Text.create(this.showHistoryDropdown ? '▲' : '▼');
            // 展开/收起图标
            Text.fontSize(14);
            // 展开/收起图标
            Text.fontColor('#999999');
        }, Text);
        // 展开/收起图标
        Text.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 下拉列表内容
            if (this.showHistoryDropdown) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('100%');
                        Column.padding({ bottom: 15 });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        If.create();
                        if (this.isLoadingHistory) {
                            this.ifElseBranchUpdateFunction(0, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 加载中提示
                                    Row.create();
                                    // 加载中提示
                                    Row.width('100%');
                                    // 加载中提示
                                    Row.justifyContent(FlexAlign.Center);
                                    // 加载中提示
                                    Row.padding(15);
                                }, Row);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Progress.create({ value: 50, total: 100, type: ProgressType.Capsule });
                                    Progress.width(20);
                                    Progress.height(20);
                                    Progress.color('#1890FF');
                                }, Progress);
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    Text.create('加载中...');
                                    Text.fontSize(14);
                                    Text.fontColor('#666666');
                                    Text.margin({ left: 10 });
                                }, Text);
                                Text.pop();
                                // 加载中提示
                                Row.pop();
                            });
                        }
                        else if (this.loginHistory.length === 0) {
                            this.ifElseBranchUpdateFunction(1, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 空列表提示
                                    Text.create('暂无登录历史');
                                    // 空列表提示
                                    Text.fontSize(14);
                                    // 空列表提示
                                    Text.fontColor('#666666');
                                    // 空列表提示
                                    Text.padding(15);
                                }, Text);
                                // 空列表提示
                                Text.pop();
                            });
                        }
                        else {
                            this.ifElseBranchUpdateFunction(2, () => {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    // 历史用户列表
                                    ForEach.create();
                                    const forEachItemGenFunction = (_item, index: number) => {
                                        const user = _item;
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Row.create();
                                            Row.padding(15);
                                            Row.backgroundColor('#FAFAFA');
                                            Row.borderRadius(8);
                                            Row.margin({ left: 15, right: 15, top: 5, bottom: 5 });
                                            Row.onClick(() => {
                                                // 点击用户项切换用户
                                                this.switchUser(user);
                                            });
                                        }, Row);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Column.create({ space: 5 });
                                            Column.flexGrow(1);
                                        }, Column);
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(`用户名: ${user.username}`);
                                            Text.fontSize(14);
                                            Text.fontWeight('500');
                                        }, Text);
                                        Text.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            Text.create(`用户ID: ${user.id}`);
                                            Text.fontSize(12);
                                            Text.fontColor('#666666');
                                        }, Text);
                                        Text.pop();
                                        Column.pop();
                                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                                            If.create();
                                            // 如果是当前用户，显示"当前"标签
                                            if (user.id === this.currentUser.id) {
                                                this.ifElseBranchUpdateFunction(0, () => {
                                                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                                                        Text.create('当前');
                                                        Text.fontSize(12);
                                                        Text.fontColor('#1890FF');
                                                        Text.border({ width: 1, color: '#1890FF' });
                                                        Text.borderRadius(4);
                                                        Text.padding({ left: 5, right: 5 });
                                                    }, Text);
                                                    Text.pop();
                                                });
                                            }
                                            else {
                                                this.ifElseBranchUpdateFunction(1, () => {
                                                });
                                            }
                                        }, If);
                                        If.pop();
                                        Row.pop();
                                    };
                                    this.forEachUpdateFunction(elmtId, this.loginHistory, forEachItemGenFunction, (user: User) => user.id?.toString() || '', true, false);
                                }, ForEach);
                                // 历史用户列表
                                ForEach.pop();
                            });
                        }
                    }, If);
                    If.pop();
                    Column.pop();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(1, () => {
                });
            }
        }, If);
        If.pop();
        // 登录历史记录（下拉列表形式）
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 功能按钮区域
            Column.create({ space: 15 });
            // 功能按钮区域
            Column.width('100%');
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 退出登录按钮
            Button.createWithLabel('退出登录');
            // 退出登录按钮
            Button.backgroundColor('#F5222D');
            // 退出登录按钮
            Button.fontColor('#FFFFFF');
            // 退出登录按钮
            Button.width('90%');
            // 退出登录按钮
            Button.height(45);
            // 退出登录按钮
            Button.borderRadius(6);
            // 退出登录按钮
            Button.onClick(() => {
                this.logout();
            });
        }, Button);
        // 退出登录按钮
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 注销账户按钮
            Button.createWithLabel('注销账户');
            // 注销账户按钮
            Button.backgroundColor('#FFFFFF');
            // 注销账户按钮
            Button.border({ width: 1, color: '#F5222D' });
            // 注销账户按钮
            Button.fontColor('#F5222D');
            // 注销账户按钮
            Button.width('90%');
            // 注销账户按钮
            Button.height(45);
            // 注销账户按钮
            Button.borderRadius(6);
            // 注销账户按钮
            Button.onClick(() => {
                this.showDeleteConfirm = true;
            });
        }, Button);
        // 注销账户按钮
        Button.pop();
        // 功能按钮区域
        Column.pop();
        Column.pop();
        Scroll.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            // 注销确认对话框
            if (this.showDeleteConfirm) {
                this.ifElseBranchUpdateFunction(0, () => {
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Column.create();
                        Column.width('80%');
                        Column.padding(20);
                        Column.backgroundColor('#FFFFFF');
                        Column.borderRadius(10);
                        Column.shadow({ radius: 10, color: '#00000030', offsetX: 0, offsetY: 5 });
                        Column.position({ x: '10%', y: '30%' });
                    }, Column);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('确认注销账户');
                        Text.fontSize(18);
                        Text.fontWeight('bold');
                        Text.margin({ bottom: 10 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Text.create('注销后将永久删除您的账户及所有相关信息，无法恢复，请谨慎操作。');
                        Text.fontSize(14);
                        Text.fontColor('#666666');
                        Text.textAlign(TextAlign.Center);
                        Text.margin({ bottom: 20 });
                    }, Text);
                    Text.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Row.create({ space: 15 });
                        Row.width('100%');
                    }, Row);
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('取消');
                        Button.backgroundColor('#FFFFFF');
                        Button.border({ width: 1, color: '#CCCCCC' });
                        Button.fontColor('#333333');
                        Button.layoutWeight(1);
                        Button.onClick(() => {
                            this.showDeleteConfirm = false;
                        });
                    }, Button);
                    Button.pop();
                    this.observeComponentCreation2((elmtId, isInitialRender) => {
                        Button.createWithLabel('确认注销');
                        Button.backgroundColor('#F5222D');
                        Button.fontColor('#FFFFFF');
                        Button.layoutWeight(1);
                        Button.onClick(() => {
                            this.deleteAccount();
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
        return "ProfilePage";
    }
}
registerNamedRoute(() => new ProfilePage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/zonghezuoye/ProfilePage", pageFullPath: "entry/src/main/ets/pages/zonghezuoye/ProfilePage", integratedHsp: "false", moduleType: "followWithHap" });
