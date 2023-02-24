import { Component, TemplateRef, OnDestroy, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonViewRenderComponent } from './buttonView.render.component';
import { ButtonEditRenderComponent } from './buttonEdit.render.component';
import { ButtonSyncRenderComponent } from './buttonSync.render.component';
import { BatchListData, BatchList } from '../../../@core/data/batchlist';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { DialogAddComponent } from './dialog-add/dialog-add.component';
import { flatMap, takeUntil, takeWhile, publishReplay, skipWhile, mergeMap } from 'rxjs/operators';
import { DialogAddBomComponent } from './dialog-addbom/dialog-addbom.component';
import { BomGridData, BomGridArray, ItemLine } from '../../../@core/data/bom-grid';
import { DialogImportComponent } from './dialog-import/dialog-import.component';
import { BomMappingData } from '../../../@core/data/bommapping';
import { PlantTankMappingData } from '../../../@core/data/planttankmapping';
import { SessionStorageService } from 'angular-web-storage';
import { DatePipe } from '@angular/common';
import { Subscription, forkJoin, Subject } from 'rxjs';
import { QRCodeImageComponent } from './dialog-print-qr-code/QRCodeImage/QRCodeImage.component';
import { BatchlistCPDBatchNoRenderComponent } from './cpdBatchNo.render.component';

@Component({
  selector: 'ngx-batchlist',
  templateUrl: './batchlist.component.html',
  styleUrls: ['./batchlist.component.scss'],
})
export class BatchListComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  batchListMap;
  plantTankMap;
  alive = true;
  cpdBatchOrderIDList = [];
  public BOMItems;
  public PlantnMixingTank: any;
  MixingTankMappingAPI: Subscription;
  productTypeList;
  settings = {
    mode: external,
    pager:{
      perPage: 20,
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
        sortDirection: false,
      },
      'batchNo': {
        title: 'CPD Batch No.',
        /*type: 'string',
        width: '10em',*/
        type: 'custom',
        width:'10%',
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
        title: 'Scheduled Start',
        type: 'Date',
        width:'11em',
        sortDirection: 'desc',
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
        title: 'Scheduled End',
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
      'syncStatus': {
        title: 'Sync\nStatus',
        type: 'string',
        width:'5em',
        valuePrepareFunction: (value) => {
          if(value != 'Synced'){
            return 'Not Sync';
          }
          else{
            return 'Synced';
          }
        },
      },
      GetQRCode: {
        type: 'custom',
        width: '50px',
        renderComponent: QRCodeImageComponent,
      },
      'id': {
        type: 'custom',
        renderComponent: ButtonViewRenderComponent,
        width: '10px',
        defaultValue: 'View',
        valuePrepareFunction: (cell, row) => row,
        editor: {
          type: 'custom',
          component: ButtonViewRenderComponent,
        },
      },
      'editColumn': {
        type: 'custom',
        renderComponent: ButtonEditRenderComponent,
        width: '10px',
        show: !this.getAPIAccess('Home', 'CPDBatchOrderList', 'EditBatch'),
        defaultValue: 'edit',
        valuePrepareFunction: (cell, row) => row,
        editor: {
          type: 'custom',
          component: ButtonEditRenderComponent,
        },
      },
      'syncRow': {
        type: 'custom',
        renderComponent: ButtonSyncRenderComponent,
        width: '10px',
        defaultValue: 'View',
        show: !this.getAPIAccess('Home', 'CPDBatchOrderTracking', 'StartSync'),
        valuePrepareFunction: (cell, row) => row,
        editor: {
          type: 'custom',
          component: ButtonSyncRenderComponent,
        },
      },
    },
  };

  notificationSettings = {
    mode: external,
    pager:{
      perPage: 20,
    },
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      'dateTime': {
        title: 'Date Time',
        type: 'string',
        width: '*',
        sortDirection: false,
      },
      'message': {
        title: 'Date Time',
        type: 'string',
        width: '*',
        sortDirection: false,
      },
      'messageID':{
        type: 'custom',
        renderComponent: ButtonViewRenderComponent,
        width: '10px',
        defaultValue: 'View',
        valuePrepareFunction: (cell, row) => row,
        editor: {
          type: 'custom',
          component: ButtonViewRenderComponent,
        },
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();
  notificationSource: LocalDataSource = new LocalDataSource();
  stageItemSource: LocalDataSource = new LocalDataSource();


  ngOnInit() {
    this.displayColumns('editColumn');
    /*if (this.settings.columns["id"].hasOwnProperty("show")) {
      console.log('it has shwow', this.settings.columns["id"].show, this.getAPIAccess('Home', 'CPDBatchOrderList', 'EditBatch'));
      if (this.settings.columns["id"].show ==false) {
        delete this.settings.columns["id"];
      }
    }*/


    //this.bomMappingService.getItems().subscribe(stageItemData => {
    //  if (stageItemData['responseCode'] === '200') {
    //    this.BOMItems = stageItemData['data'];
//
    //    /*let itemIndex = 0;
    //    while(itemIndex < this.BOMItems.length){
    //      console.log(this.BOMItems[itemIndex]['itemGroup']);
    //      if(this.BOMItems[itemIndex]['itemGroup'] === 'CPD'){
    //        this.itemNumber.push({
    //          name: this.BOMItems[itemIndex]['itemId'] ,
    //          value: this.BOMItems[itemIndex]['itemIdp'] ,
    //        });
    //      }
    //      itemIndex++;
    //    }*/
    //  }
    //});

    /*this.plantTankMappingService.currentPlant.pipe(
      takeWhile(() => this.alive),
      flatMap(() => this.plantTankMappingService.getItems()),
    ).subscribe(data => {
      if (data['responseCode'] === '200') {
        //this.source.load(data['data']);
        this.PlantnMixingTank = this.groupMixingTankbyPlant(data['data'], 'plant');
      }
    });*/

    /*this.plantTankMappingService.getItems().subscribe(data => {
      if (data['responseCode'] === '200') {
        //this.source.load(data['data']);
        this.PlantnMixingTank = this.groupMixingTankbyPlant(data['data'], 'plant');
      }
    });*/

    this.bomMappingService.currentPlant.pipe(
      takeWhile(() => this.alive),
      //takeUntil(this.destroy$),
      flatMap(() => this.bomMappingService.getItems()),
    ).subscribe(stageItemData => {
      if (stageItemData['responseCode'] === '200') {
        this.BOMItems = stageItemData['data'];
      }
    });

    this.batchListService.currentPlant.pipe(
      takeWhile(() => this.alive),
      //takeUntil(this.destroy$),
      mergeMap((plant) => {
        let batchlist;
        batchlist = this.batchListService.getItemByPlant(plant);

        const planttank = this.plantTankMappingService.getItems();

        return forkJoin([batchlist, planttank]);
      }),
    ).subscribe(data => {

      this.batchListMap = data[0];
      this.plantTankMap = data[1];
      this.PlantnMixingTank = this.groupMixingTankbyPlant(this.plantTankMap['data'], 'plant');
      this.source.load(this.batchListMap['data']);
      //this.displayColumns('id');

      this.sessionStorageService.set('BatchList', this.batchListMap['data']);
    })

    /*this.batchListService.currentPlant.pipe(
      takeWhile(() => this.alive),
      flatMap((plant) => this.batchListService.getItemByPlant(plant)),
    ).subscribe(data => {
      if (data['responseCode'] === '200') {
        this.source.load(data['data']);
        this.sessionStorageService.set('BatchList', data['data']);
      }
    });*/
  }

  constructor(private batchListService: BatchListData,
              private bomGridService: BomGridData,
              private dialogService: NbDialogService,
              private bomMappingService: BomMappingData,
              private plantTankMappingService: PlantTankMappingData,
              private sessionStorageService: SessionStorageService,
              private toastrService: NbToastrService,
              ) {





    /*this.plantTankMappingService.currentPlant.pipe(
        takeWhile(() => this.alive),
        skipWhile(() => this.PlantnMixingTank.length === 0),
        flatMap(()=> this.plantTankMappingService.getItems()),
      ).subscribe(data => {
        if (data['responseCode'] === '200') {
          //this.source.load(data['data']);
          this.PlantnMixingTank = this.groupMixingTankbyPlant(data['data'], 'plant');
        }
    });*/
    /*this.MixingTankMappingAPI = this.plantTankMappingService.currentPlant.pipe(
                                    skipWhile(() => typeof this.PlantnMixingTank === 'undefined'),
                                    mergeMap(()=>this.plantTankMappingService.getItems()),
                                  ).subscribe(data => {
                                    if (data['responseCode'] === '200') {
                                      //this.source.load(data['data']);
                                      this.PlantnMixingTank = this.groupMixingTankbyPlant(data['data'], 'plant');
                                    }
                                });*/



  }

  /*deleteRecord(event): void {
    const request = {
      'Id': event.data['Id'],
      'ModifiedBy': '',
    };

    if (window.confirm('Are you sure you want to delete?')) {
      this.batchListService.deleteItem(request).subscribe(response => {
        if (response['RequestReponse'] === 'SUCCESS') {
          this.source.update(event.newData, event.newData);
          event.confirm.resolve();
        } else {
          event.confirm.reject();
        }
      });
    } else {
      event.confirm.reject();
    }
  }*/

  openModal(): void {
    let localplant;

    this.batchListService.getProductTypeList().subscribe(data => {
      this.productTypeList = data['data'];
    });

    this.batchListService.currentPlant.subscribe(plant => {
      localplant = plant;
    });
    console.log(this.productTypeList);
    this.dialogService.open(  DialogAddBomComponent,
                              { context: { currentplant: localplant,
                                            mappedItems: this.BOMItems,
                                            mappedMixingTank: this.PlantnMixingTank,
                                            productTypeList: this.productTypeList
                              },
                                closeOnBackdropClick: false,
                                closeOnEsc: false})
    .onClose.subscribe(data =>  {
      if (data !== undefined) {
        /*  batchlistdata = data['batchorder'];
        batchlistdata.createdby = 'anuar.arsyad';
        batchlistdata.createddate = new Date();

        this.batchListService.createItem(batchlistdata).subscribe(responsebatch => {
          if (responsebatch['ResponseCode'] === '200') {
            bomgriddata.cpdbatchno = batchlistdata.cpdbatchno;
            bomgriddata.createdby = 'anuar.arsyad';

            for (const item in data['stabilization']['items']) {
              itemlinedata = item;
              itemlinedata.category = data['stabilization']['category'];
              bomgriddata.itemlinedata.push(itemlinedata);
            }

            this.bomGridService.createItem(bomgriddata).subscribe(responsebom => {
              if (responsebom['ResponseCode'] === '200') {
                this.batchListService.currentPlant.pipe(
                  takeWhile(() => this.alive),
                  flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                ).subscribe(tableData => {
                  if (tableData['ResponseCode'] === '200') {
                    this.source.load(tableData['Data']);
                  }
                });
              }
            });
          }
        }); */
      }
    });
  }

  syncToCPDHMI(): void{
    let cpdBatchItem = this.sessionStorageService.get('BatchList');
    let itemIndex = 0;
    while(itemIndex < cpdBatchItem.length){
      if(cpdBatchItem[itemIndex]['productType'] == null){
        this.showToast('top-right', 'danger', "Please update \"Product Type\" of "+ cpdBatchItem[itemIndex]['batchNo'] +" in order to sync");
      }
      else{
        this.syncBatchData(cpdBatchItem[itemIndex]['batchNo'], cpdBatchItem[itemIndex]['syncStatus']);
      }
      itemIndex++;
    }
    /*this.source.getAll().then(res2 => {

      let cpdBatchItem = [];
      res2.forEach(element => {
        cpdBatchItem.push(element);
      });
      let failedCPDBatchOrder = this.sessionStorageService.get('S_FailedCPDBatchOrder');
      console.log('1-fail order', failedCPDBatchOrder);
      //let currentFailBatchOrder = '';
      let itemIndex = 0;
      while(itemIndex < cpdBatchItem.length){
        //console.log(cpdBatchItem[itemIndex]);
        //console.log(cpdBatchItem[itemIndex]['syncStatus'] === 'Synced');
        if(cpdBatchItem[itemIndex]['syncStatus'] !== 'Synced'){
          if(failedCPDBatchOrder == 'null' || failedCPDBatchOrder == '' || failedCPDBatchOrder == null){
            console.log('null detected');
            failedCPDBatchOrder = cpdBatchItem[itemIndex]['batchNo'];
            this.sessionStorageService.set('S_FailedCPDBatchOrder', failedCPDBatchOrder);
          }
          else{
            failedCPDBatchOrder += ', ' + cpdBatchItem[itemIndex]['batchNo'];
            this.sessionStorageService.set('S_FailedCPDBatchOrder', failedCPDBatchOrder);
          }
        }
        itemIndex++;
      }
      this.sessionStorageService.set('S_FailedCPDBatchOrder', '');
      //console.log('CPDBatchOrder: ',cpdBatchOrderNo);
      console.log('failedCPDBatchOrder: ',failedCPDBatchOrder);
      if(failedCPDBatchOrder != null ){
        this.showToast('top-right', 'danger', 'Sync failed for: '+failedCPDBatchOrder); //failedCPDBatchOrder != undefined || failedCPDBatchOrder != 'null' || failedCPDBatchOrder != '' ||
      }
    });*/
  }

  ngOnDestroy() {
    this.alive = false;
    //this.plantTankMappingService.unsubscribe();
  }

  groupMixingTankbyPlant(arrayData, key){
    return arrayData.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  syncBatchData(cpdBatchOrderNo: string, syncStatus: string):void{
    switch(syncStatus){
      case 'Synced': {
        /*this.batchListService.updateSync(cpdBatchOrderNo).subscribe(stageItemData => {
          if (stageItemData['responseCode'] === '200') {
            this.batchListService.currentPlant.pipe(
              takeWhile(() => this.alive),
              flatMap((plant) => this.batchListService.getItemByPlant(plant)),
            ).subscribe(data => {
              if (data['responseCode'] === '200') {
                this.source.load(data['data']);
                console.log("CPD Batch Data synced successfully.");
              }
            });
          }
          else{
            console.log("Sync CPD Batch Data failed for " + cpdBatchOrderNo);
            this.batchListService.rollbackSync(cpdBatchOrderNo).subscribe(stageItemData => {
              if (stageItemData['responseCode'] === '200') {
                this.batchListService.currentPlant.pipe(
                  takeWhile(() => this.alive),
                  flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                ).subscribe(data => {
                  if (data['responseCode'] === '200') {
                    this.source.load(data['data']);
                  }
                });
                this.appendToStorage('FailedSyncCPDBatch', cpdBatchOrderNo);
                console.log(this.sessionStorageService.get('FailedSyncCPDBatch'));
                console.log("Rollback sync for CPD Batch No: " + cpdBatchOrderNo);
              }
              else{
                this.batchListService.currentPlant.pipe(
                  takeWhile(() => this.alive),
                  flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                ).subscribe(data => {
                  if (data['responseCode'] === '200') {
                    this.source.load(data['data']);
                  }
                });
              }
            });
          }
        })*/; break;
      }

      case 'NotSync':{
        console.log(cpdBatchOrderNo + ", " + syncStatus);
        console.log('NotSync, "startSync" triggered');
        this.batchListService.addSync(cpdBatchOrderNo).subscribe(stageItemData => {
          if (stageItemData['responseCode'] === '200') {
            this.batchListService.currentPlant.pipe(
              takeWhile(() => this.alive),
              flatMap((plant) => this.batchListService.getItemByPlant(plant)),
            ).subscribe(data => {
              if (data['responseCode'] === '200') {
                this.source.load(data['data']);
              }
            });
          }
          else{
            console.log("Sync CPD Batch Data failed for " + cpdBatchOrderNo);
            this.batchListService.rollbackSync(cpdBatchOrderNo).subscribe(stageItemData => {
              if (stageItemData['responseCode'] === '200') {
                this.batchListService.currentPlant.pipe(
                  takeWhile(() => this.alive),
                  flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                ).subscribe(data => {
                  if (data['responseCode'] === '200') {
                    this.source.load(data['data']);
                  }
                });
                console.log("Rollback sync for CPD Batch No: " + cpdBatchOrderNo);
              }
              else{
                console.log('Fail sync for CPD Batch Order: '+ cpdBatchOrderNo);
                this.batchListService.currentPlant.pipe(
                  takeWhile(() => this.alive),
                  flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                ).subscribe(data => {
                  if (data['responseCode'] === '200') {
                    this.source.load(data['data']);
                  }
                });
              }
            });
          }
        }); break;
      }

      case 'RequireSync':{
        console.log(cpdBatchOrderNo + ", " + syncStatus);
        console.log('RequireSync - UpdateSync triggered');
        this.batchListService.updateSync(cpdBatchOrderNo).subscribe(stageItemData => {
          if (stageItemData['responseCode'] === '200') {
            this.batchListService.currentPlant.pipe(
              takeWhile(() => this.alive),
              flatMap((plant) => this.batchListService.getItemByPlant(plant)),
            ).subscribe(data => {
              if (data['responseCode'] === '200') {
                console.log('**update success');
                this.source.load(data['data']);
              }
              else{
                this.batchListService.rollbackSync(cpdBatchOrderNo).subscribe(stageItemData => {
                  if (stageItemData['responseCode'] === '200') {
                    this.batchListService.currentPlant.pipe(
                      takeWhile(() => this.alive),
                      flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                    ).subscribe(data => {
                      if (data['responseCode'] === '200') {
                        console.log('**rollback success');
                        this.source.load(data['data']);
                      }
                    });
                    console.log("Rollback sync for CPD Batch No: " + cpdBatchOrderNo);
                  }
                  else{
                    this.showToast('top-right', 'danger', "Failed to rollback for CPD Batch Order: " + cpdBatchOrderNo + ' (RequireSync)');
                    this.batchListService.currentPlant.pipe(
                      takeWhile(() => this.alive),
                      flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                    ).subscribe(data => {
                      if (data['responseCode'] === '200') {
                        console.log('**failed');
                        this.source.load(data['data']);
                      }
                    });
                  }
                });
              }
            });
          }
          else{
            this.showToast('top-right', 'danger', "Sync CPD Batch Data failed for " + cpdBatchOrderNo + ' (RequireSync)');
            //window.alert('Fail sync for CPD Batch Order (outside else): '+ cpdBatchOrderNo);
            console.log(stageItemData['responseCode']);
            this.batchListService.rollbackSync(cpdBatchOrderNo).subscribe(stageItemData => {
              if (stageItemData['responseCode'] === '200') {
                this.batchListService.currentPlant.pipe(
                  takeWhile(() => this.alive),
                  flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                ).subscribe(data => {
                  if (data['responseCode'] === '200') {
                    console.log('**else rollback success');
                    this.source.load(data['data']);
                  }
                });
                console.log("Rollback sync for CPD Batch No: " + cpdBatchOrderNo);
              }
              else{
                this.showToast('top-right', 'danger', "Fail sync for CPD Batch Order: " + cpdBatchOrderNo + ' (RequireSync)');
               // window.alert('Fail sync for CPD Batch Order: '+ cpdBatchOrderNo);
                this.batchListService.currentPlant.pipe(
                  takeWhile(() => this.alive),
                  flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                ).subscribe(data => {
                  if (data['responseCode'] === '200') {

                    console.log('**else lod success');
                    this.source.load(data['data']);
                  }
                });
              }
            });
          }

        }); break;
      }
    }
    /*this.source.getAll().then(res2 => {

      let cpdBatchItem = [];
      res2.forEach(element => {
        cpdBatchItem.push(element);
      });
      let failedCPDBatchOrder = this.sessionStorageService.get('S_FailedCPDBatchOrder');
      //let currentFailBatchOrder = '';
      let itemIndex = 0;
      while(itemIndex < cpdBatchItem.length){
        console.log(cpdBatchItem[itemIndex]);
        console.log(cpdBatchItem[itemIndex]['syncStatus'] === 'Synced');
        if(cpdBatchItem[itemIndex]['syncStatus'] === 'Synced'){
          if(failedCPDBatchOrder == 'null' || failedCPDBatchOrder == '' || failedCPDBatchOrder == null){
            //console.log('null detected');
            failedCPDBatchOrder = cpdBatchOrderNo;
            this.sessionStorageService.set('S_FailedCPDBatchOrder', failedCPDBatchOrder);
          }
          else{
            failedCPDBatchOrder += ', ' + cpdBatchOrderNo;
            this.sessionStorageService.set('S_FailedCPDBatchOrder', failedCPDBatchOrder);
          }
        }
        itemIndex++;
      }
      //console.log('CPDBatchOrder: ',cpdBatchOrderNo);
      console.log('failedCPDBatchOrder: ',failedCPDBatchOrder);
      if(failedCPDBatchOrder != undefined || failedCPDBatchOrder != 'null' || failedCPDBatchOrder != '' ){
        this.showToast('top-right', 'danger', 'Sync failed for: '+failedCPDBatchOrder);
      }
    });*/
  }

  appendToStorage(name, data){
    var old = this.sessionStorageService.get(name);
    if(old === null) old = "";
    this.sessionStorageService.set(name, old +", "+ data);
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status }
    );
  }

  getAPIAccess(module, screen, api): boolean{//module, screen, api){
    let APIList = this.sessionStorageService.get('S_APIList');
    let APIAccessible = false;
    let indexCount = 0;
    let moduleName = module;
    let screenName = screen;
    let apiName = api;
    while (indexCount < APIList[moduleName].length){
      let indexChild = 0;
      while (indexChild < APIList[moduleName][indexCount]['screenChildren'].length){
        let indexAPI = 0;
        while(indexAPI < APIList[moduleName][indexCount]['screenChildren'][indexChild]['apiList'].length){
          if( APIList[moduleName][indexCount]['screenChildren'][indexChild]['screenName'] === screenName
            && APIList[moduleName][indexCount]['screenChildren'][indexChild]['apiList'][indexAPI]['apiName']  === apiName){
            APIAccessible = true;
          }
          indexAPI++;
        }
        indexChild++;
      }
      indexCount++;
    }
    //console.log(module, screen, api, APIAccessible);
    return !APIAccessible;
    //return false;
  }

  displayColumns(columnName){
    if (this.settings.columns[columnName].hasOwnProperty("show")) {
      //console.log('it has shwow', this.settings.columns["id"].show, this.getAPIAccess('Home', 'CPDBatchOrderList', 'EditBatch'));
      if (this.settings.columns[columnName].show ==false) {
        delete this.settings.columns[columnName];
      }
    }
  }

  // DELETE The folowing later
  /*importData(): void {
    this.dialogService.open(DialogImportComponent);
    .onClose.subscribe(data =>  {
      if (data !== undefined) {
        console.log(data);
      }
    });
  }*/



  /*addRecord(event): void {
    const data = {
      'Id': undefined,
      'Plant': event.newData['Plant'],
      'BatchNo': event.newData['BatchNo'],
      'ItemNo': event.newData['ItemNo'],
      'ProductType': event.newData['ProductType'],
      'Quantity': event.newData['Quantity'],
      'Description': undefined,
      'ModifiedBy': undefined,
      'ModifiedDate': undefined,
      'CreatedBy': 'anuar.arsyad',
      'CreatedDate': undefined,
    };

    this.batchListService.createItem(data).subscribe(response => {
        this.source.update(event.newData, event.newData);
        event.confirm.resolve();
    });
  }

  editRecord(event): void {
    const data = {
      'Id': event.data['Id'],
      'Plant': event.newData['Plant'],
      'BatchNo': event.newData['BatchNo'],
      'ItemNo': event.newData['ItemNo'],
      'ProductType': event.newData['ProductType'],
      'Quantity': event.newData['Quantity'],
      'Description': undefined,
      'ModifiedBy': 'anuar.arsyad',
      'ModifiedDate': undefined,
      'CreatedBy': undefined,
      'CreatedDate': undefined,
    };

    this.batchListService.updateItem(data).subscribe(response => {
      this.source.update(event.newData, event.newData);
      event.confirm.resolve();
    });
  }*/
}
