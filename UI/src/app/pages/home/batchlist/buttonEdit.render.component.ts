import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { DialogEditBomComponent } from './dialog-editbom/dialog-editbom.component';
import { BatchListData } from '../../../@core/data/batchlist';
import { BomMappingData } from '../../../@core/data/bommapping';
import { PlantTankMappingData } from '../../../@core/data/planttankmapping';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  template: `
    <button nbButton class="editButton" [disabled]="disableEditButton" (click)="openEditModal()" size="tiny" style="padding: 0.25em 0.25em 0.25em 0.25em;" nbTooltip="Update CPD Batch" nbTooltipStatus="primary" [hidden]="getAPIAccess('Home', 'CPDBatchOrderList', 'EditBatch')">
        <nb-icon icon="edit" size="tiny" style="padding: 0 0 0 0;"></nb-icon>
    </button>`,//
  styles:[`
    @media only screen and (min-width: 360px) and (max-width:640px)  {
      .editButton {
        font-size: 0 !important;
        overflow: hidden !important;
        visibility: hidden !important;
      }
    }
  `],
})
export class ButtonEditRenderComponent implements OnInit {
  public renderValue;
  public BOMItems;
  public PlantnMixingTank;
  disableEditButton: boolean = true;
  @Input() value;

  originalPlant;
  originalBatchNo;
  originalItemNo;
  originalProductType;
  originalMixingTankNo;
  originalQuantity;
  originalStartDate;
  originalEndDate;
  productTypeList;

  constructor(private router: Router,
              private dialogService: NbDialogService,
              private batchListService: BatchListData,
              private bomMappingService: BomMappingData,
              private plantTankMappingService: PlantTankMappingData,
              private sessionStorageService: SessionStorageService,
              ) {  }

  ngOnInit() {
    this.renderValue = this.value;

    if(this.renderValue['stageName'] !== 'Pigment'){
      this.disableEditButton = false;
    }


  }

  openEditModal(): void {

    this.batchListService.getProductTypeList().subscribe(data => {
      this.productTypeList = data['data'];
    });

    this.plantTankMappingService.getItems().subscribe(data => {
      if (data['responseCode'] === '200') {
        //this.source.load(data['data']);
        this.PlantnMixingTank = this.groupMixingTankbyPlant(data['data'], 'plant');

        this.bomMappingService.getItems().subscribe(stageItemData => {
          if (stageItemData['responseCode'] === '200') {
            this.BOMItems = stageItemData['data'];

            this.originalPlant = this.renderValue['plant'];
            this.originalBatchNo = this.renderValue['batchNo'];
            this.originalItemNo = this.renderValue['itemNo'];
            this.originalProductType = this.renderValue['productType'];
            this.originalMixingTankNo = this.renderValue['mixingTankNo'];
            this.originalQuantity = this.renderValue['quantity'];
            this.originalStartDate = this.renderValue['scheduledStartDatetime'];
            this.originalEndDate = this.renderValue['scheduledEndDatetime'];
            /*console.log(
              this.originalPlant,
              this.originalBatchNo,
              this.originalItemNo,
              this.originalProductType,
              this.originalMixingTankNo,
              this.originalQuantity,
              this.originalStartDate,
              this.originalEndDate,
            );*/
            let localplant;

            this.batchListService.currentPlant.subscribe(plant => {
              localplant = plant;
            });

            this.dialogService.open(  DialogEditBomComponent,
              { context: { currentplant: localplant,
                            mappedItems: this.BOMItems,
                            mappedMixingTank: this.PlantnMixingTank,
                            originalPlant: this.originalPlant,
                            originalBatchNo: this.originalBatchNo,
                            originalItemNo: this.originalItemNo,
                            originalProductType: this.originalProductType,
                            originalMixingTankNo: this.originalMixingTankNo,
                            originalQuantity: this.originalQuantity,
                            originalStartDate: this.originalStartDate,
                            originalEndDate: this.originalEndDate,
                            productTypeList: this.productTypeList
              },
                closeOnBackdropClick: false,
                closeOnEsc: false});


          }
        });
      }
    });




  }

  groupMixingTankbyPlant(arrayData, key){
    return arrayData.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
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
    return !APIAccessible;
  }
}
