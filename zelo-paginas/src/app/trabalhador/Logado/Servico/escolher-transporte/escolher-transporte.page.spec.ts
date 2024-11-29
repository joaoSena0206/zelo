import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EscolherTransportePage } from './escolher-transporte.page';

describe('EscolherTransportePage', () => {
  let component: EscolherTransportePage;
  let fixture: ComponentFixture<EscolherTransportePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(EscolherTransportePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
