import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PromoBuyerComponent } from './promo-buyer.component';

describe('PromoBuyerComponent', () => {
  let component: PromoBuyerComponent;
  let fixture: ComponentFixture<PromoBuyerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PromoBuyerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PromoBuyerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
