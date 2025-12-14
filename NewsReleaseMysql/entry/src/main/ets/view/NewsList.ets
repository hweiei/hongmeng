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

import NewsItem from './NewsItem';
import LoadMoreLayout from './LoadMoreLayout';
import RefreshLayout from './RefreshLayout';
import { NewsData } from '../viewmodel/NewsData';
import Constants, { PageState } from '../common/constants/Constants';
import NewsViewModel from '../viewmodel/NewsViewModel';
import { showToast } from '../common/utils/ToastUtil';
import FailureLayout from './FailureLayout';
import LoadingLayout from './LoadingLayout';
import NoMoreLayout from './NoMoreLayout';
import RefreshListViewModel from '../viewmodel/RefreshListViewModel';
import { preferences } from '@kit.ArkData';
import { common } from '@kit.AbilityKit';
import { GlobalContext } from '../viewmodel/GlobalContext';
import { User } from '../pages/zonghezuoye/User';

/**
 * 新闻列表组件
 */
@Component
export default struct NewsList {
  index: number = 0;
  @Watch('changeCategory') @Link currentIndex: number;
  @State refreshStore: RefreshListViewModel = new RefreshListViewModel();
  @State searchTerm: string = ''; // 搜索关键词
  @State showFavoritesOnly: boolean = false; // 是否只显示收藏的笔记
  @State favoriteNotes: number[] = []; // 收藏的笔记ID列表

  private context = getContext(this) as common.UIAbilityContext;
  private pref = preferences.getPreferencesSync(this.context, { name: 'favoriteNotesPrefs' });

  aboutToAppear(): void {
    // 加载数据
    this.changeCategory();
    // 加载收藏列表
    this.loadFavoriteNotes();
  }

  // 加载收藏笔记列表
  private loadFavoriteNotes(): void {
    try {
      this.favoriteNotes = this.pref.getSync('favorites', []) as Array<number>;
    } catch (error) {
      console.error('加载收藏列表失败:', error);
      this.favoriteNotes = [];
    }
  }

  changeCategory() {
    if (this.currentIndex !== this.index) {
      return;
    }
    this.refreshStore.currentPage = 1;
    
    // 如果是"我的"标签页(index=1)，则只获取当前用户的笔记
    if (this.currentIndex === 1) {
      NewsViewModel.getNewsList(this.refreshStore.currentPage, this.refreshStore.pageSize).then((data: NewsData[]) => {
        // 过滤出当前用户的笔记
        const currentUser = GlobalContext.getContext().getObject('loggedInUser') as User | undefined;
        if (currentUser && currentUser.username) {
          data = data.filter(item => item.source === currentUser.username);
        }
        this.handleNewsData(data);
      }).catch((err: string | Resource) => {
        showToast(err);
        this.refreshStore.pageState = PageState.Fail;
      });
    } else {
      // 全部标签页，获取所有笔记
      NewsViewModel.getNewsList(this.refreshStore.currentPage, this.refreshStore.pageSize).then((data: NewsData[]) => {
        this.handleNewsData(data);
      }).catch((err: string | Resource) => {
        showToast(err);
        this.refreshStore.pageState = PageState.Fail;
      });
    }
  }

  private handleNewsData(data: NewsData[]) {
    this.refreshStore.pageState = PageState.Success;
    if (data.length === this.refreshStore.pageSize) {
      this.refreshStore.currentPage++;
      this.refreshStore.hasMore = true;
    } else {
      this.refreshStore.hasMore = false;
    }
    this.refreshStore.newsData = data;
  }

  reloadAction() {
    this.refreshStore.pageState = PageState.Loading;
    this.changeCategory();
  }

  // 获取过滤和搜索后的笔记列表
  private getFilteredNotes(): NewsData[] {
    let result = [...this.refreshStore.newsData];
    
    // 根据搜索词过滤
    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase();
      result = result.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.content.toLowerCase().includes(term)
      );
    }
    
    // 根据收藏状态过滤
    if (this.showFavoritesOnly) {
      result = result.filter(item => {
        // 生成笔记ID并检查是否在收藏列表中
        const noteId = this.generateNoteId(item);
        return this.favoriteNotes.includes(noteId);
      });
    }
    
    return result;
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

  build() {
    Column() {
      // 搜索栏和筛选按钮
      Row() {
        // 搜索框
        Search({ value: this.searchTerm, placeholder: '搜索笔记...' })
          .onChange((value: string) => {
            this.searchTerm = value;
          })
          .width('70%')
          .margin({ right: 10 })
          .backgroundColor('#f5f5f5')
          .borderRadius(20)
        
        // 筛选按钮
        Button(this.showFavoritesOnly ? '全部' : '收藏')
          .width('25%')
          .type(ButtonType.Capsule)
          .backgroundColor(this.showFavoritesOnly ? '#ff5722' : '#f5f5f5')
          .fontColor(this.showFavoritesOnly ? Color.White : Color.Black)
          .onClick(() => {
            this.showFavoritesOnly = !this.showFavoritesOnly;
            // 切换时重新加载收藏列表
            if (this.showFavoritesOnly) {
              this.loadFavoriteNotes();
            }
          })
      }
      .width('90%')
      .margin({ top: 10, bottom: 10 })
      .alignItems(VerticalAlign.Center)

      if (this.refreshStore.pageState === PageState.Loading) {
        LoadingLayout()
      } else if (this.refreshStore.pageState === PageState.Success) {
        this.ListLayout()
      } else {
        FailureLayout({ reloadAction: () => {
          this.reloadAction();
        } })
      }
    }
    .width(Constants.FULL_PERCENT)
    .height(Constants.FULL_PERCENT)
    .justifyContent(FlexAlign.Center)
    .onTouch((event?: TouchEvent) => {
      if (event) {
        if (this.refreshStore.pageState === PageState.Success) {
          this.refreshStore.listTouchEvent(event);
        }
      }
    })
  }

  @Builder ListLayout() {
    // 采用双列瀑布流布局，模仿小红书风格
    Column() {
      Grid() {
        ForEach(this.getFilteredNotes(), (item: NewsData) => {
          GridItem() {
            NewsItem({ newsData: item })
          }
          .borderRadius($r('app.float.item_border_radius'))
          .backgroundColor($r('app.color.white'))
        }, (item: NewsData, index?: number) => JSON.stringify(item) + index)

        // 加载更多或没有更多数据的提示
        GridItem() {
          Row() {
            if (this.refreshStore.hasMore && !this.showFavoritesOnly && !this.searchTerm) {
              // 只有在显示全部笔记且没有搜索时才显示加载更多
              Blank()
                .width('50%')
              
              LoadMoreLayout({ loadMoreLayoutClass: this.refreshStore.loadingMoreClass })

            } else {
              NoMoreLayout()
                .width('100%')
            }
          }
          .width('100%')
        }
      }
      .columnsTemplate('1fr 1fr') // 双列布局
      .rowsGap($r('app.float.common_padding'))
      .columnsGap($r('app.float.common_padding'))
      .padding({
        left: $r('app.float.common_padding'),
        right: $r('app.float.common_padding'),
        top: $r('app.float.common_padding')
      })
      .backgroundColor($r('app.color.listColor'))
      .edgeEffect(EdgeEffect.None)
      .onScrollIndex((start: number, end: number) => {
        // 监听当前列表的第一个索引
        this.refreshStore.startIndex = start;
        this.refreshStore.endIndex = end;
      })
    }
  }
}