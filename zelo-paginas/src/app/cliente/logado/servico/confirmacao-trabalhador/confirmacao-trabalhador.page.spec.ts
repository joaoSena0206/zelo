import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacaoTrabalhadorPage } from './confirmacao-trabalhador.page';

describe('ConfirmacaoTrabalhadorPage', () => {
  let component: ConfirmacaoTrabalhadorPage;
  let fixture: ComponentFixture<ConfirmacaoTrabalhadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacaoTrabalhadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
