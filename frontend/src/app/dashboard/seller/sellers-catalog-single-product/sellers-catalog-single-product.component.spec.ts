import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellersCatalogSingleProductComponent } from './sellers-catalog-single-product.component';

describe('SellersCatalogSingleProductComponent', () => {
  let component: SellersCatalogSingleProductComponent;
  let fixture: ComponentFixture<SellersCatalogSingleProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellersCatalogSingleProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellersCatalogSingleProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
