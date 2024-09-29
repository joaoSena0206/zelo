import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginTrabalhadorPage } from './login-trabalhador.page';

describe('LoginTrabalhadorPage', () => {
  let component: LoginTrabalhadorPage;
  let fixture: ComponentFixture<LoginTrabalhadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginTrabalhadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
