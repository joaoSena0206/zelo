import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UltimosPedidosPage } from './ultimos-pedidos.page';

describe('UltimosPedidosPage', () => {
  let component: UltimosPedidosPage;
  let fixture: ComponentFixture<UltimosPedidosPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(UltimosPedidosPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
