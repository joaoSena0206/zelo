import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AnalisaServicoPage } from './analisa-servico.page';

describe('AnalisaServicoPage', () => {
  let component: AnalisaServicoPage;
  let fixture: ComponentFixture<AnalisaServicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(AnalisaServicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
