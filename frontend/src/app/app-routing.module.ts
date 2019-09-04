import { ShopShowroomPrivateComponent } from './dashboard/web-shop/pages/shop-showroom-private/shop-showroom-private.component';
import { ByAllComponent } from './dashboard/messenger/pages/by-all/by-all.component';
import { ShoonicSearchComponent } from './dashboard/seller/shoonicSearch.component';
import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {HomeComponent} from './home/index';
import {LoginComponent, RestorePassword, NewPassword} from './login/index';
import {RegisterStepOne, RegisterStepTwo, RegisterStepTree, RegisterStepFour, RegisterFree} from './register/index';
import {AuthGuard} from './_guards/index';
import {
    SellerComponent,
    SellerAccountComponent,
    SellerAccountCompanyComponent,
    SellerAccountPasswordComponent,
    SellerSingleProductComponent,
    SellerPreviewProductComponent,
    SearchVisitorComponent,
    SellerSearch,
    BuyerSearch,
    SellerProductAddComponent
} from './dashboard/index';
import {
    BuyerComponent,
    BuyerAccountComponent,
    BuyerAccountPasswordComponent,
    BuyerAccountCompanyComponent,
    BuyerSingleProductComponent
} from './dashboard/index';
import {SubcribeSucessComponent} from './home/subcribeSucess.component';
// import {SellerBrandsComponent} from './dashboard/seller/sellerBrands.component';
// import {SellerAccountSIComponent} from './dashboard/seller/sellerAccountSI.component';
import {SellerPrepacksComponent} from './dashboard/seller/sellerPrepacks.component';
import {SellerArchiveComponent} from './dashboard/seller/sellerArchive.component';
import {SellerDraftsComponent} from './dashboard/seller/sellerDrafts.component';
import {SellerEditComponent} from './dashboard/seller/sellerEdit.component';
import {SellerPreviewEditProductComponent} from './dashboard/seller/sellerPreviewEditProduct.component';
import {MessengerComponent} from './dashboard/messenger/messenger.component';
import {ContactsComponent} from './dashboard/messenger/pages/contacts/contacts.component';
import {ByProductsComponent} from './dashboard/messenger/pages/by-products/by-products.component';
import {ByOrdersComponent} from './dashboard/messenger/pages/by-orders/by-orders.component';
import {SpecificProductComponent} from './dashboard/messenger/pages/specific-product/specific-product.component';
import {BuyerCartComponent} from './dashboard/buyer/buyerCart.component';
import {BuyerMakeOrderComponent} from './dashboard';
import {SellersCatalogComponent} from './dashboard/seller/sellers-catalog/sellers-catalog.component';
import {SellersCatalogSingleProductComponent} from './dashboard/seller/sellers-catalog-single-product/sellers-catalog-single-product.component';
import {GroupAddComponent} from './dashboard/messenger/pages/group-add/group-add.component';
import {ContactGroupsComponent} from './dashboard/messenger/pages/contact-groups/contact-groups.component';
import {EditGroupComponent} from './dashboard/messenger/pages/edit-group/edit-group.component';
import {UserProfileComponent} from './dashboard/messenger/pages/user-profile/user-profile.component';
import {SellerShowroomComponent} from './dashboard/seller/showroom/sellerShowroom.component';
import {SellerSingleShowroomComponent} from './dashboard/seller/showroom/sellerSingleShowroom.component'
import {BuyerShowroomComponent} from './dashboard/buyer/showroom/buyerShowroom.component'
import {BuyerSingleShowroomComponent} from './dashboard/buyer/showroom/buyerSingleShowroom.component'
import {SellerShowroomArchiveComponent} from './dashboard/seller/showroom/sellerShowroomArchive.component'
import {SellerAddEditShowroomComponent} from './dashboard/seller/showroom/sellerAddEditShowroom.component'
import {SellerEditShowroomComponent} from './dashboard/seller/showroom/sellerEditShowroom.component'
import {BuyerShowroomProductComponent} from './dashboard/buyer/showroom/buyerShowroomProduct.component'
import { BuyerNotRegisteredShowroomComponent } from './dashboard/buyer/showroom/buyerNotRegisteredShowroom.component';
// import { UploadHistoryComponent } from './dashboard/seller/upload-history/upload-history.component';
import { SellerPublicCatalogComponent } from './dashboard/seller/public-catalog/public-catalog.component';
import {WebShopComponent} from './dashboard/web-shop/web-shop.component';
import {SingleWebshopComponent} from './dashboard/web-shop/pages/single-webshop/single-webshop.component';
import {SingleProductComponent} from './dashboard/web-shop/pages/single-product/single-product.component';
import {ShopPromotionsComponent} from './dashboard/web-shop/pages/shop-promotions/shop-promotions.component';
import {ShopShowroomComponent} from './dashboard/web-shop/pages/shop-showroom/shop-showroom.component';
import {PromoComponent} from './dashboard/seller/promo/promo.component';
import {PromoBuyerComponent} from './dashboard/buyer/promo-buyer/promo-buyer.component';
import { SellerShowroomPrivateComponent } from './dashboard/seller/showroom/sellerShowroomPrivate.component';

import {SellerCartComponent} from './dashboard/buyer/seller-cart/seller-cart.component';
import {SelectItemsComponent} from './dashboard/buyer/select-items/select-items.component';
import { DocumentsComponent } from './dashboard/messenger/pages/documents/documents.component';
import {SingleShowroomComponent} from './dashboard/web-shop/pages/single-showroom/single-showroom.component';
import { MessengerSellerAccountSIComponent } from './dashboard/messenger/pages/sales-identity/sales-identity.component';
import { MessengerUploadHistoryComponent } from './dashboard/messenger/pages/upload-history/upload-history.component';
import { MessengerSellerBrandsComponent } from './dashboard/messenger/pages/brands/brands.component';
import { MessengerPrepacksComponent } from './dashboard/messenger/pages/prepacks/prepacks.component';
import {ChangeEmailComponent} from './register/change-email/change-email.component';
import {TokenComponent} from './dashboard/token/token.component';
// import { UploadHistoryComponent, MessengerUploadHistoryComponent } from './dashboard/messenger/pages/upload-history/upload-history.component';
// import { SellerAccountSIComponent } from './dashboard/messenger/pages/sales-identity/sales-identity.component';

const routes: Routes = [
    {path: '', component: HomeComponent},
    {path: 'search/:name', component: SearchVisitorComponent},
    {path: 'dashboard/seller/search/:name', component: SellerSearch, canActivate: [AuthGuard]},
    {path: 'dashboard/products/search/:name', component: ShoonicSearchComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/buyer/search/:name', component: BuyerSearch, canActivate: [AuthGuard]},
    {path: 'login', component: LoginComponent},
    {path: 'login/restore-password', component: RestorePassword},
    {path: 'core/confirm-password-reset/:id', component: NewPassword},
    {path: 'core/confirm-email/:id', component: RegisterStepTree},
    {path: 'core/confirm-email-change/:id', component: ChangeEmailComponent},
    {path: 'register/register-step-one', component: RegisterStepOne},
    {path: 'register/register-step-two', component: RegisterStepTwo},
    {path: 'register/register-step-four', component: RegisterStepFour},
    {path: 'register/register-free', component: RegisterFree},
    {path: 'core/confirm-subscription/:id', component: SubcribeSucessComponent},
    {path: 'core/sellers-cart/:id', component: SellerCartComponent},
    {path: 'dashboard/seller', component: SellerComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/public-catalog', component: SellerPublicCatalogComponent, canActivate: [AuthGuard]},
    // {path: 'dashboard/seller/brands', component: SellerBrandsComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/prepacks', component: SellerPrepacksComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/archive', component: SellerArchiveComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/drafts', component: SellerDraftsComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/promotions', component: PromoComponent, canActivate: [AuthGuard]},
    // {path: 'dashboard/seller/account/sales-identity', component: SellerAccountSIComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/account', component: SellerAccountComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/account/company', component: SellerAccountCompanyComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/account/security', component: SellerAccountPasswordComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/account/token', component: TokenComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/product/:id', component: SellerSingleProductComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/product/edit/:id', component: SellerEditComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/edit-preview', component: SellerPreviewEditProductComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/showrooms', redirectTo: 'dashboard/seller/showrooms/private', pathMatch: 'full', canActivate: [AuthGuard]},
    {path: 'dashboard/seller/showrooms/private', component: SellerShowroomPrivateComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/showrooms/public',  component: SellerShowroomComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/showroom/:id', component: SellerSingleShowroomComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/showrooms/archive', component: SellerShowroomArchiveComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/showrooms/add', component: SellerAddEditShowroomComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/seller/showroom/edit/:id', component: SellerEditShowroomComponent, canActivate: [AuthGuard]},

    {path: 'dashboard/buyer', component: BuyerComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/buyer/order-edit', component: SelectItemsComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/buyer/cart', component: BuyerCartComponent, canActivate: [AuthGuard]},
    // {path: 'dashboard/buyer/make-order', component: BuyerMakeOrderComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/buyer/product/:id', component: BuyerSingleProductComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/buyer/account', component: BuyerAccountComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/buyer/account/company', component: BuyerAccountCompanyComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/buyer/account/security', component: BuyerAccountPasswordComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/buyer/showrooms', component: BuyerShowroomComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/buyer/promotions', component: PromoBuyerComponent, canActivate: [AuthGuard]},
    {path: 'dashboard/buyer/showroom/:id', component: BuyerSingleShowroomComponent, canActivate: [AuthGuard]},
    {path: 'core/showroom/:id', component: BuyerNotRegisteredShowroomComponent },
    {path: 'dashboard/buyer/showroom/product/:id', component: BuyerShowroomProductComponent, canActivate: [AuthGuard]},

    {
        path: 'dashboard/seller/product/add/steps',
        component: SellerProductAddComponent,
        canActivate: [AuthGuard]
    },
    {path: 'dashboard/seller/product/add/preview', component: SellerPreviewProductComponent, canActivate: [AuthGuard]},

    {path: 'dashboard/seller/products', component: SellersCatalogComponent, canActivate: [AuthGuard],},
    {
        path: 'dashboard/seller/products/product/:id',
        component: SellersCatalogSingleProductComponent,
        canActivate: [AuthGuard]
    },

    {
        path: 'dashboard/messenger',
        component: MessengerComponent,
        canActivate: [AuthGuard],
        children: [
            {path: '', redirectTo: 'all', pathMatch: 'full'},
            {path: 'contacts', component: ContactsComponent},
            {path: 'products', component: ByProductsComponent},
            {path: 'orders', component: ByOrdersComponent},
            {path: 'all', component: ByAllComponent},
            {path: 'documents', component: DocumentsComponent},
            {path: 'products/dialog/:dialog_id', component: SpecificProductComponent},
            {path: 'orders/dialog/:dialog_id', component: SpecificProductComponent},
            {path: 'group/add', component: GroupAddComponent},
            {path: 'groups', component: ContactGroupsComponent},
            {path: 'group/edit/:cg_id', component: EditGroupComponent},
            {path: 'upload-history', component: MessengerUploadHistoryComponent},
            {path: 'sales-identity', component:MessengerSellerAccountSIComponent},
            {path: 'brands', component: MessengerSellerBrandsComponent},
            {path: 'prepacks', component: MessengerPrepacksComponent},
            {path: 'group/:cg_id/user/:cg_member_id', component: UserProfileComponent},
            
        ]
    },
    {   path: 'dashboard/my-shop',
        component: WebShopComponent,
        canActivate: [AuthGuard]},
    // {path: 'dashboard/seller/upload-history', component: UploadHistoryComponent, canActivate: [AuthGuard]},
    // {path: 'dashboard/messenger/group/:cg_id/user/:cg_member_id', component: UserProfileComponent,
    //     canActivate: [AuthGuard]},
    {path: ':shop', component: SingleWebshopComponent},
    {path: ':shop/promotions', component: ShopPromotionsComponent},
    {path: ':shop/showrooms', redirectTo: ':shop/showrooms/public'},
    {path: ':shop/showrooms/public', component: ShopShowroomComponent},
    {path: ':shop/showrooms/private', component: ShopShowroomPrivateComponent},
    {path: ':shop/showroom/:id', component: SingleShowroomComponent},
    {path: ':shop/:id', component: SingleProductComponent},
    // otherwise redirect to home
    {path: '**', redirectTo: ''}
];

@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
