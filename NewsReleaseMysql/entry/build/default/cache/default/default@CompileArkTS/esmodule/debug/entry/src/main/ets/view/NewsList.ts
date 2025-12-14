if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface NewsList_Params {
    index?: number;
    currentIndex?: number;
    refreshStore?: RefreshListViewModel;
    searchTerm?: string;
    showFavoritesOnly?: boolean;
    favoriteNotes?: number[];
    context?;
    pref?;
}
import NewsItem from "@bundle:com.example.newsrelease/entry/ets/view/NewsItem";
import LoadMoreLayout from "@bundle:com.example.newsrelease/entry/ets/view/LoadMoreLayout";
import type { NewsData } from '../viewmodel/NewsData';
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import type { PageState } from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import NewsViewModel from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsViewModel";
import { showToast } from "@bundle:com.example.newsrelease/entry/ets/common/utils/ToastUtil";
import FailureLayout from "@bundle:com.example.newsrelease/entry/ets/view/FailureLayout";
import LoadingLayout from "@bundle:com.example.newsrelease/entry/ets/view/LoadingLayout";
import NoMoreLayout from "@bundle:com.example.newsrelease/entry/ets/view/NoMoreLayout";
import RefreshListViewModel from "@bundle:com.example.newsrelease/entry/ets/viewmodel/RefreshListViewModel";
import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
import { GlobalContext } from "@bundle:com.example.newsrelease/entry/ets/viewmodel/GlobalContext";
import type { User } from '../pages/zonghezuoye/User';
export default class NewsList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.index = 0;
        this.__currentIndex = new SynchedPropertySimpleTwoWayPU(params.currentIndex, this, "currentIndex");
        this.__refreshStore = new ObservedPropertyObjectPU(new RefreshListViewModel(), this, "refreshStore");
        this.__searchTerm = new ObservedPropertySimplePU('', this, "searchTerm");
        this.__showFavoritesOnly = new ObservedPropertySimplePU(false, this, "showFavoritesOnly");
        this.__favoriteNotes = new ObservedPropertyObjectPU([], this, "favoriteNotes");
        this.context = getContext(this) as common.UIAbilityContext;
        this.pref = preferences.getPreferencesSync(this.context, { name: 'favoriteNotesPrefs' });
        this.setInitiallyProvidedValue(params);
        this.declareWatch("currentIndex", this.changeCategory);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: NewsList_Params) {
        if (params.index !== undefined) {
            this.index = params.index;
        }
        if (params.refreshStore !== undefined) {
            this.refreshStore = params.refreshStore;
        }
        if (params.searchTerm !== undefined) {
            this.searchTerm = params.searchTerm;
        }
        if (params.showFavoritesOnly !== undefined) {
            this.showFavoritesOnly = params.showFavoritesOnly;
        }
        if (params.favoriteNotes !== undefined) {
            this.favoriteNotes = params.favoriteNotes;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.pref !== undefined) {
            this.pref = params.pref;
        }
    }
    updateStateVars(params: NewsList_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__currentIndex.purgeDependencyOnElmtId(rmElmtId);
        this.__refreshStore.purgeDependencyOnElmtId(rmElmtId);
        this.__searchTerm.purgeDependencyOnElmtId(rmElmtId);
        this.__showFavoritesOnly.purgeDependencyOnElmtId(rmElmtId);
        this.__favoriteNotes.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__currentIndex.aboutToBeDeleted();
        this.__refreshStore.aboutToBeDeleted();
        this.__searchTerm.aboutToBeDeleted();
        this.__showFavoritesOnly.aboutToBeDeleted();
        this.__favoriteNotes.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private index: number;
    private __currentIndex: SynchedPropertySimpleTwoWayPU<number>;
    get currentIndex() {
        return this.__currentIndex.get();
    }
    set currentIndex(newValue: number) {
        this.__currentIndex.set(newValue);
    }
    private __refreshStore: ObservedPropertyObjectPU<RefreshListViewModel>;
    get refreshStore() {
        return this.__refreshStore.get();
    }
    set refreshStore(newValue: RefreshListViewModel) {
        this.__refreshStore.set(newValue);
    }
    private __searchTerm: ObservedPropertySimplePU<string>; // 搜索关键词
    get searchTerm() {
        return this.__searchTerm.get();
    }
    set searchTerm(newValue: string) {
        this.__searchTerm.set(newValue);
    }
    private __showFavoritesOnly: ObservedPropertySimplePU<boolean>; // 是否只显示收藏的笔记
    get showFavoritesOnly() {
        return this.__showFavoritesOnly.get();
    }
    set showFavoritesOnly(newValue: boolean) {
        this.__showFavoritesOnly.set(newValue);
    }
    private __favoriteNotes: ObservedPropertyObjectPU<number[]>; // 收藏的笔记ID列表
    get favoriteNotes() {
        return this.__favoriteNotes.get();
    }
    set favoriteNotes(newValue: number[]) {
        this.__favoriteNotes.set(newValue);
    }
    private context;
    private pref;
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
        }
        catch (error) {
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
                this.refreshStore.pageState = 2;
            });
        }
        else {
            // 全部标签页，获取所有笔记
            NewsViewModel.getNewsList(this.refreshStore.currentPage, this.refreshStore.pageSize).then((data: NewsData[]) => {
                this.handleNewsData(data);
            }).catch((err: string | Resource) => {
                showToast(err);
                this.refreshStore.pageState = 2;
            });
        }
    }
    private handleNewsData(data: NewsData[]) {
        this.refreshStore.pageState = 1;
        if (data.length === this.refreshStore.pageSize) {
            this.refreshStore.currentPage++;
            this.refreshStore.hasMore = true;
        }
        else {
            this.refreshStore.hasMore = false;
        }
        this.refreshStore.newsData = data;
    }
    reloadAction() {
        this.refreshStore.pageState = 0;
        this.changeCategory();
    }
    // 获取过滤和搜索后的笔记列表
    private getFilteredNotes(): NewsData[] {
        let result = [...this.refreshStore.newsData];
        // 根据搜索词过滤
        if (this.searchTerm.trim()) {
            const term = this.searchTerm.toLowerCase();
            result = result.filter(item => item.title.toLowerCase().includes(term) ||
                item.content.toLowerCase().includes(term));
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
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.width(Constants.FULL_PERCENT);
            Column.height(Constants.FULL_PERCENT);
            Column.justifyContent(FlexAlign.Center);
            Column.onTouch((event?: TouchEvent) => {
                if (event) {
                    if (this.refreshStore.pageState === 1) {
                        this.refreshStore.listTouchEvent(event);
                    }
                }
            });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索栏和筛选按钮
            Row.create();
            // 搜索栏和筛选按钮
            Row.width('90%');
            // 搜索栏和筛选按钮
            Row.margin({ top: 10, bottom: 10 });
            // 搜索栏和筛选按钮
            Row.alignItems(VerticalAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索框
            Search.create({ value: this.searchTerm, placeholder: '搜索笔记...' });
            // 搜索框
            Search.onChange((value: string) => {
                this.searchTerm = value;
            });
            // 搜索框
            Search.width('70%');
            // 搜索框
            Search.margin({ right: 10 });
            // 搜索框
            Search.backgroundColor('#f5f5f5');
            // 搜索框
            Search.borderRadius(20);
        }, Search);
        // 搜索框
        Search.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 筛选按钮
            Button.createWithLabel(this.showFavoritesOnly ? '全部' : '收藏');
            // 筛选按钮
            Button.width('25%');
            // 筛选按钮
            Button.type(ButtonType.Capsule);
            // 筛选按钮
            Button.backgroundColor(this.showFavoritesOnly ? '#ff5722' : '#f5f5f5');
            // 筛选按钮
            Button.fontColor(this.showFavoritesOnly ? Color.White : Color.Black);
            // 筛选按钮
            Button.onClick(() => {
                this.showFavoritesOnly = !this.showFavoritesOnly;
                // 切换时重新加载收藏列表
                if (this.showFavoritesOnly) {
                    this.loadFavoriteNotes();
                }
            });
        }, Button);
        // 筛选按钮
        Button.pop();
        // 搜索栏和筛选按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            If.create();
            if (this.refreshStore.pageState === 0) {
                this.ifElseBranchUpdateFunction(0, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new LoadingLayout(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/NewsList.ets", line: 181, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {};
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "LoadingLayout" });
                    }
                });
            }
            else if (this.refreshStore.pageState === 1) {
                this.ifElseBranchUpdateFunction(1, () => {
                    this.ListLayout.bind(this)();
                });
            }
            else {
                this.ifElseBranchUpdateFunction(2, () => {
                    {
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            if (isInitialRender) {
                                let componentCall = new FailureLayout(this, { reloadAction: () => {
                                        this.reloadAction();
                                    } }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/NewsList.ets", line: 185, col: 9 });
                                ViewPU.create(componentCall);
                                let paramsLambda = () => {
                                    return {
                                        reloadAction: () => {
                                            this.reloadAction();
                                        }
                                    };
                                };
                                componentCall.paramsGenerator_ = paramsLambda;
                            }
                            else {
                                this.updateStateVarsOfChildByElmtId(elmtId, {});
                            }
                        }, { name: "FailureLayout" });
                    }
                });
            }
        }, If);
        If.pop();
        Column.pop();
    }
    ListLayout(parent = null) {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 采用双列瀑布流布局，模仿小红书风格
            Column.create();
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Grid.create();
            Grid.columnsTemplate('1fr 1fr');
            Grid.rowsGap({ "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Grid.columnsGap({ "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Grid.padding({
                left: { "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                right: { "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" },
                top: { "id": 16777264, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }
            });
            Grid.backgroundColor({ "id": 16777255, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Grid.edgeEffect(EdgeEffect.None);
            Grid.onScrollIndex((start: number, end: number) => {
                // 监听当前列表的第一个索引
                this.refreshStore.startIndex = start;
                this.refreshStore.endIndex = end;
            });
        }, Grid);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        GridItem.create(() => { }, false);
                        GridItem.borderRadius({ "id": 16777273, "type": 10002, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
                        GridItem.backgroundColor({ "id": 16777258, "type": 10001, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
                    };
                    const observedDeepRender = () => {
                        this.observeComponentCreation2(itemCreation2, GridItem);
                        {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                if (isInitialRender) {
                                    let componentCall = new NewsItem(this, { newsData: item }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/NewsList.ets", line: 208, col: 13 });
                                    ViewPU.create(componentCall);
                                    let paramsLambda = () => {
                                        return {
                                            newsData: item
                                        };
                                    };
                                    componentCall.paramsGenerator_ = paramsLambda;
                                }
                                else {
                                    this.updateStateVarsOfChildByElmtId(elmtId, {});
                                }
                            }, { name: "NewsItem" });
                        }
                        GridItem.pop();
                    };
                    observedDeepRender();
                }
            };
            this.forEachUpdateFunction(elmtId, this.getFilteredNotes(), forEachItemGenFunction, (item: NewsData, index?: number) => JSON.stringify(item) + index, false, true);
        }, ForEach);
        ForEach.pop();
        {
            const itemCreation2 = (elmtId, isInitialRender) => {
                GridItem.create(() => { }, false);
            };
            const observedDeepRender = () => {
                this.observeComponentCreation2(itemCreation2, GridItem);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    Row.create();
                    Row.width('100%');
                }, Row);
                this.observeComponentCreation2((elmtId, isInitialRender) => {
                    If.create();
                    if (this.refreshStore.hasMore && !this.showFavoritesOnly && !this.searchTerm) {
                        this.ifElseBranchUpdateFunction(0, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                // 只有在显示全部笔记且没有搜索时才显示加载更多
                                Blank.create();
                                // 只有在显示全部笔记且没有搜索时才显示加载更多
                                Blank.width('50%');
                            }, Blank);
                            // 只有在显示全部笔记且没有搜索时才显示加载更多
                            Blank.pop();
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new LoadMoreLayout(this, { loadMoreLayoutClass: this.refreshStore.loadingMoreClass }, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/NewsList.ets", line: 222, col: 15 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {
                                                loadMoreLayoutClass: this.refreshStore.loadingMoreClass
                                            };
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {
                                            loadMoreLayoutClass: this.refreshStore.loadingMoreClass
                                        });
                                    }
                                }, { name: "LoadMoreLayout" });
                            }
                        });
                    }
                    else {
                        this.ifElseBranchUpdateFunction(1, () => {
                            this.observeComponentCreation2((elmtId, isInitialRender) => {
                                __Common__.create();
                                __Common__.width('100%');
                            }, __Common__);
                            {
                                this.observeComponentCreation2((elmtId, isInitialRender) => {
                                    if (isInitialRender) {
                                        let componentCall = new NoMoreLayout(this, {}, undefined, elmtId, () => { }, { page: "entry/src/main/ets/view/NewsList.ets", line: 225, col: 15 });
                                        ViewPU.create(componentCall);
                                        let paramsLambda = () => {
                                            return {};
                                        };
                                        componentCall.paramsGenerator_ = paramsLambda;
                                    }
                                    else {
                                        this.updateStateVarsOfChildByElmtId(elmtId, {});
                                    }
                                }, { name: "NoMoreLayout" });
                            }
                            __Common__.pop();
                        });
                    }
                }, If);
                If.pop();
                Row.pop();
                // 加载更多或没有更多数据的提示
                GridItem.pop();
            };
            observedDeepRender();
        }
        Grid.pop();
        // 采用双列瀑布流布局，模仿小红书风格
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
}
