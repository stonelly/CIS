import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { throwIfAlreadyLoaded } from '../../../@core/module-import-guard';
//import { CreateUserDialogComponent } from './create-user-dialog.component';

@Component({
  template: `
    <button nbButton (click)="selectUser()" size="small"><!--<nb-icon icon="list"></nb-icon>-->Select</button>`,
})
export class ButtonSelectRenderComponent implements OnInit {

  public renderValue;

  @Input() value;
  @Output() hideADTable: EventEmitter<any> = new EventEmitter();

  constructor(  private router: Router,
                //private DialogComponent: CreateUserDialogComponent,
    ) {  }

  ngOnInit() {
    this.renderValue = this.value;
  }

  selectUser(): void {
    this.hideADTable.emit({ Name: this.value['Name'], 
                            UserId: this.value['UserId'],
                            Email: this.value['Email'],
                            hideADTable: true,
    });
  }

  getHideADTableValue(){
      return this.hideADTable;
  }
}
