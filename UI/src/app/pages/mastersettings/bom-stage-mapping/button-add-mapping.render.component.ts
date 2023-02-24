import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogAddBomStageMappingComponent } from './dialog-add-bom-stage-mapping/dialog-add-bom-stage-mapping.component';
import { BomMappingData } from '../../../@core/data/bommapping';

@Component({
  template: `
    <button nbButton (click)="openAddMappingDialog()" size="small"><!--<nb-icon icon="list"></nb-icon>-->Map BOM</button>`,
})
export class ButtonAddRenderComponent implements OnInit {

  public renderValue;
  
  @Input() value;

  selectedRowValue;

  constructor(  private router: Router,
                private dialogService: NbDialogService,
                private bomMappingService: BomMappingData,
                //private DialogComponent: CreateUserDialogComponent,
    ) {  }

  ngOnInit() {
    this.renderValue = this.value;
  }

  openAddMappingDialog(): void {
    let localplant: string;

    this.bomMappingService.currentPlant.subscribe(plant => {
      localplant = plant;
    });

    this.dialogService.open(DialogAddBomStageMappingComponent, {
                            context: { selectedRowValue: this.value,
                                      currentplant: localplant,
                                    },
                            closeOnBackdropClick: false,
                            closeOnEsc: false,
    });
  }
}
