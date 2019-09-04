import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopPromotionsComponent } from './shop-promotions.component';

describe('ShopPromotionsComponent', () => {
  let component: ShopPromotionsComponent;
  let fixture: ComponentFixture<ShopPromotionsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopPromotionsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopPromotionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
