import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ConfirmarCelularPage } from './confirmar-celular.page';

describe('ConfirmarCelularPage', () => {
  let component: ConfirmarCelularPage;
  let fixture: ComponentFixture<ConfirmarCelularPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmarCelularPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
