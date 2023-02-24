import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CpdTrackingData } from '../../../@core/data/cpdtracking';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DialogBatchSheetSummaryComponent } from '../batchlist/dialog-batch-sheet-summary/dialog-batch-sheet-summary.component';
import { DialogSelectAbTankComponent } from './dialog-select-ab-tank/dialog-select-ab-tank.component';
import { BomGridData } from '../../../@core/data/bom-grid';
import { DatePipe } from '@angular/common';

@Component({
  template: `
    <div *ngIf="pigmentTank !== ''" style="float: left;padding: 0px 0px 0px 0px;">{{pigmentTank}}</div>
    <button *ngIf="stageStatus === 'Started'" nbButton (click) = "openCPDBatchSheet()" size="small" style="padding: 0px 0px 0px 0px;">Post</button>
    <button *ngIf="stageStatus !== 'Started' && stageStatus !== 'Pass'" nbButton (click) = "openCPDBatchSheet()" size="small" style="padding: 0px 0px 0px 0px;" disabled>Post</button>
    <div *ngIf="stageStatus === 'Pass'" size="small" style="padding: 0px 0px 0px 0px;" class="text-success" >POSTED</div>
    `,
})
export class ButtonPostToD365RenderComponent implements OnInit {

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
  stageStatus: string;

  constructor(private router: Router,
              private service: CpdTrackingData,
              private dialogService: NbDialogService,
              private bomGridService: BomGridData,
              private toastrService: NbToastrService,
              ) {  }

  ngOnInit() {
    
    if(this.value.row.data['pigment']['stageStatus'] !== undefined){
      this.stageStatus = this.value.row.data['pigment']['stageStatus'];
    }
    this.currentbatchno = this.value.row.data['batchno'];
  }

  openCPDBatchSheet(){
    //console.log(this.currentbatchno);
    if(this.value.row.data['batchno'] === undefined){
      this.showToast('top-right', 'danger', 'Please perform Final Verification on CPD QA first. '); 
    }
    else{
      this.dialogService.open( DialogBatchSheetSummaryComponent, 
        { context: {  cpdBatchOrderNo: this.currentbatchno,
                      showBtnPostD365: true},
                      closeOnBackdropClick: false, 
                      closeOnEsc: false});
    }
     
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status }
    );
  }
}
