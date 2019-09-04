import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellerCartComponent } from './seller-cart.component';

describe('SellerCartComponent', () => {
  let component: SellerCartComponent;
  let fixture: ComponentFixture<SellerCartComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellerCartComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellerCartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
