if (!("finalizeConstruction" in ViewPU.prototype)) {
    Reflect.set(ViewPU.prototype, "finalizeConstruction", () => { });
}
interface ProductDetailPage_Params {
    productId?: number;
    product?: ProductItem | null;
    isFavorite?: boolean;
    name?: string;
    price?: number;
    rating?: number;
    image?: Resource;
    message?: boolean;
    context?;
    preferences?;
}
import router from "@ohos:router";
import preferences from "@ohos:data.preferences";
import type common from "@ohos:app.ability.common";
import { ProductItem, products } from "@bundle:com.example.newsrelease/entry/ets/pages/zonghezuoye/ListPage";
// 定义路由参数接口
interface ListPage {
    id: string;
    name: string;
    price: string;
    rating: string;
    image: string;
}
class ProductDetailPage extends ViewPU {
    constructor(parent, params, __localStorage, elmtId = -1, paramsLambda = undefined, extraInfo) {
        super(parent, __localStorage, elmtId, extraInfo);
        if (typeof paramsLambda === "function") {
            this.paramsGenerator_ = paramsLambda;
        }
        this.__productId = new ObservedPropertySimplePU(0, this, "productId");
        this.__product = new ObservedPropertyObjectPU(null, this, "product");
        this.__isFavorite = new ObservedPropertySimplePU(false, this, "isFavorite");
        this.__name = new ObservedPropertySimplePU('', this, "name");
        this.__price = new ObservedPropertySimplePU(0, this, "price");
        this.__rating = new ObservedPropertySimplePU(0, this, "rating");
        this.__image = new ObservedPropertyObjectPU({ "id": 16777324, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" }, this, "image");
        this.__message = new ObservedPropertySimplePU(true, this, "message");
        this.context = this.getUIContext().getHostContext() as common.UIAbilityContext;
        this.preferences = preferences.getPreferencesSync(this.context, { name: 'favoritePrefs' });
        this.setInitiallyProvidedValue(params);
        this.finalizeConstruction();
    }
    setInitiallyProvidedValue(params: ProductDetailPage_Params) {
        if (params.productId !== undefined) {
            this.productId = params.productId;
        }
        if (params.product !== undefined) {
            this.product = params.product;
        }
        if (params.isFavorite !== undefined) {
            this.isFavorite = params.isFavorite;
        }
        if (params.name !== undefined) {
            this.name = params.name;
        }
        if (params.price !== undefined) {
            this.price = params.price;
        }
        if (params.rating !== undefined) {
            this.rating = params.rating;
        }
        if (params.image !== undefined) {
            this.image = params.image;
        }
        if (params.message !== undefined) {
            this.message = params.message;
        }
        if (params.context !== undefined) {
            this.context = params.context;
        }
        if (params.preferences !== undefined) {
            this.preferences = params.preferences;
        }
    }
    updateStateVars(params: ProductDetailPage_Params) {
    }
    purgeVariableDependenciesOnElmtId(rmElmtId) {
        this.__productId.purgeDependencyOnElmtId(rmElmtId);
        this.__product.purgeDependencyOnElmtId(rmElmtId);
        this.__isFavorite.purgeDependencyOnElmtId(rmElmtId);
        this.__name.purgeDependencyOnElmtId(rmElmtId);
        this.__price.purgeDependencyOnElmtId(rmElmtId);
        this.__rating.purgeDependencyOnElmtId(rmElmtId);
        this.__image.purgeDependencyOnElmtId(rmElmtId);
        this.__message.purgeDependencyOnElmtId(rmElmtId);
    }
    aboutToBeDeleted() {
        this.__productId.aboutToBeDeleted();
        this.__product.aboutToBeDeleted();
        this.__isFavorite.aboutToBeDeleted();
        this.__name.aboutToBeDeleted();
        this.__price.aboutToBeDeleted();
        this.__rating.aboutToBeDeleted();
        this.__image.aboutToBeDeleted();
        this.__message.aboutToBeDeleted();
        SubscriberManager.Get().delete(this.id__());
        this.aboutToBeDeletedInternal();
    }
    private __productId: ObservedPropertySimplePU<number>;
    get productId() {
        return this.__productId.get();
    }
    set productId(newValue: number) {
        this.__productId.set(newValue);
    }
    private __product: ObservedPropertyObjectPU<ProductItem | null>;
    get product() {
        return this.__product.get();
    }
    set product(newValue: ProductItem | null) {
        this.__product.set(newValue);
    }
    private __isFavorite: ObservedPropertySimplePU<boolean>;
    get isFavorite() {
        return this.__isFavorite.get();
    }
    set isFavorite(newValue: boolean) {
        this.__isFavorite.set(newValue);
    }
    private __name: ObservedPropertySimplePU<string>;
    get name() {
        return this.__name.get();
    }
    set name(newValue: string) {
        this.__name.set(newValue);
    }
    private __price: ObservedPropertySimplePU<number>;
    get price() {
        return this.__price.get();
    }
    set price(newValue: number) {
        this.__price.set(newValue);
    }
    private __rating: ObservedPropertySimplePU<number>;
    get rating() {
        return this.__rating.get();
    }
    set rating(newValue: number) {
        this.__rating.set(newValue);
    }
    private __image: ObservedPropertyObjectPU<Resource>; // 设置默认值
    get image() {
        return this.__image.get();
    }
    set image(newValue: Resource) {
        this.__image.set(newValue);
    }
    private __message: ObservedPropertySimplePU<boolean>;
    get message() {
        return this.__message.get();
    }
    set message(newValue: boolean) {
        this.__message.set(newValue);
    }
    private context;
    private preferences;
    // 加载收藏状态
    private loadFavoriteStatus(): void {
        const favoriteList = this.preferences.getSync('favorites', []) as Array<number>;
        this.isFavorite = favoriteList.includes(this.productId);
    }
    // aboutToAppear(): void {
    //   const params = router.getParams();
    //
    //   if (params) {
    //     const routeParams = params as ListPage;
    //     const productId = parseInt(routeParams.id || '0');
    //     this.productId = productId;
    //     this.name = routeParams.name || '';
    //     this.price = parseFloat(routeParams.price || '0');
    //     this.rating = parseFloat(routeParams.rating || '0');
    //     const foundProduct = products.find(p => p.id === productId);
    //     if (foundProduct) {
    //       this.image = foundProduct.image;
    //       // 直接使用原商品的 Resource 对象
    //     } else {
    //       // 如果找不到对应商品，使用默认图片
    //       this.image = $r('app.media.earphone');
    //     }
    //     // 加载商品信息
    //     this.loadProduct();
    //     // 检查是否已收藏
    //     this.checkFavorite();
    //   }
    // }
    // 页面加载时获取路由参数并初始化数据
    aboutToAppear(): void {
        const params = router.getParams(); //获取路由参数
        if (params) {
            const routeParams = params as ListPage;
            //通过 router.getParams() 获取传递给页面的路由参数将参数转换为 ListPage 接口类型
            this.productId = parseInt(routeParams.id || '0');
            //从路由参数中获取产品ID，如果不存在则默认为'0'
            const foundProduct = products.find(p => p.id === this.productId);
            //在全局 products 数组中查找匹配 productId 的产品
            if (foundProduct) { //如果找到匹配的产品，直接使用该产品对象
                this.product = foundProduct;
            }
            else { //如果未找到，则根据路由参数创建新的 ProductItem 实例
                // 使用默认值创建产品
                this.product = new ProductItem(this.productId, routeParams.name || '', parseFloat(routeParams.price || '0'), parseFloat(routeParams.rating || '0'), { "id": 16777324, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            }
            this.loadFavoriteStatus();
        }
    }
    //保存收藏状态
    private saveFavoriteStatus(): void {
        let favoriteList = this.preferences.getSync('favorites', []) as Array<number>;
        // 判断是否已收藏
        if (this.isFavorite) {
            //如果未收藏
            if (!favoriteList.includes(this.productId)) {
                // 添加到收藏
                favoriteList.push(this.productId);
            }
        }
        else {
            // ..filter是筛选
            favoriteList = favoriteList.filter(id => id !== this.productId);
        }
        this.preferences.putSync('favorites', favoriteList);
        this.preferences.flushSync();
    }
    // 加载商品信息
    loadProduct(): void {
        this.product = new ProductItem(this.productId, this.name, this.price, this.rating, this.image);
        this.checkFavorite();
    }
    // 检查是否已收藏
    checkFavorite(): void {
        // 可对接本地存储或用户偏好设置
        this.loadFavoriteStatus();
    }
    // 切换收藏状态
    toggleFavorite(): void {
        this.isFavorite = !this.isFavorite;
        this.saveFavoriteStatus();
    }
    // 保存收藏状态
    // private async saveFavoriteStatus(): Promise<void> {
    //   try {
    //     if (!this.pref) {
    //       this.pref = await dataPreferences.getPreferences(getContext(this), 'favoritePrefs');
    //     }
    //     if (this.pref) {
    //       let favoriteList = (await this.pref.get('favorites', [])) as Array<number>;
    //
    //       if (this.isFavorite) {
    //         if (!favoriteList.includes(this.productId)) {
    //           favoriteList.push(this.productId);
    //         }
    //       } else {
    //         favoriteList = favoriteList.filter(id => id !== this.productId);
    //       }
    //
    //       await this.pref.put('favorites', favoriteList);
    //       await this.pref.flush();
    //     }
    //   } catch (error) {
    //     console.error('保存收藏状态失败:', error);
    //   }
    // }
    initialRender() {
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(158:5)", "entry");
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(159:7)", "entry");
            Row.alignSelf(ItemAlign.Start);
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Image.create({ "id": 16777299, "type": 20000, params: [], "bundleName": "com.example.newsrelease", "moduleName": "entry" });
            Image.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(160:9)", "entry");
            Image.width(24);
            Image.height(24);
            Image.margin({ top: 10, left: 20 });
            Image.onClick(() => {
                router.back();
            });
        }, Image);
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品图片
            Image.create(this.product?.image);
            Image.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(169:7)", "entry");
            // 商品图片
            Image.width('100%');
            // 商品图片
            Image.height(300);
            // 商品图片
            Image.objectFit(ImageFit.Contain);
            // 商品图片
            Image.margin({ top: 20, bottom: 20 });
        }, Image);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(this.product?.name || '');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(175:7)", "entry");
            Text.fontSize(24);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 10 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.product?.price}元`);
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(180:7)", "entry");
            Text.fontColor('#ff5722');
            Text.fontSize(20);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Row.create();
            Row.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(186:7)", "entry");
            Row.justifyContent(FlexAlign.SpaceBetween);
            Row.width('100%');
            Row.margin({ bottom: 20 });
        }, Row);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create(`${this.product?.rating}星`);
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(187:9)", "entry");
            Text.fontColor('#666');
            Text.fontSize(16);
            Text.margin({ left: 20 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Button.createWithLabel(this.isFavorite ? '已收藏' : '收藏');
            Button.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(192:9)", "entry");
            Button.width(100);
            Button.height(32);
            Button.fontSize(14);
            Button.margin({ right: 20 });
            Button.type(ButtonType.Capsule);
            Button.backgroundColor(this.isFavorite ? '#ff5722' : '#f5f5f5');
            Button.fontColor(this.isFavorite ? Color.White : Color.Black);
            Button.onClick(() => {
                this.toggleFavorite(); //切换收藏状态
            });
        }, Button);
        Button.pop();
        Row.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 商品描述区域
            Column.create();
            Column.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(208:7)", "entry");
            // 商品描述区域
            Column.width('100%');
            // 商品描述区域
            Column.margin({ bottom: 80 });
        }, Column);
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('商品描述:');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(209:9)", "entry");
            Text.fontSize(16);
            Text.fontWeight(FontWeight.Bold);
            Text.margin({ bottom: 8 });
        }, Text);
        Text.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            Text.create('这是一款高品质的商品，具有出色的性能和用户体验。');
            Text.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(214:9)", "entry");
            Text.fontSize(14);
            Text.lineHeight(20);
            Text.maxLines(5);
            Text.textOverflow({ overflow: TextOverflow.Ellipsis });
        }, Text);
        Text.pop();
        // 商品描述区域
        Column.pop();
        this.observeComponentCreation2((elmtId, isInitialRender) => {
            // 购物车按钮
            Button.createWithLabel(this.message ? "添加到购物车" : "已添加");
            Button.debugLine("entry/src/main/ets/pages/zonghezuoye/ProductDetailPage.ets(224:9)", "entry");
            // 购物车按钮
            Button.width('80%');
            // 购物车按钮
            Button.height(40);
            // 购物车按钮
            Button.fontSize(16);
            // 购物车按钮
            Button.type(ButtonType.Capsule);
            // 购物车按钮
            Button.backgroundColor('#ff5722');
            // 购物车按钮
            Button.fontColor(Color.White);
            // 购物车按钮
            Button.onClick(() => {
                this.message = !this.message;
                console.log('已添加到购物车');
                if (this.product) { //
                    console.log(`商品 "${this.product.name}" 已添加到购物车`);
                }
            });
        }, Button);
        // 购物车按钮
        Button.pop();
        Column.pop();
    }
    rerender() {
        this.updateDirtyElements();
    }
    static getEntryName(): string {
        return "ProductDetailPage";
    }
}
registerNamedRoute(() => new ProductDetailPage(undefined, {}), "", { bundleName: "com.example.newsrelease", moduleName: "entry", pagePath: "pages/zonghezuoye/ProductDetailPage", pageFullPath: "entry/src/main/ets/pages/zonghezuoye/ProductDetailPage", integratedHsp: "false", moduleType: "followWithHap" });
