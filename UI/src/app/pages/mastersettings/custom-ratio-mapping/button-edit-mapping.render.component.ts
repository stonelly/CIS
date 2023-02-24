import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogEditExistingCustomItemComponent } from './dialog-edit-existing-item/dialog-edit-existing-item.component';
import { BomMappingData } from '../../../@core/data/bommapping';
import { sfwRatioMapping } from '../../../@core/data/sfwRatioMapping';

@Component({
  template: `
    <button nbButton (click)="openEditMappingDialog()" size="tiny"><nb-icon icon="edit" size="tiny" style="padding: 0 0 0 0;"></nb-icon></button>`,
})
export class ButtonEditRatioRenderComponent implements OnInit {

  public renderValue;

  @Input() value;

  selectedRowValue;
  itemList;
  constructor(  private router: Router,
                private dialogService: NbDialogService,
                private service : sfwRatioMapping
    ) {  }

  ngOnInit() {
    this.renderValue = this.value;
    this.service.getCPDItems().subscribe(data => {
      this.itemList = data['data'];
    });
  }

  openEditMappingDialog(): void {

    this.dialogService.open(DialogEditExistingCustomItemComponent, {
                            context: { selectedRowValue: this.value,
                                        itemList: this.itemList
                                    },
                            closeOnBackdropClick: false,
                            closeOnEsc: false,
    });
  }
}
