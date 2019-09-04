import {Injectable} from '@angular/core';
import {HttpClient, HttpEventType, HttpHeaders, HttpParams} from '@angular/common/http';
import {Company, Contact, Paginated} from '../_models';
import {Observable} from 'rxjs/internal/Observable';
import {map} from 'rxjs/operators';

@Injectable()
export class ProductsService {
    public products: any = [];
    public productImage: File;
    public product: string;
    public cartItemsQuantity: number;

    constructor(private http: HttpClient) {
    }
    static paramsObjToHttpParams<T>(paramsObj?:object): HttpParams {
        let params = new HttpParams();
        if (paramsObj !== null && paramsObj !== undefined) {
            // we were given filtering criteria, build the query string
            Object.keys(paramsObj).sort().forEach(key => {
                const value = paramsObj[key];
                if (value !== null) {
                    params = params.set(key, value.toString());
                }
            });
        }

        return params
    }

    getProductImage(image: File) {
        this.productImage = image;

    }

    setProductImage() {
        return this.productImage;
    }

    setCartItemsQuantity(items) {
        this.cartItemsQuantity = items;
    }

    getCartItemsQuantity() {
        return this.cartItemsQuantity;
    }

    getProductInfoStep(productInfoStep2) {
        this.product = productInfoStep2;
    }

    setProductInfoStep() {
        return this.product;
    }

    getBestSellers() {
        return this.http.get('products/?ordering=-price&limit=8');
    }

    allProducts(token) {
        return this.http.get('products/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    sellerProductPageCategory(token, category, query) {
        let q = '';
        if (category === 'all') {
            this.sellerProductPage(token, q);
        }
        else {
            return this.http.get(`products/?seller=me&${category}=True&draft=False&archived=False${query}`, {
                headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
            })
        }
    }

    sellerProduct(token, query, paramsObj?:object):Observable<Paginated<Product>> {
        console.log(`getProducts params=${JSON.stringify(paramsObj)}`)
        const url = `products/${query}`
        const params = ProductsService.paramsObjToHttpParams(paramsObj)

        return this.http.get<Paginated<Product>>(url, {
                    headers: new HttpHeaders().set('Authorization', 'JWT ' + token),
                    params: params
                })
    }
    sellerProductForVisitor( query, paramsObj?:object):Observable<Paginated<Product>> {
        console.log(`getProducts params=${JSON.stringify(paramsObj)}`)
        const url = `products/${query}`
        const params = ProductsService.paramsObjToHttpParams(paramsObj)

        return this.http.get<Paginated<Product>>(url, {
            params: params
        })
    }
    sellerProductPage(token, query) {
        return this.http.get(`products/?seller=me&published=True&draft=False&archived=False${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allSellerDraftsPages(token, query) {
        return this.http.get(`products/?seller=me&draft=True${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    buyerProductsPage(token, query) {
        console.log(`products/?published=True${query}`)
        return this.http.get(`products/?published=True${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    sellerFilterProducts(token, filter, category) {
        if(category === 'all' || !category) {
            return this.http.get('products/?seller=me&published=True&hidden=True&show_showroom_products=True&draft=False&archived=False' + filter, {
                headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
            })
        }
        else {
            return this.http.get(`products/?seller=me&${category}=True&draft=False&archived=False` + filter, {
                headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
            })
        }
    }

    buyerFilterProducts(token, filter) {
        return this.http.get('products/?published=True' + filter, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allPagesBuyerFilterProducts(token, filter, query) {
        return this.http.get(`products/?published=True${query}` + filter, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allPagesSellerFilterProducts(token, filter, query) {
        return this.http.get(`products/?seller=me&published=True${query}` + filter, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    buyerSearchProducts(token, search) {
        return this.http.get('products/' + search, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    buyerSearchProductsPages(token, search, query) {
        return this.http.get(`products/?search=${search}${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    buyerSearchProductsPagesFiltered(token, filter, query) {
        return this.http.get(`products/${filter}${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    visitorSearchProductsPages( query) {
        return this.http.get(`products/${query}`)
    }

    buyerSearchProductsFilter(token, search) {
        return this.http.get('products/' + search, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    visitorSearchProductsPagesFiltered(filter) {
        return this.http.get(`products/${filter}`)
    }


    allPagesArchiveSellerProducts(token, query) {
        return this.http.get(`products/?seller=me&archived=True${query}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    archiveFilterProductsPages(token, query, filter) {
        return this.http.get(`products/?seller=me&archived=True${query}` + filter, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allDraftsSellerProductsPages(token, query, filter) {
        return this.http.get(`products/?seller=me&draft=True${query}` + filter, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allSellerBrands(token) {
        return this.http.get('profile/brands/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allSellerPrepacks(token) {
        return this.http.get('profile/pre-packs/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allSI(token) {
        return this.http.get('profile/sales-identities/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    allBrands(token) {
        return this.http.get('profile/brands/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    editSI(token, id) {
        return this.http.get('profile/sales-identities/' + id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    archiveProduct(token, id) {
        return this.http.post('products/' + id + '/archive/', id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
   // https://shoenic.dev.tseh20.com/api/v1/products/{product_id}/start-dialog/request-sample/
    requestSample(token, product_id) {
        return this.http.post('products/' + product_id + '/start-dialog/request-sample/', null, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    
    contactUs(token, product_id) {
        return this.http.post('products/' + product_id + '/start-dialog/contact-us/', null, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    getCarts(token) {
        return this.http.get('carts/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    getCartInfo(token, id) {
        return this.http.get('/carts/' + id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    getSellerCart(token, id) {
        return this.http.get('sellercarts/' + id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    getSellerCartVisitor(id) {
        return this.http.get('sellercarts/' + id)
    }
    createNewCart(token, items) {
        return this.http.post('carts/', items, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    createSellerCart(token, items) {
        return this.http.post('sellercarts/', items, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    createOrder(token, items) {
        return this.http.post('orders/', items, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    addItemsCart(token, cart_id, items) {
        return this.http.put('carts/' + cart_id, items, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    updateItemsCart(token, cart_id, item_id, items) {
        return this.http.put('carts/' + cart_id + '/' + item_id, items, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })

    }

    removeItemsCart(token, cart_id, item_id) {
        return this.http.delete('carts/' + cart_id + '/' + item_id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    clearCart(token, cart_id) {
        return this.http.delete('carts/' + cart_id + '/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    undoArchive(token, id) {
        return this.http.delete('products/' + id + '/archive/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    editBrand(token, id) {
        return this.http.get('profile/brands/' + id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    editPrepack(token, id) {
        return this.http.get('profile/pre-packs/' + id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    saveBrand(brand, token) {
        return this.http.post('profile/brands/', brand, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    saveNewPrepack(prepack, token) {
        return this.http.post('profile/pre-packs/', prepack, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    saveSI(sales, token) {
        return this.http.post('profile/sales-identities/', sales, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    saveBrandNew(brand, token) {
        return this.http.post('profile/brands/', brand, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }


    updateSI(sales, id, token) {
        return this.http.put('profile/sales-identities/' + id, sales, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    updateBrand(brand, id, token) {
        return this.http.put('profile/brands/' + id, brand, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }


    updatePrepack(brand, id, token) {
        return this.http.put('profile/pre-packs/' + id, brand, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    deleteSI(token, id) {
        return this.http.delete('profile/sales-identities/' + id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    deleteBrand(token, id) {
        return this.http.delete('profile/brands/' + id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    deletePrepack(token, id) {
        return this.http.delete('profile/pre-packs/' + id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    getProduct(token, id) {
        return this.http.get('products/' + id, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    getProductForVisitor(id) {
        return this.http.get('products/' + id)
    }

    makeProductOrder(token, id, order) {
        return this.http.post('accounts/product/' + id + '/make-order/', order, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    batch(token, operations) {
        return this.http.post('batch/', operations,  {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    deleteProduct(token, id) {
        return this.http.delete('accounts/product/' + id, {
                headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
            }
        )
    }

    uploadImage(file, token) {
        const formData: FormData = new FormData();
        formData.append('img', file, file.name);
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'JWT ' + token);
        return this.http.post('upload-image/', formData, {headers: headers})
    }

    productChoises(token, lang_code) {
        return this.http.get(`choices/?lang=${lang_code}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    productChoisesVisitor(lang_code) {
        return this.http.get(`choices/?lang=${lang_code}`)
    }


    productSellers(token) {
        return this.http.get('accounts/sellers/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    addProduct(token, product) {
        return this.http.post('products/publish/', product, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    updateProduct(token, product) {
        return this.http.post('products/publish/', product, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    editProduct(token, id, product) {
        return this.http.post('products/' + id + '/publish/', product, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    addDraft(token, product) {
        return this.http.post('products/draft/', product, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    saveDraft(token, id, product) {
        return this.http.post('products/' + id + '/draft/', product, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    
    updateOrder(token, item_id, items) {
        return this.http.put('orders/' + item_id, items, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })

    }

    getOrderInfo(token, orderId) {
        return this.http.get('orders/' + orderId, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    
    getOrders(token, query) {
        return this.http.get('orders/' + query, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    ordersSorting(token, params) {
        return this.http.get('orders/' + params, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    acceptOrder(token, id) {
        return this.http.post('orders/' + id + '/approve/', id,{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    declineOrder(token, id) {
        return this.http.post('orders/' + id + '/decline/', id,{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    archiveOrder(token, id) {
        return this.http.post('orders/' + id + '/archive/', id,{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    unarchiveOrder(token, id) {
        return this.http.delete('orders/' + id + '/archive/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    getGroupProductFile(token) {
        return this.http.get('data-importer/template/', {
            responseType: 'arraybuffer',
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    public postGroupProductFile(fd, token) {
        return this.http.post<any>('data-importer/template', fd, {
            reportProgress: true,
            observe: 'events',
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        }).pipe(map((event) => {
            console.log(event)
                switch (event.type) {

                    case HttpEventType.UploadProgress:
                        let progress = Math.round(100 * event.loaded / event.total);
                        return { status: 'progress', message: progress };

                    case HttpEventType.Response:
                        return event.body;
                    default:
                        return `Unhandled event: ${event.type}`;
                }
            })
        );
    }

    getUploadHistory(query, token) {
        return this.http.get('data-importer/jobs/'+ query, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    getJobInfo(id, token) {
        return this.http.get('data-importer/jobs/' + id + '/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    deleteJobFromHistory(id, token) {
        return this.http.delete('data-importer/jobs/' + id + '/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    cancelJob(id, token) {
        return this.http.post('data-importer/jobs/' + id + '/cancel', null, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    draftProccessedProducts(id, token) {
        return this.http.post('data-importer/jobs/' + id + '/draft', null, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    publishProccessedProducts(id, token) {
        return this.http.post('data-importer/jobs/' + id + '/publish', null, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
   
    unhideProduct(token, id) {
        return this.http.delete(`products/${id}/hide`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    hideProduct(token, id) {
        return this.http.post(`products/${id}/hide`, null,{
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }

    getCompositionTypeInternal(token) {
        return this.http.get('composition/type=internal/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    getCompositionTypeInternalForVisitor() {
        return this.http.get('composition/type=internal/')
    }
    getCompositionTypeOuter(token) {
        return this.http.get('composition/type=outer/', {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    getCompositionTypeOuterForVisitor() {
        return this.http.get('composition/type=outer/')
    }

    getSellers(token, offset) {
        return this.http.get(`sellers/?limit=100&offset=${offset}`, {
            headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
        })
    }
    getSellersForVisitor(offset) {
        return this.http.get(`sellers/?limit=100&offset=${offset}`)
    }


    getBrands(token, offset, shop?, seller_id?) {
        if (shop) {
            return this.http.get(`brands/?seller=${seller_id}&offset=${offset}&limit=100`, {
                headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
            })
        } else {
            return this.http.get(`brands/?offset=${offset}&limit=100`, {
                headers: new HttpHeaders().set('Authorization', 'JWT ' + token)
            })
        }

    }
    getBrandsForVisitor(offset, shop?, seller_id?) {
        if (shop) {
            return this.http.get(`brands/?seller=${seller_id}&offset=${offset}&limit=100`)
        } else {
            return this.http.get(`brands/?offset=${offset}&limit=100`)
        }
    }

}




