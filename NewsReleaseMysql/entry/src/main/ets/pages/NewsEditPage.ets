import { router } from '@kit.ArkUI';
import Constants from '../common/constants/Constants';
import { fileSelect, fileUpload } from '../common/utils/FileUtil';
import { NewsFile, NewsData } from '../viewmodel/NewsData';
import newsViewModel from '../viewmodel/NewsViewModel';
import { showToast } from '../common/utils/ToastUtil';
import ResponseResult from '../viewmodel/ResponseResult';
import { GlobalContext } from '../viewmodel/GlobalContext';
import { User } from './zonghezuoye/User';

@Entry
@Component
struct NewsEditPage {
  @State title: string = '';
  @State content: string = '';
  @State imageUri: string = '';
  @State isSubmitting: boolean = false;

  private newsViewModel = newsViewModel;

  aboutToAppear(): void {
    const loggedInUser: User | undefined = GlobalContext.getContext().getObject('loggedInUser') as User | undefined;
    if (!loggedInUser || !loggedInUser.id) {
      showToast('请先登录');
      router.back();
    }
  }

  selectImage() {
    fileSelect().then((uri: string) => {
      this.imageUri = uri || '';
    });
  }

  async publishNews(): Promise<void> {
    if (!this.title.trim()) {
      showToast('请输入标题');
      return;
    }
    if (!this.content.trim()) {
      showToast('请输入内容');
      return;
    }
    if (!this.imageUri) {
      showToast('请选择图片');
      return;
    }

    const loggedInUser: User | undefined = GlobalContext.getContext().getObject('loggedInUser') as User | undefined;
    if (!loggedInUser || !loggedInUser.id) {
      showToast('请先登录');
      return;
    }

    this.isSubmitting = true;
    try {
      // 首先上传图片
      let imageUrl: string = '';
      if (this.imageUri) {
        const serverData: ResponseResult = await fileUpload(getContext(this), this.imageUri);
        imageUrl = serverData.data as string;
      }

      // 构造新闻文件对象
      let newsFile = new NewsFile();
      newsFile.id = 0;
      newsFile.url = imageUrl;
      newsFile.type = 0;
      newsFile.newsId = 0;

      // 构造新闻数据对象
      let newsData: NewsData = new NewsData();
      newsData.title = this.title.trim();
      newsData.content = this.content.trim();
      newsData.imagesUrl = [newsFile];  // 赋值NewsFile数组
      newsData.source = loggedInUser.username;
      newsData.author = loggedInUser.username;

      // 上传新闻数据
      await this.newsViewModel.uploadNews(newsData);

      showToast('发布成功');
      GlobalContext.getContext().setObject('isBackRouter', true);
      router.back();
    } catch (error) {
      console.error('发布新闻失败:', JSON.stringify(error));
      showToast('发布失败');
    } finally {
      this.isSubmitting = false;
    }
  }

  build() {
    Column() {
      // 顶部导航
      Row() {
        Text('取消')
          .fontSize(16)
          .fontColor('#666666')
          .onClick(() => {
            router.back();
          })

        Text('发布笔记')
          .fontSize(18)
          .fontWeight(FontWeight.Bold)
          .layoutWeight(1)
          .textAlign(TextAlign.Center)

        Button('发布')
          .fontSize(14)
          .height(32)
          .backgroundColor(this.isSubmitting ? '#CCCCCC' : '#FF6B6B')
          .enabled(!this.isSubmitting)
          .onClick(() => {
            this.publishNews();
          })
      }
      .width('100%')
      .height(56)
      .padding({ left: 16, right: 16 })
      .backgroundColor('#FFFFFF')

      // 表单区域
      Column() {
        // 图片选择区域
        Column() {
          Row() {
            Image(this.imageUri ? this.imageUri : $r('app.media.ic_add_pic'))
              .width('100%')
              .height(200)
              .objectFit(ImageFit.Cover)
              .onClick(() => this.selectImage())
              .clip(true)
              .borderRadius(20)
          }
          .width('100%')
          .height(200)
          .borderRadius(20)
          .backgroundColor('#FFFFFF')
          .padding(12)
        }
        .width('100%')
        .margin({ bottom: 20 })

        TextInput({ placeholder: '请输入标题（必填）', text: this.title })
          .fontSize(20)
          .fontWeight(FontWeight.Bold)
          .width('100%')
          .height(56)
          .backgroundColor('#FFFFFF')
          .onChange((value: string) => {
            this.title = value;
          })

        Divider()
          .color('#F0F0F0')
          .margin({ top: 8, bottom: 8 })

        TextArea({ placeholder: '分享你的想法...', text: this.content })
          .fontSize(16)
          .width('100%')
          .layoutWeight(1)
          .backgroundColor('#FFFFFF')
          .onChange((value: string) => {
            this.content = value;
          })
      }
      .padding(20)
      .layoutWeight(1)
      .backgroundColor('#FFFFFF')
    }
    .width('100%')
    .height('100%')
    .backgroundColor('#F5F5F5')
  }
}