import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmacaoClientePage } from './confirmacao-cliente.page';

describe('ConfirmacaoClientePage', () => {
  let component: ConfirmacaoClientePage;
  let fixture: ComponentFixture<ConfirmacaoClientePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacaoClientePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
