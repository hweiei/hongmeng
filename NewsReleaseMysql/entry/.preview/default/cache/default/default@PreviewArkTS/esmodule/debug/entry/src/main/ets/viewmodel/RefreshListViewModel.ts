import promptAction from "@ohos:promptAction";
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import type { RefreshState, RefreshConstant, PageState } from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import NewsViewModel from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsViewModel";
import type { NewsData } from './NewsData';
import RefreshLoadingClass from "@bundle:com.example.newsrelease/entry/ets/viewmodel/RefreshLoadingClass";
@Observed
export default class RefreshListViewModel {
    private downY = 0;
    private lastMoveY = 0;
    private isRefreshing: boolean = false;
    private isCanRefresh = false;
    private isPullRefreshOperation = false;
    private isLoading: boolean = false;
    private isCanLoadMore = false;
    public startIndex = 0;
    public endIndex = 0;
    public newsData: Array<NewsData> = [];
    public currentPage: number = 1;
    public pageSize: number = 4;
    public offsetY: number = 0;
    public hasMore: boolean = true;
    public refreshLayoutClass: RefreshLoadingClass = new RefreshLoadingClass({ "id": 16777269, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }, { "id": 16777234, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }, 0);
    public loadingMoreClass: RefreshLoadingClass = new RefreshLoadingClass({ "id": 16777254, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }, { "id": 16777235, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }, 0);
    public pageState: number = 0;
    listTouchEvent(event: TouchEvent) {
        switch (event.type) {
            case TouchType.Down:
                this.downY = event.touches[0].y;
                this.lastMoveY = event.touches[0].y;
                break;
            case TouchType.Move:
                if (this.isRefreshing || this.isLoading) {
                    return;
                }
                let isDownPull = event.touches[0].y - this.lastMoveY > 0;
                if ((isDownPull || this.isPullRefreshOperation) && !this.isCanLoadMore) {
                    // Touch move pull refresh.
                    this.touchMovePullRefresh(event);
                }
                else {
                    // Touch move load more.
                    this.touchMoveLoadMore(event);
                }
                this.lastMoveY = event.touches[0].y;
                break;
            case TouchType.Cancel:
                break;
            case TouchType.Up:
                if (this.isRefreshing || this.isLoading) {
                    return;
                }
                if (this.isPullRefreshOperation) {
                    // Touch up pull refresh.
                    this.touchUpPullRefresh();
                }
                else {
                    // Touch up load more.
                    this.touchUpLoadMore();
                }
                break;
            default:
                break;
        }
    }
    touchMovePullRefresh(event: TouchEvent) {
        if (this.startIndex === 0) {
            this.isPullRefreshOperation = true;
            let height = vp2px(Constants.CUSTOM_LAYOUT_HEIGHT);
            this.offsetY = event.touches[0].y - this.downY;
            // Check offsetY to Refresh.
            if (this.offsetY >= height) {
                this.pullRefreshState(1);
                this.offsetY = height + this.offsetY * Constants.Y_OFF_SET_COEFFICIENT;
            }
            else {
                this.pullRefreshState(0);
            }
            if (this.offsetY < 0) {
                this.offsetY = 0;
                this.isPullRefreshOperation = false;
            }
        }
    }
    touchUpPullRefresh() {
        if (this.isCanRefresh) {
            this.offsetY = vp2px(Constants.CUSTOM_LAYOUT_HEIGHT);
            this.pullRefreshState(2);
            this.currentPage = 1;
            setTimeout(() => {
                NewsViewModel.getNewsList(this.currentPage, this.pageSize).then((data: NewsData[]) => {
                    if (data.length === this.pageSize) {
                        this.currentPage++;
                        this.hasMore = true;
                    }
                    else {
                        this.hasMore = false;
                    }
                    this.newsData = data;
                    this.closeRefresh(true);
                }).catch((errMsg: string | Resource) => {
                    promptAction.showToast({ message: errMsg });
                    this.closeRefresh(false);
                });
            }, Constants.DELAY_TIME);
        }
        else {
            this.closeRefresh(false);
        }
    }
    pullRefreshState(state: number) {
        switch (state) {
            case 0:
                this.isCanRefresh = false;
                this.isRefreshing = false;
                this.refreshLayoutClass = new RefreshLoadingClass({ "id": 16777269, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }, { "id": 16777234, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }, Constants.CUSTOM_LAYOUT_HEIGHT);
                break;
            case 1:
                this.refreshLayoutClass.imageSrc = { "id": 16777253, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" };
                this.refreshLayoutClass.textValue = { "id": 16777241, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" };
                this.isCanRefresh = true;
                this.isRefreshing = false;
                break;
            case 2:
                this.offsetY = vp2px(this.refreshLayoutClass.heightValue);
                this.refreshLayoutClass.imageSrc = { "id": 16777254, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" };
                this.refreshLayoutClass.textValue = { "id": 16777239, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" };
                this.isCanRefresh = true;
                this.isRefreshing = true;
                break;
            case 3:
                this.refreshLayoutClass.imageSrc = { "id": 16777271, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" };
                this.refreshLayoutClass.textValue = { "id": 16777238, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" };
                this.isCanRefresh = true;
                this.isRefreshing = true;
                break;
            case 4:
                this.refreshLayoutClass.imageSrc = { "id": 16777257, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" };
                this.refreshLayoutClass.textValue = { "id": 16777237, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" };
                this.isCanRefresh = true;
                this.isRefreshing = true;
                break;
            default:
                break;
        }
    }
    closeRefresh(isRefreshSuccess: boolean) {
        setTimeout(() => {
            let delay = 50;
            if (this.isCanRefresh) {
                this.pullRefreshState(isRefreshSuccess ? 3 : 4);
                delay = 500;
            }
            Context.animateTo({
                duration: 150,
                delay: delay,
                onFinish: () => {
                    this.pullRefreshState(0);
                    this.refreshLayoutClass.heightValue = 0;
                    this.isPullRefreshOperation = false;
                }
            }, () => {
                this.offsetY = 0;
            });
        }, this.isCanRefresh ? Constants.DELAY_ANIMATION_DURATION : 0);
    }
    touchMoveLoadMore(event: TouchEvent) {
        if (this.endIndex >= this.newsData.length - 1) {
            this.offsetY = event.touches[0].y - this.downY;
            if (Math.abs(this.offsetY) > vp2px(Constants.CUSTOM_LAYOUT_HEIGHT) / 2) {
                this.isCanLoadMore = true;
                this.loadingMoreClass.heightValue = Constants.CUSTOM_LAYOUT_HEIGHT;
                this.offsetY = -vp2px(Constants.CUSTOM_LAYOUT_HEIGHT) + this.offsetY * Constants.Y_OFF_SET_COEFFICIENT;
            }
        }
    }
    touchUpLoadMore() {
        if (this.isCanLoadMore && this.hasMore) {
            this.isLoading = true;
            setTimeout(() => {
                NewsViewModel.getNewsList(this.currentPage, this.pageSize).then((data: NewsData[]) => {
                    if (data.length === this.pageSize) {
                        this.currentPage++;
                        this.hasMore = true;
                    }
                    else {
                        this.hasMore = false;
                    }
                    this.newsData = this.newsData.concat(data);
                }).catch((errMsg: string | Resource) => {
                    promptAction.showToast({ message: errMsg });
                });
                this.closeLoadMore();
            }, Constants.DELAY_TIME);
        }
        else {
            this.closeLoadMore();
        }
    }
    closeLoadMore() {
        this.isCanLoadMore = false;
        this.isLoading = false;
        this.loadingMoreClass.heightValue = 0;
    }
}
