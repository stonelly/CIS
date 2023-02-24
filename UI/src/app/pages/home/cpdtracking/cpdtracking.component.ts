import { Component } from '@angular/core';
import { CpdTrackingData } from '../../../@core/data/cpdtracking';
import { Router, ActivatedRoute } from '@angular/router';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonRenderComponent } from './button.render.component';
import { ButtonStartFlowInRenderComponent } from './buttonStartFlowIn.render.component';
import { ButtonSelectABTankRenderComponent } from './buttonSelectABTank.render.component';
import { ButtonPostToD365RenderComponent } from './buttonPostToD365.render.component';
import { CPDBatchNoRenderComponent } from './cpdBatchNo.render.component';
import { takeWhile, flatMap } from 'rxjs/operators';
import { isNull } from '@angular/compiler/src/output/output_ast';
import { DatePipe } from '@angular/common';
import { SessionStorageService } from 'angular-web-storage';
import { BatchListData } from '../../../@core/data/batchlist';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'ngx-cpdtracking',
  templateUrl: './cpdtracking.component.html',
  styleUrls: ['./cpdtracking.component.scss']
})
export class CpdTrackingComponent {
  loadingSpinner = false;
  alive = true;
  currentstatus: string = '';
  cpdBatchTrackingData = [];
  cpdBatchTrackingStages = [];
  cpdTrackingObj = [];

  settings = {
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
    columns: {
      tankNo: {
        title: 'Mixing Tank',
        type: 'string',
        //width:'*',
      },
      batchno: {
        title: 'CPD Batch No.',
        /*type: 'string',
        width: '20%',*/
        type: 'custom',
        width:'20%',
        renderComponent: CPDBatchNoRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: CPDBatchNoRenderComponent,
        },

      },
      startdate: {
        title: 'Start Date',
        type: 'Date',
        width:'20%',
        valuePrepareFunction: (startDate) => {
          if(startDate){
            return new DatePipe('en-MY').transform(startDate, 'dd/MM/yyyy HH:mm:ss');
          }
          else{
            return null;
          }
        },
      },
      enddate: {
        title: 'End Date',
        type: 'Date',
        width:'20%',
        valuePrepareFunction: (endDate) => {
          if(endDate){
            return new DatePipe('en-MY').transform(endDate, 'dd/MM/yyyy HH:mm:ss');
          }
          else{
            return null;
          }
        },
      },
      /*latex: {
        title: 'Latex',
        type: 'custom',
        //width:'*',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: ButtonRenderComponent,
        },
      },
      stabilization: {
        title: 'Stabilization',
        type: 'custom',
        //width:'*',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: ButtonRenderComponent,
        },
      },
      composite: {
        title: 'Composite',
        type: 'custom',
        width:'*',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: ButtonRenderComponent,
        },
      },
      esd: {
        title: 'ESD',
        type: 'custom',
        width:'*',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: ButtonRenderComponent,
        },
      },
      aquawax: {
        title: 'Wax',
        type: 'custom',
        width:'*',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: ButtonRenderComponent,
        },
      },*/

      pigmentTank: {
        title: 'Transfer Tank',
        type: 'custom',
        width:'1em',
        renderComponent: ButtonSelectABTankRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: ButtonSelectABTankRenderComponent,
        },
      },

      pigment: {
        title: 'Pigment',
        type: 'custom',
        width:'*',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: ButtonRenderComponent,
        },
      },

      d365Posting: {
        title: 'D365 Post',
        type: 'custom',
        width:'*',
        renderComponent: ButtonPostToD365RenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: ButtonPostToD365RenderComponent,
        },
      },

      /*flowInCPD:{
        title: 'Flow In CPD',
        type: 'custom',
        renderComponent: ButtonRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: ButtonRenderComponent,
        },
      },*/

      latexFlowInTime:{
        title: 'FlowIn Time',
        type: 'custom',
        width:'*',
        renderComponent: ButtonStartFlowInRenderComponent,
        valuePrepareFunction: (a, b, c) => c,
        editor: {
          type: 'custom',
          component: ButtonStartFlowInRenderComponent,
        },
      },
    },
  };

  lastClickTime: number = 0;
  source: LocalDataSource = new LocalDataSource();
  source2: LocalDataSource = new LocalDataSource();

  constructor(  private service: CpdTrackingData, 
                private router: Router, 
                private arouter: ActivatedRoute,
                private sessionStorageService: SessionStorageService,
                private toastrService: NbToastrService,
                private batchListService: BatchListData,) {
    this.service.currentPlant.pipe(
      takeWhile(() => this.alive),
      flatMap((plantId) => {
        //console.log(this.sessionStorageService.get('S_Token'));
        return this.service.getItems(plantId);
      }),
    ).subscribe(data => {
      if (data['responseCode'] === '200') {
        let itemIndex = 0;
        while(itemIndex < data['data'].length){
          if(data['data'][itemIndex]['stages'] !== undefined){
            this.cpdTrackingObj.push({
              tankNo:         data['data'][itemIndex]['mixingTankNo'],
              batchno:        data['data'][itemIndex]['batchNo'],
              startdate:      data['data'][itemIndex]['startDate'],
              enddate:        data['data'][itemIndex]['endDate'],
              latex:          data['data'][itemIndex]['stages'][0],
              stabilization:  data['data'][itemIndex]['stages'][1],
              composite:      data['data'][itemIndex]['stages'][2],
              aquawax:        data['data'][itemIndex]['stages'][3],//4
              pigment:        data['data'][itemIndex]['stages'][4],//5
              esd:            data['data'][itemIndex]['stages'][5],//3
              cpdFlowTime:    data['data'][itemIndex]['cpdFlowTime'],
              pigmentTank:    data['data'][itemIndex]['pigmentTank'],
              cpdFlowTimeAllowedToStart: data['data'][itemIndex]['cpdFlowTimeAllowedToStart'],
              cpdPigmentTankAllowedToAdd: data['data'][itemIndex]['cpdPigmentTankAllowedToAdd'],
            });
          }
          itemIndex++;
        }
          
        this.source.load(this.cpdTrackingObj);
        //console.log(this.cpdTrackingObj);
        this.cpdTrackingObj = [];
      }
    });
  }

  refreshTable(): void {
    this.service.currentPlant.pipe(
      takeWhile(() => this.alive),
      flatMap((plantId) => this.service.getItems(plantId)),
    ).subscribe(data => {
      if (data['responseCode'] === '200') {
        let itemIndex = 0;
        while(itemIndex < data['data'].length){
          if(typeof data['data'][itemIndex]['stages'] != 'undefined'){
            this.cpdTrackingObj.push({
              tankNo:         data['data'][itemIndex]['mixingTankNo'],
              batchno:        data['data'][itemIndex]['batchNo'],
              startdate:      data['data'][itemIndex]['startDate'],
              enddate:        data['data'][itemIndex]['endDate'],
              latex:          data['data'][itemIndex]['stages'][0],
              stabilization:  data['data'][itemIndex]['stages'][1],
              composite:      data['data'][itemIndex]['stages'][2],
              aquawax:        data['data'][itemIndex]['stages'][3],
              pigment:        data['data'][itemIndex]['stages'][4],
              esd:            data['data'][itemIndex]['stages'][5],
              cpdFlowTime:    data['data'][itemIndex]['cpdFlowTime'],
              pigmentTank:    data['data'][itemIndex]['pigmentTank'],
              cpdFlowTimeAllowedToStart: data['data'][itemIndex]['cpdFlowTimeAllowedToStart'],
              cpdPigmentTankAllowedToAdd: data['data'][itemIndex]['cpdPigmentTankAllowedToAdd'],
            });
          }
          
          itemIndex++;
        }
          
        this.source.load(this.cpdTrackingObj);
        this.cpdTrackingObj = [];
      }
    });
  }

  syncToCPDHMI(): void{
    this.loadingSpinner = true;
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
    this.loadingSpinner = false;
    //window.alert("CPD Batch Data synced successfully.");
  }

  syncBatchData(cpdBatchOrderNo: string, syncStatus: string):void{
    console.log('------------------------------------------------------------------');
    switch(syncStatus){
      case 'Synced': { ; break;
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
                this.refreshTable();
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
                    this.refreshTable();
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
                    this.refreshTable();
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
                this.refreshTable();
              }
              else{
                this.batchListService.rollbackSync(cpdBatchOrderNo).subscribe(stageItemData => {
                  if (stageItemData['responseCode'] === '200') {
                    this.batchListService.currentPlant.pipe(
                      takeWhile(() => this.alive),
                      flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                    ).subscribe(data => {
                      if (data['responseCode'] === '200') {
                        this.refreshTable();
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
                        this.refreshTable();
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
                    this.refreshTable();
                  }
                });
                console.log("Rollback sync for CPD Batch No: " + cpdBatchOrderNo);
              }
              else{
                //window.alert('Fail sync for CPD Batch Order: '+ cpdBatchOrderNo);
                this.batchListService.currentPlant.pipe(
                  takeWhile(() => this.alive),
                  flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                ).subscribe(data => {
                  if (data['responseCode'] === '200') {
                    this.refreshTable();
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

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  onRowSelect(event): void {
    if (this.lastClickTime === 0) {
      this.lastClickTime = new Date().getTime();
    } else {
      const change = (new Date().getTime()) - this.lastClickTime;
      if (change < 400) {
       this.onDoubleClick(event.data.batchno);
      }
      this.lastClickTime = 0;
    }
  }

  onDoubleClick(batchno): void {
      this.router.navigate(['/pages/home/bom-grid', { batchno: batchno }]);
  }

  groupDetailsbyStages(arrayData, key){
    return arrayData.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status }
    );
  }
}
