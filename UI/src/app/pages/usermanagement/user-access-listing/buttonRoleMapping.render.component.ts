import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DatePipe } from '@angular/common';
import { DialogSelectRoleComponent } from './dialog-select-role/dialog-select-role.component';

@Component({
  template: `
  <!--<button nbButton (click) = "selectPlant()" size="small" style="padding: 0px 0px 0px 0px;">Select Plant</button>-->

  <div style="padding: 0px 0px 0px 0px;">
    <!--<span style="float: left;">Role</span>-->
    <span style="float: left;">{{roleName}}</span>
    <button nbButton (click) = "selectRole()" size="small" style="padding: 0px 0px 0px 0px; float: right;">
      <nb-icon icon="edit" size="tiny" style="padding: 0 0 0 0;"></nb-icon>
    </button>
  </div>
    `,
})
export class ButtonRoleMappingRenderComponent implements OnInit {

  renderValue: any;
  currentstagename: string;
  currentbatchno: string;
  currentline: string;
  disableButton: boolean;
  cpdBatchDetails: any;
  obj;
  isAllowToStart: boolean; 
  flowInTime;
  roleName;
  @Input() value;
  

  constructor(private router: Router,
              private dialogService: NbDialogService,
              ) {  }

  ngOnInit() {
    //console.log(this.value);
    
    this.roleName = this.value.roleName;
  }

  selectRole(){

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
    this.dialogService.open( DialogSelectRoleComponent, 
      { context: {  selectedValue: this.value, 
      },
        closeOnBackdropClick: false, 
        closeOnEsc: false});
  }
}
