import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CpdTrackingData } from '../../../@core/data/cpdtracking';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DialogPigmentAdditionComponent } from './dialog-pigment-addition/dialog-pigment-addition.component';
import { BomGridData } from '../../../@core/data/bom-grid';
import { phAdjustmentComponent } from './ph-adjustment-component/ph-adjustment-component.component';
import { DialogAddLatexTimeComponent } from './dialog-add-latex-time/dialog-add-latex-time.component';
import { DatePipe } from '@angular/common';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Component({
  template: `
  <button *ngIf="toolTipLength > 0 && currentstagename ==='Pigment'" nbButton ghost [nbTooltip]="this.tooltipText" nbTooltipPlacement="top" size="tiny" style="float: right; margin: 0px 0px 0px 0px; padding: 0px 0px 0px 0px;">
    <nb-icon icon="checkmark-circle-2-outline" style="color: green; padding: 0px 0px 0px 0px;"></nb-icon>
  </button> <!--*ngIf="toolTipLength > 0"-->

    <div *ngIf="renderValue === 'Started' && currentstagename ==='Pigment'" style="padding: 0px 0px 0px 0px;"><span style="float: left;">IN PROGRESS</span>
      <button nbButton *ngIf="renderValue === 'Started' && currentstagename !=='Latex' && currentstagename !=='Pigment'" (click)="openModal()" size="tiny" style="float: right; margin: 0px 0px 0px 0px; padding: 0px 0px 0px 0px;">
        <nb-icon icon="plus" style="padding: 0px 0px 0px 0px;"></nb-icon>
      </button>
      <!--<button nbButton *ngIf="renderValue === 'Started' && currentstagename ==='Latex'" (click)="openAddLatexTime()" size="small" style="margin: 0px 0px 0px 0px; padding: 0px 0px 0px 0px;">
        Add Time
      </button>-->
    </div> 
    
    <div *ngIf="renderValue === 'Pass' && currentstagename ==='Pigment'" class="text-success"  style="float: left;padding: 0px 0px 0px 0px;">FINISH</div>
    
    <div *ngIf="renderValue === 'Fail' && currentstagename ==='Pigment'" class="text-danger"  style="float: left;padding: 0px 0px 0px 0px;" >FAIL</div>
    
    <button *ngIf="renderValue === 'NotStarted' && currentstagename ==='Pigment'" nbButton size="small" (click) = "startStage()"  [disabled] = disableButton  style="float: left; padding: 0px 0px 0px 0px;">Start</button>
    
    <!--<button *ngIf="renderValue === 'NotStarted' && (currentstagename !=='Composite' && currentstagename !=='ESD')" nbButton size="small" (click) = "startStage()" [disabled] = disableButton  style="float: left; padding: 0px 0px 0px 0px;">Start</button>
    -->
    <!--<button *ngIf="renderValue === 'NotStarted' && currentstagename ==='Composite'" nbButton size="small" (click) = "startStage()" [disabled] = disableButton  style="float: left; padding: 0px 0px 0px 0px;">Start</button>
    -->
    <!--<button *ngIf="currentstagename ==='ESD'" nbButton size="small" (click) = "startStage()" [disabled] = disableButton  style="float: left; padding: 0px 0px 0px 0px;" disabled>NA</button>
    -->
    <div *ngIf="currentstagename ==='NotESD'" style="float: left;padding: 0px 0px 0px 0px;" >NA</div>
    <div *ngIf="currentstagename !=='NotESD' && currentstagename !=='Pigment'" style="float: left;padding: 0px 0px 0px 0px;" >NA</div>
    
    <button *ngIf="renderValue === 'startdisable' && currentstagename ==='Pigment'" nbButton size="small" disabled>Start</button>
    
    <button *ngIf="renderValue === 'Started' && currentstagename ==='Pigment'" nbButton (click) = "openAddPigment()" size="tiny" style="float: left;">Add Materials</button>
    <!-- -->
    
    
    <!--<button *ngIf="currentstagename ==='ESD' && currentbatchno === 'HNBON00007105'" nbButton ghost [nbTooltip]="this.tooltipText" nbTooltipPlacement="top" size="tiny" style="float: right; margin: 0px 0px 0px 0px; padding: 0px 0px 0px 0px;">
      <nb-icon  icon="question-mark-circle-outline" style="color: grey; padding: 0px 0px 0px 0px;"></nb-icon>
    </button>-->

    <button *ngIf="this.tooltipWarningText !== '' " nbButton ghost [nbTooltip]="this.tooltipWarningText" nbTooltipPlacement="top" size="tiny" style="float: right; margin: 0px 0px 0px 0px; padding: 0px 0px 0px 0px;">
      <nb-icon icon="alert-triangle-outline" style="color: red; padding: 0px 0px 0px 0px;"></nb-icon>
    </button> 
  `,
})
export class ButtonRenderComponent implements OnInit {

  renderValue: any;
  currentstagename: string;
  currentbatchno: string;
  currentline: string;
  disableButton: boolean;
  cpdBatchDetails: any;
  obj;
  tooltipWarningText = '';
  toolTipWarningLength: number;
  tooltipText = '';
  toolTipLength: number;
  mixingTank;
  @Input() value;
  

  constructor(private router: Router,
              private service: CpdTrackingData,
              private dialogService: NbDialogService,
              private bomGridService: BomGridData,
              private toastrService: NbToastrService,
              ) {  }

  ngOnInit() {
    //this.toolTipWarningLength = this.tooltipWarningText.length;
    //this.currentstagename = this.value.value['stageName'];
    if(typeof this.value.value['stageName'] === 'undefined'){
      this.currentstagename = 'NotESD';
    }
    else if(typeof this.value.value['stageName'] !== 'undefined'){
      this.currentstagename = this.value.value['stageName'];
      //console.log(this.value.row.data['batchno'], ': ',this.currentstagename);
    }
    this.currentbatchno = this.value.row.data['batchno'];
    this.mixingTank = this.value.row.data['tankNo'];
    this.renderValue = this.value.value['stageStatus'];
    this.disableButton = !this.value.value['isAllowedToStart'];
    
    if(typeof this.value.value['tooltip'] !== 'undefined'){
      this.toolTipLength = this.value.value['tooltip'].length;
    }
    else if (typeof this.value.value['tooltip'] === 'undefined'){
      this.toolTipLength = 0;
    }
    
    this.cpdBatchDetails = {
      batchNo: this.currentbatchno,
      mixingTankNo: this.mixingTank,
    }

    if (this.toolTipLength === 1){
      let dataValueString;
        let dataKey = this.value.value['tooltip'][0]['dataKey'];
        let dataValue = this.value.value['tooltip'][0]['dataValue'];
        if ( dataValue.length === 0){
          dataValue = 'No Result';
        }
        if (this.currentstagename === 'Latex'){
          dataValueString = new DatePipe('en-MY').transform(dataValue, 'dd/MM/yyyy HH:mm:ss');
        }
        else{
          dataValueString = dataValue;
        }
        this.tooltipText = this.tooltipText 
                          + dataKey + ': ' 
                          + dataValueString;
    }
    else{
      let itemIndex = 0;
      while(itemIndex < this.toolTipLength){
        let dataValueString;
        let dataKey = this.value.value['tooltip'][itemIndex]['dataKey'];
        let dataValue = this.value.value['tooltip'][itemIndex]['dataValue'];
        let commaSymbol = '';
        if ( dataValue.length === 0){
          dataValue = 'No Result';
        }
        if(this.tooltipText.length !== 0){
          commaSymbol = '';
        }
        else{
          commaSymbol = ', ';
        }
        if (this.currentstagename === 'Latex'){
          dataValueString = new DatePipe('en-MY').transform(dataValue, 'dd/MM/yyyy HH:mm:ss');
        }
        else{
          dataValueString = dataValue;
        }
        this.tooltipText = this.tooltipText 
                          + dataKey + ': ' 
                          + dataValueString + commaSymbol;
        itemIndex++;
      }
    }
    
  }

  startStage(){    
    console.log(this.currentbatchno, ' ', this.currentstagename);
    
    this.service.startStage(this.currentbatchno, this.currentstagename).pipe(
      catchError(err => this.handleStartStageError(err, this.currentbatchno, this.currentstagename))
    ).subscribe(response => {
      if (response['responseCode'] === '200' && response['data']['result'] === 'Success') {
            //window.location.reload();
            
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['pages/home/cpdbatchordertracking'], { skipLocationChange: false }).then(() => {
                this.showToast('top-right', 'success', 'successful', true);
              });
            });
          }
      else if (response['responseCode'] === '400'){
        //this.tooltipWarningText = 'Unable to start stage';
        //this.tooltipWarningText = 'Unable to start stage';
        //this.toolTipWarningLength = this.tooltipWarningText.length;
        
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/home/cpdbatchordertracking'], { skipLocationChange: false }).then(() => {
            let displayMessage = this.currentbatchno + ': Unable to start \"' + this.currentstagename + '\" stage. Please contact supervisor for further action.';
            this.showToast('top-right', 'danger', displayMessage, true);
            //console.log(this.tooltipWarningText, ': ', this.toolTipWarningLength);
          });
        });
      }
      }
    );
  }

  openAddLatexTime(){
    this.dialogService.open( DialogAddLatexTimeComponent, 
      { /*context: {  selectedCPDBatch: this.cpdBatchDetails, 
                    currentStage: this.currentstagename,
                  },*/
                    closeOnBackdropClick: false, 
                    closeOnEsc: false});
  }

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

  showToolTip(){
    return 'text';
  }

  openModal(){
    this.dialogService.open( phAdjustmentComponent, 
      { context: {  selectedCPDBatch: this.cpdBatchDetails, 
                    currentStage: this.currentstagename,
      },
        closeOnBackdropClick: false, 
        closeOnEsc: false});
  }

  showToast(position, status, errMessage, destroyByClick) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status, destroyByClick }
    );
  }
  
  handleStartStageError(error, cpdBatchOrderNo, currentStage) {
    let errorMessage = '';
    let displayMessage = cpdBatchOrderNo + ': Unable to start \"' + currentStage + '\" stage. Please contact MIS for further action.';
    this.showToast('top-right', 'danger', displayMessage, true);
    this.tooltipWarningText = 'Unable to start stage';
    console.log(this.tooltipWarningText);
    /*if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    }
    else {
      // Get server-side error
      errorMessage = `Error ${error.status}\n: ${error.message}`; //error.error.title
    }
    this.showToast('top-right', 'danger', errorMessage, true);*/
    return throwError(errorMessage);
  }
}
