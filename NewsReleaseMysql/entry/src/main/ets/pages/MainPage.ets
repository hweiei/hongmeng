import Constants from '../common/constants/Constants';
import NewsList from '../view/NewsList';
import { router } from '@kit.ArkUI';
import NewsTypeViewModel from '../viewmodel/NewsTypeViewModel';
import NewsTypeBean from '../viewmodel/NewsTypeModel';
import { GlobalContext } from '../viewmodel/GlobalContext';
import { User } from '../pages/zonghezuoye/User';

/**
 * 主页 - 新闻列表页面
 */
@Entry
@Component
struct MainPage {
  @State tabBarArray: NewsTypeBean[] = NewsTypeViewModel.getDefaultTypeList();
  @State currentIndex: number = 0;

  aboutToAppear() {
    // 请求新闻分类
    NewsTypeViewModel.getNewsTypeList().then((typeList: NewsTypeBean[]) => {
      this.tabBarArray = typeList;
    });
  }

  onPageShow() {
    if (GlobalContext.getContext().getObject('isBackRouter') === true) {
      GlobalContext.getContext().setObject('isBackRouter', false);
      let tempIndex = this.currentIndex;
      this.currentIndex = -1;
      this.currentIndex = tempIndex;
    }
  }

  build() {
    Stack({ alignContent: Alignment.BottomEnd }) {
      Column() {
        // 内容区域
        NewsList({ index: this.currentIndex, currentIndex: $currentIndex })
          .layoutWeight(1)

        // 底部导航栏
        Row() {
          // 全部标签
          Column() {
            Text(this.tabBarArray[0]?.name || "全部")
              .fontSize(16)
              .fontWeight(this.currentIndex === 0 ? 600 : 400)
              .fontColor(this.currentIndex === 0 ? $r('app.color.color_index') : $r('app.color.fontColor_text1'))
              .onClick(() => {
                this.currentIndex = 0;
              })
          }
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)

          // 发布按钮
          Column() {
            Image($r("app.media.ic_signature"))
              .width(56)
              .height(56)
              .objectFit(ImageFit.Contain)
              .onClick(() => {
                router.pushUrl({ url: Constants.NEWS_EDIT_PAGE });
              })
          }
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)

          // 我的标签
          Column() {
            Text(this.tabBarArray[1]?.name || "我的")
              .fontSize(16)
              .fontWeight(this.currentIndex === 1 ? 600 : 400)
              .fontColor(this.currentIndex === 1 ? $r('app.color.color_index') : $r('app.color.fontColor_text1'))
              .onClick(() => {
                this.currentIndex = 1;
                router.pushUrl({ url: 'pages/zonghezuoye/ProfilePage' });
              })
          }
          .layoutWeight(1)
          .justifyContent(FlexAlign.Center)
          .alignItems(HorizontalAlign.Center)
        }
        .height(60)
        .backgroundColor($r('app.color.white'))
        .border({
          width: 1,
          color: $r('app.color.dividerColor'),
          style: BorderStyle.Solid
        })
        .shadow({ radius: 6, color: '#1F000000', offsetX: 0, offsetY: -2 })
      }
      .width(Constants.FULL_PERCENT)
      .height(Constants.FULL_PERCENT)
      .backgroundColor($r('app.color.listColor'))

    }
  }
}