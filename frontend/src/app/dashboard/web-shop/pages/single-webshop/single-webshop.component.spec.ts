import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleWebshopComponent } from './single-webshop.component';

describe('SingleWebshopComponent', () => {
  let component: SingleWebshopComponent;
  let fixture: ComponentFixture<SingleWebshopComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleWebshopComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleWebshopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
