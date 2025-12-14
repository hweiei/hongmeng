import { promptAction, router } from '@kit.ArkUI';
import { common } from '@kit.AbilityKit';
import { DatabaseHelper } from './DatabaseHelper';
import { User } from './User';
import { GlobalContext } from '../../viewmodel/GlobalContext';
import http from '@ohos.net.http';

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

@Entry
@Component
struct ProfilePage {
  @State currentUser: User = new User('', ''); // 默认空用户
  @State showDeleteConfirm: boolean = false;
  @State loginHistory: User[] = []; // 登录历史记录
  @State isLoadingHistory: boolean = true;
  @State showHistoryDropdown: boolean = false; // 控制下拉列表显示状态
  
  private context = getContext(this) as common.UIAbilityContext;
  private dbHelper = DatabaseHelper.getInstance();

  async aboutToAppear() {
    console.log("ProfilePage aboutToAppear");
    // 从全局上下文中获取当前用户信息
    const user = GlobalContext.getContext().getObject('loggedInUser') as User | undefined;
    if (user) {
      this.currentUser = user;
      console.log("获取到当前用户:", user.toString());
    } else {
      console.log("未获取到当前用户");
    }
    
    // 初始化数据库
    try {
      console.log("开始初始化数据库");
      await this.dbHelper.initialize(this.context);
      console.log("数据库初始化成功");
      // 加载登录历史
      await this.loadLoginHistory();
    } catch (err) {
      console.error("数据库初始化失败:", err);
    }
  }

  // 加载登录历史
  private async loadLoginHistory() {
    try {
      this.isLoadingHistory = true;
      // 从后端获取登录历史
      await this.fetchLoginHistoryFromBackend();
      this.isLoadingHistory = false;
    } catch (err) {
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
    
    httpRequest.request(
      `${baseUrl}/users/login-history`,
      {
        method: http.RequestMethod.GET,
        header: { 'Content-Type': 'application/json' },
        readTimeout: 50000,
        connectTimeout: 50000
      },
      (err, data) => {
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
              } catch (parseErr) {
                console.error('JSON解析失败:', parseErr);
                promptAction.showToast({ message: '数据解析失败' });
                return;
              }
            } else {
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
            } else {
              const errorMsg = responseData ? (responseData.msg || '未知错误') : '响应数据为空';
              console.error('后端返回错误:', errorMsg);
              promptAction.showToast({ message: '获取登录历史失败: ' + errorMsg });
            }
          } catch (parseError) {
            console.error('解析响应数据失败:', parseError);
            promptAction.showToast({ message: '数据解析失败: ' + parseError.message });
          }
        } else {
          console.error('请求失败:' + JSON.stringify(err));
          const errorMsg = err.message || '未知网络错误';
          promptAction.showToast({ message: '网络请求失败: ' + errorMsg });
        }
        httpRequest.destroy();
      }
    );
  }

  // 切换用户
  private switchUser(user: User) {
    console.log("切换用户到:", user.toString());
    // 更新全局上下文中的用户信息
    GlobalContext.getContext().setObject('loggedInUser', user);
    // 更新当前用户状态
    this.currentUser = user;
    // 显示切换成功的提示
    promptAction.showToast({ message: `已切换到用户: ${user.username}` });
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
      await this.deleteUserFromBackend(this.currentUser.id);
    } catch (err) {
      console.error('注销账户失败:', err);
      promptAction.showToast({ message: '注销账户失败: ' + JSON.stringify(err) });
    } finally {
      // 无论成功与否都关闭确认对话框
      this.showDeleteConfirm = false;
      // 重新加载登录历史
      await this.loadLoginHistory();
    }
  }

  // 从后端删除用户
  private async deleteUserFromBackend(userId: number) {
    let httpRequest = http.createHttp();
    
    // 使用实际的IP地址替换localhost
    const baseUrl = "http://172.17.75.16:9588"; // 可以根据实际情况修改为开发机的实际IP
    
    // 构造删除用户的请求URL
    const url = `${baseUrl}/users/${userId}`;
    
    console.log('开始发送删除请求到:', url);
    
    httpRequest.request(
      url,
      {
        method: http.RequestMethod.DELETE,
        header: { 'Content-Type': 'application/json' },
        readTimeout: 50000,
        connectTimeout: 50000
      },
      (err, data) => {
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
              return;
            }
            
            // 尝试解析响应数据
            let responseData: DeleteResponse | undefined;
            if (typeof data.result === 'string') {
              try {
                responseData = JSON.parse(data.result) as DeleteResponse;
              } catch (parseErr) {
                console.error('JSON解析失败:', parseErr);
                promptAction.showToast({ message: '删除响应数据解析失败' });
                return;
              }
            } else {
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
            } else {
              const errorMsg = responseData ? (responseData.msg || '未知错误') : '响应数据为空';
              console.error('后端返回错误:', errorMsg);
              promptAction.showToast({ message: '账户注销失败: ' + errorMsg });
            }
          } catch (parseError) {
            console.error('解析响应数据失败:', parseError);
            promptAction.showToast({ message: '删除数据解析失败: ' + parseError.message });
          }
        } else {
          console.error('请求失败:' + JSON.stringify(err));
          const errorMsg = err.message || '未知网络错误';
          promptAction.showToast({ message: '删除请求失败: ' + errorMsg });
        }
        httpRequest.destroy();
      }
    );
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
      .justifyContent(FlexAlign.Start)
      
      // 页面标题
      Row() {
        Text('个人主页')
          .fontSize(22)
          .fontWeight('bold')
      }
      .width('100%')
      .padding({ top: 20, left: 20, right: 20 })
      .justifyContent(FlexAlign.Center)

      Scroll() {
        Column() {
          // 用户信息展示区域
          Column() {
            // 使用mine_normal.png作为用户头像
            Image($r('app.media.mine_normal'))
              .width(80)
              .height(80)
              .objectFit(ImageFit.Contain)
              .margin({ top: 30, bottom: 20 })
            
            // 用户名
            Text(this.currentUser.username || '未知用户')
              .fontSize(18)
              .fontWeight('500')
              .margin({ bottom: 30 })
            
            // 个人信息详情
            Column() {
              Text('个人信息')
                .fontSize(16)
                .fontWeight('bold')
                .textAlign(TextAlign.Start)
                .margin({ bottom: 15 })
              
              // 用户ID
              Row() {
                Text('用户ID:')
                  .fontSize(14)
                  .fontColor('#666666')
                  .width('30%')
                  .textAlign(TextAlign.Start)
                
                Text(`${this.currentUser.id ? this.currentUser.id.toString() : '未知'}`)
                  .fontSize(14)
                  .width('70%')
                  .textAlign(TextAlign.Start)
              }
              .width('100%')
              .margin({ bottom: 10 })
              
              // 用户名
              Row() {
                Text('用户名:')
                  .fontSize(14)
                  .fontColor('#666666')
                  .width('30%')
                  .textAlign(TextAlign.Start)
                
                Text(this.currentUser.username || '未知')
                  .fontSize(14)
                  .width('70%')
                  .textAlign(TextAlign.Start)
              }
              .width('100%')
              .margin({ bottom: 10 })
            }
            .width('90%')
            .padding(20)
            .backgroundColor('#FFFFFF')
            .borderRadius(10)
            .shadow({ radius: 5, color: '#00000010', offsetX: 0, offsetY: 2 })
            .margin({ bottom: 30 })
          }
          
          // 登录历史记录（下拉列表形式）
          Column() {
            Row() {
              Text('登录历史')
                .fontSize(16)
                .fontWeight('bold')
                .textAlign(TextAlign.Start)
              
              Blank()
              
              // 展开/收起图标
              Text(this.showHistoryDropdown ? '▲' : '▼')
                .fontSize(14)
                .fontColor('#999999')
            }
            .width('90%')
            .padding({ top: 15, bottom: 15 })
            .onClick(() => {
              this.showHistoryDropdown = !this.showHistoryDropdown;
              // 每次展开时重新加载数据
              if (this.showHistoryDropdown) {
                this.loadLoginHistory();
              }
            })
            
            // 下拉列表内容
            if (this.showHistoryDropdown) {
              Column() {
                if (this.isLoadingHistory) {
                  // 加载中提示
                  Row() {
                    Progress({ value: 50, total: 100, type: ProgressType.Capsule })
                      .width(20)
                      .height(20)
                      .color('#1890FF')
                    
                    Text('加载中...')
                      .fontSize(14)
                      .fontColor('#666666')
                      .margin({ left: 10 })
                  }
                  .width('100%')
                  .justifyContent(FlexAlign.Center)
                  .padding(15)
                } else if (this.loginHistory.length === 0) {
                  // 空列表提示
                  Text('暂无登录历史')
                    .fontSize(14)
                    .fontColor('#666666')
                    .padding(15)
                } else {
                  // 历史用户列表
                  ForEach(this.loginHistory, (user: User, index: number) => {
                    Row() {
                      Column({ space: 5 }) {
                        Text(`用户名: ${user.username}`)
                          .fontSize(14)
                          .fontWeight('500')
                        
                        Text(`用户ID: ${user.id}`)
                          .fontSize(12)
                          .fontColor('#666666')
                      }
                      .flexGrow(1)
                      
                      // 如果是当前用户，显示"当前"标签
                      if (user.id === this.currentUser.id) {
                        Text('当前')
                          .fontSize(12)
                          .fontColor('#1890FF')
                          .border({ width: 1, color: '#1890FF' })
                          .borderRadius(4)
                          .padding({ left: 5, right: 5 })
                      }
                    }
                    .padding(15)
                    .backgroundColor('#FAFAFA')
                    .borderRadius(8)
                    .margin({ left: 15, right: 15, top: 5, bottom: 5 })
                    .onClick(() => {
                      // 点击用户项切换用户
                      this.switchUser(user);
                    })
                  }, (user: User) => user.id?.toString() || '')
                }
              }
              .width('100%')
              .padding({ bottom: 15 })
            }
          }
          .width('90%')
          .backgroundColor('#FFFFFF')
          .borderRadius(10)
          .shadow({ radius: 5, color: '#00000010', offsetX: 0, offsetY: 2 })
          .margin({ bottom: 30 })
          
          // 功能按钮区域
          Column({ space: 15 }) {
            // 退出登录按钮
            Button('退出登录')
              .backgroundColor('#F5222D')
              .fontColor('#FFFFFF')
              .width('90%')
              .height(45)
              .borderRadius(6)
              .onClick(() => {
                this.logout();
              })
            
            // 注销账户按钮
            Button('注销账户')
              .backgroundColor('#FFFFFF')
              .border({ width: 1, color: '#F5222D' })
              .fontColor('#F5222D')
              .width('90%')
              .height(45)
              .borderRadius(6)
              .onClick(() => {
                this.showDeleteConfirm = true;
              })
          }
          .width('100%')
        }
        .width('100%')
      }
      .layoutWeight(1)
      
      // 注销确认对话框
      if (this.showDeleteConfirm) {
        Column() {
          Text('确认注销账户')
            .fontSize(18)
            .fontWeight('bold')
            .margin({ bottom: 10 })
          
          Text('注销后将永久删除您的账户及所有相关信息，无法恢复，请谨慎操作。')
            .fontSize(14)
            .fontColor('#666666')
            .textAlign(TextAlign.Center)
            .margin({ bottom: 20 })
          
          Row({ space: 15 }) {
            Button('取消')
              .backgroundColor('#FFFFFF')
              .border({ width: 1, color: '#CCCCCC' })
              .fontColor('#333333')
              .layoutWeight(1)
              .onClick(() => {
                this.showDeleteConfirm = false;
              })
            
            Button('确认注销')
              .backgroundColor('#F5222D')
              .fontColor('#FFFFFF')
              .layoutWeight(1)
              .onClick(() => {
                this.deleteAccount();
              })
          }
          .width('100%')
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