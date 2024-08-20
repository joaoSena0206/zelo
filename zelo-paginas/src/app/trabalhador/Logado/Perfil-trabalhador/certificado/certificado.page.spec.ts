import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificadoPage } from './certificado.page';

describe('CertificadoPage', () => {
  let component: CertificadoPage;
  let fixture: ComponentFixture<CertificadoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(CertificadoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
