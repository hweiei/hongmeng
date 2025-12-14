import { promptAction, router, } from '@kit.ArkUI';
import { common } from '@kit.AbilityKit';
import { DatabaseHelper } from './DatabaseHelper';
import { User } from './User';

@Entry
@Component
struct UserListPage {
  // 用户列表状态
  @State users: User[] = [];
  @State isLoading: boolean = true;
  @State selectedUser: User | null = null;
  @State showEditDialog: boolean = false;
  @State newPassword: string = '';
  @State showPasswordError: boolean = false;

  // 获取应用上下文
  private context = getContext(this) as common.UIAbilityContext;
  private dbHelper = DatabaseHelper.getInstance();

  // 页面显示时加载用户列表
  async onPageShow() {
    try {
      await this.dbHelper.initialize(this.context);
      this.loadUsers();
    } catch (err) {
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
      console.log('加载用户列表:', JSON.stringify(this.users));
      this.isLoading = false;
    } catch (err) {
      console.error('加载用户列表失败:', err);
      promptAction.showToast({ message: '加载用户列表失败' });
      this.isLoading = false;
    }
  }

  // 删除用户
  private async deleteUser(userId: number) {
    console.log('开始删除用户，用户ID:', userId);
    try {
      const rowsDeleted = await this.dbHelper.deleteUser(userId);
      console.log('删除操作完成，影响行数:', rowsDeleted);
      if (rowsDeleted > 0) {
        promptAction.showToast({ message: '用户删除成功' });
        this.loadUsers(); // 重新加载用户列表
      } else {
        promptAction.showToast({ message: '用户删除失败' });
      }
    } catch (err) {
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
    } else {
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
      } else {
        promptAction.showToast({ message: '密码更新失败' });
      }
    } catch (err) {
      console.error('更新密码失败:', err);
      promptAction.showToast({ message: '更新密码失败' });
    }
  }

  // 退出登录
  private logout() {
    router.pushUrl({ url: 'pages/zonghezuoye/LoginPage' });
  }

  build() {
    Column() {
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
      // 页面标题和退出按钮
      Row({ space: 20 }) {
        Text('用户管理')
          .fontSize(22)
          .fontWeight('bold')

        Button( '退出登录' )
          .backgroundColor('#F5222D')
          .fontColor('#FFFFFF')
          .padding({ left: 15, right: 15 })
          .onClick(() => {
            this.logout();
          })
      }
      .width('100%')
      .padding({ top: 20, left: 20, right: 20 })
      .justifyContent(FlexAlign.SpaceBetween)

      // 用户列表
      if (this.isLoading) {
        // 加载中提示
        Column() {
          Progress({ value: 50, total: 100, type: ProgressType.Capsule })
            .width(40)
            .height(40)
            .color('#1890FF')

          Text('加载中...')
            .fontSize(14)
            .fontColor('#666666')
            .margin({ top: 10 })
        }
        .margin({ top: 100 })
      } else if (this.users.length === 0) {
        // 空列表提示
        Text('暂无用户数据')
          .fontSize(16)
          .fontColor('#666666')
          .margin({ top: 100 })
      } else {
        // 用户列表
        List() {
          ForEach(this.users, (user: User) => {
            ListItem() {
              Row({ space: 10 }) {
                Column({ space: 5 }) {
                  Text(`用户名: ${user.username}`)
                    .fontSize(16)
                    .fontWeight('500')

                  Text(`用户ID: ${user.id}`)
                    .fontSize(12)
                    .fontColor('#666666')
                }
                .flexGrow(1)

                Column({ space: 10 }) {
                  Button('修改密码' )
                    .backgroundColor('#1890FF')
                    .fontColor('#FFFFFF')
                    .padding({ left: 15, right: 15 })
                    .onClick(() => {
                      this.openEditDialog(user);
                    })

                  Button( '删除' )
                    .backgroundColor('#F5222D')
                    .fontColor('#FFFFFF')
                    .padding({ left: 15, right: 15 })
                    .onClick(() => {
                      console.log('点击删除按钮，用户ID:', user.id);
                      this.deleteUser(user.id as number);
                    })
                }
              }
              .padding(15)
              .backgroundColor('#FFFFFF')
              .borderRadius(10)
              .margin({ left: 15, right: 15, top: 10 })
              .shadow({ radius: 5, color: '#00000010', offsetX: 0, offsetY: 2 })
            }
          }, (user: User) => user.id?.toString() || '')
        }
        .width('100%')
        .margin({ top: 20 })
      }

      // 修改密码对话框
      if (this.showEditDialog && this.selectedUser) {
        Column() {
          Text(`修改 ${this.selectedUser.username} 的密码`)
            .fontSize(18)
            .fontWeight('bold')
            .margin({ bottom: 20 })

          TextInput({ placeholder: '请输入新密码', text: this.newPassword })
            .borderRadius(6)
            .width('100%')
            .height(45)
            .type(InputType.Password)
            .padding({ left: 20 })
            .backgroundColor(this.showPasswordError ? '#FFEBEE' : '')
            .onChange((value: string) => {
              this.newPassword = value;
              this.showPasswordError = false;
            })

          Text(this.showPasswordError ? '密码长度需为6-20位字母、数字或特殊字符' : '')
            .fontSize(12)
            .fontColor('#F44336')
            .margin({ top: 5 })

          Row({ space: 15 }) {
            Button('取消' )
              .backgroundColor('#FFFFFF')
              .border({ width: 1, color: '#CCCCCC' })
              .fontColor('#333333')
              .width('50%')
              .onClick(() => {
                this.closeEditDialog();
              })

            Button('确认' )
              .backgroundColor('#1890FF')
              .fontColor('#FFFFFF')
              .width('50%')
              .onClick(() => {
                this.updateUserPassword();
              })
          }
          .margin({ top: 20 })
        }
        .width('80%')
        .padding(20)
        .backgroundColor('#FFFFFF')
        .borderRadius(10)
        .shadow({ radius: 10, color: '#00000030', offsetX: 0, offsetY: 5 })
        .position({ x: '10%', y: '30%' })
      }
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}