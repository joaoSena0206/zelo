import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PagamentoCarteiraPage } from './pagamento-carteira.page';

describe('PagamentoCarteiraPage', () => {
  let component: PagamentoCarteiraPage;
  let fixture: ComponentFixture<PagamentoCarteiraPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PagamentoCarteiraPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
