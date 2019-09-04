
import { BuyerShowroomPrivateComponent } from './dashboard/buyer/showroom/buyerShowroomPrivate.component';
import { ByAllComponent } from './dashboard/messenger/pages/by-all/by-all.component';
import { TranslatePipe } from './pipes/translate.pipe';
import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HttpClientModule, HTTP_INTERCEPTORS} from '@angular/common/http';
import {DataTableModule} from 'angular-6-datatable';
import {AppRoutingModule} from './app-routing.module';
import {ImageUploadModule} from 'angular2-image-upload';
import {NgxGalleryModule} from 'ngx-gallery';
import {DateValPoint, DateVal, RoundingPipe, ReplaceLineBreaks, ReplaceLongLine, ObjNgFor} from './pipes/rounding.pipe';

import {ClickOutsideModule} from 'ng4-click-outside';
import {TabModule} from 'angular-tabs-component';

import {AppComponent} from './app.component';
import {AlertComponent} from './_directives/index';
import {FooterComponent} from './_directives/index';
import {HeaderComponent} from './_directives/index';
import {HomeComponent} from './home/index';
import {LoginComponent, NewPassword} from './login/index';
import {RestorePassword} from './login/index';
import {RegisterStepFour, RegisterStepOne, RegisterStepTwo, RegisterStepTree, RegisterFree} from './register/index';
import {
    SellerComponent, SellerAccountComponent, SellerAccountCompanyComponent, SellerAccountPasswordComponent,
    SellerSingleProductComponent, SellerProductAddComponent, SellerPreviewProductComponent,
    SearchVisitorComponent, SellerSearch, BuyerSearch, BuyerMakeOrderComponent
} from './dashboard/index';
import {BuyerComponent, BuyerAccountComponent, BuyerSingleProductComponent} from './dashboard/index';
import {ModalComponent} from './_directives/index';
import {MessengerService, ModalService} from './_services/index';
import {CustomValidator} from './_services/custom_validators';

import {AlertService, AuthenticationService, UserService} from './_services/index';
import {ProductsService, OrdersService} from './_services/index';

import {AuthGuard} from './_guards/index';
import {JwtInterceptor, ApiPathInterceptor} from './_helpers/index';


import {PLATFORM_ID, APP_ID, Inject} from '@angular/core';
import {DatePipe, isPlatformBrowser} from '@angular/common';

import {SubcribeSucessComponent} from './home/subcribeSucess.component';
import {BuyerAccountPasswordComponent} from './dashboard/buyer/buyerAccountPassword.component';
import {BuyerAccountCompanyComponent} from './dashboard/buyer/buyerAccountCompany.component';
// import {SellerBrandsComponent} from './dashboard/seller/sellerBrands.component';
// import {SellerAccountSIComponent} from './dashboard/seller/sellerAccountSI.component';
import {SellerPrepacksComponent} from './dashboard/seller/sellerPrepacks.component';
import {SellerArchiveComponent} from './dashboard/seller/sellerArchive.component';
import {SellerDraftsComponent} from './dashboard/seller/sellerDrafts.component';
import {SellerEditComponent} from './dashboard/seller/sellerEdit.component';
import {SellerPreviewEditProductComponent} from './dashboard/seller/sellerPreviewEditProduct.component';
import {FiltersComponent} from './components/dashboard/filters/filters.component';
import {SortSelectorComponent} from './components/dashboard/sort-selector/sort-selector.component';
import {InputTextComponent} from './components/form/input-text/input-text.component';
import {InputEmailComponent} from './components/form/input-email/input-email.component';
import {InputPasswordComponent} from './components/form/input-password/input-password.component';
// import { CustomElementComponent } from './components/form/custom-element/custom-element.component';
import {SelectComponent} from './components/form/select/select.component';
import {FormService} from './_services/form';
import {InputTextareaComponent} from './components/form/input-textarea/input-textarea.component';
import {InputNumberComponent} from './components/form/input-number/input-number.component';
import {FormImagesComponent} from './components/form/form-images/form-images.component';
import {SizesModelComponent} from './components/form/sizes-model/sizes-model.component';
import {OneImageUploadComponent} from './components/form/one-image-upload/one-image-upload.component';
import {AccountSetComponent} from './components/form/account-set/account-set.component';
import {BuyerCartComponent} from './dashboard/buyer/buyerCart.component';
import {AddPhotoComponent} from './components/form/add-photo/add-photo.component';
import {OneImageProductComponent} from './components/form/one-image-product/one-image-product.component';
import {AddEditProductOneComponent} from './components/form/add-edit-product-one/add-edit-product-one.component';
import {NewPasswordComponent} from './components/form/new-password/new-password.component';
import {AddEditProductTwoComponent} from './components/form/add-edit-product-two/add-edit-product-two.component';
import {AddEditProductThreeComponent} from './components/form/add-edit-product-three/add-edit-product-three.component';
import {MessengerComponent} from './dashboard/messenger/messenger.component';
import {SideMenuComponent} from './dashboard/messenger/components/side-menu/side-menu.component';
import {SideMenuItemComponent} from './dashboard/messenger/components/side-menu/side-menu-item/side-menu-item.component';
import {SideMenuSubItemComponent} from './dashboard/messenger/components/side-menu/side-menu-sub-item/side-menu-sub-item.component';
import {ContactsComponent} from './dashboard/messenger/pages/contacts/contacts.component';
import {ByProductsComponent} from './dashboard/messenger/pages/by-products/by-products.component';
import {ByOrdersComponent} from './dashboard/messenger/pages/by-orders/by-orders.component';
import {FullPageSpinnerComponent} from './dashboard/messenger/components/full-page-spinner/full-page-spinner.component';
import {SpecificProductComponent} from './dashboard/messenger/pages/specific-product/specific-product.component';
import {SocketService} from './_services/socket.service';
import {PaginationComponent} from './dashboard/messenger/components/pagination/pagination.component';
import {SellersCatalogComponent} from './dashboard/seller/sellers-catalog/sellers-catalog.component';
import {SellersCatalogSingleProductComponent} from './dashboard/seller/sellers-catalog-single-product/sellers-catalog-single-product.component';
import { GroupAddComponent } from './dashboard/messenger/pages/group-add/group-add.component';
import { ContactGroupsComponent } from './dashboard/messenger/pages/contact-groups/contact-groups.component';
import { EditGroupComponent } from './dashboard/messenger/pages/edit-group/edit-group.component';
import { ModalViewComponent } from './components/dashboard/modal-view/modal-view.component';
import { UserProfileComponent } from './dashboard/messenger/pages/user-profile/user-profile.component';
import { SellerShowroomComponent } from './dashboard/seller/showroom/sellerShowroom.component';
import { SellerSingleShowroomComponent } from './dashboard/seller/showroom/sellerSingleShowroom.component';
import { BuyerShowroomComponent } from './dashboard/buyer/showroom/buyerShowroom.component'
import { BuyerSingleShowroomComponent } from './dashboard/buyer/showroom/buyerSingleShowroom.component';
import { SellerShowroomArchiveComponent } from './dashboard/seller/showroom/sellerShowroomArchive.component';
import { SellerAddEditShowroomComponent } from './dashboard/seller/showroom/sellerAddEditShowroom.component';
import {OneImageShowroomComponent} from './components/form/one-image-showroom/one-image-showroom.component';
import {ShowroomsService} from './_services/showrooms.service'
import {SellerEditShowroomComponent} from './dashboard/seller/showroom/sellerEditShowroom.component';
import {BuyerShowroomProductComponent} from './dashboard/buyer/showroom/buyerShowroomProduct.component';
import { BuyerNotRegisteredShowroomComponent } from './dashboard/buyer/showroom/buyerNotRegisteredShowroom.component';
import { RegisterHeaderComponent } from './register/register-header/register-header.component';
import { ShoonicSearchComponent } from './dashboard/seller/shoonicSearch.component';
import { DateValueAccessorModule } from 'angular-date-value-accessor';
import { AngularDateTimePickerModule } from 'angular2-datetimepicker';
import { DataPickerComponent } from './components/form/data-picker/data-picker.component';
// import { UploadHistoryComponent } from './dashboard/seller/upload-history/upload-history.component';
import { SellerPublicCatalogComponent } from './dashboard/seller/public-catalog/public-catalog.component';
import { SelectFilterComponent } from './components/dashboard/select-filter/select-filter.component';
import { WebShopComponent } from './dashboard/web-shop/web-shop.component';
import { SingleWebshopComponent } from './dashboard/web-shop/pages/single-webshop/single-webshop.component';
import { WebshopHeaderComponent } from './dashboard/web-shop/components/webshop-header/webshop-header.component';
import { SingleProductComponent } from './dashboard/web-shop/pages/single-product/single-product.component';
import { ShopPromotionsComponent } from './dashboard/web-shop/pages/shop-promotions/shop-promotions.component';
import { ShopShowroomComponent } from './dashboard/web-shop/pages/shop-showroom/shop-showroom.component';
import { PromoComponent } from './dashboard/seller/promo/promo.component';
import { PromoBuyerComponent } from './dashboard/buyer/promo-buyer/promo-buyer.component';
import { SellerShowroomPrivateComponent } from './dashboard/seller/showroom/sellerShowroomPrivate.component';
import { ShopShowroomPrivateComponent } from './dashboard/web-shop/pages/shop-showroom-private/shop-showroom-private.component';
import { SellerCartComponent } from './dashboard/buyer/seller-cart/seller-cart.component';
import { SelectItemsComponent } from './dashboard/buyer/select-items/select-items.component';
import { DocumentsComponent } from './dashboard/messenger/pages/documents/documents.component';
import { SingleShowroomComponent } from './dashboard/web-shop/pages/single-showroom/single-showroom.component';
import {MessengerSellerBrandsComponent} from './dashboard/messenger/pages/brands/brands.component';
import {MessengerSellerAccountSIComponent} from './dashboard/messenger/pages/sales-identity/sales-identity.component';
import {MessengerUploadHistoryComponent} from './dashboard/messenger/pages/upload-history/upload-history.component';
import { MessengerPrepacksComponent } from './dashboard/messenger/pages/prepacks/prepacks.component';
import { InputWebshopUrlComponent } from './components/form/input-webshop-url/input-webshop-url.component';
import {SlideshowModule} from 'ng-simple-slideshow';
import {TextareaAutosizeModule} from 'ngx-textarea-autosize';
import { ChangeEmailComponent } from './register/change-email/change-email.component';
import { TokenComponent } from './dashboard/token/token.component';



@NgModule({
    imports: [
        BrowserModule.withServerTransition({appId: 'shoonic'}),
        FormsModule,
        ReactiveFormsModule,
        AppRoutingModule,
        AngularDateTimePickerModule,
        HttpClientModule,
        DateValueAccessorModule,
        DataTableModule,
        NgxGalleryModule,
        ClickOutsideModule,
        TabModule,
        ImageUploadModule.forRoot(),
        SlideshowModule,
        TextareaAutosizeModule
    ],
    declarations: [
        AppComponent,
        AlertComponent,
        HomeComponent,
        HeaderComponent,
        MessengerSellerBrandsComponent,
        MessengerSellerAccountSIComponent,
        MessengerUploadHistoryComponent,
        FooterComponent,
        LoginComponent,
        ObjNgFor,
        RestorePassword,
        NewPassword,
        // SellerBrandsComponent,
        // SellerAccountSIComponent,
        SellerPrepacksComponent,
        SellerArchiveComponent,
        SellerDraftsComponent,
        SellerEditComponent,
        SellerPreviewEditProductComponent,
        RegisterStepOne,
        RegisterStepTwo,
        RegisterStepTree,
        RegisterStepFour,
        RegisterFree,
        SellerComponent,
        BuyerComponent,
        SellerAccountComponent,
        SellerSingleProductComponent,
        SellerProductAddComponent,
        SellerPreviewProductComponent,
        BuyerAccountComponent,
        BuyerCartComponent,
        BuyerMakeOrderComponent,
        BuyerSingleProductComponent,
        ModalComponent,
        SubcribeSucessComponent,
        SellerAccountCompanyComponent,
        SellerAccountPasswordComponent,
        BuyerAccountPasswordComponent,
        BuyerAccountCompanyComponent,
        SearchVisitorComponent,
        SellerSearch,
        BuyerSearch,
        DateVal,
        DateValPoint,
        ReplaceLongLine,
        RoundingPipe,
        TranslatePipe,
        ReplaceLineBreaks,
        FiltersComponent,
        SortSelectorComponent,
        InputTextComponent,
        InputEmailComponent,
        InputPasswordComponent,
        SelectComponent,
        InputTextareaComponent,
        InputNumberComponent,
        FormImagesComponent,
        SizesModelComponent,
        OneImageUploadComponent,
        AccountSetComponent,
        AddPhotoComponent,
        OneImageProductComponent,
        AddEditProductOneComponent,
        NewPasswordComponent,
        AddEditProductTwoComponent,
        AddEditProductThreeComponent,
        AddEditProductTwoComponent,
        MessengerComponent,
        SideMenuComponent,
        SideMenuItemComponent,
        SideMenuSubItemComponent,
        ContactsComponent,
        ByProductsComponent,
        ByOrdersComponent,
        ByAllComponent,
        FullPageSpinnerComponent,
        SpecificProductComponent,
        PaginationComponent,
        SellersCatalogComponent,
        SellersCatalogSingleProductComponent,
        GroupAddComponent,
        ContactGroupsComponent,
        EditGroupComponent,
        ModalViewComponent,
        UserProfileComponent,
        SellerShowroomComponent,
        SellerShowroomPrivateComponent,
        SellerSingleShowroomComponent,
        BuyerShowroomComponent,
        BuyerShowroomPrivateComponent,
        BuyerSingleShowroomComponent,
        SellerShowroomArchiveComponent,
        SellerAddEditShowroomComponent,
        OneImageShowroomComponent,
        SellerEditShowroomComponent,
        BuyerShowroomProductComponent,
        BuyerNotRegisteredShowroomComponent,
        RegisterHeaderComponent,
        ShoonicSearchComponent,
        DataPickerComponent,
        // UploadHistoryComponent,
        SellerPublicCatalogComponent,
        SelectFilterComponent,
        WebShopComponent,
        SingleWebshopComponent,
        WebshopHeaderComponent,
        SingleProductComponent,
        ShopPromotionsComponent,
        ShopShowroomComponent,
        ShopShowroomPrivateComponent,
        PromoComponent,
        PromoBuyerComponent,
        SellerCartComponent,
        SelectItemsComponent,
        DocumentsComponent,
        SingleShowroomComponent,
        MessengerPrepacksComponent,
        InputWebshopUrlComponent,
        ChangeEmailComponent,
        TokenComponent
    ],
    providers: [
        SocketService,
        DatePipe,
        AuthGuard,
        AlertService,
        AddEditProductTwoComponent,
        SellerProductAddComponent,
        SellerEditComponent,
        AuthenticationService,
        UserService,
        ProductsService,
        OrdersService,
        CustomValidator,
        FormService,
        MessengerService,
        SellerAccountComponent,
        BuyerAccountComponent,
        SellerComponent,
        SelectComponent,
        BuyerComponent,
        FiltersComponent,
        ModalService,
        ShowroomsService,
        TranslatePipe,
        SellerAccountCompanyComponent,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: ApiPathInterceptor,
            multi: true
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: JwtInterceptor,
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(APP_ID) private appId: string) {
        const platform = isPlatformBrowser(platformId) ?
            'in the browser' : 'on the server';
        console.log(`Running ${platform} with appId=${appId}`);
    }
}
