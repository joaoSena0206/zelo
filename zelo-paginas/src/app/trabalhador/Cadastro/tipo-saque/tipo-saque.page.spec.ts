import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TipoSaquePage } from './tipo-saque.page';

describe('TipoSaquePage', () => {
  let component: TipoSaquePage;
  let fixture: ComponentFixture<TipoSaquePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TipoSaquePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
