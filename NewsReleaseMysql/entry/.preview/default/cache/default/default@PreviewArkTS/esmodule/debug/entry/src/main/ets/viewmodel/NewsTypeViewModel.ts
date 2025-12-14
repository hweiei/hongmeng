import NewsTypeBean from "@bundle:com.example.newsrelease/entry/ets/viewmodel/NewsTypeModel";
import type ResponseResult from './ResponseResult';
import Constants from "@bundle:com.example.newsrelease/entry/ets/common/constants/Constants";
import { httpRequestGet } from "@bundle:com.example.newsrelease/entry/ets/common/utils/HttpUtil";
const DEFAULT_NEWS_TYPES: NewsTypeBean[] = [
    new NewsTypeBean(0, { "id": 16777242, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new NewsTypeBean(1, { "id": 16777315, "type": 10003, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }) // 我的选项
];
class NewsTypeViewModel {
    /**
     * Get news type list from server.
     *
     * @return NewsTypeBean[] newsTypeList
     */
    getNewsTypeList(): Promise<NewsTypeBean[]> {
        return new Promise((resolve: Function) => {
            let url = `${Constants.SERVER}/${Constants.GET_NEWS_TYPE}`;
            httpRequestGet(url).then((data: ResponseResult) => {
                if (data.code === Constants.SERVER_CODE_SUCCESS) {
                    resolve(data.data);
                }
                else {
                    resolve(DEFAULT_NEWS_TYPES);
                }
            }).catch(() => {
                resolve(DEFAULT_NEWS_TYPES);
            });
        });
    }
    /**
     * Get default news type list.
     *
     * @return NewsTypeBean[] newsTypeList
     */
    getDefaultTypeList(): NewsTypeBean[] {
        return DEFAULT_NEWS_TYPES;
    }
}
let newsTypeViewModel = new NewsTypeViewModel();
export default newsTypeViewModel as NewsTypeViewModel;
