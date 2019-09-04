import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellersCatalogComponent } from './sellers-catalog.component';

describe('SellersCatalogComponent', () => {
  let component: SellersCatalogComponent;
  let fixture: ComponentFixture<SellersCatalogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellersCatalogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellersCatalogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
