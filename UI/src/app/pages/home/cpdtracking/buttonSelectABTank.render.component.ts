import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CpdTrackingData } from '../../../@core/data/cpdtracking';
import { NbDialogService } from '@nebular/theme';
import { DialogPigmentAdditionComponent } from './dialog-pigment-addition/dialog-pigment-addition.component';
import { DialogSelectAbTankComponent } from './dialog-select-ab-tank/dialog-select-ab-tank.component';
import { BomGridData } from '../../../@core/data/bom-grid';
import { DatePipe } from '@angular/common';

@Component({
  template: `
    <div *ngIf="pigmentTank !== ''" style="float: left;padding: 0px 0px 0px 0px;">{{pigmentTank}}</div>
    <button *ngIf="cpdPigmentTankAllowedToAdd === true" nbButton (click) = "openSelectABTankDialog()" size="small" style="padding: 0px 0px 0px 0px;">SELECT</button>
    <button *ngIf="cpdPigmentTankAllowedToAdd === false && pigmentTank === null" nbButton (click) = "openSelectABTankDialog()" size="small" style="padding: 0px 0px 0px 0px;" disabled>SELECT</button>
    `,
})
export class ButtonSelectABTankRenderComponent implements OnInit {

  renderValue: any;
  currentstagename: string;
  currentbatchno: string;
  currentline: string;
  disableButton: boolean;
  cpdBatchDetails: any;
  obj;
  isAllowToStart: boolean; 
  flowInTime;
  @Input() value;
  tankNo: string;
  pigmentTank;
  cpdPigmentTankAllowedToAdd;
  

  constructor(private router: Router,
              private service: CpdTrackingData,
              private dialogService: NbDialogService,
              private bomGridService: BomGridData,
              ) {  }

  ngOnInit() {
    this.currentbatchno = this.value.row.data['batchno'];
    this.cpdPigmentTankAllowedToAdd = this.value.row.data['cpdPigmentTankAllowedToAdd'];
    this.pigmentTank = this.value.row.data['pigmentTank'];
    this.isAllowToStart = true;
    this.tankNo = this.value.row.data['tankNo'];
    //this.tankNo = 'A';
  }
  openSelectABTankDialog(){
    //console.log(this.value);
    //console.log(this.cpdPigmentTankAllowedToAdd);
    this.dialogService.open(  DialogSelectAbTankComponent, 
          { context: { cpdBatchOrderNo: this.currentbatchno,
                        mixingTankNo: this.tankNo,
          },
            closeOnBackdropClick: false, 
            closeOnEsc: true});
  }
}
