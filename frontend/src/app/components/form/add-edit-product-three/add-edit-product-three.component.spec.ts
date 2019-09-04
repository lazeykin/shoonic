import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductThreeComponent } from './add-edit-product-three.component';

describe('AddEditProductThreeComponent', () => {
  let component: AddEditProductThreeComponent;
  let fixture: ComponentFixture<AddEditProductThreeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditProductThreeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductThreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
