import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WebshopHeaderComponent } from './webshop-header.component';

describe('WebshopHeaderComponent', () => {
  let component: WebshopHeaderComponent;
  let fixture: ComponentFixture<WebshopHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WebshopHeaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WebshopHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
