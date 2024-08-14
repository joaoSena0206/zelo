import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmarCelularSenhaPage } from './confirmar-celular-senha.page';

describe('ConfirmarCelularSenhaPage', () => {
  let component: ConfirmarCelularSenhaPage;
  let fixture: ComponentFixture<ConfirmarCelularSenhaPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarCelularSenhaPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
