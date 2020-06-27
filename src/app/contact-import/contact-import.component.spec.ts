import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactImportComponent } from './contact-import.component';

describe('ContactImportComponent', () => {
  let component: ContactImportComponent;
  let fixture: ComponentFixture<ContactImportComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContactImportComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactImportComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
