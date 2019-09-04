import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {TranslatePipe} from '../../../../pipes/translate.pipe';
import {LanguageService} from '../../../../_services/language.service';
import {ActivatedRoute, Router} from '@angular/router';
import {PaginationChangedEvent} from '../../../../events';
import {PaginationComponent} from '../../../messenger/components/pagination/pagination.component';
import {AlertService, ModalService, ProductsService, UserService} from '../../../../_services';
import {Location} from '@angular/common';

@Component({
  selector: 'app-single-webshop',
  templateUrl: './single-webshop.component.html',
  styleUrls: ['./single-webshop.component.sass']
})
export class SingleWebshopComponent implements OnInit {
  @Input() promotions = false;
  sortValues: any = [
    {name: 'SORTBY_HIGH_PRICE', id: '-price'},
    {name: 'SORTBY_LOW_PRICE', id: 'price'},
    {name: 'SORTBY_NEWEST', id: '-date_published'},
    {name: 'SORTBY_OLDEST', id: 'date_published'},
    // {name: 'SORTBY_WITHOUT', id: 'reset'}
  ];
  sortValuesTranslated: any = [];
  shop: string;
  response: any = {};
  products: any = [];
  noProducts: boolean = false;
  currentDate: any;
  searchInput: string = '';
  sortFilter = '';
  urlFilter  = '';
  @ViewChild(PaginationComponent) pagination;
  @ViewChild('banner') banner: ElementRef;
  displayErorQuantity: boolean = false;
  displayErorPrepackQuantity: boolean = false;
  modalProduct: any;
  prepacksQuantity: any = [];
  errorPrepackQuantity: any = [];
  totalSum: any = 0;
  sumSizes: any = 0;
  arr: any = [];
  isHovering: any = [];
  errorQuantity: any = [];
  errorQuantityMes = false;
  items: any = [];
  addItimes: any = {};
  cartInfoData: any = [];
  cartInfo: any = [];
  errorMesage: any;
  scope: string;
  cartItems: any = {};
  personalInfo: any = {};
  webSiteInfo: any = {};
  imgHeight: number;
  innerWidth: number;
  showFilters = false;
  limit = 40;
  @HostListener('scroll', ['$event'])
  onScroll(event: any) {
    // visible height + pixel scrolled >= total height
    if ( !this.showFilters && this.innerWidth <= 480 && event.target.offsetHeight + event.target.scrollTop >= event.target.scrollHeight) {
      console.log("End");
      this.limit = this.limit + 40
      this.loadPages(this.searchInput, this.urlFilter + this.sortFilter, this.limit, 0);

    }
  }

  constructor(
      private translatePipe: TranslatePipe,
      private langService: LanguageService,
      private route: ActivatedRoute,
      private router: Router,
      private productsService: ProductsService,
      private userService: UserService,
      private modalService: ModalService,
      private alertService: AlertService,
      private location: Location
  ) { }
  translateValues() {
    this.sortValuesTranslated = this.sortValues.map(x => Object.assign({}, x)).map(e => {
      e.name = this.translatePipe.transform(e.name);
      return e;
    })
    if(this.sortValuesTranslated.some(e => {return e.name == undefined})) {
      setTimeout(this.translateValues.bind(this), 500);
    }
    else return this.sortValuesTranslated;
  }
  ngOnInit() {
    this.innerWidth = window.innerWidth;
    this.shop = this.route.snapshot.paramMap.get('shop');
    const user = this.userService.getCurrentUser();
    const query = this.route.snapshot.queryParams.search;
    if (query) {
      this.searchInput = query;
    }
    console.log(query);
    if(user) {
      this.scope = user.scope[0];
    } else {
      this.scope = 'notRegistered';
    }
    console.log(this.scope);
    if (this.scope === 'buyer') {
      this.userService.getWebShop(this.userService.getCurrentUserToken(), this.shop).subscribe(response => {
        console.log(response);
        this.webSiteInfo = response;
        if (this.promotions) {
          this.urlFilter = '&has_discount=true';
        }
        this.webSiteInfo.new_webshop_url = this.webSiteInfo.webshop_url;
        this.loadPages(this.searchInput, this.urlFilter);
      }, error => {
        this.router.navigate(['/login']);
        console.log(error);
      });
      this.productsService.getCarts(this.userService.getCurrentUserToken()).subscribe(
          data => {
            this.cartInfo = data;
            if (this.cartInfo[0]) {
              console.log(this.cartInfo);
              this.productsService.getCartInfo(this.userService.getCurrentUserToken(), this.cartInfo[0].id)
                  .subscribe(
                      data => {
                        this.cartItems = data;
                        this.productsService.setCartItemsQuantity(this.cartItems.items.length);
                      });
            }
          });
    }
    if (this.scope === 'notRegistered') {
      this.userService.getWebShopForVisitor(this.shop).subscribe(response => {
        console.log(response);
        this.webSiteInfo = response;
        if (this.promotions) {
          this.urlFilter = '&has_discount=true';
        }
        this.webSiteInfo.new_webshop_url = this.webSiteInfo.webshop_url;
        this.loadPages(this.searchInput, this.urlFilter);
      }, error => {
        console.log(error);
      });
    }
    if (this.scope === 'seller') {
      this.getWebShop();
      if (this.promotions) {
        this.urlFilter = '&has_discount=true';
        this.loadPages(null, this.urlFilter);
      }
    }
    console.log(`scope ${this.scope}`);

    this.currentDate = new Date().getTime();
    this.langService.currentLanguage.subscribe(lang => {
      setTimeout(this.translateValues.bind(this), 2000);
    })
  }
  onPageChanged(info: PaginationChangedEvent) {
    this.loadPages(this.searchInput, this.urlFilter + this.sortFilter, info.fetch, info.offset);
    window.scroll(0, 0);
  }

  loadPages(search: string = '', query: string = '', limit = null, offset = 0) {
    let queryString;
    if (limit == null) {
      limit = this.pagination.pageSize;
    }
    console.log(this.sortFilter);
    console.log(limit);
    console.log(offset);
    if (this.scope === 'seller') {
      queryString = `?seller=me&published=True&draft=False&archived=False` + query
    } else if (this.scope === 'buyer' || this.scope === 'notRegistered') {
      if (this.webSiteInfo.company_id) {
        queryString = `?seller=${this.webSiteInfo.company_id}&published=True&draft=False&archived=False` + query
      }
    }
    console.log(query);
    if (this.scope !== 'notRegistered') {
      this.productsService.sellerProduct(this.userService.getCurrentUserToken(),queryString,
          {'search':search,
            'limit': limit,
            'offset': offset}).subscribe(response => {
        this.response = response;
        this.pagination.totalRows = this.response.count;
        console.log(this.pagination.totalRows);
        this.products = this.response.results;
        if (this.products.length > 0) {
          this.noProducts = false;
        } else {
          this.noProducts = true;
        }

      });
    } else {
      this.productsService.sellerProductForVisitor(queryString,
          {'search':search,
            'limit': limit,
            'offset': offset}).subscribe(response => {
        this.response = response;
        this.pagination.totalRows = this.response.count;
        console.log(this.pagination.totalRows);
        this.products = this.response.results;
        if (this.products.length > 0) {
          this.noProducts = false;
        } else {
          this.noProducts = true;
        }

      });
    }

  }
  checkDiscountDate(date) {
    let discountEndDate = new Date(date).getTime();
    return discountEndDate > this.currentDate;
  }
  searchProduct(e) {
    this.searchInput = e;
    this.loadPages(this.searchInput, this.urlFilter)
  }
  onFilterChenge(filter) {
    console.log(filter);
    console.log(this.searchInput);
    console.log(this.urlFilter);
    if (this.promotions) {
      if (filter) {
        this.urlFilter += filter;
      } else {
        this.urlFilter = '&has_discount=true';
      }
    } else {
      this.urlFilter = filter;
    }
    this.loadPages(this.searchInput, this.urlFilter + this.sortFilter)
  }
  onSortByChange(e) {
    console.log(e);
    if (e.id !== 'rest') {
      this.sortFilter += `&ordering=${e.id}`;
    } else {
      this.sortFilter += `&ordering=-date_published`;

    }
    this.loadPages(this.searchInput, this.urlFilter + this.sortFilter);
  }
  openModal(productId) {
    if (this.scope === 'seller') {
      return
    }
    this.prepacksQuantity = [];
    this.arr = [];
    this.totalSum = 0;
    this.sumSizes = 0;
    this.errorQuantity = [];
    this.errorPrepackQuantity = [];
    this.errorQuantityMes = false;
    this.displayErorQuantity = false;
    this.displayErorPrepackQuantity = false;
    this.productsService.getProduct(this.userService.getCurrentUserToken(), productId).subscribe(response => {
      this.modalProduct = response;
      console.log(this.modalProduct);
      this.modalService.open('custom-modal-product');
      if (this.modalProduct.sizes) {
        // this.displaySizes = true;
        this.modalProduct.sizes = Object.entries(this.modalProduct.sizes).map(([key, value]) => ({key, value}));
        this.modalProduct.sizes = this.modalProduct.sizes.sort(function(a: any, b: any) {
          return (+a.key) - (+b.key);
        });
      }
      if (this.modalProduct.prepacks) {
        for (let i = 0; i < this.modalProduct.prepacks.length; i++) {
          this.modalProduct.prepacks[i].sizes = Object.entries(this.modalProduct.prepacks[i].sizes).map(([key, value]) => ({
            key,
            value
          }));
        }

      }
    });
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
  onCheckPrepackQuantity(input_quantity, available_quantity, i) {
    if (!available_quantity) {
      return
    }
    if (+input_quantity > +available_quantity) {
      this.errorPrepackQuantity[i] = true;
    } else {
      this.errorPrepackQuantity[i] = false;
    }
  }
  checkError(arr) {
    return arr.some(elem => {
      return elem === true
    })
  }
  _keyPress(event: any) {
    const pattern = /[0-9\ ]/;
    let inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  onSumSizes(product, sum, prepack, pr_quaintity, index) {

    if (this.modalProduct.sizes) {
      this.sumSizes = 0;
      let sizes = sum.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.quantity)}), {});

      for (let i = 0; i < sum.length; i++) {
        if (sum[i].quantity !== undefined) {
          this.sumSizes += Number(sum[i].quantity);
        }
      }
      if (this.modalProduct.has_discount && this.checkDiscountDate(this.modalProduct.discount_end_date)) {
        this.totalSum = (this.sumSizes * this.modalProduct.discount_price).toFixed(2);
      } else {
        this.totalSum = (this.sumSizes * this.modalProduct.price).toFixed(2);
      }

    } else {
      if (pr_quaintity !== '') {
        this.arr.push(pr_quaintity);
      }
      if (pr_quaintity === '') {
        if (index === 0) {
          this.sumSizes = 0;

        } else {
          const sizes = prepack.sizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
          const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
          const totalQuantity = sumValues(sizes);
          this.sumSizes = this.sumSizes - Number(totalQuantity) * Number(this.arr[index]);
        }
      }

      const sizes = prepack.sizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
      const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
      let totalQuantity = sumValues(sizes);
      totalQuantity = Number(totalQuantity) * pr_quaintity;
      this.sumSizes += totalQuantity;
      if (this.modalProduct.has_discount && this.checkDiscountDate(this.modalProduct.discount_end_date)) {
        this.totalSum = (this.sumSizes * this.modalProduct.discount_price).toFixed(2);
      } else {
        this.totalSum = (this.sumSizes * this.modalProduct.price).toFixed(2);
      }
    }
  }
  addtoCart() {
    this.items = [];
    this.addItimes = {};
    let totalQuantity = null;
    if (this.modalProduct.sizes) {
      let finalSizes = JSON.parse(JSON.stringify(this.modalProduct.sizes));
      let finalQuantity = finalSizes.filter(x => {
        if (x.quantity) {
          return true;
        }
      }).filter(x => {
        delete x.value;
        return x;
      });
      let sizes = finalQuantity.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.quantity)}), {});
      console.log(sizes);
      if (Object.keys(sizes).length === 0) {
        this.displayErorQuantity = true;
      } else if (Object.keys(sizes).length > 0) {
        this.displayErorQuantity = false;
        const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
        totalQuantity = sumValues(sizes);
        let total_price = this.modalProduct.price * totalQuantity;
        this.items.push(
            {
              'product': this.modalProduct,
              'product_id': this.modalProduct.id,
              'size_quantities': sizes,
              'total_price': total_price,
              'total_price_with_discount': total_price
            });
      }
    } else {
      if (this.prepacksQuantity.length === 0) {
        this.displayErorPrepackQuantity = true;
      } else {
        this.displayErorPrepackQuantity = false;
        for (let i = 0; i < this.prepacksQuantity.length; i++) {
          if (this.prepacksQuantity[i]) {
            let sizes = this.modalProduct.prepacks[i].sizes.reduce((acc, cur) => ({...acc, [cur.key]: Number(cur.value)}), {});
            const sumValues = obj => Object.values(obj).reduce((a, b) => +a + +b);
            totalQuantity = sumValues(sizes);
            let total_price = this.modalProduct.price * totalQuantity;
            this.items.push(
                {
                  'product': this.modalProduct,
                  'product_id': this.modalProduct.id,
                  'prepack_id': this.modalProduct.prepacks[i].id,
                  'prepack': this.modalProduct.prepacks[i],
                  'quantity': this.prepacksQuantity[i],
                  'total_price': total_price,
                  'total_price_with_discount': total_price
                });
          }
        }
      }
    }
    this.addItimes.items = this.items;
    if ((!this.displayErorPrepackQuantity) && (!this.displayErorQuantity)) {
      this.productsService.getCarts(this.userService.getCurrentUserToken()).subscribe(
          data => {
            this.cartInfo = data;
            console.log(this.cartInfo);
            if (this.cartInfo.length === 0) {
              this.productsService.createNewCart(this.userService.getCurrentUserToken(), this.addItimes).subscribe(
                  data => {
                    this.cartInfoData = data;
                    this.productsService.setCartItemsQuantity(this.cartInfoData.items.length);
                    this.modalService.close('custom-modal-product');
                    this.modalService.open('custom-modal-3');
                    if (this.modalProduct.sizes) {
                      this.modalProduct.sizes.forEach(function (item) {
                        item.quantity = '';
                      });
                    } else {
                      this.prepacksQuantity = [];
                    }
                  },
                  error => {
                    console.log(error);
                    this.errorMesage = this.alertService._error_to_string(error.error.items[0].product_id);
                    this.modalService.close('custom-modal-product');
                    this.modalService.open('custom-modal-products-imported-bad');
                  });
            } else {
              this.productsService.addItemsCart(this.userService.getCurrentUserToken(), this.cartInfo[0].id, this.addItimes).subscribe(
                  data => {
                    this.cartInfoData = data;
                    this.productsService.setCartItemsQuantity(this.cartInfoData.items.length);
                    this.modalService.close('custom-modal-product');
                    this.modalService.open('custom-modal-3');
                    if (this.modalProduct.sizes) {
                      this.modalProduct.sizes.forEach(function (item) {
                        item.quantity = '';
                      });
                    } else {
                      this.prepacksQuantity = [];
                    }
                  },
                  error => {
                    console.log(error);
                    this.errorMesage = this.alertService._error_to_string(error.error.items[0].product_id);
                    this.modalService.close('custom-modal-product');
                    this.modalService.open('custom-modal-products-imported-bad')
                  });
            }
          },
          error => {
            console.log(error);
          }
      );
    }
  }
  closeModal(id: string) {
    this.modalProduct = '';
    this.totalSum = 0;
    this.displayErorQuantity = false;
    this.displayErorPrepackQuantity = false;
    this.modalService.close(id);
  }
  cartQuntity () {
    return this.productsService.getCartItemsQuantity();
  }
  getWebShop() {
    this.userService.getPersonalInfo(this.userService.getCurrentUserToken()).subscribe( data => {
      console.log(data);
      this.personalInfo = data;
      this.userService.getWebShop(this.userService.getCurrentUserToken(), this.personalInfo.webshop_url).subscribe(response => {
        console.log(response);
        this.webSiteInfo = response;
        this.webSiteInfo.new_webshop_url = this.webSiteInfo.webshop_url;
      }, error => {
        console.log(error);
      })
    }, error => {
      console.log(error);
    })
  }
  onLoad() {
    const imgHeight = (this.banner.nativeElement as HTMLImageElement).height;
    this.imgHeight = imgHeight - 175;
  }

  onBack() {
    //this.location.back();
    switch(this.scope) {
      case 'buyer':
        this.router.navigate(['/dashboard/buyer']);
        break
      case 'seller':
        this.router.navigate(['dashboard/seller']);
        break
      default:
        this.router.navigate(['/'])
    }
  }
  onEdit() {
    this.router.navigate(['/dashboard/my-shop'])
  }
  productLink(id) {
    this.router.navigate(['', this.shop, id]);
  }

}
