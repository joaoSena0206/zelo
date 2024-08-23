import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DescricaoServicoPage } from './descricao-servico.page';

describe('DescricaoServicoPage', () => {
  let component: DescricaoServicoPage;
  let fixture: ComponentFixture<DescricaoServicoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DescricaoServicoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
