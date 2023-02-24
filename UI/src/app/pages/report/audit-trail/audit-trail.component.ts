import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { FormGroup, FormBuilder } from '@angular/forms';
import { start } from 'repl';
import { ButtonRenderComponent } from './button.render.component';
import { AuditLogData } from '../../../@core/data/audit-log';
import { DatePipe } from '@angular/common';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-audit-trail',
  templateUrl: './audit-trail.component.html',
  styleUrls: ['./audit-trail.component.scss']
})
export class AuditTrailComponent implements OnInit {
  dateRangeForm: FormGroup;
  numberForm: FormGroup;
  toggleText = 'Search by Date Range';//'Search by Most Recent';
  hideDateRange = true; //false;
  hideMostRecent = !this.hideDateRange; //true;
  loadingSpinner = false;
  constructor(private fb: FormBuilder,
              private auditLogService: AuditLogData,
              private toastrService: NbToastrService,
              ) {
  }

  ngOnInit() {
    this.loadingSpinner = false;
    this.dateRangeForm = this.fb.group({
      fromDate:[''],
      toDate:[''],
    });
    this.numberForm = this.fb.group({
      numberInput: [''],
    });
  }

  settings = {
    mode: external,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      index: {
        title: 'No',
        type: 'text',
        width:'1em',
        valuePrepareFunction(value,row,cell){return cell.row.index+1;}
      },
      'apiOperation': {
        title: 'Operation',
        type: 'string',
        width: '1em',
      },
      'apiFunction': {
        title: 'API Function',
        type: 'string',
        width: '15em',
      },
      'payLoad': {
        title: 'Payload',
        //type: 'string',
        type: 'custom',
        width: '.5em',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (a,b,c) => c,
        editor: {
          type: 'custom',
          component: ButtonRenderComponent,
        },
      },
      'returnLoad': {
        title: 'Return Load',
        type: 'custom',
        width: '.5em',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (a,b,c) => c,
        editor: {
          type: 'custom',
          component: ButtonRenderComponent,
        },
      },
      /*'ReturnLoad': {
        title: 'Return Load',
        type: 'string',
        width: '.5em',
      },*/
      'userId': {
        title: 'User ID',
        type: 'string',
        width: '35em',
      },
      'createdDateTime': {
        title: 'Date Time',
        type: 'string',
        width: '35em',
        valuePrepareFunction: (createdDateTime) => {
          if(createdDateTime){
            return new DatePipe('en-MY').transform(createdDateTime, 'dd/MM/yyyy HH:mm:ss');
          }
          else{
            return null;
          }
        },
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();
  
  toggle(checked: boolean) {
    this.hideDateRange = !this.hideDateRange;
    this.hideMostRecent = !this.hideMostRecent;
    if(this.toggleText === 'Search by Most Recent'){
      this.toggleText = 'Search by Date Range';
    }
    else{
      this.toggleText = 'Search by Most Recent';
    }
  }
  
  searchByDate(){
    this.loadingSpinner = true;
    let startDate = +new Date(this.dateRangeForm.get('fromDate').value);
    let endDate = +new Date(this.dateRangeForm.get('toDate').value);
    let dateRange = Math.round(Math.abs((startDate - endDate) / (1000*60*60*24)));
    if ((dateRange+1) > 7){
      //window.alert("Date range cannot more than 7 days.");
      this.showToast('top-right', 'danger', 'Date range cannot more than 7 days.');
      this.loadingSpinner = false;
    }
    else if(startDate > endDate){
      this.showToast('top-right', 'danger', '\"To:\" date must be later than \"From:\" date.');
      this.loadingSpinner = false;
    }
    else{
      let dateObj = {
        StartDate: this.dateRangeForm.get('fromDate').value,
        EndDate: this.dateRangeForm.get('toDate').value,
      };
  
      this.auditLogService.getAuditLogbyDate(dateObj).subscribe(data => {
        if (data['responseCode'] === '200') {
          if(data['data'].length > 0){
            this.source.load(data['data']);
          }
          else{
            this.showToast('top-right', 'danger', 'No data found');
          }
          this.loadingSpinner = false;
        }
        else{
          this.showToast('top-right', 'danger', 'Please check your date range again.');
          this.loadingSpinner = false;
        }
      });
    }    
  }

  searchByCount(){
    this.loadingSpinner = true;
    let numberCount = this.numberForm.get('numberInput').value;
    if (numberCount > 100){
      numberCount = 100;
      this.numberForm = this.fb.group({
        numberInput: numberCount,
      });
      this.loadingSpinner = false;
    }
    else if(numberCount <= 0){
      this.showToast('top-right', 'danger', 'The number cannot be \'0\' or negative.');
      this.loadingSpinner = false;
    }

    else{
      this.auditLogService.getAuditLogbyCount(numberCount).subscribe(data => {
        if (data['responseCode'] === '200') {
          if(data['data'].length > 0){
            this.source.load(data['data']);
          }
          else{
            this.showToast('top-right', 'danger', 'No data found');
          }
          this.loadingSpinner = false;
        }
        else{
          this.showToast('top-right', 'danger', 'Please check your date range again.');
          this.loadingSpinner = false;
        }
      });
    }
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }
}
