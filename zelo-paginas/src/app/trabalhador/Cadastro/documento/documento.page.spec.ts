import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DocumentoPage } from './documento.page';

describe('DocumentoPage', () => {
  let component: DocumentoPage;
  let fixture: ComponentFixture<DocumentoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(DocumentoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
