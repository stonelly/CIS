import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogStringifiedReturnloadComponent } from './dialog-stringified-returnload.component';

describe('DialogStringifiedReturnloadComponent', () => {
  let component: DialogStringifiedReturnloadComponent;
  let fixture: ComponentFixture<DialogStringifiedReturnloadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DialogStringifiedReturnloadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogStringifiedReturnloadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
