import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogEditExistingItemComponent } from './dialog-edit-existing-item/dialog-edit-existing-item.component';
import { BomMappingData } from '../../../@core/data/bommapping';

@Component({
  template: `
    <button nbButton (click)="openEditMappingDialog()" size="tiny"><nb-icon icon="edit" size="tiny" style="padding: 0 0 0 0;"></nb-icon></button>`,
})
export class ButtonEditRenderComponent implements OnInit {

  public renderValue;
  
  @Input() value;

  selectedRowValue;

  constructor(  private router: Router,
                private dialogService: NbDialogService,
                private bomMappingService: BomMappingData,
    ) {  }

  ngOnInit() {
    this.renderValue = this.value;
  }

  openEditMappingDialog(): void {
    let localplant: string;

    console.log(this.value);
    this.bomMappingService.currentPlant.subscribe(plant => {
      localplant = plant;
    });

    this.dialogService.open(DialogEditExistingItemComponent, {
                            context: { selectedRowValue: this.value,
                                      currentplant: localplant,
                                    },
                            closeOnBackdropClick: false,
                            closeOnEsc: false,
    });
  }
}
