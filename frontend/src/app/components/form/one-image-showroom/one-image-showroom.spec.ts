import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OneImageShowroomComponent } from './one-image-showroom.component';

describe('OneImageUploadComponent', () => {
  let component: OneImageShowroomComponent;
  let fixture: ComponentFixture<OneImageShowroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OneImageShowroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OneImageShowroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
