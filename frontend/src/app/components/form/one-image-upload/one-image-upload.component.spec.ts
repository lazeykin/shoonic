import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneImageUploadComponent } from './one-image-upload.component';

describe('OneImageUploadComponent', () => {
  let component: OneImageUploadComponent;
  let fixture: ComponentFixture<OneImageUploadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneImageUploadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneImageUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
