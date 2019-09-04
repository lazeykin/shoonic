import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleShowroomComponent } from './single-showroom.component';

describe('SingleShowroomComponent', () => {
  let component: SingleShowroomComponent;
  let fixture: ComponentFixture<SingleShowroomComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleShowroomComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleShowroomComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
