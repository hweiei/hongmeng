import { promptAction, router } from '@kit.ArkUI';
import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { DatabaseHelper } from './DatabaseHelper'
import { User } from './User'
import { UserService } from '../../common/utils/UserService';

@Entry
@Component
struct ForgetPasswordPage {
  // 页面状态变量
  @State username: string = '';
  @State verificationCode: string = '';
  @State newPassword: string = '';
  @State confirmPassword: string = '';
  @State step: number = 1; // 1: 验证身份, 2: 重置密码
  @State showUsernameError: boolean = false;
  @State showVerificationError: boolean = false;
  @State showPasswordError: boolean = false;
  @State showConfirmError: boolean = false;
  @State countdown: number = 0;
  @State buttonText: string = '获取验证码';
  @State isButtonDisabled: boolean = false;

  // 定时器引用
  private countdownTimer: number | null = null;

  // 获取应用上下文和偏好设置实例
  private context = getContext(this) as common.UIAbilityContext;
  private dbHelper = DatabaseHelper.getInstance();
  private generatedCode: string = ''; // 生成的验证码

  // 页面初始化时初始化数据库
  async onPageShow() {
    try {
      await this.dbHelper.initialize(this.context);
    } catch (err) {
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
  private readonly usernamePattern = /^[a-zA-Z0-9]{4,16}$/;
  private readonly passwordPattern = /^[a-zA-Z0-9!@#$%^&*]{6,20}$/;

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

    // 直接通过网络服务检查用户是否存在，而不是检查本地数据库
    try {
      // 这里应该调用一个验证用户是否存在的API
      // 临时跳过本地用户检查，直接进入发送验证码环节
      // 生成验证码
      this.generateVerificationCode();

      // 模拟发送验证码
      promptAction.showToast({
        message: `验证码已发送，请注意查收: ${this.generatedCode}`
      });

      // 开始倒计时
      this.startCountdown();
    } catch (error) {
      this.showUsernameError = true;
      promptAction.showToast({
        message: '用户名不存在'
      });
      return;
    }
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
    } else {
      this.showPasswordError = false;
    }

    // 验证确认密码
    if (this.confirmPassword !== this.newPassword) {
      this.showConfirmError = true;
      isValid = false;
    } else {
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
      // 使用 UserService 同步更新密码
      const userService = new UserService();
      const success: boolean = await userService.updatePassword(this.username, this.newPassword);

      if (success) {
        promptAction.showToast({
          message: '密码重置成功',
          duration: 2000
        });

        // 返回登录页面
        setTimeout(() => {
          router.back();
        }, 2000);
      } else {
        promptAction.showToast({
          message: '密码重置失败，请重试'
        });
      }
    } catch (err) {
      console.error('更新密码失败:', err);
      promptAction.showToast({
        message: '密码重置失败，请重试'
      });
    }
  }

  // 第一步：验证身份
  @Builder
  private buildStep1() {
    Column() {
      Text('验证身份')
        .fontSize(22)
        .fontWeight(500)
        .margin({ top: 30, bottom: 40 })

      TextInput({ placeholder: "请输入用户名", text: this.username })
        .borderRadius(6)
        .width('88%')
        .height(45)
        .padding({ left: 20 })
        .onChange((value: string) => {
          this.username = value;
          this.showUsernameError = this.username.length > 0 && !this.usernamePattern.test(this.username);
        })

      // 用户名错误提示
      Text(this.showUsernameError ? '用户名格式错误' : '')
        .fontSize(12)
        .fontColor('#F44336')
        .margin({ top: 5 })

      // 验证码输入框和获取按钮
      Row({ space: 10 }) {
        TextInput({ placeholder: "请输入验证码", text: this.verificationCode })
          .borderRadius(6)
          .width('60%')
          .height(45)
          .padding({ left: 20 })
          .onChange((value: string) => {
            this.verificationCode = value;
            this.showVerificationError = false;
          })

        Button(this.buttonText)
          .backgroundColor(this.isButtonDisabled ? '#CCCCCC' : '#409EFF')
          .width('40%')
          .height(45)
          .fontSize(14)
          .enabled(!this.isButtonDisabled && this.username !== '')

          .onClick(() => {
            this.getVerificationCode();
          })
      }
      .width('88%')
      .margin({ top: 20 })

      // 验证码错误提示
      Text(this.showVerificationError ? '验证码错误' : '')
        .fontSize(12)
        .fontColor('#F44336')
        .margin({ top: 5 })

      // 下一步按钮
      Button('下一步')
        .backgroundColor('#409EFF')
        .width('90%')
        .margin({ top: 40 })
        .padding(15)
        .fontSize(20)
        .onClick(() => {
          if (this.verifyCode()) {
            this.step = 2; // 进入第二步：重置密码
          }
        })
    }
  }

  // 第二步：重置密码
  @Builder
  private buildStep2() {
    Column() {
      Text('重置密码')
        .fontSize(22)
        .fontWeight(500)
        .margin({ top: 30, bottom: 40 })

      // 新密码输入框
      TextInput({ placeholder: "请输入新密码", text: this.newPassword })
        .borderRadius(6)
        .width('88%')
        .height(45)
        .padding({ left: 20 })
        .type(InputType.Password)
        .onChange((value: string) => {
          this.newPassword = value;
          this.showPasswordError = this.newPassword.length > 0 && !this.passwordPattern.test(this.newPassword);
          this.showConfirmError = this.confirmPassword !== '' && this.confirmPassword !== this.newPassword;
        })

      // 新密码错误提示
      Text(this.showPasswordError ? '密码长度需为6-20字符' : '')
        .fontSize(12)
        .fontColor('#F44336')
        .margin({ top: 5 })

      // 确认密码输入框
      TextInput({ placeholder: "请再次输入新密码", text: this.confirmPassword })
        .borderRadius(6)
        .width('88%')
        .height(45)
        .padding({ left: 20 })
        .type(InputType.Password)
        .margin({ top: 20 })
        .onChange((value: string) => {
          this.confirmPassword = value;
          this.showConfirmError = this.confirmPassword !== this.newPassword;
        })

      // 确认密码错误提示
      Text(this.showConfirmError ? '两次输入的密码不一致' : '')
        .fontSize(12)
        .fontColor('#F44336')
        .margin({ top: 5 })

      // 重置密码按钮
      Button('重置密码')
        .backgroundColor('#409EFF')
        .width('90%')
        .margin({ top: 40 })
        .padding(15)
        .fontSize(20)
        .onClick(() => {
          this.updatePassword();
        })

      // 返回按钮
      Button('返回')
        .backgroundColor('#FFFFFF')
        .border({ width: 1, color: '#409EFF' })
        .fontColor('#409EFF')
        .width('90%')
        .margin({ top: 20 })
        .padding(15)
        .fontSize(20)
        .onClick(() => {
          this.step = 1; // 返回第一步
        })
    }
  }

  build() {
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

      // 根据当前步骤显示不同内容
      if (this.step === 1) {
        this.buildStep1();
      } else {
        this.buildStep2();
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor(Color.White)
  }
}