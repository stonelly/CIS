import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { StringifyOptions } from 'querystring';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { EditBOMDetailsFormArray, CpdTrackingData } from '../../../../@core/data/cpdtracking';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import { MatTableDataSource } from '@angular/material/table';
import { SessionStorageService } from 'angular-web-storage';
import { MatSort } from '@angular/material/sort';
import { CPDBatchSheetData } from '../../../../@core/data/cpd-batch-sheet-summary';

@Component({
  selector: 'ngx-dialog-batch-sheet-summary',
  templateUrl: './dialog-batch-sheet-summary.component.html',
  styleUrls: ['./dialog-batch-sheet-summary.component.scss']
})
export class DialogBatchSheetSummaryComponent implements OnInit {
  @Input() cpdBatchOrderNo: string;
  @Input() showBtnPostD365: boolean;
  mainForm: FormGroup;
  dialogTitle: string;
  cpdBatchOrderObj;
  postToD365CPDBatchOrderObj;
  hideBtnPostToD365: boolean;
  cpdBatchNo: string;
  ABTankObj:any;
  data: any;
  displayedColumns: string[] = ['No',
                                //'Stage',
                                'ItemID',
                                'BatchNo',
                                'ActualWeight',
                                'TargetWeight',
                                'VarianceWeight',
                                'VariancePct'];
  dataSource = new MatTableDataSource();
  hideResult: boolean;
  hideNotFound: boolean;
  hideESD: boolean;
  hidePostToD365Section: boolean = true;
  reportHeader;
  dataLatex;
  dataStabilization;
  dataComposite;
  dataESD;
  dataWax;
  dataPigment;
  generatedOn;
  generatedBy;
  groupedData;
  actualWeight;
  previousActualWeight;
  isEditDisabled: boolean;
  @ViewChild(MatSort, { static: true }) sort: MatSort;
  
  constructor(protected ref: NbDialogRef<DialogBatchSheetSummaryComponent>,
              private service: CPDBatchSheetData,
              private router: Router, 
              private sessionStorageService: SessionStorageService,
              private toastrService: NbToastrService,
              private fb: FormBuilder,
              ) { 
    this.isEditDisabled = true;

    this.service.initBatchSheetByBatchOrder().subscribe(cpdBatchSheetResult => {
      this.dataSource = new MatTableDataSource(cpdBatchSheetResult.result);
      this.reportHeader = cpdBatchSheetResult.header;
      this.actualWeight = 0.000.toFixed(4);
      this.previousActualWeight = this.actualWeight;
      
    });

  }

  ngOnInit() {
    this.hideBtnPostToD365 = !this.showBtnPostD365;
    this.generatedOn = this.format(new Date(), 'dd/MM/yyyy hh:mm:ss');
    this.generatedBy = this.sessionStorageService.get('S_UserId');

    if(this.showBtnPostD365 === true){
      this.dialogTitle = "D365 Posting Summary";
      this.service.getBatchSheetWithActualWeightByBatchOrder(this.cpdBatchOrderNo).subscribe(cpdBatchSheetResult => {
        console.log(cpdBatchSheetResult['data']);
        if(cpdBatchSheetResult['data'] !== null 
            ){
          this.hideResult = false;
          this.hideNotFound = true;
          this.hidePostToD365Section = false;
          this.convertDateTimeObj(cpdBatchSheetResult);
          this.postToD365CPDBatchOrderObj = cpdBatchSheetResult;
          this.dataSource = new MatTableDataSource(cpdBatchSheetResult['data'].lines);
          this.reportHeader = cpdBatchSheetResult['data'];
          this.groupedData = this.groupStagebyCategory(cpdBatchSheetResult['data']['lines'], 'stageName');
  
          this.dataLatex          = this.groupedData['Latex'];
          this.dataStabilization  = this.groupedData['Stabilization'];
          this.dataComposite      = this.groupedData['Composite'];
          this.dataWax            = this.groupedData['Wax'];
          this.dataPigment        = this.groupedData['Pigment'];
          this.actualWeight       = parseFloat(this.reportHeader['actualWeight'].replace(/,/g, ''));

          if(typeof this.groupedData['ESD'] === 'undefined'){
            this.dataESD = [];
            this.hideESD = true;
          }
          else{
            this.dataESD = this.groupedData['ESD'];
            this.hideESD = false;
          }
        }
        else{
          this.hideResult = true;
          this.hideNotFound = false;
          this.hidePostToD365Section = true;
        }
      });
    }

    else{
      this.hidePostToD365Section = false;
      this.dialogTitle = "CPD Batch Sheet Summary";
      this.service.getBatchSheetByBatchOrder(this.cpdBatchOrderNo).subscribe(cpdBatchSheetResult => {
        if(cpdBatchSheetResult['data'].cpdBatchOrderNo !== null){
          this.hideResult = false;
          this.hideNotFound = true;
          this.convertDateTimeObj(cpdBatchSheetResult);
          this.postToD365CPDBatchOrderObj = cpdBatchSheetResult;
          this.dataSource = new MatTableDataSource(cpdBatchSheetResult['data'].lines);
          this.reportHeader = cpdBatchSheetResult['data'];
          this.groupedData = this.groupStagebyCategory(cpdBatchSheetResult['data']['lines'], 'stageName');
  
          this.dataLatex          = this.groupedData['Latex'];
          this.dataStabilization  = this.groupedData['Stabilization'];
          this.dataComposite      = this.groupedData['Composite'];
          this.dataWax            = this.groupedData['Wax'];
          this.dataPigment        = this.groupedData['Pigment'];
  
          if(typeof this.groupedData['ESD'] === 'undefined'){
            this.dataESD = [];
            this.hideESD = true;
          }
          else{
            this.dataESD = this.groupedData['ESD'];
            this.hideESD = false;
          }
        }
        else{
          this.hideResult = true;
          this.hideNotFound = false;
        }
        
      });
    }
    
    this.dataSource.sort = this.sort;
  }

  print(){
    window.print();
    /*printJS({
      printable: 'div_table',
      type: 'html',
      //targetStyles: ['*']
      targetStyles: ['margin','font-size','text-align','font-weight','border'],
    });*/
  }
  
  editActualWeight(){
    this.previousActualWeight = this.actualWeight;
    this.isEditDisabled = !this.isEditDisabled;
  }

  confirmEditActualWeight(){
    this.isEditDisabled = !this.isEditDisabled;
    this.actualWeight = this.actualWeight.toFixed(4);
    this.previousActualWeight = this.actualWeight;
  }

  cancelEditActualWeight(){
    this.isEditDisabled = !this.isEditDisabled;

    this.actualWeight = this.previousActualWeight;//this.reportHeader['actualWeight'].toFixed(4);
  }

  postToD365(){
    let modified = false;
    if(this.actualWeight !== this.reportHeader['actualWeight']){
      modified = true;
    }
    let D365CPDObj = {
      CPDBatchOrderNo: this.cpdBatchOrderNo,
      ActualWeight: this.actualWeight,
      IsModified: modified,
    }

    //console.log(D365CPDObj);
    this.service.postBatchSheetDetailsToD365(D365CPDObj).subscribe(cpdBatchSheetResult => {
      if(cpdBatchSheetResult['responseCode'] === "200"){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/home/cpdbatchordertracking'], { skipLocationChange: false }).then(() => {
            this.showToast('top-right', 'success', 'Posted to WebAdmin successfully.');
          });
        });
      }
      else{
        this.showToast('top-right', 'danger', 'Failed to post to WebAdmin');
      }
    });
  }
  
  cancel() {
    this.ref.close();
  }

  convertDateTimeObj(cpdBatchSheetResult) {
    //convert compounding date
    let datetimeObj = new Date(cpdBatchSheetResult['data'].compoundingDate);
    let convertedDate = new DatePipe('en-MY').transform(datetimeObj, 'dd/MM/yyyy HH:mm:ss');
    cpdBatchSheetResult['data'].compoundingDate = convertedDate;
    //convert created date
    datetimeObj = new Date(cpdBatchSheetResult['data'].createdDate);
    convertedDate = new DatePipe('en-MY').transform(datetimeObj, 'dd/MM/yyyy HH:mm:ss');
    cpdBatchSheetResult['data'].createdDate = convertedDate;
    //convert flow in time
    if(cpdBatchSheetResult['data'].flowInTime !== undefined){
      datetimeObj = new Date(cpdBatchSheetResult['data'].flowInTime);
      convertedDate = new DatePipe('en-MY').transform(datetimeObj, 'dd/MM/yyyy HH:mm:ss');
      cpdBatchSheetResult['data'].flowInTime = convertedDate;
    }

    cpdBatchSheetResult['data'].actualWeight = this.formatDecimalandThousand(cpdBatchSheetResult['data'].actualWeight.toFixed(4)); 
    cpdBatchSheetResult['data'].targetWeight = this.formatDecimalandThousand(cpdBatchSheetResult['data'].targetWeight.toFixed(4)); 

    return cpdBatchSheetResult;
  };

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }

  groupStagebyCategory(arrayData, key){
    return arrayData.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  formatDecimalandThousand(nStr){
    nStr += '';
    let x = nStr.split('.');
    let x1 = x[0];
    let x2 = x.length > 1 ? '.' + x[1] : '';
    var rgx = /(\d+)(\d{3})/;
    while (rgx.test(x1)) {
            x1 = x1.replace(rgx, '$1' + ',' + '$2');
    }
    return x1 + x2;
  }
  
  format(x, y) {
    var z = {
        M: x.getMonth() + 1,
        d: x.getDate(),
        h: x.getHours(),
        m: x.getMinutes(),
        s: x.getSeconds()
    };
    y = y.replace(/(M+|d+|h+|m+|s+)/g, function(v) {
        return ((v.length > 1 ? "0" : "") + eval('z.' + v.slice(-1))).slice(-2)
    });

    return y.replace(/(y+)/g, function(v) {
        return x.getFullYear().toString().slice(-v.length)
    });
  }
}
