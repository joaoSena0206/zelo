import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComercialPage } from './comercial.page';

describe('ComercialPage', () => {
  let component: ComercialPage;
  let fixture: ComponentFixture<ComercialPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ComercialPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
