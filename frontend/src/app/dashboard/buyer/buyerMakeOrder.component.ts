import {Component, OnInit, ViewChild, PLATFORM_ID} from '@angular/core';
import {ProductsService, ModalService, UserService, AlertService} from '../../_services/index';
import {Router, ActivatedRoute} from '@angular/router';
import {Inject} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import {NgForm} from '@angular/forms';


@Component({
    templateUrl: 'buyerMakeOrder.component.html',
    styleUrls: ['buyerMakeOrder.component.css']
})

export class BuyerMakeOrderComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    finalProducts: any = [];
    sellers: any = [];
    discount: any = [];
    cartInfo: any = [];
    unique: any = [];
    cartItems: any = [];
    sizes: any = [];
    selectItem: any = [];
    selectItems: any = [];
    edit: any = [];
    updateItems: any = [];
    editSizes: any = [];
    disabledMakeOrder: boolean = false;
    displayOrderPanel: boolean = false;
    displayErorDiscount: any = [];
    displayErorQuantity: boolean = false;
    displayErorPrepackQuantity: boolean = false;
    orderQuantity: number;
    productInfo: any;
    itemsLength: number;
    itemUpdate: any;
    public cartQuantity: number;
    originalInfo: any;
    errorIndex: any = [];
    Object = Object;
    orderNumber: number;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private modalService: ModalService,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private router: Router,
        private  alertService: AlertService,
        private userService: UserService,
        @Inject(PLATFORM_ID) private platformId: any
    ) {
    }

    ngOnInit() {
        this.productsService.getCarts(this.userService.getCurrentUserToken()).subscribe(
            data => {
                this.cartInfo = data;
            });
        window.scroll(0, 0);
        this.getItems();
    }


    onDiscountGroupChange(value, items, productGroupOrder) {
        let discount = value.replace('%', '');
        let newDiscount = Number(discount);
        if (newDiscount > 100) {
            this.discount[productGroupOrder].error = true;
            this.discount[productGroupOrder].value = 0;
            this.discount[productGroupOrder].sumTotalDiscount = this.discount[productGroupOrder].sumTotal;
            for (let i = 0; i < items.length; i++) {
                items[i].discount_percent = 0;
                items[i].total_price_with_discount = items[i].total_price;
                items[i].product.discount = '0%';
            }
        } else {
            this.discount[productGroupOrder].error = false;
            this.discount[productGroupOrder].value = newDiscount;
            this.discount[productGroupOrder].sumTotalDiscount = this.discount[productGroupOrder].sumTotal - (this.discount[productGroupOrder].sumTotal * newDiscount) / 100;
            this.discount[productGroupOrder].discount = newDiscount + '%';
            for (let i = 0; i < items.length; i++) {
                items[i].discount_percent = newDiscount;
                items[i].total_price_with_discount = items[i].total_price - (items[i].total_price * newDiscount) / 100;
                items[i].product.discount = newDiscount + '%';
            }
        }
    }

    onDiscountGroupPlus(items, productGroupOrder) {
        if (!this.disabledMakeOrder) {
            let discount = this.discount[productGroupOrder].discount.replace('%', '');
            let newDiscount = Number(discount) + 5;
            this.discount[productGroupOrder].value = newDiscount;
            this.discount[productGroupOrder].sumTotalDiscount = this.discount[productGroupOrder].sumTotal - (this.discount[productGroupOrder].sumTotal * newDiscount) / 100;
            this.discount[productGroupOrder].discount = newDiscount + '%';
            for (let i = 0; i < items.length; i++) {
                items[i].discount_percent = newDiscount;
                items[i].total_price_with_discount = items[i].total_price - (items[i].total_price * newDiscount) / 100;
                items[i].product.discount = newDiscount + '%';
            }
        }
    }

    onDiscountGroupMinus(items, productGroupOrder) {
        if (!this.disabledMakeOrder) {
            let discount = this.discount[productGroupOrder].discount.replace('%', '');
            let newDiscount = Number(discount) - 5;
            this.discount[productGroupOrder].value = newDiscount;
            this.discount[productGroupOrder].discount = newDiscount + '%';
            this.discount[productGroupOrder].sumTotalDiscount = this.discount[productGroupOrder].sumTotal - (this.discount[productGroupOrder].sumTotal * newDiscount) / 100;
            for (let i = 0; i < items.length; i++) {
                items[i].discount_percent = newDiscount;
                items[i].total_price_with_discount = items[i].total_price - (items[i].total_price * newDiscount) / 100;
                items[i].product.discount = newDiscount + '%';
            }
        }
    }

    onDiscountPlus(item, i, items) {
        if (this.disabledMakeOrder) {
            let discount = item.product.discount.replace('%', '');
            let newDiscount = Number(discount) + 5;
            newDiscount = Math.max(0, Math.min(100, newDiscount));
            item.discount_percent = newDiscount;
            item.total_price_with_discount = item.total_price - (item.total_price * newDiscount) / 100;
            item.product.discount = newDiscount + '%';
            let sumTotalDiscount = null;
            items.forEach(item => sumTotalDiscount = sumTotalDiscount + item.total_price_with_discount);
            this.discount[i].sumTotalDiscount = sumTotalDiscount;
        }
    }

    onDiscountMinus(item, i, items) {
        if (this.disabledMakeOrder) {
            let discount = item.product.discount.replace('%', '');
            let newDiscount = Number(discount) - 5;
            newDiscount = Math.max(0, Math.min(100, newDiscount));
            item.discount_percent = newDiscount;
            item.total_price_with_discount = item.total_price - (item.total_price * newDiscount) / 100;
            item.product.discount = newDiscount + '%';
            let sumTotalDiscount = null;
            items.forEach(item => sumTotalDiscount = sumTotalDiscount + item.total_price_with_discount);
            this.discount[i].sumTotalDiscount = sumTotalDiscount;
        }
    }

    onDiscountChange(value, item, i, items) {
        let discount = value.replace('%', '');
        let newDiscount = Number(discount);
        newDiscount = Math.max(0, Math.min(100, newDiscount));
        if (newDiscount > 100) {
            this.displayErorDiscount[item.id] = true;
            item.discount_percent = 0;
            item.total_price_with_discount = item.total_price;
            this.discount[i].sumTotalDiscount = this.discount[i].sumTotal;
        } else {
            this.displayErorDiscount[item.id] = false;
            item.discount_percent = newDiscount;
            item.total_price_with_discount = item.total_price - (item.total_price * newDiscount) / 100;
            item.product.discount = newDiscount + '%';
            let sumTotalDiscount = null;
            items.forEach(item => sumTotalDiscount = sumTotalDiscount + item.total_price_with_discount);
            this.discount[i].sumTotalDiscount = sumTotalDiscount;
        }
    }

    getItems() {
        if (isPlatformBrowser(this.platformId)) {
            let _storage = JSON.parse(localStorage.getItem('makeOrder'));
            console.log(_storage);
            let products = _storage.reduce((unique, o) => {
                if (!unique.some(obj => obj.id === o.id)) {
                    unique.push(o);
                }
                return unique;
            }, []);
            for (let i = 0; i < products.length; i++) {
                if (products[i].bidding_discount_percent !== null && products[i].bidding_discount_percent !== undefined) {
                    let rounded = Math.round(products[i].bidding_discount_percent * 100) / 100;
                    products[i].product.discount = rounded + '%';
                    products[i].discount_percent = rounded;
                }
                this.sellers.push(products[i].product.company.id);
            }
            this.unique = this.sellers.filter((v, i, a) => a.indexOf(v) === i);
            for (let i = 0; i < this.unique.length; i++) {
                this.finalProducts.push(products.filter(item => item.product.company.id === this.unique[i]));
                this.edit.push([]);
            }
            for (let i = 0; i < this.finalProducts.length; i++) {
                let is_bidding_allowed = this.finalProducts[i].every(item => item.product.is_bidding_allowed === true);
                let sumTotal = 0;
                let sumTotalDiscount = 0;
                let sumTotalCurrency = '';
                for (let j = 0; j < this.finalProducts[i].length; j++) {
                    this.edit[i].push({'edit': true});
                }
                if (this.finalProducts[i].length === 1) {
                    sumTotalCurrency = this.finalProducts[i][0].product.currency;
                    sumTotalDiscount = this.finalProducts[i][0].total_price;
                    sumTotal = this.finalProducts[i][0].total_price;
                } else {
                    let _sameCurrency = this.finalProducts[i].every((val, i, arr) => val.product.currency === arr[0].product.currency);
                    if (_sameCurrency) {
                        sumTotalCurrency = this.finalProducts[i][0].product.currency;
                        this.finalProducts[i].forEach(item => sumTotal = sumTotal + item.total_price);
                        this.finalProducts[i].forEach(item => sumTotalDiscount = sumTotalDiscount + item.total_price);
                    } else {
                        sumTotalCurrency = '';
                        sumTotal = null;
                        sumTotalDiscount = null;
                    }
                }
                this.discount.push({
                    'discount': '0%',
                    'value': 0,
                    'error': false,
                    'display': is_bidding_allowed,
                    'sumTotal': sumTotal,
                    'sumTotalCurrency': sumTotalCurrency,
                    'sumTotalDiscount': sumTotalDiscount
                });
            }
            this.orderQuantity = this.finalProducts.length;
            this.originalInfo = JSON.parse(JSON.stringify(this.finalProducts));
        }
    }

    productLink(id) {
        this.router.navigate(['dashboard/buyer/product/', id]);
    }

    sumOfPairs(item) {
        var sum = 0;
        for (let i = 0; i < item.length; i++) {
            sum += item[i].value;
        }
        return sum;
    }

    removeItem(items, product, orderNumber, index) {
        if (isPlatformBrowser(this.platformId)) {
            this.errorIndex.splice(index, 1);
            let _storage = JSON.parse(localStorage.getItem('makeOrder'));
            let newItems = _storage.filter(item => item.id !== product.id);
            localStorage.setItem('makeOrder', JSON.stringify(newItems));
            let _newItems = items.filter(item => item.id !== product.id);
            if (!_newItems.length) {
                this.finalProducts.splice(orderNumber, 1);
            } else {
                this.finalProducts[orderNumber] = _newItems;
            }
            this.orderQuantity = this.finalProducts.length;
            let sumTotal = 0;
            let sumTotalDiscount = 0;
            let sumTotalCurrency = '';
            if (this.finalProducts[orderNumber].length <= 1) {
                sumTotalCurrency = this.finalProducts[orderNumber][0].product.currency;
                sumTotalDiscount = this.finalProducts[orderNumber][0].total_price_with_discount;
                sumTotal = this.finalProducts[orderNumber][0].total_price;
            } else {
                let _sameCurrency = this.finalProducts[orderNumber].every((val, i, arr) => val.product.currency === arr[0].product.currency);
                if (_sameCurrency) {
                    sumTotalCurrency = this.finalProducts[orderNumber][0].product.currency;
                    this.finalProducts[orderNumber].forEach(item => sumTotal = sumTotal + item.total_price);
                    this.finalProducts[orderNumber].forEach(item => sumTotalDiscount = sumTotalDiscount + item.total_price_with_discount);
                } else {
                    sumTotalCurrency = '';
                    sumTotal = null;
                    sumTotalDiscount = null;
                }
            }
            let is_bidding_allowed = this.finalProducts[orderNumber].every(item => item.product.is_bidding_allowed === true);
            this.discount[orderNumber].sumTotalDiscount = sumTotalDiscount;
            this.discount[orderNumber].sumTotal = sumTotal;
            this.discount[orderNumber].display = is_bidding_allowed;
            this.discount[orderNumber].sumTotalCurrency = sumTotalCurrency;
        }
    }

    updateItem(item, itemsNumber, itemNumber) {
        if (isPlatformBrowser(this.platformId)) {
            this.itemUpdate = {};
            this.displayErorQuantity = false;
            this.displayErorPrepackQuantity = false;
            if (item.size_quantities) {
                let totalQuantity = null;
                let finalSizes = [];
                finalSizes = JSON.parse(JSON.stringify(item.size_quantities));
                let sizes = finalSizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
                Object.keys(sizes).forEach((key) => (sizes[key] == 0) && delete sizes[key]);
                if (Object.keys(sizes).length === 0) {
                    this.displayErorQuantity = true;
                } else if (Object.keys(sizes).length > 0) {
                    this.displayErorQuantity = false;
                    const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
                    totalQuantity = sumValues(sizes);
                    let total_price = item.product.price * totalQuantity;
                    this.itemUpdate.size_quantities = sizes;
                    this.itemUpdate.total_price = total_price;
                }
            } else {
                if (!item.quantity) {
                    this.displayErorPrepackQuantity = true;
                } else {
                    this.displayErorPrepackQuantity = false;
                    this.itemUpdate.prepack_id = item.prepack.id;
                    this.itemUpdate.prepack = item.prepack;
                    this.itemUpdate.quantity = Number(item.quantity);
                }
            }
            this.itemUpdate.id = item.id;
            this.itemUpdate.discount_percent = item.discount_percent;
            this.itemUpdate.bidding_discount_percent = item.discount_percent;
            this.itemUpdate.product_id = item.product.id;
            this.itemUpdate.product = item.product;
            this.itemUpdate.delete = false;
            console.log(this.itemUpdate);

            if ((!this.displayErorPrepackQuantity) && (!this.displayErorQuantity)) {
                this.productsService.updateItemsCart(this.userService.getCurrentUserToken(), this.cartInfo[0].id, item.id, this.itemUpdate).subscribe(
                    data => {
                        console.log(data);
                        let _id = item.id;
                        this.updateItems = data;
                        let itemNew = this.updateItems.items.filter(item => item.id === _id);
                        itemNew[0].product.company = this.itemUpdate.product.company;
                        itemNew[0].product.discount = this.itemUpdate.product.discount;
                        itemNew[0].discount_percent = this.itemUpdate.discount_percent;
                        if (itemNew[0].discount_percent) {
                            itemNew[0].total_price_with_discount = itemNew[0].total_price - (itemNew[0].total_price * itemNew[0].discount_percent) / 100;
                        } else {
                            itemNew[0].total_price_with_discount = itemNew[0].total_price;
                        }
                        this.disabledMakeOrder = false;
                        this.edit[itemsNumber][itemNumber].edit = true;
                        if (itemNew[0].size_quantities) {
                            itemNew[0].size_quantities = Object.entries(itemNew[0].size_quantities).map(([key, value]) => ({key, value}));
                        }
                        this.finalProducts[itemsNumber][itemNumber] = itemNew[0];
                        this.originalInfo[itemsNumber][itemNumber] = JSON.parse(JSON.stringify(itemNew[0]));
                        let sumTotal = null;
                        let sumTotalDiscount = null;
                        this.finalProducts[itemsNumber].forEach(item => sumTotal = sumTotal + item.total_price);
                        this.finalProducts[itemsNumber].forEach(item => sumTotalDiscount = sumTotalDiscount + item.total_price_with_discount);
                        this.discount[itemsNumber].sumTotal = sumTotal;
                        this.discount[itemsNumber].sumTotalDiscount = sumTotalDiscount;
                        let _storage = JSON.parse(localStorage.getItem('makeOrder'));
                        for (let i = 0; i < _storage.length; i++) {
                            if (_storage[i].id === itemNew[0].id) {
                                _storage[i] = JSON.parse(JSON.stringify(itemNew[0]));
                                _storage[i].total_price_with_discount = _storage[i].total_price;
                            }
                        }
                        localStorage.setItem('makeOrder', JSON.stringify(_storage));
                    },
                    error => {
                        console.log(error);
                    }
                );
            }
        }

    }

    editItem(itemsNumber, itemNumber, item) {
        this.modalService.open('custom-modal-10');
        if (!this.disabledMakeOrder) {
            this.edit[itemsNumber][itemNumber].edit = false;
            this.disabledMakeOrder = true;
            if (item.size_quantities) {
                this.productsService.getProduct(this.userService.getCurrentUserToken(), item.product.id).subscribe(
                    response => {
                        this.productInfo = response;
                        if (this.productInfo.sizes) {
                            item.product.sizes = this.productInfo.sizes;
                            item.product.sizes = Object.entries(item.product.sizes).map(([key, value]) => ({key, value}));
                        }
                        for (let i = 0; i < item.product.sizes.length; i++) {
                            if (!item.size_quantities.find(k => k.key === item.product.sizes[i].key)) {
                                item.size_quantities.push({key: item.product.sizes[i].key, value: null});
                            }
                        }
                    });


            }
        }
    }

    cancelUpdateItem(item, itemsNumber, itemNumber) {
        this.displayErorQuantity = false;
        this.displayErorPrepackQuantity = false;
        if (this.disabledMakeOrder) {
            this.edit[itemsNumber][itemNumber].edit = true;
            this.disabledMakeOrder = false;
            console.log('finalProducts');
            console.log(this.finalProducts);
            console.log('originalInfo');
            console.log(this.originalInfo);

            let original_item_idx = null;
            let order_item_idx = null;
            for (let i = 0; i < this.finalProducts.length; i++) {
                for (let j = 0; j < this.finalProducts[i].length; j++) {
                    if (this.finalProducts[i][j].id === item.id) {
                        order_item_idx = [i, j];
                        break;
                    }
                }
            }

            for (let i = 0; i < this.originalInfo.length; i++) {
                for (let j = 0; j < this.originalInfo[i].length; j++) {
                    console.log(`this.originalInfo[i][j] ${this.originalInfo[i][j]} item.id ${item.id} `);
                    if (this.originalInfo[i][j].id === item.id) {
                        original_item_idx = [i, j];
                        break;
                    }
                }
            }

            if (order_item_idx !== null && original_item_idx !== null) {
                this.finalProducts[order_item_idx[0]][order_item_idx[1]] = JSON.parse(JSON.stringify(
                    this.originalInfo[original_item_idx[0]][original_item_idx[1]]
                ));
            }
        }

    }

    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    makeOrder(products, orderNumber) {
        if (isPlatformBrowser(this.platformId)) {
            this.errorIndex = [];
            this.orderNumber = orderNumber;
            let items = [];
            let ids = [];
            for (let i = 0; i < products.length; i++) {
                let _discount = 0;
                if (products[i].discount_percent) {
                    _discount = products[i].discount_percent;
                }
                if (products[i].size_quantities) {
                    let totalQuantity = null;
                    let finalSizes = [];
                    finalSizes = JSON.parse(JSON.stringify(products[i].size_quantities));
                    let sizes = finalSizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
                    items.push({
                            'id': products[i].id,
                            'product_id': products[i].product.id,
                            'size_quantities': sizes,
                            'quantity': products[i].quantity,
                            'bidding_discount_percent': _discount
                        }
                    );
                } else {
                    items.push({
                            'id': products[i].id,
                            'product_id': products[i].product.id,
                            'prepack_id': products[i].prepack.id,
                            'quantity': products[i].quantity,
                            'bidding_discount_percent': _discount
                        }
                    );
                }
                ids.push(products[i].id);
            }
            console.log(items);
            this.productsService.addItemsCart(this.userService.getCurrentUserToken(), this.cartInfo[0].id, {'items': items}).subscribe(
                data => {
                    console.log(data);
                    this.productsService.createOrder(this.userService.getCurrentUserToken(), {'item_ids': ids}).subscribe(
                        data => {
                            this.modalService.open('custom-modal-3');
                            this.finalProducts.splice(orderNumber, 1);
                            this.orderQuantity = this.finalProducts.length;
                            let _storage = JSON.parse(localStorage.getItem('makeOrder'));
                            let newItems = [];
                            for (let i = 0; i < _storage.length; i++) {
                                if (_storage[i].id !== ids[i]) {
                                    newItems.push(_storage[i]);
                                }
                            }
                            localStorage.setItem('makeOrder', JSON.stringify(newItems));
                            this.productsService.getCarts(this.userService.getCurrentUserToken()).subscribe(
                                data => {
                                    this.cartInfo = data;
                                    if (this.cartInfo[0]) {
                                        this.productsService.getCartInfo(this.userService.getCurrentUserToken(), this.cartInfo[0].id).subscribe(
                                            data => {
                                                this.cartItems = data;
                                                this.cartQuantity = this.cartItems.items.length;
                                                this.productsService.setCartItemsQuantity(this.cartItems.items.length);

                                            });
                                    } else {
                                        this.productsService.setCartItemsQuantity(0);
                                    }
                                });
                        },
                        error => {
                            console.log(error);
                        }
                    );
                },
                error => {
                    console.log(error);
                    const errorMessage = this.alertService.errorSendOrder(error.error)
                    errorMessage.forEach((value, index) => {
                        this.errorIndex.push(value);
                    });
                    console.log(this.errorIndex)
                }
            );
        }
    }

    closeModal(id: string) {
        this.modalService.close(id);
    }

    onInputSizes() {
        this.modalService.close('custom-modal-10');
    }

    onCheckForError(item) {
        console.log(item)
        if (!Array.isArray(item)) {
            if (item === '' || item === 0) {
                this.displayErorPrepackQuantity = true;
            } else {
                this.displayErorPrepackQuantity = false;
            }
        } else {
            let count = 0;
            for (let i = 0; i < item.length; i++) {
                count += Number(item[i].value);
            }
            if (count === 0) {
                this.displayErorQuantity = true;
            } else {
                this.displayErorQuantity = false;
            }
        }

    }

    onSortSizes(sizes) {
        sizes = sizes.sort(function (a: any, b: any) {
            return (+a.key) - (+b.key);
        });
        return sizes;
    }
    chekForObject(item){
        if (typeof item === 'object') {
            return true
        }
        return false
    }
}
