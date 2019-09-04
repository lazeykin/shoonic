import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SizesModelComponent } from './sizes-model.component';

describe('SizesModelComponent', () => {
  let component: SizesModelComponent;
  let fixture: ComponentFixture<SizesModelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SizesModelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SizesModelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
