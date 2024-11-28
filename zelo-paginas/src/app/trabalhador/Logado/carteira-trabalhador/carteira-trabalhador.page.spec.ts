import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarteiraTrabalhadorPage } from './carteira-trabalhador.page';

describe('CarteiraTrabalhadorPage', () => {
  let component: CarteiraTrabalhadorPage;
  let fixture: ComponentFixture<CarteiraTrabalhadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteiraTrabalhadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
