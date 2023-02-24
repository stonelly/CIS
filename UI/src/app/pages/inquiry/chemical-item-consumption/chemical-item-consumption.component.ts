/*import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ngx-chemical-item-consumption',
  templateUrl: './chemical-item-consumption.component.html',
  styleUrls: ['./chemical-item-consumption.component.scss']
})
export class ChemicalItemConsumptionComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}*/

import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from './../../forms/forms.module';
import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CPDBatchSheetData } from '../../../@core/data/cpd-batch-sheet-summary';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { SessionStorageService } from 'angular-web-storage';
import { Session } from 'selenium-webdriver';
import { DatePipe } from '@angular/common';
import printJS from 'print-js';
import { timestamp } from 'rxjs/operators';
import  * as xlsx from 'xlsx';

@Component({
  selector: 'ngx-chemical-item-consumption',
  templateUrl: './chemical-item-consumption.component.html',
  styleUrls: ['./chemical-item-consumption.component.scss']
})
export class ChemicalItemConsumptionComponent implements OnInit {
  @ViewChild('epltable', { static: false }) epltable: ElementRef;
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
  reportHeader;
  dataLatex;
  dataStabilization;
  dataComposite;
  dataESD;
  dataWax;
  dataPigment;
  generatedOn;
  generatedBy;
  currentBatchNo;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  mainForm = new FormGroup({
    cpdBatchOrder: new FormControl(''),
  });

  ngOnInit() {
    this.hideResult = true;
    this.hideNotFound = true;
    this.service.initBatchSheetByBatchOrder().subscribe(cpdBatchSheetResult => {
      this.dataSource = new MatTableDataSource(cpdBatchSheetResult.result);
      this.reportHeader = cpdBatchSheetResult.header;
    }
    );
    this.dataSource.sort = this.sort;
  }

  constructor(private service: CPDBatchSheetData,
              private fb: FormBuilder,
              private sessionStorageService: SessionStorageService) {

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

  exportExcel(){
    let fileName = this.currentBatchNo + '.xlsx';
    const ws: xlsx.WorkSheet = xlsx.utils.table_to_sheet(this.epltable.nativeElement);
    const wb: xlsx.WorkBook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(wb, ws, 'Sheet1');
    xlsx.writeFile(wb, fileName);
  }

  onSubmit(){
    let groupedData;
    //this.generatedOn = new Date().toLocaleString("dd/MM/yyyy");
    this.generatedOn = this.format(new Date(), 'dd/MM/yyyy hh:mm:ss');
    this.generatedBy = this.sessionStorageService.get('S_Name');
    //console.log(this.mainForm.value['cpdBatchOrder']);
    this.currentBatchNo = this.mainForm.value['cpdBatchOrder'].trim();
    this.service.getBatchSheetByBatchOrder(this.mainForm.value['cpdBatchOrder'].trim()).subscribe(cpdBatchSheetResult => {
      //console.log(cpdBatchSheetResult['data']);
      if(cpdBatchSheetResult['data'].cpdBatchOrderNo !== null){
        this.hideResult = false;
        this.hideNotFound = true;
        this.convertDateTimeObj(cpdBatchSheetResult);
        this.dataSource = new MatTableDataSource(cpdBatchSheetResult['data'].lines);
        this.reportHeader = cpdBatchSheetResult['data'];

        groupedData = this.groupStagebyCategory(cpdBatchSheetResult['data']['lines'], 'stageName');
        
        this.dataLatex          = groupedData['Latex'];
        this.dataStabilization  = groupedData['Stabilization'];
        this.dataComposite      = groupedData['Composite'];
        this.dataWax            = groupedData['Wax'];
        this.dataPigment        = groupedData['Pigment'];

        if(typeof groupedData['ESD'] === 'undefined'){
          this.dataESD = [];
          this.hideESD = true;
        }
        else{
          this.dataESD = groupedData['ESD'];
          this.hideESD = false;
        }
        //console.log(this.dataLatex);
      }
      else{
        this.hideResult = true;
        this.hideNotFound = false;
      }
      
    });
    
    this.dataSource.sort = this.sort;
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
    datetimeObj = new Date(cpdBatchSheetResult['data'].flowInTime);
    convertedDate = new DatePipe('en-MY').transform(datetimeObj, 'dd/MM/yyyy HH:mm:ss');
    cpdBatchSheetResult['data'].flowInTime = convertedDate;
    cpdBatchSheetResult['data'].actualWeight = this.formatDecimalandThousand(cpdBatchSheetResult['data'].actualWeight.toFixed(4)); 
    cpdBatchSheetResult['data'].targetWeight = this.formatDecimalandThousand(cpdBatchSheetResult['data'].targetWeight.toFixed(4)); 

    return cpdBatchSheetResult;
  };

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
