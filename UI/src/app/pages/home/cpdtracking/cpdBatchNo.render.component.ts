import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CpdTrackingData } from '../../../@core/data/cpdtracking';
import { NbDialogService } from '@nebular/theme';
import { BomGridData } from '../../../@core/data/bom-grid';
import { DialogBatchSheetSummaryComponent } from './../batchlist/dialog-batch-sheet-summary/dialog-batch-sheet-summary.component';

@Component({
  template: `
    <span (click)="openModal()">{{cpdBatchNo}}</span>
    <!--<div *ngIf="renderValue === 'Pass'" class="text-success"  style="float: left;padding: 0px 0px 0px 0px;">{{cpdBatchNo}}</div>-->
  `,
})
export class CPDBatchNoRenderComponent implements OnInit {
  //currentstagename;
  cpdBatchNo;
  @Input() value;
  

  constructor(private router: Router,
              private service: CpdTrackingData,
              private dialogService: NbDialogService,
              private bomGridService: BomGridData,
              ) {  }

  ngOnInit() {
    //this.currentstagename = this.value.value['stageName'];
    this.cpdBatchNo = this.value.value;


  }

  openModal(){
    this.dialogService.open( DialogBatchSheetSummaryComponent, 
      { context: {  cpdBatchOrderNo: this.cpdBatchNo,
                    showBtnPostD365: false},
        closeOnBackdropClick: false, 
        closeOnEsc: false});
  }
  
}
