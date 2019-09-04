import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductTwoComponent } from './add-edit-product-two.component';

describe('AddEditProductTwoComponent', () => {
  let component: AddEditProductTwoComponent;
  let fixture: ComponentFixture<AddEditProductTwoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditProductTwoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
