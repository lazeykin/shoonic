import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneImageProductComponent } from './one-image-product.component';

describe('OneImageProductComponent', () => {
  let component: OneImageProductComponent;
  let fixture: ComponentFixture<OneImageProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneImageProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneImageProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
