import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OpcoesDeCadastroPage } from './opcoes-de-cadastro.page';

describe('OpcoesDeCadastroPage', () => {
  let component: OpcoesDeCadastroPage;
  let fixture: ComponentFixture<OpcoesDeCadastroPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(OpcoesDeCadastroPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
