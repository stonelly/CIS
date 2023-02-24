import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogEditUserRoleComponent } from './dialog-edit-user-role/dialog-edit-user-role.component';
import { BatchListData } from '../../../@core/data/batchlist';
import { BomMappingData } from '../../../@core/data/bommapping';
import { PlantTankMappingData } from '../../../@core/data/planttankmapping';

@Component({
  template: `
    <button nbButton (click)="openEditModal()" size="tiny" style="padding: 0.25em 0.25em 0.25em 0.25em;">
        <nb-icon icon="edit" size="tiny" style="padding: 0 0 0 0;"></nb-icon>
    </button>`,
})
export class ButtonEditRoleRenderComponent implements OnInit {
  public renderValue;
  public BOMItems;
  public PlantnMixingTank;

  @Input() value;

  constructor(private router: Router,
              private dialogService: NbDialogService,
              private batchListService: BatchListData,
              private bomMappingService: BomMappingData,
              private plantTankMappingService: PlantTankMappingData,
              ) {  }

  ngOnInit() {
  }

  openEditModal(){
    this.dialogService.open( DialogEditUserRoleComponent, 
      { context: {  selectedValue: this.value, 
      },
        closeOnBackdropClick: false, 
        closeOnEsc: false});
  }
}
