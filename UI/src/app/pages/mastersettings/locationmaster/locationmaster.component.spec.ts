import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LocationMasterComponent } from './locationmaster.component';

describe('LocationMasterComponent', () => {
  let component: LocationMasterComponent;
  let fixture: ComponentFixture<LocationMasterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LocationMasterComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LocationMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
