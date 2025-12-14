import { promptAction, router } from '@kit.ArkUI';
import { DatabaseHelper } from './DatabaseHelper';
import { User } from './User'
import { common } from '@kit.AbilityKit';
import { UserService } from '../../common/utils/UserService';


@Entry
@Component
struct RegisterPage {
  // 用户输入状态变量
  @State username: string = '';
  @State password: string = '';
  @State confirmPassword: string = '';
  @State email: string = '';
  @State phone: string = '';
  @State gender: string = 'male'; // 性别选择
  @State hobbies: Array<string> = [];

  // 表单验证错误状态
  @State isAgreed: boolean = false;
  @State showPasswordError: boolean = false; // 密码错误
  @State showPasswordError_confirm: boolean = false; // 密码错误
  @State showEmailError: boolean = false; // 邮箱错误
  @State showPhoneError: boolean = false; // 手机号错误
  @State showUsernameError: boolean = false; // 用户名错误
  @State showError: string = '请检查是否有未填写的信息！';
  // 表单验证正则表达式
  private readonly usernamePattern = /^[a-zA-Z0-9]{4,16}$/;
  private readonly passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/;
  // 长度在6-20个字符之间
  // 只能包含字母、数字和特殊符号（!@#$%^&*）
  private readonly emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  private readonly phonePattern = /^1[3-9]\d{9}$/;

  // 使用单例模式获取数据库实例
  private dbHelper = DatabaseHelper.getInstance();

  @State users: User[] = [];
  @State selectedUserId: number = 0;

  async onPageShow() {
  try {
    const context = getContext(this) as common.UIAbilityContext;

    await this.dbHelper.initialize(context); // 传入页面上下文
    this.users = await this.dbHelper.queryAllUsers();
    console.log('数据库初始化成功，当前用户数：', this.users.length);
  } catch (err) {
    console.error('页面初始化数据库失败：', err);
    promptAction.showToast({ message: '数据库连接失败' });
  }
}
  onPageHide(): void {
    this.dbHelper.close()
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
    } else {
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

  build() {
    // 主容器列布局
    Column({}) {
      // 行布局
      Row() {
        // 返回按钮区域
        Image($r('app.media.ic_back'))
          .width(24)
          .height(24)
          .margin({ top: 10, left: 20 })
          .onClick(() => {
            router.back();  // 返回到上一页
          });
      }
      .width('100%')
      .justifyContent(FlexAlign.Start);

      // 页面标题
      Text('用户注册')
        .fontSize(22)
        .fontWeight(500)
        .margin({ top: 30, bottom: 40 });

      // 表单输入区域
      Column() {
        // 用户名输入框
        TextInput({ placeholder: '用户名', text: this.username })
          .width('88%')
          .height(45)
          .borderRadius(6)
          .padding({ left: 20 })
          .onChange((value: string) => {
            this.username = value;
            this.validateUsername(); // 确保格式正确
          })
          .backgroundColor(this.showUsernameError ? '#FFEBEE' : ''); // true--用户名错误

        // 用户名错误提示
        Text(this.showUsernameError ? '用户名长度需为4-16字符' : '')
          .fontSize(12)
          .fontColor('#F44336')
          .margin({ top: 5 });

        // 密码输入框
        TextInput({ placeholder: '设置密码', text: this.password })
          .width('88%')
          .height(45)
          .borderRadius(6)
          .onChange((value: string) => {
            this.password = value;
            this.validatePassword();
          })
          .type(InputType.Password)
          .margin({ top: 5 })
          .padding({ left: 20 })
          .backgroundColor(this.showPasswordError ? '#FFEBEE' : ''); // true--密码错误

        // 密码错误提示
        Text(this.showPasswordError ? '密码长度需为6-20字符' : '')
          .fontSize(12)
          .fontColor('#F44336')
          .margin({ top: 5 });

        // 确认密码输入框
        TextInput({ placeholder: '确认密码', text: this.confirmPassword })
          .width('88%')
          .height(45)
          .borderRadius(6)
          .type(InputType.Password)
          .margin({ top: 5 })
          .padding({ left: 20 })
          .onChange((value: string) => {
            this.confirmPassword = value;
            this.validateConfirmPassword();
          });

        // 确认密码错误提示
        Text(this.showPasswordError_confirm ? '两次密码不一致' : '') // 密码错误--提示信息
          .fontSize(12)
          .fontColor('#F44336')
          .margin({ top: 5 });

        // 邮箱输入框
        TextInput({ placeholder: '电子邮箱', text: this.email })
          .width('88%')
          .height(45)
          .margin({ top: 5 })
          .borderRadius(6)
          .padding({ left: 20 })
          .onChange((value: string) => {
            this.email = value;
            this.validateEmail(); // 确保格式正确
          })
          .backgroundColor(this.showEmailError ? '#FFEBEE' : ''); // true--邮箱错误

        // 邮箱错误提示
        Text(this.showEmailError ? '请输入正确的邮箱格式' : '') // 邮箱错误--提示信息
          .fontSize(12)
          .fontColor('#F44336')
          .margin({ top: 5 });

        // 手机号输入框
        TextInput({ placeholder: '手机号码（可选）', text: this.phone })
          .onChange((value: string) => {
            this.phone = value;
            this.validatePhone();
          })
          .width('88%')
          .height(45)
          .margin({ top: 5 })
          .borderRadius(6)
          .padding({ left: 20 })
          .backgroundColor(this.showPhoneError ? '#FFEBEE' : '')
          .borderColor(this.showPhoneError ? '#F44336' : '');

        // 手机号错误提示
        Text(this.showPhoneError ? '请输入正确的手机号格式' : '')
          .fontSize(12)
          .fontColor('#F44336')
          .margin({ top: 5 });
      }

      // Radio性别选择区域
      Row() {
        Text('性别：')
          .fontSize(16)
          .margin({ right: 10 });

        Radio({ value: 'male', group: 'gender' })
          .checked(this.gender == 'male') // true--性别为男
          .margin({ left: 10 })
          .onChange(() => {
            this.gender = 'male';
          });

        Text('男')
          .fontSize(16)
          .margin({ left: 5 });

        Radio({ value: 'female', group: 'gender' })
          .checked(this.gender === 'female')
          .margin({ left: 10 })
          .onChange(() => {
            this.gender = 'female';
          });

        Text('女')
          .fontSize(16)
          .margin({ left: 5 });
      }
      .margin({ top: 5 });

      // 兴趣爱好选择区域
      Column() {
        Text('兴趣爱好：')
          .fontSize(16)
          .margin({ bottom: 10 });

        Flex({ justifyContent: FlexAlign.SpaceEvenly }) {
          Checkbox({ name: '编程', group: 'checkboxGroup' })
            .select(false)
            .selectedColor("#409EFF")
            .shape(CheckBoxShape.ROUNDED_SQUARE)
            .onChange((value: boolean) => {
              console.info('Checkbox1 change is' + value);
            });

          Text('编程').fontSize(20)
            .margin({ top: 2 });

          Checkbox({ name: '阅读', group: 'checkboxGroup' })
            .select(false)
            .selectedColor("#409EFF")
            .shape(CheckBoxShape.ROUNDED_SQUARE)
            .onChange((value: boolean) => {
              console.info('Checkbox2 change is' + value);
            });

          Text('阅读').fontSize(20)
            .margin({ top: 2 });

          Checkbox({ name: '运动', group: 'checkboxGroup' })
            .select(false)
            .selectedColor("#409EFF")
            .shape(CheckBoxShape.ROUNDED_SQUARE)
            .onChange((value: boolean) => {
              console.info('Checkbox2 change is' + value);
            });

          Text('运动').fontSize(20)
            .margin({ top: 2 });
        }
      }
      .margin({ top: 15 })
      .width('90%');

      // 用户协议同意区域
      Row() {
        Checkbox()
          .onChange((value: boolean) => {
            this.isAgreed = value;
          });

        Text('同意《用户协议》')
          .fontColor('#409EFF')
          .margin({ left: 10 });
      }
      .margin({ top: 25 });

      // 注册按钮
      Button('立即注册', { type: ButtonType.Capsule })
        .width('90%')
        .height(45)
        .onClick(async() => {
          console.log(`注册：${this.username}/${this.password}`);

          if (!this.isAgreed) {
            promptAction.showToast({
              message: '请同意用户协议'
            });
            return;
          }

          this.register()

        })


        .margin({ top: 30 });
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F8F9FA');
  }
}
