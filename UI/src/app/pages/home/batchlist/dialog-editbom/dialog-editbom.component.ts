import { Component, Input, OnInit, ErrorHandler } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DialogAddStageItemComponent } from './../dialog-add-stage-item/dialog-add-stage-item.component';
import { SessionStorageService } from 'angular-web-storage';
import { mappedItems } from './../../../../@core/data/bommapping';
import { CPDBatchOrderData } from './../../../../@core/data/cpdbatchorder';
import { EditBOMDetailsFormArray, ItemLine } from './../../../../@core/data/bom-grid';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { BomGridData } from '../../../../@core/data/bom-grid';


@Component({
  selector: 'ngx-dialog-editbom',
  templateUrl: './dialog-editbom.component.html',
  styleUrls: ['./dialog-editbom.component.scss'],
  /*styles:[`
    :host {
      max-height: 10vh;
    }
  `],*/
})

export class DialogEditBomComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  mainForm: FormGroup;
  dialogForm: FormGroup;
  @Input() currentplant: string;
  @Input() currentStage: string;
  @Input() mappedItems;
  @Input() mappedMixingTank;
  @Input() originalPlant;
  @Input() originalBatchNo;
  @Input() originalItemNo;
  @Input() originalProductType;
  @Input() originalMixingTankNo;
  @Input() originalQuantity;
  @Input() originalStartDate;
  @Input() originalEndDate;
  @Input() productTypeList;

  plant: string;
  cpdbatchno: string;
  itemno: string;
  producttype: string;
  quantity: number;
  //currentStage: string;
  hideMajorDialog: boolean ;
  hideStageItemDialog: boolean ;
  mappedBOMItemsForDialog = new Array<mappedItems>();
  mappedBOMItemsForDialogSorted: Array<mappedItems>;
  stageNumber: number;
  selectedOption = '';
  mixingTankList;
  originalBomGridData: any;
  groupedBomGridData: any;
  formArrayBOM = new Array<EditBOMDetailsFormArray>();
  LatexData = new Array<EditBOMDetailsFormArray>();
  disableButton: boolean = true;
  returnItemObj =[];

  keyword = 'name';


  constructor(  protected ref: NbDialogRef<DialogEditBomComponent>,
                private fb: FormBuilder,
                private dialogService: NbDialogService,
                private sessionStorageService: SessionStorageService,
                private cpdBatchOrderService: CPDBatchOrderData,
                private bomGridService: BomGridData,
                private router: Router,
                private toastrService: NbToastrService,) {}

  ngOnInit() {
    this.hideMajorDialog = false;
    this.hideStageItemDialog = true;
    this.plant = 'P' + this.currentplant;

    this.mixingTankList = this.mappedMixingTank[this.plant];

    this.mainForm = this.fb.group({
      batchorder: this.fb.group({
        plant: [this.originalPlant],
        cpdbatchno: [this.originalBatchNo],
        itemno: [this.originalItemNo],
        producttype: [this.originalProductType],
        mixingtank: [this.originalMixingTankNo],
        quantity: [this.originalQuantity.toFixed(4)],
        scheduledstartdatetime: [this.originalStartDate],
        scheduledenddatetime: [this.originalEndDate],
      }),

      latex: this.fb.group({
        category: ['Latex'],
        items: this.fb.array([]),
        //items: this.LatexData,
      }),
      stabilization: this.fb.group({
        category: ['Stabilization'],
        items: this.fb.array([]),
      }),
      composite: this.fb.group({
        category: ['Composite'],
        items: this.fb.array([]),
      }),
      esd: this.fb.group({
        category: ['esd'],
        items: this.fb.array([]),
      }),
      wax: this.fb.group({
        category: ['Wax'],
        items: this.fb.array([]),
      }),
      pigment: this.fb.group({
        category: ['Pigment'],
        items: this.fb.array([]),
      }),
    });

    this.getOriginalBOM(this.originalBatchNo, 1);
    this.getOriginalBOM(this.originalBatchNo, 2);
    this.getOriginalBOM(this.originalBatchNo, 3);
    this.getOriginalBOM(this.originalBatchNo, 4);
    this.getOriginalBOM(this.originalBatchNo, 5);
    this.getOriginalBOM(this.originalBatchNo, 6);


    //this.initializeOriginalBOMinDialog(1, this.LatexData);

    this.dialogForm = new FormGroup({
      StageItemId: new FormControl(''),
    });
  }

  cancel() {
    this.ref.close();
  }

  onSubmit() {
    this.mainForm.get('batchorder').get('plant').enable();
    let lineObj = this.buildLineItemObj(this.mainForm.get('latex').get('items').value);
    lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('stabilization').get('items').value));
    lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('composite').get('items').value));
    lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('esd').get('items').value));
    lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('wax').get('items').value));
    lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('pigment').get('items').value));
    /*let lineObj = this.mainForm.get('latex').get('items').value;
    lineObj = lineObj.concat(this.mainForm.get('stabilization').get('items').value);
    lineObj = lineObj.concat(this.mainForm.get('composite').get('items').value);
    lineObj = lineObj.concat(this.mainForm.get('wax').get('items').value);
    lineObj = lineObj.concat(this.mainForm.get('pigment').get('items').value);*/

    const batchOrderDetailsObj = {
      Plant:            this.mainForm.get('batchorder').get('plant').value,
      CPDBatchOrderNo:  this.mainForm.get('batchorder').get('cpdbatchno').value.toUpperCase(),
      CPDItemNo:        this.mainForm.get('batchorder').get('itemno').value.toUpperCase(),
      CPDQuantity:      this.mainForm.get('batchorder').get('quantity').value,
      TankNo:           this.mainForm.get('batchorder').get('mixingtank').value,
      ProductType:      this.producttype,
      ScheduledStartDatetime: this.mainForm.get('batchorder').get('scheduledstartdatetime').value,
      ScheduledEndDatetime: this.mainForm.get('batchorder').get('scheduledenddatetime').value,
      CreatedBy: this.sessionStorageService.get('S_Name'),
      CreatedDatetime: Date.now(),
      Lines: lineObj,
    };

    // console.log(batchOrderDetailsObj);
    this.cpdBatchOrderService.UpdateBatchOrder(batchOrderDetailsObj).pipe(
      takeUntil(this.destroy$),
      catchError(this.handleError),
    ).subscribe( response => {
      if (response['responseCode'] === '200') {
        //window.location.reload();
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/home/cpdbatchorderlist'], { skipLocationChange: false }).then(() => {
            this.showToast('top-right', 'success', 'CPD Batch Order updated successfully.');
          });
        });
        this.ref.close();
      }
      else{
        this.showToast('top-right', 'danger', 'Kindly check your CPD Batch details and edit again.');
        //window.alert('Kindly check your CPD Batch details and edit again.');
      }
    });
  }

  getControls(stage: string) {
    //console.log(this.mainForm.get('latex').get('items'));
    return (this.mainForm.get(stage).get('items') as FormArray).controls;
  }

  addLatex(){
    this.currentStage = "Latex";
    this.populateItem(this.mappedItems, 'latex');
    this.stageNumber = 1;
    this.hideMajorDialog = true;
    this.hideStageItemDialog = false;
    //this.populateItem(this.mappedItems, 'Latex');
  /*this.openAddStageItemDialog("Latex");*/
  }

  addStabilization(){
    this.currentStage = "Stabilization";
    this.populateItem(this.mappedItems, 'stabilization');
    this.stageNumber = 2;
    this.hideMajorDialog = true;
    this.hideStageItemDialog = false;
    //this.populateItem(this.mappedItems, 'Stabilization');
    //this.openAddStageItemDialog("Stabilization");
  }

  addComposite(){
    this.currentStage = "Composite";
    this.populateItem(this.mappedItems, 'composite');
    this.stageNumber = 3;
    this.hideMajorDialog = true;
    this.hideStageItemDialog = false;
    //this.populateItem(this.mappedItems, 'Composite');
    //this.openAddStageItemDialog("Composite");
  }

  addESD(){
    this.currentStage = "ESD";
    this.populateItem(this.mappedItems, 'esd');
    this.stageNumber = 6;
    this.hideMajorDialog = true;
    this.hideStageItemDialog = false;
    //this.populateItem(this.mappedItems, 'Composite');
    //this.openAddStageItemDialog("Composite");
  }

  addWax(){
    this.currentStage = "Wax";
    this.populateItem(this.mappedItems, 'aquawax');
    this.stageNumber = 4;
    this.hideMajorDialog = true;
    this.hideStageItemDialog = false;
    //this.populateItem(this.mappedItems, 'Wax');
    //this.openAddStageItemDialog("Wax");
}

  addPigment() {
    this.currentStage = "Pigment";
    this.populateItem(this.mappedItems, 'pigment');
    this.stageNumber = 5;
    this.hideMajorDialog = true;
    this.hideStageItemDialog = false;
    //this.populateItem(this.mappedItems, 'Pigment');
    //this.openAddStageItemDialog("Pigment");
  };

  removeLatexItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('latex').get('items') as FormArray;
    items.removeAt(index);
    this.disableButton = false;
  }

  removeStabilizationItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('stabilization').get('items') as FormArray;
    items.removeAt(index);
    this.disableButton = false;
  }

  removeCompositeItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('composite').get('items') as FormArray;
    items.removeAt(index);
    this.disableButton = false;
  }

  removeESDItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('esd').get('items') as FormArray;
    items.removeAt(index);
    this.disableButton = false;
  }

  removeWaxItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('wax').get('items') as FormArray;
    items.removeAt(index);
    this.disableButton = false;
  }

  removePigmentItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('pigment').get('items') as FormArray;
    items.removeAt(index);
    this.disableButton = false;
  }

  openAddStageItemDialog(stage:string){
    this.dialogService.open(DialogAddStageItemComponent, {context: {currentStage: stage, mainFormValue: this.mainForm} })
    .onClose.subscribe(data => {

    });
  }

  addStageItem(){
    this.mappedBOMItemsForDialog = null;
    this.hideMajorDialog = false;
    this.hideStageItemDialog = true;
    let selectedItem = this.dialogForm.get('StageItemId').value;
    //console.log('this.dialogForm.get(\'StageItemId\').value', this.dialogForm.get('StageItemId').value);
    //console.log('this.dialogForm', this.dialogForm);
    this.populateNewRowInBOM(this.stageNumber, selectedItem);

  }

  cancelStageItem(){
    this.dialogForm.reset();
    this.hideMajorDialog = false;
    this.hideStageItemDialog = true;
  }

  populateItem(allBOMItemList, stageName){
    let itemIndex = 0;
    let displayItemId;
    let stageNameString;
    this.mappedBOMItemsForDialog = new Array<mappedItems>();
    if (stageName === 'aquawax'){
      stageNameString = 'wax';
    }
    else{
      stageNameString = stageName;
    }
    //console.log(stageNameString);

    while(itemIndex < allBOMItemList.length){
      if(allBOMItemList[itemIndex]['stageMapping'][stageName] === true){
        let itemId = allBOMItemList[itemIndex]['itemId'];
        if(itemId.substr(itemId.length - 18) === "SOFTWATER-FLUSHING"){
          displayItemId = "SOFTWATER-FLUSHING";
        }
        else if(itemId.substr(itemId.length - 9) === "SOFTWATER"){
          displayItemId = "SOFTWATER";
        }
        else{
          displayItemId = allBOMItemList[itemIndex]['itemId'];
        }

        this.mappedBOMItemsForDialog.push(
          {
            'itemId': allBOMItemList[itemIndex]['itemId'],
            'itemName': allBOMItemList[itemIndex]['itemName'],
            'unit': allBOMItemList[itemIndex]['unit'],
            'displayItemId': displayItemId,
            'StageName': stageNameString,
          }
        );
      }
      itemIndex++;
    }

    /*this.mappedBOMItemsForDialogSorted = this.mappedBOMItemsForDialog.slice(0);
    this.mappedBOMItemsForDialogSorted.sort((left, right) => {
        if (left.itemName < right.itemName) return -1;
        if (left.itemName > right.itemName) return 1;
        return 0;
    })*/
  }

  populateNewRowInBOM(stageID: number, itemIdSelected){
    let stageName = '';
    switch(stageID){
      case 1: { stageName = 'latex'; break; }
      case 2: { stageName = 'stabilization'; break; }
      case 3: { stageName = 'composite'; break; }
      case 4: { stageName = 'wax'; break; }
      case 5: { stageName = 'pigment'; break; }
      case 6: { stageName = 'esd'; break; }
      default:{ stageName = ''; break}
    }

    const details = this.mainForm.get(stageName).get('items') as FormArray;
    details.push(this.fb.group({
        itemid: itemIdSelected['itemId'],
        bomunit: itemIdSelected['unit'],
        quantity: ['', [Validators.required]],
        displayItemId: itemIdSelected['displayItemId'],
        StageName:  itemIdSelected['StageName'],
        PHR: ['', [Validators.required]],
        TSC: ['', [Validators.required]],
        //itemname: ['Item Name selected'],
        //itembatchno: ['', [Validators.required]],
        //targetweight: ['', [Validators.required]],
        //actualweight: ['', [Validators.required]],
    }));

    this.dialogForm = new FormGroup({
      StageItemId: new FormControl(''),
    });
  }

  checkEmpty(value){
    if(value == undefined){
      return "";
    }
    else{
      return value;
    }
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }

  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Please check and update your CPD Batch information.`;
    }
    console.log(error);
    window.alert(errorMessage);
    return throwError(errorMessage);
 }

  groupBOMItemsbyStage(arrayData, key){
    return arrayData.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  getOriginalBOM(cpdBatchOrderNo, stageID){
    let groupedBomGridData;//: any[];
    let stageName = '';
    switch(stageID){
      case 1: { stageName = 'Latex'; break; }
      case 2: { stageName = 'Stabilization'; break; }
      case 3: { stageName = 'Composite'; break; }
      case 4: { stageName = 'Wax'; break; }
      case 5: { stageName = 'Pigment'; break; }
      case 6: { stageName = 'ESD'; break; }
      default:{ stageName = ''; break}
    }

    this.bomGridService.getItems(cpdBatchOrderNo).subscribe(data => {
      if (data['responseCode'] === '200') {
        groupedBomGridData = this.groupBOMItemsbyStage(data['data']['bomDetail'], 'category');
        let itemIndex = 0;
        let displayItemId;
        if(typeof groupedBomGridData[stageName].length !== 'undefined'){
          //console.log('item', groupedBomGridData[stageName]);
          while(itemIndex < groupedBomGridData[stageName].length){
            let itemId = groupedBomGridData[stageName][itemIndex]['itemId'];
            //console.log(itemId);
            if(itemId.substr(itemId.length - 18) === "SOFTWATER-FLUSHING"){
              displayItemId = "SOFTWATER-FLUSHING";
            }
            else if(itemId.substr(itemId.length - 9) === "SOFTWATER"){
              displayItemId = "SOFTWATER";
            }
            else{
              displayItemId = groupedBomGridData[stageName][itemIndex]['itemId'];
            }
            this.formArrayBOM.push({
              itemid: groupedBomGridData[stageName][itemIndex]['itemId'],
              bomunit: groupedBomGridData[stageName][itemIndex]['unit'],
              quantity: groupedBomGridData[stageName][itemIndex]['targetWeight'].toFixed(4),
              displayitemid: displayItemId,
              StageName: groupedBomGridData[stageName][itemIndex]['category'],
              PHR: groupedBomGridData[stageName][itemIndex]['PHR'],
              TSC: groupedBomGridData[stageName][itemIndex]['TSC'],
            });
            this.initializeOriginalBOMinDialog(stageID, this.formArrayBOM);
            itemIndex++;
            this.formArrayBOM = [];
          }
        }

      }
    });
  }

  initializeOriginalBOMinDialog(stageID: number, dataArray){
    let stageName = '';
    switch(stageID){
      case 1: { stageName = 'latex'; break; }
      case 2: { stageName = 'stabilization'; break; }
      case 3: { stageName = 'composite'; break; }
      case 4: { stageName = 'wax'; break; }
      case 5: { stageName = 'pigment'; break; }
      case 6: { stageName = 'esd'; break; }
      default:{ stageName = ''; break}
    }
    const details = this.mainForm.get(stageName).get('items') as FormArray;
    let itemIndex = 0;
    //console.log('dataArray', dataArray);
    //console.log('Array length:', dataArray.length);
    //console.log('Array:', dataArray);
    while(itemIndex < dataArray.length){
      details.push(this.fb.group({
        itemid: dataArray[itemIndex]['itemid'],
        bomunit: dataArray[itemIndex]['bomunit'],
        quantity: dataArray[itemIndex]['quantity'],
        displayItemId: dataArray[itemIndex]['displayitemid'],
        StageName: dataArray[itemIndex]['StageName'],
        PHR: dataArray[itemIndex]['PHR'],
        TSC: dataArray[itemIndex]['TSC'],
      }));
      //console.log(dataArray[itemIndex]['itemid']);
      itemIndex++;
    }
    //console.log('details', details);
    //console.log('dataArray',dataArray);
  }

  getStageNamebyNumber(stageID: number): string{
    let stageName = '';
    switch(stageID){
      case 1: { stageName = 'latex'; break; }
      case 2: { stageName = 'stabilization'; break; }
      case 3: { stageName = 'composite'; break; }
      case 4: { stageName = 'wax'; break; }
      case 5: { stageName = 'pigment'; break; }
      case 6: { stageName = 'esd'; break; }
      default:{ stageName = ''; break}
    }
    return stageName;
  }

  valueChanged(){
    this.disableButton = false;
  }

  buildLineItemObj(itemObj){
    this.returnItemObj =[];
    let itemIndex = 0;
    //console.log('itemObj:', itemObj);
    while(itemIndex < itemObj.length){
      this.returnItemObj.push({
        'itemId': itemObj[itemIndex]['itemid'],
        'unit': itemObj[itemIndex]['bomunit'],
        'quantity': itemObj[itemIndex]['quantity'],
        'StageName': itemObj[itemIndex]['StageName'],
      });
      itemIndex++;
    }
    return this.returnItemObj;
  }

  selectEvent(item) {
   if(item.value !== undefined)
   {
    this.producttype = item.value;
    this.mainForm.get('batchorder').get('producttype').setValue(item.value);
    this.disableButton = false;
    //console.log(this.mainForm.get('batchorder').get('producttype').value);
   }
  }

}
