/*
 * Copyright (c) 2023 Huawei Device Co., Ltd.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { NewsData, NewsFile } from '../viewmodel/NewsData';
import Constants from '../common/constants/Constants';
import { router, promptAction } from '@kit.ArkUI';
import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import http from '@ohos.net.http';

// 定义后端响应数据类型
interface BackendResponse {
  code: string;
  msg: string;
  data?: object | null;
}

/**
 * 新闻列表项组件
 */
@Component
export default struct NewsItem {
  newsData: NewsData = new NewsData();
  @State isFavorite: boolean = false;
  @State noteId: number = 0;
  @State showDeleteConfirm: boolean = false; // 是否显示删除确认对话框
  
  // 用于获取应用上下文
  private context = getContext(this) as common.UIAbilityContext;
  private pref = preferences.getPreferencesSync(this.context, { name: 'favoriteNotesPrefs' });

  aboutToAppear(): void {
    // 生成笔记ID
    this.noteId = this.generateNoteId(this.newsData);
    // 加载收藏状态
    this.loadFavoriteStatus();
  }

  // 生成笔记的唯一ID
  private generateNoteId(note: NewsData): number {
    // 使用标题和内容生成一个简单的哈希值作为ID
    const str = note.title + note.content;
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // 转换为32位整数
    }
    return Math.abs(hash);
  }

  // 加载收藏状态
  private loadFavoriteStatus(): void {
    try {
      const favoriteList = this.pref.getSync('favorites', []) as Array<number>;
      this.isFavorite = favoriteList.includes(this.noteId);
    } catch (error) {
      console.error('加载收藏状态失败:', error);
      this.isFavorite = false;
    }
  }

  // 切换收藏状态
  private toggleFavorite(): void {
    this.isFavorite = !this.isFavorite;
    this.saveFavoriteStatus();
  }

  // 保存收藏状态
  private saveFavoriteStatus(): void {
    try {
      let favoriteList = this.pref.getSync('favorites', []) as Array<number>;
      
      if (this.isFavorite) {
        // 添加到收藏
        if (!favoriteList.includes(this.noteId)) {
          favoriteList.push(this.noteId);
        }
      } else {
        // 从收藏中移除
        favoriteList = favoriteList.filter(id => id !== this.noteId);
      }
      
      this.pref.putSync('favorites', favoriteList);
      this.pref.flushSync();
    } catch (error) {
      console.error('保存收藏状态失败:', error);
    }
  }

  // 删除笔记
  private deleteNote(): void {
    // 显示确认对话框
    this.showDeleteConfirm = true;
  }

  // 确认删除
  private confirmDelete(): void {
    // 发送删除请求到后端
    this.sendDeleteRequest(this.newsData.id);
    this.showDeleteConfirm = false;
  }

  // 取消删除
  private cancelDelete(): void {
    this.showDeleteConfirm = false;
  }

  // 发送删除请求到后端
  private sendDeleteRequest(noteId: number): void {
    let httpRequest = http.createHttp();
    const baseUrl = "http://172.17.75.16:9588"; // 后端服务地址
    const url = `${baseUrl}/news/deleteNews/${noteId}`;
    
    console.log('发送删除请求到:', url);
    
    httpRequest.request(
      url,
      {
        method: http.RequestMethod.DELETE,
        header: { 'Content-Type': 'application/json' },
        readTimeout: 50000,
        connectTimeout: 50000
      },
      (err, data) => {
        console.log('删除请求回调执行');
        console.log('错误信息:', JSON.stringify(err));
        console.log('响应数据:', JSON.stringify(data));
        
        if (!err) {
          console.info('删除请求成功:' + JSON.stringify(data));
          try {
            let responseData: BackendResponse = { code: '', msg: '' };
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
            
            if (responseData && responseData.code === 'success') {
              console.log("笔记删除成功");
              promptAction.showToast({ message: '笔记删除成功' });
              // 可以在这里添加刷新列表的逻辑
            } else {
              const errorMsg = responseData ? (responseData.msg || '未知错误') : '响应数据为空';
              console.error('后端返回错误:', errorMsg);
              promptAction.showToast({ message: '删除失败: ' + errorMsg });
            }
          } catch (parseError) {
            console.error('解析响应数据失败:', parseError);
            promptAction.showToast({ message: '数据解析失败: ' + (parseError as Error).message });
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
    Stack() {
      Column() {
        // 图片展示区域（小红书风格以图片为主）
        // 修复imagesUrl显示问题，兼容后端返回的不同格式
        Image(Constants.SERVER + (typeof this.newsData.imagesUrl === 'string' ? this.newsData.imagesUrl : (this.newsData.imagesUrl && this.newsData.imagesUrl.length > 0 ? this.newsData.imagesUrl[0]?.url : '')))
          .objectFit(ImageFit.Cover)
          .aspectRatio(0.8) // 宽高比，使图片看起来更像小红书的风格
          .clip(true)
          .width('100%')
          .onClick(() => {
            // 点击图片跳转到详情页
            router.pushUrl({
              url: 'pages/zonghezuoye/NoteDetailPage',
              params: this.newsData
            });
          })
        
        // 标题和内容区域
        Column() {
          Row() {
            Text(this.newsData?.title)
              .fontSize($r('app.float.title_font'))
              .fontColor($r('app.color.title_color'))
              .maxLines(2)
              .lineHeight($r('app.float.title_line_height'))
              .fontFamily($r('app.string.harmony_hei_ti_medium'))
              .textOverflow({ overflow: TextOverflow.Ellipsis })
              .fontWeight(Constants.TITLE_FONT_WEIGHT)
              .layoutWeight(1)
              .onClick(() => {
                // 点击标题跳转到详情页
                router.pushUrl({
                  url: 'pages/zonghezuoye/NoteDetailPage',
                  params: this.newsData
                });
              })
            
            // 删除按钮（仅在详情页显示）
            Image($r("app.media.ic_fail_refresh")) // 使用现有的删除图标，实际项目中应该使用专用的删除图标
              .width(20)
              .height(20)
              .margin({ left: 10 })
              .onClick(() => {
                this.deleteNote();
              })
          }
          .width('100%')
            
          Text(this.newsData?.content)
            .fontSize($r('app.float.desc_font'))
            .fontFamily($r('app.string.harmony_hei_ti'))
            .opacity(Constants.DESC_OPACITY)
            .fontColor($r('app.color.title_color'))
            .lineHeight($r('app.float.desc_line_height'))
            .width('100%')
            .maxLines(3)
            .fontWeight(Constants.DESC_FONT_WEIGHT)
            .textOverflow({ overflow: TextOverflow.Ellipsis })
            .margin({ top: $r('app.float.normal_padding') })
            .onClick(() => {
              // 点击内容跳转到详情页
              router.pushUrl({
                url: 'pages/zonghezuoye/NoteDetailPage',
                params: this.newsData
              });
            })
          
          // 来源信息和互动元素
          Row() {
            Column(){
              Text(this.newsData?.source ?? '')
                .fontSize($r('app.float.source_font'))
                .fontColor($r('app.color.fontColor_text2'))
              
              Text('发布者: ' + (this.newsData?.author ?? '未知'))
                .fontSize($r('app.float.source_font'))
                .fontColor($r('app.color.fontColor_text2'))
            }
            .layoutWeight(1)
            
            // 添加一些互动元素（点赞、评论、收藏）
            Blank()
            
            Row() {
              // 收藏按钮
              if (this.isFavorite) {
                Text('❤')
                  .fontSize(16)
                  .margin({ right: 10 })
                  .fontColor('#ff5722')
                  .onClick(() => {
                    this.toggleFavorite();
                  })
              } else {
                Text('♡')
                  .fontSize(16)
                  .margin({ right: 10 })
                  .fontColor('#999')
                  .onClick(() => {
                    this.toggleFavorite();
                  })
              }
              
              Text('💬')
                .fontSize(16)
            }
          }
          .width('100%')
          .margin({ top: $r('app.float.normal_padding') })
        }
        .padding({
          left: $r('app.float.common_padding'),
          right: $r('app.float.common_padding'),
          bottom: $r('app.float.common_padding'),
          top: $r('app.float.normal_padding')
        })
      }
      .backgroundColor($r('app.color.white'))
      .borderRadius($r('app.float.item_border_radius'))
      .onClick(() => {
        // 点击整个卡片跳转到详情页
        router.pushUrl({
          url: 'pages/zonghezuoye/NoteDetailPage',
          params: this.newsData
        });
      })
      .shadow({ radius: 6, color: '#1F000000', offsetX: 0, offsetY: 2 })
      
      // 删除确认对话框
      if (this.showDeleteConfirm) {
        Column() {
          Text('确认删除')
            .fontSize(18)
            .fontWeight(FontWeight.Bold)
            .margin({ bottom: 10 })
          
          Text('确定要删除这篇笔记吗？此操作不可撤销。')
            .fontSize(14)
            .fontColor('#666666')
            .textAlign(TextAlign.Center)
            .margin({ bottom: 20 })
          
          Row({ space: 15 }) {
            Button('N')
              .backgroundColor('#FFFFFF')
              .border({ width: 1, color: '#CCCCCC' })
              .fontColor('#333333')
              .layoutWeight(1)
              .height(40)
              .fontSize(14)
              .onClick(() => {
                this.cancelDelete();
              })
            
            Button('Y')
              .backgroundColor('#F5222D')
              .fontColor('#FFFFFF')
              .layoutWeight(1)
              .height(40)
              .fontSize(14)
              .onClick(() => {
                this.confirmDelete();
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
  }
}