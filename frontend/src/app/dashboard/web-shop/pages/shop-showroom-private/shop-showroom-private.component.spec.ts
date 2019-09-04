import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopShowroomPrivateComponent } from './shop-showroom-private.component';

describe('ShopShowroomPrivateComponent', () => {
  let component: ShopShowroomPrivateComponent;
  let fixture: ComponentFixture<ShopShowroomPrivateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopShowroomPrivateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopShowroomPrivateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
