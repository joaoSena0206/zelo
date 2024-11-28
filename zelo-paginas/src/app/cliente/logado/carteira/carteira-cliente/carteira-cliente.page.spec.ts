import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CarteiraClientePage } from './carteira-cliente.page';

describe('CarteiraClientePage', () => {
  let component: CarteiraClientePage;
  let fixture: ComponentFixture<CarteiraClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CarteiraClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
