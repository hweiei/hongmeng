// import { router } from '@kit.ArkUI';
//
// @Entry
// @Component
// struct IndexPage {
//   @State message: string = 'Hello User,this is an application ';
//
//   build() {
//     Column({ space: 20 }) {
//       SwipperFun()
//       Button('立即注册', { type: ButtonType.Capsule })
//         .width('50%')
//         .height(45)
//         .onClick(() => {
//           router.pushUrl({ url: 'pages/zonghezuoye/RegisterPage' });
//         })
//         .margin({ top: 150 })
//
//       Button('立即登录', { type: ButtonType.Capsule })
//         .width('50%')
//         .height(45)
//         .onClick(() => {
//           router.pushUrl({ url: 'pages/zonghezuoye/LoginPage' });
//         })
//
//     }
//     .height('100%')
//     .width('100%')
//   }
// }
//
//   /**Swipper轮播组件
//    */
// @Component
// struct SwipperFun{
//
//   build() {
//     Swiper() {
//       Image($r('app.media.1'))
//       Image($r('app.media.2'))
//       Image($r('app.media.3'))
//     }.width('94%').height(200).margin(10).borderRadius(10)
//     .loop(true).autoPlay(true).interval(1000)
//     .indicator( new DotIndicator()
//       .itemWidth(15)
//       .itemHeight(15)
//       .selectedItemWidth(15)
//       .selectedItemHeight(15)
//       .color(Color.Gray)
//       .selectedColor(Color.Blue )
//     )
//     .onChange((index:number)=>{
//       console.log("index:",index)
//     })
//   }
// }
// /**
//  */
import { router } from '@kit.ArkUI';

@Entry
@Component
struct IndexPage {
  @State message: string = '简约记录生活';


  build() {
    Column({ space: 25 }) {
      // 主内容列布局，设置元素间距
      Column() {
        Blank()
        // 标题区域
        Text('简记')
          .fontSize(60)
          .fontWeight(FontWeight.Bold)
          .fontColor(Color.White)
          .margin({ top: 30 })
          .textShadow({ radius: 2, color: Color.Black, offsetX: 1, offsetY: 1 })

        Text(this.message)
          .fontSize(16)
          .fontColor(Color.White)
          .margin({ top: 10 })
          .textShadow({ radius: 1, color: Color.Black, offsetX: 0.5, offsetY: 0.5 })
      }
      .alignItems(HorizontalAlign.Center)

      // 轮播图组件
      SwiperFun()

      // 功能按钮区域
      Column({ space: 20 }) {
        Blank()
        Blank()

        Button('立即注册')
          .type(ButtonType.Capsule)
          .width('80%')
          .height(50)
          .backgroundColor('#1890FF')
          .fontColor(Color.White)
          .onClick(() => {
            router.pushUrl({ url: 'pages/zonghezuoye/RegisterPage' });
          })

        Button('立即登录')
          .type(ButtonType.Capsule)
          .width('80%')
          .height(50)
          .backgroundColor('#52C41A')
          .fontColor(Color.White)
          .onClick(() => {
            router.pushUrl({ url: 'pages/zonghezuoye/LoginPage' });
          })
        // Button('用户管理')
        //   .type(ButtonType.Capsule)
        //   .width('80%')
        //   .height(50)
        //   .backgroundColor('#722ED1')
        //   .fontColor(Color.White)
        //   .onClick(() => {
        //     router.pushUrl({ url: 'pages/zonghezuoye/UserListPage' });
        //   })
        //
        // // 新增笔记发布按钮
        // Button('笔记发布')
        //   .type(ButtonType.Capsule)
        //   .width('80%')
        //   .height(50)
        //   .backgroundColor('#FF6666')
        //   .fontColor(Color.White)
        //   .onClick(() => {
        //     router.pushUrl({ url: 'pages/MainPage' });
        //   })
      }
      .margin({ top: 30 })



    }
    .width('100%')
    .height('100%')
    .alignItems(HorizontalAlign.Center)
    // 设置背景图片
    .backgroundImage($r('app.media.zhuyebizhi'))
    .backgroundImageSize(ImageSize.Cover)

  }


}

/**Swipper轮播组件
 */
@Component
struct SwiperFun {
  build() {
    // 创建轮播容器
    Swiper() {
      // 循环渲染三张图片
      ForEach([1, 2, 3], (index: number) => {
        Column() {
          Image($r(`app.media.${index}`))
            .objectFit(ImageFit.Cover)
            .width('100%')
            .height(180)
        }
        .padding(20)
        .backgroundColor('#00dddddd')

      })
    }
    .width('90%')
    .height(240)
    .margin({ top: 20 })
    .loop(true)// 循环播放
    .autoPlay(true) // 自动播放
    .interval(3000)  // 播放间隔3秒
    .indicator( // 设置指示器样式
      new DotIndicator()
        .itemWidth(12)
        .itemHeight(12)
        .selectedItemWidth(20)
        .selectedItemHeight(12)
        .color('#DDDDDD')
        .selectedColor('#1890FF')
    )
    .onChange((index: number) => {
      console.log("当前轮播索引:", index);
    })
  }
}