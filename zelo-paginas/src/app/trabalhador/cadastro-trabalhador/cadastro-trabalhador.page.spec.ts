import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CadastroTrabalhadorPage } from './cadastro-trabalhador.page';

describe('CadastroTrabalhadorPage', () => {
  let component: CadastroTrabalhadorPage;
  let fixture: ComponentFixture<CadastroTrabalhadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CadastroTrabalhadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
