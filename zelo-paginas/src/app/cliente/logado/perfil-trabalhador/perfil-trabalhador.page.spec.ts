import { ComponentFixture, TestBed } from '@angular/core/testing';
import { PerfilTrabalhadorPage } from './perfil-trabalhador.page';

describe('PerfilTrabalhadorPage', () => {
  let component: PerfilTrabalhadorPage;
  let fixture: ComponentFixture<PerfilTrabalhadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PerfilTrabalhadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
