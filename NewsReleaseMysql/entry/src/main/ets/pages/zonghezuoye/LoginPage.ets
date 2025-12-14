import { promptAction, router } from '@kit.ArkUI';
import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { DatabaseHelper } from './DatabaseHelper'
import { User } from './User'
import { GlobalContext } from '../../viewmodel/GlobalContext';
import { UserService } from '../../common/utils/UserService';


@Entry
@Component
struct LoginPage {
  // 登录表单状态变量
  @State username: string = '';
  @State password: string = '';
  @State rememberMe: boolean = false;
  @State showPasswordError: boolean = false;
  @State showAccountList: boolean = false;
  @State users: User[] = []; // 移除了@Prop装饰器，改为@State
  @State showUsernameError: boolean = false;
  // 获取应用上下文和偏好设置实例
  private context = this.getUIContext()
    .getHostContext() as common.UIAbilityContext;
  private preferences = preferences
    .getPreferencesSync(this.context, { name: 'Setting' });
  private dbHelper = DatabaseHelper.getInstance();

  async deleteUser(userId: number) {
    const rowsDeleted = await this.dbHelper.deleteUser(userId);
    if (rowsDeleted > 0) {
      this.users = await this.dbHelper.queryAllUsers();
    }
  }

  onPageHide(): void {
    this.dbHelper.close()
  }
  async updateUser(user:User,userId:number)
  {
    const rowsUpdated=await this.dbHelper.updateUser(user,userId);
    if (rowsUpdated > 0) {
      this.users = await this.dbHelper.queryAllUsers();
    }
  }

  // 页面初始化时从偏好设置加载保存的账号信息
  aboutToAppear(): void {
    //从首选项读取保存的用户名和密码信息
    let savepassword = this.preferences.getSync('password', '')
    let saveusername = this.preferences.getSync('account', '')
    // 将所获取到的用户名和密码信息信息保存到组件状态变量 username和 password 中
    this.password = savepassword.toString() //状态变量
    this.username = saveusername.toString() //状态变量
  }

  // 页面显示时处理路由传参
  async onPageShow() { //?
    try {
    const context = getContext(this) as common.UIAbilityContext;
    await this.dbHelper.initialize(context);
    this.users = await this.dbHelper.queryAllUsers();
    const params = this.getUIContext().getRouter()
      .getParams()as Record<string, string | undefined>
    if (params) {
      this.username = params['username'] || '';
      this.password = params['password'] ?? ''
    }
  }catch (err) {
      console.error('数据库初始化失败:', err);
    }
  }

  // 表单验证正则表达式
  // 用户名验证规则：4-16位字母或数字
  private readonly usernamePattern = /^[a-zA-Z0-9]{4,16}$/;
  private readonly passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/;

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
      })
      return;
    }

    // 显示登录中提示
    promptAction.showToast({
      message: '登录中...',
      duration: 1000
    });

    // 使用 UserService 进行混合登录验证（网络优先，本地备用）
    const userService = new UserService();
    const matchedUser = await userService.login(this.username, this.password);

    if (matchedUser) {
      // 登录成功
      promptAction.showToast({
        message: '登录成功',
        duration: 2000
      });

      // 将用户信息保存到全局上下文
      GlobalContext.getContext().setObject('loggedInUser', matchedUser);

      // 跳转到主页面
      this.getUIContext().getRouter().pushUrl({ url: 'pages/MainPage' });

      // 根据"记住我"选项处理用户信息存储
      if (this.rememberMe) {
        this.preferences.putSync('account', this.username);
        this.preferences.putSync('password', this.password);
        this.preferences.flush();
      } else {
        this.preferences.deleteSync('account');
        this.preferences.deleteSync('password');
        this.preferences.flush();
      }
    } else {
      // 登录失败
      promptAction.showToast({
        message: '用户名或密码错误',
        duration: 2000
      });
    }
  }


  build() {

    // 主页面列布局
    Column() {
      Row() {
        Image($r('app.media.ic_back'))
          .width(24)
          .height(24)
          .margin({ top: 10, left: 20 })
          .onClick(() => {
            router.back(); // 返回到上一页
          })
      }
      .width('100%')
      .justifyContent(FlexAlign.Start)

      // 登录标题
      Text('用户登录')
        .fontSize(22)
        .fontWeight(500)
        .margin({ top: 30, bottom: 40 })

      // 用户名输入框
      TextInput({ placeholder: "用户名/邮箱", text: this.username })
        .borderRadius(6)
        .width('88%')
        .height(45)
        .onChange((value: string) => { //value是输入框的值，this.username是username的初始值，this.username=value
          this.username = value;
          this.showUsernameError = this.username.length > 0 &&
            !this.users.some(user => user.username === this.username);

        })


      // 密码输入框
        TextInput({ placeholder: "请输入密码", text: this.password })
          .width('88%')
          .height('45')
          .borderRadius(6)
          .type(InputType.Password)
          .margin({ top: 20 })
          .padding({ left: 20 })

          .onChange((value: string) => {
            this.password = value;
            this.validateForm();
          })
          .onChange(value => this.password = value)

          .backgroundColor(this.showPasswordError ? '#FFEBEE' : '')
        // 密码错误提示信息
        Text(this.showPasswordError ? '密码长度需为6-20字符' : '')
          .fontSize(12)
          .fontColor('#F44336')
          .margin({ top: 5 })

        // 记住我选项
        Row() {
          Toggle({ type: ToggleType.Checkbox, isOn: this.rememberMe })
            .onChange(val => this.rememberMe = val)
          Text('记住我')
            .fontSize(14)
            .margin({ left: 10 })
        }
        .width('100%')
        .justifyContent(FlexAlign.Start)
        .margin({ left: '15%', top: 15, bottom: 0 })

        // 登录按钮
        Button('立即登录')
          .backgroundColor('#409EFF')
          .width('90%')
          .margin({ top: 20 })
          .padding(15)
          .fontSize(20)
          .onClick(() => {
            this.login();

          })

        // 忘记密码和新用户注册链接
        Flex({ justifyContent: FlexAlign.SpaceBetween }) {
          Text('忘记密码')
            .fontColor('#409EFF')
            .onClick(() => {
              router.pushUrl({ url: 'pages/zonghezuoye/ForgetPage' });
            })
          Text('新用户注册').fontColor('#409EFF')
            .onClick(() => {
              router.pushUrl({ url: 'pages/zonghezuoye/RegisterPage' });
            })
        }
        .height('100%')
        .width('100%')
        .padding(20)
        .backgroundColor(Color.White)
      }
    }

  }