import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FormImagesComponent } from './form-images.component';

describe('FormImagesComponent', () => {
  let component: FormImagesComponent;
  let fixture: ComponentFixture<FormImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FormImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FormImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
