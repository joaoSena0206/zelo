import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscolherTrabalhadorPage } from './escolher-trabalhador.page';

describe('EscolherTrabalhadorPage', () => {
  let component: EscolherTrabalhadorPage;
  let fixture: ComponentFixture<EscolherTrabalhadorPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscolherTrabalhadorPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
