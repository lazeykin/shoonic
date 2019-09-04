import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopShowroomComponent } from './shop-showroom.component';

describe('ShopShowroomComponent', () => {
  let component: ShopShowroomComponent;
  let fixture: ComponentFixture<ShopShowroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ShopShowroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShopShowroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
