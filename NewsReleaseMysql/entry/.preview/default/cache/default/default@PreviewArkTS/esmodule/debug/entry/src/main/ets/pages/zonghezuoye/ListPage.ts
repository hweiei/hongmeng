if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProductList_Params {
    select?: number;
    paixu?: string[];
    paixu1?: string[];
    sortField?: 'name' | 'price' | 'rating';
    sortOrder?: 'asc' | 'desc';
    v?: string;
    searchTerm?: string;
    products?: ProductItem[];
}
import router from "@ohos:router";
// 定义产品项类
export class ProductItem {
    id: number;
    name: string;
    price: number;
    rating: number;
    image: Resource;
    constructor(id: number, name: string, price: number, rating: number, image: Resource) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.rating = rating;
        this.image = image;
    }
}
// 初始化产品数据
export const products: ProductItem[] = [
    new ProductItem(7, "降噪耳机Lite", 399, 4.6, { "id": 16777320, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(8, "智能手环Pro", 299, 4.8, { "id": 16777307, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(9, "运动耳机", 199, 4.5, { "id": 16777324, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(10, "无线充电器", 129, 4.3, { "id": 16777304, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(11, "蓝牙耳机Mini", 99, 4.2, { "id": 16777324, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(12, "智能手表Pro", 1299, 4.9, { "id": 16777307, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(13, "降噪耳机Ultra", 899, 4.9, { "id": 16777324, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(14, "运动手环Pro", 349, 4.7, { "id": 16777325, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(15, "智能音箱", 299, 4.6, { "id": 16777304, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(16, "无线耳机Air", 249, 4.5, { "id": 16777324, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(17, "智能眼镜", 1599, 4.8, { "id": 16777307, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(18, "降噪耳机Max", 1199, 4.9, { "id": 16777304, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(19, "运动耳机Pro", 399, 4.7, { "id": 16777304, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(20, "智能手环Ultra", 499, 4.8, { "id": 16777307, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(21, "蓝牙音箱Mini", 199, 4.4, { "id": 16777320, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(22, "智能闹钟", 159, 4.3, { "id": 16777307, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(23, "降噪耳机Plus", 599, 4.7, { "id": 16777320, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(24, "运动手环Lite", 199, 4.2, { "id": 16777325, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(25, "无线耳机Pro", 499, 4.8, { "id": 16777320, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(26, "智能灯泡", 99, 4.1, { "id": 16777324, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(27, "便携式投影仪", 899, 4.6, { "id": 16777324, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(28, "智能门锁", 699, 4.7, { "id": 16777307, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(29, "电动牙刷", 299, 4.5, { "id": 16777324, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }),
    new ProductItem(30, "车载空气净化器", 399, 4.4, { "id": 16777324, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" })
];
class ProductList extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.select = 0;
        this.paixu = ['名称', '价格', '评分'];
        this.paixu1 = ['增序', '降序'];
        this.__sortField = new ObservedPropertySimplePU('name', this, "sortField");
        this.__sortOrder = new ObservedPropertySimplePU('asc', this, "sortOrder");
        this.__v = new ObservedPropertySimplePU('', this, "v");
        this.__searchTerm = new ObservedPropertySimplePU('', this, "searchTerm");
        this.__products = new ObservedPropertyObjectPU([...products], this, "products");
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProductList_Params) {
        if (params.select !== undefined) {
            this.select = params.select;
        }
        if (params.paixu !== undefined) {
            this.paixu = params.paixu;
        }
        if (params.paixu1 !== undefined) {
            this.paixu1 = params.paixu1;
        }
        if (params.sortField !== undefined) {
            this.sortField = params.sortField;
        }
        if (params.sortOrder !== undefined) {
            this.sortOrder = params.sortOrder;
        }
        if (params.v !== undefined) {
            this.v = params.v;
        }
        if (params.searchTerm !== undefined) {
            this.searchTerm = params.searchTerm;
        }
        if (params.products !== undefined) {
            this.products = params.products;
        }
    }
    updateStateVars(params: ProductList_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__sortField.purgeDependencyOnElmtId(rmElmtId);
        this.__sortOrder.purgeDependencyOnElmtId(rmElmtId);
        this.__v.purgeDependencyOnElmtId(rmElmtId);
        this.__searchTerm.purgeDependencyOnElmtId(rmElmtId);
        this.__products.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__sortField.aboutToBeDeleted();
        this.__sortOrder.aboutToBeDeleted();
        this.__v.aboutToBeDeleted();
        this.__searchTerm.aboutToBeDeleted();
        this.__products.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    // 排序字段索引
    private select: number;
    // 排序字段选项
    private paixu: string[];
    private paixu1: string[];
    // 当前排序字段
    private __sortField: ObservedPropertySimplePU<'name' | 'price' | 'rating'>;
    get sortField() {
        return this.__sortField.get();
    }
    set sortField(newValue: 'name' | 'price' | 'rating') {
        this.__sortField.set(newValue);
    }
    private __sortOrder: ObservedPropertySimplePU<'asc' | 'desc'>;
    get sortOrder() {
        return this.__sortOrder.get();
    }
    set sortOrder(newValue: 'asc' | 'desc') {
        this.__sortOrder.set(newValue);
    }
    // 搜索输入值
    private __v: ObservedPropertySimplePU<string>;
    get v() {
        return this.__v.get();
    }
    set v(newValue: string) {
        this.__v.set(newValue);
    }
    // 搜索关键词
    private __searchTerm: ObservedPropertySimplePU<string>;
    get searchTerm() {
        return this.__searchTerm.get();
    }
    set searchTerm(newValue: string) {
        this.__searchTerm.set(newValue);
    }
    private __products: ObservedPropertyObjectPU<ProductItem[]>;
    get products() {
        return this.__products.get();
    }
    set products(newValue: ProductItem[]) {
        this.__products.set(newValue);
    }
    // 创建独立副本
    // 获取过滤和排序后的产品列表
    getFilteredAndSortedProducts(): ProductItem[] {
        let result = [...this.products];
        // 根据搜索词过滤产品
        if (this.searchTerm?.trim()) {
            const searchTermLower = this.searchTerm.toLowerCase();
            result = result.filter(item => item.name.toLowerCase().includes(searchTermLower));
        }
        // 对产品进行排序
        result.sort((a, b) => {
            let comparison = 0;
            // 根据排序字段获取比较值
            switch (this.sortField) {
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
                case 'price':
                    comparison = a.price - b.price;
                    break;
                case 'rating':
                    comparison = a.rating - b.rating;
                    break;
                default:
                    return 0;
            }
            // 根据排序顺序调整结果
            return this.sortOrder === 'asc' ? comparison : -comparison;
        });
        return result;
    }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(108:5)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(109:7)", "entry");
            Row.alignSelf(ItemAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777299, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(110:9)", "entry");
            Image.width(24);
            Image.height(24);
            Image.margin({ top: 10, left: 20 });
            Image.onClick(() => {
                router.back(); // 返回到上一页
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 搜索
            Search.create({ value: this.searchTerm, placeholder: "搜索商品..." });
            Search.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(119:7)", "entry");
            // 搜索
            Search.onChange((value: string) => {
                this.searchTerm = value;
            });
            // 搜索
            Search.width('90%');
            // 搜索
            Search.margin({ top: 16, bottom: 10 });
            // 搜索
            Search.backgroundColor('#f5f5f5');
        }, Search);
        // 搜索
        Search.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 排序控制按钮
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(127:7)", "entry");
            // 排序控制按钮
            Row.justifyContent(FlexAlign.Center);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel("排序: " + (this.paixu[this.sortField === 'name' ? 0 : this.select === 1 ? 1 : 2]));
            Button.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(128:9)", "entry");
            Button.margin(20);
            Button.onClick(() => {
                const currentFieldIndex = this.sortField === 'name' ? 0 : this.sortField === 'price' ? 1 : 2;
                this.getUIContext().showTextPickerDialog({
                    range: this.paixu,
                    selected: currentFieldIndex,
                    defaultPickerItemHeight: 40,
                    onAccept: (value: TextPickerResult) => {
                        const selectedIndex = Array.isArray(value.index) ? value.index[0] : value.index;
                        this.select = selectedIndex === 0 ? 0 : selectedIndex === 1 ? 1 : 2;
                        this.sortField = ['name', 'price', 'rating'][selectedIndex] as 'name' | 'price' | 'rating';
                        console.info("Selected sort field: " + this.sortField);
                    }
                });
            });
        }, Button);
        Button.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 排序顺序选择按钮
            Button.createWithLabel("价格: " + (this.paixu1[this.sortOrder === 'asc' ? 0 : 1]));
            Button.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(146:9)", "entry");
            // 排序顺序选择按钮
            Button.margin(20);
            // 排序顺序选择按钮
            Button.onClick(() => {
                const currentOrderIndex = this.sortOrder === 'asc' ? 0 : 1;
                this.getUIContext().showTextPickerDialog({
                    range: this.paixu1,
                    selected: currentOrderIndex,
                    defaultPickerItemHeight: 40,
                    onAccept: (value: TextPickerResult) => {
                        const selectedIndex = Array.isArray(value.index) ? value.index[0] : value.index;
                        this.sortOrder = selectedIndex === 0 ? 'asc' : 'desc';
                        console.info("Selected sort order: " + this.sortOrder);
                    },
                });
            });
        }, Button);
        // 排序顺序选择按钮
        Button.pop();
        // 排序控制按钮
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 产品列表
            List.create({ space: 10 });
            List.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(167:7)", "entry");
            // 产品列表
            List.width('100%');
            // 产品列表
            List.height('100%');
            // 产品列表
            List.backgroundColor(Color.White);
        }, List);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            ForEach.create();
            const forEachItemGenFunction = _item => {
                const item = _item;
                {
                    const itemCreation = (elmtId, isInitialRender) => {
                        ViewStackProcessor.StartGetAccessRecordingFor(elmtId);
                        itemCreation2(elmtId, isInitialRender);
                        if (!isInitialRender) {
                            ListItem.pop();
                        }
                        ViewStackProcessor.StopGetAccessRecording();
                    };
                    const itemCreation2 = (elmtId, isInitialRender) => {
                        ListItem.create(deepRenderFunction, true);
                        ListItem.width('100%');
                        ListItem.border({ width: 1, color: '#f0f0f0' });
                        ListItem.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(169:11)", "entry");
                    };
                    const deepRenderFunction = (elmtId, isInitialRender) => {
                        itemCreation(elmtId, isInitialRender);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(170:13)", "entry");
                            Row.onClick(() => {
                                // 点击跳转到详情页
                                this.getUIContext().getRouter().pushUrl({
                                    url: "pages/zonghezuoye/ProductDetailPage",
                                    params: {
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        rating: item.rating,
                                        productId: item.id
                                    }
                                });
                            });
                            Row.width('100%');
                            Row.padding(12);
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Image.create(item.image);
                            Image.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(171:15)", "entry");
                            Image.width(120);
                            Image.height(120);
                            Image.margin({ right: 20 });
                            Image.backgroundColor("#eee");
                            Image.borderRadius(8);
                        }, Image);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Column.create();
                            Column.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(177:15)", "entry");
                            Column.layoutWeight(1);
                        }, Column);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(item.name);
                            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(178:17)", "entry");
                            Text.fontSize(18);
                            Text.margin({ bottom: 8 });
                            Text.maxLines(1);
                            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`${item.price}元`);
                            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(183:17)", "entry");
                            Text.fontColor('#ff5722');
                            Text.fontSize(18);
                            Text.margin({ bottom: 8 });
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Row.create();
                            Row.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(187:17)", "entry");
                            Row.justifyContent(FlexAlign.SpaceBetween);
                            Row.width('100%');
                        }, Row);
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            Text.create(`${item.rating}星`);
                            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(188:19)", "entry");
                            Text.fontColor('#666');
                        }, Text);
                        Text.pop();
                        this.observeComponentCreation2((elmtId, isInitialRender) => {
                            // 加入购物车按钮
                            Button.createWithLabel("加入购物车");
                            Button.debugLine("entry/src/main/ets/pages/zonghezuoye/ListPage.ets(191:19)", "entry");
                            // 加入购物车按钮
                            Button.width("70%");
                            // 加入购物车按钮
                            Button.height(32);
                            // 加入购物车按钮
                            Button.fontSize(14);
                            // 加入购物车按钮
                            Button.type(ButtonType.Capsule);
                            // 加入购物车按钮
                            Button.backgroundColor('#ff5722');
                            // 加入购物车按钮
                            Button.fontColor(Color.White);
                            // 加入购物车按钮
                            Button.onClick(() => {
                                this.getUIContext().getRouter().pushUrl({
                                    url: "pages/zonghezuoye/ProductDetailPage",
                                    params: {
                                        id: item.id,
                                        name: item.name,
                                        price: item.price,
                                        rating: item.rating,
                                        productId: item.id
                                    }
                                });
                            });
                        }, Button);
                        // 加入购物车按钮
                        Button.pop();
                        Row.pop();
                        Column.pop();
                        Row.pop();
                        ListItem.pop();
                    };
                    this.observeComponentCreation2(itemCreation2, ListItem);
                    ListItem.pop();
                }
            };
            this.forEachUpdateFunction(elmtId, this.getFilteredAndSortedProducts(), forEachItemGenFunction, (item: ProductItem) => item.id.toString(), false, false);
        }, ForEach);
        ForEach.pop();
        // 产品列表
        List.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ProductList";
    }
}
registerNamedRoute(() => new ProductList(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/zonghezuoye/ListPage", pageFullPath: "entry/src/main/ets/pages/zonghezuoye/ListPage", integratedHsp: "false", moduleType: "followWithHap" });
