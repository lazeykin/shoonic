import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditProductOneComponent } from './add-edit-product-one.component';

describe('AddEditProductOneComponent', () => {
  let component: AddEditProductOneComponent;
  let fixture: ComponentFixture<AddEditProductOneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddEditProductOneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddEditProductOneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
