import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { DialogSelectPlantComponent } from './dialog-select-plant/dialog-select-plant.component';

@Component({
  template: `
    <div style="padding: 0px 0px 0px 0px; text-align:center">
      <span style="float: center;">
      <nb-icon icon="info-outline" [nbTooltip]="this.plant"  style="color: green; padding: 0px 0px 0px 0px; float: left;"></nb-icon>
      <button nbButton (click) = "selectPlant()" size="small" style="padding: 0px 0px 0px 0px;">
        <nb-icon icon="edit" size="tiny" style="padding: 0 0 0 0; float: right;"></nb-icon>
      </button></span>
      <!--<span>{{plant}}</span>-->
    </div>
  `,
})
export class ButtonPlantMappingRenderComponent implements OnInit {

  renderValue: any;
  currentstagename: string;
  currentbatchno: string;
  currentline: string;
  disableButton: boolean;
  cpdBatchDetails: any;
  obj;
  isAllowToStart: boolean; 
  flowInTime;
  plant;
  @Input() value;
  

  constructor(private router: Router,
              private dialogService: NbDialogService,
              ) {  }

  ngOnInit() {
    //console.log(this.value.roleName);//.plant);
    this.plant = this.value.plant;
  }

  selectPlant(){

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
    this.dialogService.open( DialogSelectPlantComponent, 
      { context: {  selectedValue: this.value, 
      },
        closeOnBackdropClick: false, 
        closeOnEsc: false});
  }
}
