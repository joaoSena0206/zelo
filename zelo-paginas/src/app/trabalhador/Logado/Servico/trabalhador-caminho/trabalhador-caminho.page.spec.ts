import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TrabalhadorCaminhoPage } from './trabalhador-caminho.page';

describe('TrabalhadorCaminhoPage', () => {
  let component: TrabalhadorCaminhoPage;
  let fixture: ComponentFixture<TrabalhadorCaminhoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TrabalhadorCaminhoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
