import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogDeleteCustomRatioComponent } from './dialog-delete-custom-ratio/dialog-delete-custom-ratio.component';

@Component({
  template: `
    <button nbButton (click)="deleteMapping()" size="small"><!--<nb-icon icon="list"></nb-icon>-->Delete</button>`,
    /*<div *ngIf="renderValue === 'started'">STARTED</div>
    <div *ngIf="renderValue === 'pass'" class="text-success">PASS</div>
    <div *ngIf="renderValue === 'fail'" class="text-danger">FAIL</div>
    <button *ngIf="renderValue === 'start'" nbButton (click)="navigateToBomGrid()" size="small">Start</button>
    <button nbButton (click)="deleteMapping()" size="small"><!--<nb-icon icon="list"></nb-icon>-->Delete</button>
    <button *ngIf="renderValue === 'startdisable'" nbButton (click)="navigateToBomGrid()" size="small" disabled>Start</button>*/
    
    
})
export class ButtonDeleteRatioRenderComponent implements OnInit {

  public renderValue;
  
  @Input() value;

  selectedRowValue;

  constructor(  private router: Router,
                private dialogService: NbDialogService,
                //private DialogComponent: CreateUserDialogComponent,
    ) {  }

  ngOnInit() {
    this.renderValue = this.value;
  }

  deleteMapping(): void {
    this.dialogService.open(DialogDeleteCustomRatioComponent, {
      context: { selectedRowValue: this.value }
    });
  }
}
