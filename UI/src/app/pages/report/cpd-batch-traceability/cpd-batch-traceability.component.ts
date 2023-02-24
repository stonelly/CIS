import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from './../../forms/forms.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { CPDTraceabilityListData, } from '../../../@core/data/cpd-traceability';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import printJS from 'print-js';

@Component({
  selector: 'cpd-batch-traceability-report',
  styleUrls: ['./cpd-batch-traceability.component.scss'],
  templateUrl: './cpd-batch-traceability.component.html',
})
export class CPDBatchTraceabilityComponent implements OnInit {

  data: any;
  displayedColumns: string[] = ['No',
    'DateTime',
    'Action',
    'Status',
    'PerformedBy'];
  dataSource = new MatTableDataSource();
  reportHeader;
  generatedDateTime;
  hideResult: boolean;
  hideNotFound: boolean;

  @ViewChild(MatSort, { static: true }) sort: MatSort;

  mainForm = new FormGroup({
    cpdBatchOrder: new FormControl(''),
  });

  ngOnInit() {
    this.hideResult = true;
    this.hideNotFound = true;
    this.service.inittraceabilityByBatchOrder().subscribe(cpdtraceabiltyResult => {
      this.dataSource = new MatTableDataSource(cpdtraceabiltyResult.result);
      this.reportHeader = cpdtraceabiltyResult.header;
    }
    );
    this.dataSource.sort = this.sort;
  }
  constructor(private service: CPDTraceabilityListData,private fb: FormBuilder) {

  }

  print(){
    window.print();
    /*printJS({
      printable: 'div_table',
      type: 'html',
      targetStyles: ['border', 'color'],
      //gridStyle: 'border: 2px solid #3971A5;',
      //targetStyles: ['*'],
      //targetStyles: ['margin','font-size','text-align','font-weight','border'],
    });*/
  }

  onSubmit(){
    //console.log(this.mainForm.value['cpdBatchOrder']);
    this.service.gettraceabilityByBatchOrder(this.mainForm.value['cpdBatchOrder'].trim()).subscribe(cpdtraceabiltyResult => {
      if(cpdtraceabiltyResult['data']!== null){
        this.hideResult = false;
        this.hideNotFound = true;
        this.convertDateTimeObj(cpdtraceabiltyResult);
        this.dataSource = new MatTableDataSource(cpdtraceabiltyResult['data'].lines);
        this.reportHeader = cpdtraceabiltyResult['data'];
      }
      else{
        this.hideResult = true;
        this.hideNotFound = false;
      }
    }
    );
    this.generatedDateTime = new Date().toLocaleString("en-MY");
    this.dataSource.sort = this.sort;
  }

  convertDateTimeObj(cpdtraceabiltyResult) {
    let datetimeObj = new Date(cpdtraceabiltyResult['data'].cpdStageDateTime);
    let convertedDate = datetimeObj.toLocaleString("en-MY");
    cpdtraceabiltyResult['data'].cpdStageDateTime = convertedDate;

    cpdtraceabiltyResult['data'].cpdBatchQuantity = this.formatDecimalandThousand(cpdtraceabiltyResult['data'].cpdBatchQuantity.toFixed(4)); //cpdtraceabiltyResult['data'].cpdBatchQuantity.toFixed(4).replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');//.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
    
    for (let i = 0; i < cpdtraceabiltyResult['data'].lines.length; i++) {
      let datetimeObj = new Date(cpdtraceabiltyResult['data'].lines[i].actionDatetime);
      let convertedDate = datetimeObj.toLocaleString("en-MY");
      cpdtraceabiltyResult['data'].lines[i].actionDatetime = convertedDate;
    }
    return cpdtraceabiltyResult;
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
  
}
