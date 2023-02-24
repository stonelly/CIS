import { Component, TemplateRef, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonHistoryViewRenderComponent } from './buttonView.render.component';
import { BatchListData, BatchList } from '../../../@core/data/batchlist';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { flatMap, takeUntil, takeWhile, publishReplay, skipWhile, mergeMap } from 'rxjs/operators';
import { BomGridData, BomGridArray, ItemLine } from '../../../@core/data/bom-grid';
import { BomMappingData } from '../../../@core/data/bommapping';
import { SessionStorageService } from 'angular-web-storage';
import { DatePipe } from '@angular/common';
import { Subscription } from 'rxjs';
import { FormGroup, FormControl } from '@angular/forms';
import { BatchlistCPDBatchNoRenderComponent } from './../batchlist/cpdBatchNo.render.component';//   cpdBatchNo.render.component';

@Component({
  selector: 'ngx-batchlist-history',
  templateUrl: './batchlist-history.component.html',
  styleUrls: ['./batchlist-history.component.scss']
})
export class BatchlistHistoryComponent implements OnDestroy {
  alive = true;
  cpdBatchOrderIDList = [];
  public BOMItems;
  public PlantnMixingTank: any;
  MixingTankMappingAPI: Subscription;
  mainForm = new FormGroup({
    cpdBatchOrder: new FormControl(''),
  });
  pageSize = 20;
  currentPage = 0;

  currentPageNumber; 
  prevPageNumber;
  nextPageNumber; 
  disableButton;

  settings = {
    mode: external,
    pager:{
      //display: true,
      perPage: 20,
      display: true,
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      /*'plant': {
        title: 'Plant',
        type: 'string',
        width: '1em',
      },*/
      'mixingTankNo': {
        title: 'Mixing Tank',
        type: 'string',
        width: '1em',
      },
      /*'batchNo': {
        title: 'CPD Batch No.',
        type: 'string',
        width: '10em',
      },*/
      'batchNo': {
        title: 'CPD Batch No.',
        type: 'custom',
        width:'20%',
        renderComponent: BatchlistCPDBatchNoRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: BatchlistCPDBatchNoRenderComponent,
        },
      },
      'itemNo': {
        title: 'Item No.',
        type: 'string',
        width: '13em',
      },
      'productType': {
        title: 'Product Type',
        type: 'string',
        width: '17em',
      },
      'quantity': {
        title: 'Qty (kg)',
        type: 'html',
        width: '2.5em',
        valuePrepareFunction: (value) => {
          return value.toFixed(4);
        },
      },
      'scheduledStartDatetime':{
        title: 'CPD Start',
        type: 'Date',
        width:'11em',
        valuePrepareFunction: (startDate) => {
          if(startDate){
            return new DatePipe('en-MY').transform(startDate, 'dd/MM/yyyy HH:mm:ss');
          }
          else{
            return null;
          }
        },
      },
      'scheduledEndDatetime':{
        title: 'CPD End',
        type: 'Date',
        width:'11em',
        valuePrepareFunction: (endDate) => {
          if(endDate){
            return new DatePipe('en-MY').transform(endDate, 'dd/MM/yyyy HH:mm:ss');
          }
          else{
            return null;
          }
        },
      },
      /*'stageName': {
        title: 'Current\nStage',
        type: 'string',
        width:'6em',
      },*/
      'id': {
        type: 'custom',
        renderComponent: ButtonHistoryViewRenderComponent,
        width: '10px',
        defaultValue: 'View',
        valuePrepareFunction: (cell, row) => row,
        editor: {
          type: 'custom',
          component: ButtonHistoryViewRenderComponent,
        },
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  stageItemSource: LocalDataSource = new LocalDataSource();

  constructor(private batchListService: BatchListData,
              private bomMappingService: BomMappingData,
              private sessionStorageService: SessionStorageService,
              private toastrService: NbToastrService,
              ) {
    //this.pageChange(0);
    /*this.source.onChanged().subscribe((change) => {
      if (change.action === 'page') {
        this.pageChange(change.paging.page);
      }
    });*/

    /*this.bomMappingService.getItems().subscribe(stageItemData => {
      if (stageItemData['responseCode'] === '200') {
        this.BOMItems = stageItemData['data'];
      }
    });*/

    //Return first 20 records
    this.batchListService.getHistoryByPageNumber(1).subscribe(data => {
      if (data['responseCode'] === '200') {
        this.source.load(data['data']);
        this.sessionStorageService.set('BatchList', data['data']);
        this.currentPage = 1;
        
        console.log('length:', data['data'].length);
        if(data['data'].length % 20 > 0){
          this.disableButton = true;
        }
        else{
          this.disableButton = false;
        }
      }
    });
    /*this.source.onChanged().subscribe((change) => {
      console.log('In Constructor Called: source.onChanged().');
      if (change.action === 'page') {
        console.log('change.action', change.action);
        console.log('change.paging.page: ',change.paging.page);
        if(this.currentPage !== change.paging.page){
          this.pageChange(change.paging.page);
          this.settings.pager.display = true;  
        }
      }
    });*/
    
  }

  ngOnInit() {
    //this.settings.pager.display = true;  
    this.currentPageNumber = 1;
    this.nextPageNumber = this.currentPageNumber + 1;
    this.prevPageNumber = this.currentPageNumber - 1;
    this.disableButton = false;
  }

  onSubmit(){
    //console.log(this.mainForm.value['cpdBatchOrder']);
  }

  ngOnDestroy() {
    this.alive = false;
    //this.plantTankMappingService.unsubscribe();
  }

  goToPage(pageNumber: number){
    this.getHistoryByPageNumber(pageNumber);
    this.updatePageButtonNumber(pageNumber);
  }

  firstPage(){
    this.getHistoryByPageNumber(1);
    this.updatePageButtonNumber(1);
  }

  previousPage(currentPageNumber){
    this.getHistoryByPageNumber(currentPageNumber-1);
    this.updatePageButtonNumber(currentPageNumber-1);
  }

  nextPage(currentPageNumber){
    this.getHistoryByPageNumber(currentPageNumber+1);
    this.updatePageButtonNumber(currentPageNumber+1);
  }

  updatePageButtonNumber(pageNumberClicked){
    this.currentPageNumber = pageNumberClicked;
    this.nextPageNumber = this.currentPageNumber+1;
    this.prevPageNumber = this.currentPageNumber-1;
  }


  getHistoryByPageNumber(pageNumber){
    this.batchListService.getHistoryByPageNumber(pageNumber) //.toPromise()
        .subscribe(data => 
                  {
                    //this.currentPage = pageIndex;
                    if(data['responseCode'] === '200'){
                      this.source.load(data['data']);
                      if(data['data'].length % 20 > 0){
                        this.disableButton = true;
                      }
                      else{
                        this.disableButton = false;
                      }
                    }
                    else{
                      this.showToast('top-right', 'danger', 'No data to show');
                    }
                  });
    
    /*this.batchListService.getHistoryByPageNumber(pageNumber+1) //.toPromise()
    .subscribe(data => 
              {
                //this.currentPage = pageIndex;
                if(data['responseCode'] === '200' && data['data'].length <= 0){
                  this.disableButton = true;
                }
                else{
                  this.disableButton = false;
                }
              });*/
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }


  pageChange(pageIndex) {
    const loadedRecordCount = this.source.count();
    const lastRequestedRecordIndex = pageIndex * this.pageSize;
    
   /*console.log('loadedRecordCount: ', loadedRecordCount);
    console.log('lastRequestedRecordIndex: ', lastRequestedRecordIndex);
    console.log('pageIndex * this.pageSize: ', pageIndex * this.pageSize);
    console.log('pageIndex: ', pageIndex);
    console.log('pageSize', this.pageSize);*/
    if (loadedRecordCount <= lastRequestedRecordIndex) {    
  
      this.batchListService.getHistoryByPageNumber(pageIndex) //.toPromise()
        .subscribe(data => 
                  {
                    //this.currentPage = pageIndex;
                    //this.source.load(data['data']);
                  });
    }
  }
}
