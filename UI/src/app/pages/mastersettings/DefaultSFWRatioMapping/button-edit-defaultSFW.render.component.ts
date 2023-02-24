import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import {DialogEditDefaultSFWRatioComponent} from './dialog-edit-defaultSFWRatio/dialog-edit-defaultSFWRatio.component';


@Component({
  template: `
    <button nbButton (click)="openEditMappingDialog()" size="tiny"><nb-icon icon="edit" size="tiny" style="padding: 0 0 0 0;"></nb-icon></button>`,
})
export class ButtonEditSFWRenderComponent implements OnInit {

  public renderValue;

  @Input() value;

  selectedRowValue;

  constructor(  private router: Router,
                private dialogService: NbDialogService,
                //private bomMappingService: BomMappingData,
                //private DialogComponent: DialogEditDefaultSFWRatioComponent,
    ) {  }

  ngOnInit() {
    this.renderValue = this.value;
  }

  openEditMappingDialog(): void {

    this.dialogService.open(DialogEditDefaultSFWRatioComponent, {
                            context: { selectedRow: this.value},
                            closeOnBackdropClick: false,
                            closeOnEsc: false,
    });
  }
}
