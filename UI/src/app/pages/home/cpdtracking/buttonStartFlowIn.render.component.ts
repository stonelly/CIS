import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CpdTrackingData } from '../../../@core/data/cpdtracking';
import { NbDialogService } from '@nebular/theme';
import { DialogPigmentAdditionComponent } from './dialog-pigment-addition/dialog-pigment-addition.component';
import { DialogAddFlowinTimeComponent } from './dialog-add-flowin-time/dialog-add-flowin-time.component';
import { BomGridData } from '../../../@core/data/bom-grid';
import { DatePipe } from '@angular/common';

@Component({
  template: `
    <div    *ngIf="flowInTime !== null">{{flowInTime}}</div>
    <button *ngIf="isAllowToStart === true && flowInTime === null" nbButton (click) = "startFlowIn()" size="small" style="padding: 0px 0px 0px 0px;">Add FlowIn</button>
    <button *ngIf="isAllowToStart === false && flowInTime === null" nbButton size="small" style="padding: 0px 0px 0px 0px;" disabled>Add FlowIn</button>
  `,
})
export class ButtonStartFlowInRenderComponent implements OnInit {

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
  

  constructor(private router: Router,
              private service: CpdTrackingData,
              private dialogService: NbDialogService,
              private bomGridService: BomGridData,
              ) {  }

  ngOnInit() {
    this.currentstagename = this.value.value['stageName'];
    this.currentbatchno = this.value.row.data['batchno'];
    this.renderValue = this.value.value['stageStatus'];
    //this.disableButton = !this.value.value['cpdFlowTimeAllowedToStart'];
    this.isAllowToStart = this.value.row.data['cpdFlowTimeAllowedToStart'];
    this.flowInTime = new DatePipe('en-MY').transform(this.value.row.data['cpdFlowTime'], 'dd/MM/yyyy HH:mm:ss');//new DatePipe('en-MY').transform('2019-11-11 10:10', 'dd/MM/yyyy HH:mm:ss');
    //console.log(this.currentbatchno);
  }

  startFlowIn(){
    /*let CPDObject = {
      CPDBatchOrderNo: this.currentbatchno,
      FlowInTime: new Date(),
    }
    console.log(CPDObject);
    this.service.startFlowInTime(CPDObject).subscribe(response => {
      if (response['responseCode'] === '200' && response['data']['result'] === 'Success') {
            //window.location.reload();
          }
      });*/
    this.dialogService.open( DialogAddFlowinTimeComponent, 
      { context: {  selectedCPDBatch: this.currentbatchno, 
      },
        closeOnBackdropClick: false, 
        closeOnEsc: false});
  }
  /*startStage(){
    this.service.startStage(this.currentbatchno, this.currentstagename).subscribe(response => {
      if (response['responseCode'] === '200' && response['data']['result'] === 'Success') {
            //window.location.reload();
          }
      });
  }*/

  openAddPigment(){
    let pigmentDataObj;
    this.bomGridService.getItems(this.currentbatchno).subscribe(data => {
      if (data['responseCode'] === '200') {
        let itemIndex = 0;
        pigmentDataObj = data['data'];
        this.dialogService.open(  DialogPigmentAdditionComponent, 
          { context: { cpdBatchOrderDetails: pigmentDataObj,
                        cpdBatchOrderNo: this.currentbatchno,
          },
            closeOnBackdropClick: false, 
            closeOnEsc: true});
      }
      else{
        window.alert('server error');
      }
    });

    
  }
}
