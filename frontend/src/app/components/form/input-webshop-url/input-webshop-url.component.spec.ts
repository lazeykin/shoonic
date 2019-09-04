import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InputWebshopUrlComponent } from './input-webshop-url.component';

describe('InputWebshopUrlComponent', () => {
  let component: InputWebshopUrlComponent;
  let fixture: ComponentFixture<InputWebshopUrlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InputWebshopUrlComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputWebshopUrlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
