import {Component, Input, OnInit, ViewChild} from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import {AlertService, ProductsService, ModalService, UserService} from '../../_services/index';
import { Router, ActivatedRoute } from '@angular/router';
import { Inject } from '@angular/core';
import { DOCUMENT } from '@angular/platform-browser';
import {Location} from '@angular/common';
import {NgForm} from '@angular/forms';
import { FiltersComponent } from '../../components/dashboard/filters/filters.component';
import { subscribeOn } from 'rxjs/operators';

@Component({
    selector: 'app-buyer-cart',
    templateUrl: 'buyerCart.component.html',
    styleUrls: ['buyerCart.component.sass']
})

export class BuyerCartComponent implements OnInit {
    @ViewChild('f') public form: NgForm;
    @Input() scope: string;
    products: any;
    cartInfo: any = [];
    cartItems: any = [];
    sizes: any = [];
    selectItem: any = [];
    selectItems: any = [];
    editPrepack: any = [];
    editSizes: any = [];
    disabledMakeOrder: boolean = false;
    displayOrderPanel: boolean = false;
    displayErorQuantity: any = [];
    displayErorPrepackQuantity: any = [];
    public cartQuantity: number;
    productInfo: any;
    itemsLength: number;
    itemUpdate: any;
    originalCartItems: any;
    modalProduct: any = null;
    currentDate:any;
    sumSizes: any = 0;
    totalSum: any = 0;
    arr: any = [];
    cartItem: any = null;
    errorAvailableQuantity = false;
    isHovering: any = [];
    errorQuantity: any = [];
    errorQuantityMes = false;
    productInfoArray: any = [];
    itemNumber: number = null;
    errorIndex: any = [];
    orderNumber: any;
    _options: any = {
        items: []
    };
    @Input() set options(value: string) {
        this._options = value;
        console.log(this._options);
        this.cartItems = this._options;
        if (this._options && this._options.items.length) {
                this.getVisitorItems();
        }

    }
    isSameCompany: boolean = false;
    isLoading: boolean = false;
    isOrderSent: boolean = false;

    sellers: any = [];

    createdOrderId: number;
    Object = Object;
    errorItem: any = [];
    erorPrepackQuantity = false;

    constructor(
        @Inject(DOCUMENT) private document: Document,
        private productsService: ProductsService,
        private route: ActivatedRoute,
        private userService: UserService,
        private modalService: ModalService,
        private  alertService: AlertService,
        private router: Router) {
    }

    ngOnInit() {
        window.scroll(0,0);
        console.log(this.scope);
        if (this.scope !== 'notRegistered') {
            this.getItems();
        }

        this.currentDate = new Date().getTime();
    }
     testString(str: string) {
       return (str.search(/\./) === -1)
    }
    getVisitorItems() {
        for (let i=0; i < this.cartItems.items.length; i++) {
                if (this.cartItems.items[i].size_quantities) {
                    this.cartItems.items[i].size_quantities = Object.entries(this.cartItems.items[i].size_quantities).map(([key, value]) => ({key, value}))
                    this.cartItems.items[i].size_quantities.sort(function (a, b) { return +a.key - +b.key; });
                } else {
                    const ordered = {};
                    for (let key in this.cartItems.items[i].prepack.sizes) {
                        if (+key < 15 && this.testString(key)) {
                            this.cartItems.items[i].prepack.sizes =
                                Object.defineProperty(this.cartItems.items[i].prepack.sizes, Number(key).toFixed(1),
                                    Object.getOwnPropertyDescriptor(this.cartItems.items[i].prepack.sizes, key))
                            delete this.cartItems.items[i].prepack.sizes[key]
                        }
                    }

                    Object.keys(this.cartItems.items[i].prepack.sizes).sort(function (a, b) {
                        return +a - +b; }).forEach((key) => {
                        ordered[key] = this.cartItems.items[i].prepack.sizes[key];
                    });
                    this.cartItems.items[i].prepack.sizes = ordered;
                }
            this.productsService.getProductForVisitor(this.cartItems.items[i].product.id).subscribe(
                response => {
                    this.productInfo = response;
                    this.productInfoArray.push(this.productInfo);
                    console.log(response)
                    console.log(this.productInfo.company);
                    this.cartItems.items[i].product.company = this.productInfo.company;
                    if (this.cartItems.items[i].product.has_discount) {
                        if (this.cartItems.items[i].size_quantities) {
                            const sum = this.sumOfPairs(this.cartItems.items[i].size_quantities)
                            this.cartItems.items[i].total_price_with_discount = this.cartItems.items[i].product.discount_price
                                * Number(sum);
                        } else {
                          const pairs =  this.sum(this.cartItems.items[i].prepack.sizes);
                            this.cartItems.items[i].total_price_with_discount = this.cartItems.items[i].product.discount_price *
                                 Number(pairs) * this.cartItems.items[i].quantity;
                        }
                    } else {
                        this.cartItems.items[i].total_price_with_discount = this.cartItems.items[i].total_price;
                    }
                }).add(() => {
                if(this.cartItems.items.every(e => e.product.company)) {
                    this.groupItems();
                }
            });

            this.selectItem.push(false);
            this.originalCartItems = JSON.parse(JSON.stringify(this.cartItems))
            this.isLoading = false;
        }
    }
    getItems() {
        this.isLoading = true;
        this.currentDate = new Date().getTime();
        this.cartItems = [];
        this.cartQuantity = 0;
        this.productsService.getCarts(this.userService.getCurrentUserToken()).subscribe(
            data => {
                    this.cartInfo = data;

                    if (this.cartInfo[0]) {
                    this.productsService.getCartInfo(this.userService.getCurrentUserToken(), this.cartInfo[0].id).subscribe(
                    data => {
                            this.cartItems = data;
                            console.log(this.cartItems);
                            this.productsService.setCartItemsQuantity(this.cartItems.items.length);
                            this.cartQuantity = this.cartItems.items.length;
                            if (!this.cartQuantity) {
                            this.isLoading = false;
                            }
                            this.productsService.setCartItemsQuantity(this.cartItems.items.length);
                            for (let i=0; i < this.cartItems.items.length; i++) {
                               if (this.cartItems.items[i].size_quantities) {
                                   this.cartItems.items[i].size_quantities = Object.entries(this.cartItems.items[i].size_quantities).map(([key, value]) => ({key, value}))
                                   this.cartItems.items[i].size_quantities.sort(function (a, b) { return +a.key - +b.key; });
                               } else {
                                   const ordered = {};
                                   for (let key in this.cartItems.items[i].prepack.sizes) {
                                       if (+key < 15 && this.testString(key)) {
                                           this.cartItems.items[i].prepack.sizes =
                                               Object.defineProperty(this.cartItems.items[i].prepack.sizes, Number(key).toFixed(1),
                                               Object.getOwnPropertyDescriptor(this.cartItems.items[i].prepack.sizes, key))
                                           delete this.cartItems.items[i].prepack.sizes[key]
                                       }
                                   }

                                   Object.keys(this.cartItems.items[i].prepack.sizes).sort(function (a, b) {
                                       return +a - +b; }).forEach((key) => {
                                       ordered[key] = this.cartItems.items[i].prepack.sizes[key];
                                   });
                                   this.cartItems.items[i].prepack.sizes = ordered;
                               }
                            this.productsService.getProduct(this.userService.getCurrentUserToken(), this.cartItems.items[i].product.id).subscribe(
                                response => {
                                        this.productInfo = response;
                                    this.productInfoArray.push(this.productInfo);
                                    if (this.productInfo.sizes) {
                                            this.cartItems.items[i].product.sizes = this.productInfo.sizes;
                                            this.cartItems.items[i].product.sizes = Object.entries(this.cartItems.items[i].product.sizes).map(([key, value]) => ({key,value}));

                                        }
                                        console.log(response)
                                        console.log(this.productInfo.company);
                                        this.cartItems.items[i].product.company = this.productInfo.company;
                            }).add(() => {
                                if(this.cartItems.items.every(e => e.product.company)) {
                                    this.groupItems();
                                }
                            });

                            this.selectItem.push(false);
                            this.originalCartItems = JSON.parse(JSON.stringify(this.cartItems))
                            this.isLoading = false;
                        }
                    });
                    }
                    else {
                        this.productsService.setCartItemsQuantity(0)
                        this.isLoading = false;
                    }
            }, error => {
                this.isLoading = false;
            });
        console.log(this.productInfoArray);
    }


    productLink(product) {
        this.productsService.getProduct( this.userService.getCurrentUserToken(), product.id).subscribe( response => {
            product = response;
            if (product.latest_version) {
                this.router.navigate(['dashboard/buyer/product/', product.latest_version]);
            } else {
                this.router.navigate(['dashboard/buyer/product/', product.id]);
            }
        }, error => {
            console.log(error)
        })

    }


    groupItems() {
        this.cartItems.items.sort((a, b) => {
            return a.product.company.id - b.product.company.id;
        })

        this.cartItems.items.forEach((item, i) => {
            console.log(i, item);
            if(!this.sellers.some(e => e.name === item.product.company.name)) {
                console.log(item.product.company.name, ' DOESNT EXIST')
                let index = this.sellers.push({
                    owner_id: item.product.company.owner_id,
                    name: item.product.company.name,
                    items: []
                });
                console.log('INDEX: ', index);
                this.sellers[index-1].items.push(item);
            }
            else {

                console.log(item.product.company.name, ' EXISTS');
            }
        });

        console.log(this.sellers);
        console.log(this.cartItems.items);
    }
    removeItem(item) {
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-modal-2');
            return
        }

        let seller = this.sellers.filter(e => e.name === item.product.company.name)[0];
        for (let i = 0; i < seller.items.length; i++) {
            if(seller.items[i].product.id === item.product.id) {
                seller.items.splice(i, 1);
            }
        }

        if(!seller.items.length) {
            this.sellers = this.sellers.filter(e => {
                e.name !== seller.name;
            })
        }

       if (!this.disabledMakeOrder) {
           this.productsService.removeItemsCart(this.userService.getCurrentUserToken(), this.cartInfo[0].id, item.id).subscribe(data => {
               this.getItems();
               if (this.cartItems.items) {
                   this.productsService.setCartItemsQuantity(this.cartItems.items.length);
                   this.cartQuantity = this.cartItems.items.length;
               }
           });
       }
    }

    removeSeveralItems() {
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-modal-2');
            return
        }
        console.log(this.selectItems);
        if(this.selectItems.length !== this.cartItems.items.length) {
            console.log('different')
            let bathArr = [];
            for (let i = 0; i < this.selectItems.length; i++) {
                bathArr.push({
                    "method": "DELETE",
                    "path": `/api/v1/carts/${this.cartInfo[0].id}/${this.selectItems[i].id}/`
                })
            }
            this.productsService.batch(this.userService.getCurrentUserToken(),{"operations": bathArr}).subscribe(data => {
                console.log(data);
                console.log(this.sellers);
                for (let j = 0; j < this.selectItems.length; j++) {
                    const seller = this.sellers.filter(e => e.name === this.selectItems[j].product.company.name)[0];
                    console.log(seller);
                    if (seller) {
                        this.sellers = this.sellers.filter(e => {
                            e.name !== seller.name;
                        })
                    }
                }
                this.getItems();
                this.selectItem = [];
                this.selectItems = [];
                this.displayOrderPanel = false;
            }, error => {
                console.log(error);
            })
        }
        else {
            console.log('same')
            this.productsService.clearCart(this.userService.getCurrentUserToken(), this.cartInfo[0].id)
            .subscribe(
                data => {
                    this.productsService.setCartItemsQuantity(0);
                    this.router.navigate(['dashboard/buyer']);
                }

            )
        }
    }

    makeOrder(products) {
        this.createdOrderId = null;
        this.errorIndex = [];
        //this.orderNumber = orderNumber;
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
                        this.createdOrderId = data['dialog_id'];
                        this.modalService.open('custom-modal-3');
                        this.selectItems = [];
                        this.selectItem = [];
                        this.displayOrderPanel = false;
                        this.getItems();
                        this.isOrderSent = false;
                        for(let j = 0; j < products.length; j++) {
                            let seller = this.sellers.filter(e => e.name === products[j].product.company.name)[0];
                            for (let i = 0; i < seller.items.length; i++) {
                                if(seller.items[i].product.id === products[j].product.id) {
                                    seller.items.splice(i, 1);
                                }
                            }

                            if(!seller.items.length) {
                                this.sellers = this.sellers.filter(e => {
                                    e.name !== seller.name;
                                })
                            }
                        }
                    },
                    error => {
                        console.log(error);
                        this.isOrderSent = false;
                        this.selectItems = [];
                        this.selectItem = [];
                        this.displayOrderPanel = false;
                        this.disabledMakeOrder = false;

                    }
                );
            },
            error => {
                this.isOrderSent = false;
                console.log(error);
                const errorMessage = this.alertService.errorSendOrder(error.error);
                this.modalService.open('error_modal')
                errorMessage.forEach((value, index) => {
                    this.errorIndex.push(value);
                });
                this.errorItem = error['error']['items'].map((e, i) => {
                    if (e.product_id) {
                        return ids[i]
                    }
                });
                this.selectItems = [];
                this.selectItem = [];
                this.displayOrderPanel = false;
                this.disabledMakeOrder = false;
            }
        );
    }

    makeOrderSingle(item) {
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-modal-2');
            return
        }
        this.isOrderSent = true;
        let items = [];
        items.push(item);
        this.makeOrder(items)
    }

    makeOrderGroup() {
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-modal-2');
            return
        }
        this.isOrderSent = true;
        let _makeOrder = [];
        this.selectItems.forEach(item => _makeOrder.push(item));
        this.makeOrder(_makeOrder)
    }

    makeOfferSeller(seller) {
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-modal-2');
            return
        }
        this.isOrderSent = true;
        let products = [];
        this.cartItems.items.forEach(item => {
            if(item.product.company.name === seller.name)
                products.push(item);
        })
        this.makeOrder(products);
    }

    deleteOfferSeller(seller) {
        for(let i = 0; i < this.cartItems.items.length; i++) {
            let item = this.cartItems.items[i];
            if(item.product.company.name === seller.name){
                this.removeItem(item);

            }
        }
    }

    checkForError(item) {
        if(this.errorItem.indexOf(item.id) > -1)
            return true;
        return false;
    }

    updateItem(item) {
        console.log(item);
        this.itemUpdate = {};
        if (item.size_quantities) {
            let totalQuantity = null;
            let finalSizes = [];
            finalSizes = JSON.parse(JSON.stringify(item.size_quantities));
            let sizes = finalSizes.reduce((acc, cur) => ({ ...acc, [cur.key]: Number(cur.value) }), {});
            Object.keys(sizes).forEach((key) => (sizes[key] == 0) && delete sizes[key]);
            if (Object.keys(sizes).length === 0) {
                this.displayErorQuantity = true;
            } else  if (Object.keys(sizes).length > 0) {
                this.displayErorQuantity = false;
                const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
                totalQuantity = sumValues(sizes);
                let total_price = 0;
                if (item.product.has_discount && this.checkDiscountDate(item.product.discount_end_date)) {
                    total_price = item.product.discount_price * totalQuantity;
                } else {
                    total_price = item.product.price * totalQuantity;
                }
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
        this.itemUpdate.discount_percent = 0;
        this.itemUpdate.product_id = item.product.id;
        this.itemUpdate.product = item.product;
        this.itemUpdate.delete = false;


        if ((!this.displayErorPrepackQuantity) && (!this.displayErorQuantity) && (!this.errorAvailableQuantity)) {
            this.productsService.updateItemsCart(this.userService.getCurrentUserToken(), this.cartInfo[0].id, item.id, this.itemUpdate).subscribe(
                data => {
                    this.disabledMakeOrder = false;
                    this.productInfoArray = [];
                    if (item.size_quantities) {
                    } else {
                    }
                    this.getItems();
                    this.modalService.close('custom-modal-product');
                },
                error => {
                    console.log(error);
                }
            );
        }
    }

    cancelUpdateItem(item, itemNumber) {
        if (this.disabledMakeOrder) {
            this.disabledMakeOrder = false;
            if (item.size_quantities) {
                this.editSizes[itemNumber] = false;
            } else {
                this.editPrepack[itemNumber] = false;
            }

            let original_item_idx = null
            let cart_item_idx = null
            for (let i=0; i < this.cartItems.items.length; i++) {
                if (this.cartItems.items[i].id === item.id) {
                    cart_item_idx = i
                    break
                }
            }

            for (let i=0; i < this.originalCartItems.items.length; i++) {
                if (this.originalCartItems.items[i].id === item.id) {
                    original_item_idx = i
                    break
                }
            }

            if (cart_item_idx !== null && original_item_idx !== null) {
                this.cartItems.items[cart_item_idx] = JSON.parse(JSON.stringify(
                    this.originalCartItems.items[original_item_idx]
                ))
            }
        }
    }
    mapOrder (array, order, key) {

        array.sort( function (a, b) {
            var A = a[key], B = b[key];

            if (order.indexOf(A) > order.indexOf(B)) {
                return 1;
            } else {
                return -1;
            }

        });

        return array;
    };
    editItem(item, itemNumber) {
        if (this.scope === 'notRegistered') {
            this.modalService.open('custom-modal-2');
            return
        }
        let arr = [];
        this.cartItems.items.forEach(elem => {
            arr.push(elem.product.id)
        });
        this.productInfoArray = this.mapOrder(this.productInfoArray, arr, 'id')
        console.log(this.productInfoArray);
        console.log(arr);
        this.itemNumber = itemNumber;
        this.cartItem = JSON.parse(JSON.stringify(item));
        if (item.sizes) {
            this.onPairs(item.sizes);
        }
        if (item.size_quantities) {
            item.size_quantities.sort(function(a: any, b: any) {
                return (+a.key) - (+b.key);
            });
        }
        console.log(this.cartItem);
        if (item.product.has_discount && this.checkDiscountDate(item.product.discount_end_date)) {
            this.totalSum = item.total_price_with_discount;
        } else {
            this.totalSum = item.total_price;
        }
        this.modalProduct = item.product;
        this.displayErorQuantity = false;
        this.displayErorPrepackQuantity = false;
        if (!this.disabledMakeOrder) {
            this.disabledMakeOrder = true;
            if (this.cartItem.size_quantities) {
                for (let k = 0; k < this.cartItem.size_quantities.length; k++) {
                    // todo: change item.size_quantities[k].key depending size type
                    if (+this.cartItem.size_quantities[k].key < 15) {
                        console.log(this.cartItem.size_quantities[k].key)
                        this.cartItem.size_quantities[k].key = (+this.cartItem.size_quantities[k].key).toFixed(1);
                    }
                }
                console.log(this.cartItem.size_quantities);
                for (let i = 0; i < this.cartItem.product.sizes.length; i++) {
                    if (+this.cartItem.product.sizes[i].key < 15) {
                        this.cartItem.product.sizes[i].key = (+this.cartItem.product.sizes[i].key).toFixed(1);
                    }
                    if (!this.cartItem.size_quantities.find(k => k.key === this.cartItem.product.sizes[i].key)) {
                        console.log(this.cartItem.product.sizes[i].key)
                        this.cartItem.size_quantities.push({key: this.cartItem.product.sizes[i].key, value: null});
                    }
                }
                this.cartItem.size_quantities.sort(function (a, b) { return +a.key - +b.key; });

            } else {
                this.editPrepack[itemNumber] = true;
            }
        }
        this.erorPrepackQuantity = false;
        this.modalService.open('custom-modal-product');
    }
    checkDiscountDate(date) {
        let discountEndDate = new Date(date).getTime();
        return discountEndDate > this.currentDate;
    }
    onSumSizes(product, sum, cart?) {
        if (this.modalProduct.sizes) {
            this.sumSizes = 0;
            let sizes = sum.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.quantity)}), {});

            for (let i = 0; i < sum.length; i++) {
                if (sum[i].value !== undefined) {
                    this.sumSizes += Number(sum[i].value);
                    if (sum[i].value !== null) {
                        sum[i].value = Number(sum[i].value);
                    }
                }
            }
            if (this.modalProduct.has_discount && new Date(product.discount_end_date).getTime() > this.currentDate) {
                this.totalSum = (this.sumSizes * this.modalProduct.discount_price).toFixed(2);
            } else {
                this.totalSum = (this.sumSizes * this.modalProduct.price).toFixed(2);
            }

        } else {
            +sum === 0 ? this.erorPrepackQuantity = true : this.erorPrepackQuantity = false

            if (cart.prepack.available_quantity) {
                sum > cart.prepack.available_quantity ? this.errorAvailableQuantity = true : this.errorAvailableQuantity = false;
            }
            const sizes = cart.prepack.sizes;
            const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
            let totalQuantity = sumValues(sizes);
            this.sumSizes = Number(totalQuantity) * sum;
            if (this.modalProduct.has_discount && new Date(product.discount_end_date).getTime() > this.currentDate) {
                this.totalSum = (this.sumSizes * this.modalProduct.discount_price).toFixed(2);
            } else {
                this.totalSum = (this.sumSizes * this.modalProduct.price).toFixed(2);
            }
        }
    }
    closeModal(id: string) {
        this.modalProduct = '';
        this.disabledMakeOrder = false;
        this.totalSum = 0;
        this.displayErorQuantity = false;
        this.displayErorPrepackQuantity = false;
        this.modalService.close(id);
    }

    sumOfPairs(item) {
            var sum = 0;
            for(let i = 0; i < item.length; i++) {
                sum += item[i].value;
            }
            return sum;
    }

    _keyPress(event: any) {
        const pattern = /[0-9\ ]/;
        let inputChar = String.fromCharCode(event.charCode);

        if (!pattern.test(inputChar)) {
            // invalid character, prevent input
            event.preventDefault();
        }
    }

    addItemsOrder(event, item, itemNumber) {
        this.selectItem[itemNumber] = event;
        let even = function(element) {
            return element === true;
        };
        if (event) {
            this.selectItems.push(item);
        } else {
            for (let i=0; i < this.selectItems.length; i++) {
                if (this.selectItems[i] === item) {
                    this.selectItems.splice(i, 1);
                }
            }
        }
        this.itemsLength = this.selectItems.length;
        this.disabledMakeOrder = this.selectItem.some(even);
        this.displayOrderPanel = this.selectItem.some(even);
        console.log(this.selectItems)
        if(this.selectItems.length) {
            let companyToCompare = this.selectItems[0].product.company.id
            this.isSameCompany = this.selectItems.every(item => item.product.company.id === companyToCompare)
        }
    }

    getNumOfItems(seller) {
        return this.cartItems.items.filter(e => e.product.company.name === seller).length;
    }
    clearSelected(seller?) {

        for(let i = 0; i < this.cartItems.items.length; i++) {
            if(this.cartItems.items[i].product.company.name === seller) {
                this.selectItem[i] = false;
                //this.selectItems.splice(i, 1);
                //--i;
            }
        }
        this.selectItems = this.selectItems.filter(e => {
            return e.product.company.name !== seller
        })
        // console.log(this.selectItems);

        console.log(this.selectItems);
        this.itemsLength = this.selectItems.length
        if(!this.selectItems.length) {
            this.displayOrderPanel = false;
            this.disabledMakeOrder = false;
        }

        if(this.selectItems.length) {
            let companyToCompare = this.selectItems[0].product.company.id;
            this.isSameCompany = this.selectItems.every(item => item.product.company.id === companyToCompare)
        }

        // }
        // this.selectItem = [];
        // this.selectItems = [];
        // this.itemsLength = 0;
        // this.displayOrderPanel = false;
        // this.disabledMakeOrder = false;
    }

    getTotalPrice(seller) {
        let sum = 0;
        this.cartItems.items.filter(e => e.product.company.name === seller.name).forEach(item => {
            sum += item.total_price;
        })

        return sum;

    }

    getTotalDiscountPrice(seller) {
        let sum = 0;
        this.cartItems.items.filter(e => e.product.company.name === seller.name).forEach(item => {
                sum += item.total_price_with_discount;
        })

        return sum;
    }
    selectAll(seller) {
        console.log(this.selectItems, this.selectItem);
        for (let i=0; i < this.cartItems.items.length; i++ ) {
            if(this.cartItems.items[i].product.company.name === seller) {
                this.selectItem[i] = true;
                if(!this.selectItems.forEach(e => e.product.id === this.cartItems.items[i].product.id))
                    this.selectItems.push(this.cartItems.items[i]);
            }
        }
        let even = function(element) {
            return element === true;
        }
        this.itemsLength = this.selectItems.length;
        this.disabledMakeOrder = this.selectItem.some(even);
        this.displayOrderPanel = this.selectItem.some(even);
        if(this.selectItems.length) {
            let companyToCompare = this.selectItems[0].product.company.id
            this.isSameCompany = this.selectItems.every(item => item.product.company.id === companyToCompare)
        }
        console.log(this.selectItems, this.selectItem);
    }

    checkSelected(seller) {
        return this.selectItems.some(item => item.product.company.name === seller.name);
        // return this.selectItem.some(item => item === true);
    }
    clickedInside($event: Event) {
        $event.preventDefault();
        $event.stopPropagation();
        this.disabledMakeOrder = false;
    }
    onPairs(sizes) {
        let arr = [];
        if (this.scope === 'notRegistered') {
            return Object.keys(sizes).length
        } else {
            arr = Object.assign([], sizes);
            for (let i = 0; i < arr.length; i++) {
                if (arr[i].value === null) {
                    arr.splice(i)
                }
            }
            return arr.length;
        }

    }
    mouseHovering(i) {
        this.isHovering[i] = true;
    }
    mouseLeaving(i) {
        this.isHovering[i] = false;
    }
    onSizeChange(quantity, value, i) {
        if (+quantity > +value) {
            this.errorQuantity[i] = true;
        } else {
            this.errorQuantity[i] = false;
        }
        console.log(this.errorQuantity);
        this.errorQuantityMes = !this.errorQuantity.every(elem => {
            return elem === false
        })
    }
    sum( obj ) {
        let sum = 0;
        for ( const el in obj ) {
            if ( obj.hasOwnProperty( el ) ) {
                sum += parseFloat( obj[el] );
            }
        }
        return sum;
    }
}
