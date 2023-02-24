import { Component, Input, OnInit, ErrorHandler } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators, FormArray, FormControl } from '@angular/forms';
import { DialogAddStageItemComponent } from './../dialog-add-stage-item/dialog-add-stage-item.component';
import { SessionStorageService } from 'angular-web-storage';
import { mappedItems } from './../../../../@core/data/bommapping';
import { CPDBatchOrderData } from './../../../../@core/data/cpdbatchorder';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-dialog-addbom',
  templateUrl: './dialog-addbom.component.html',
  styleUrls: ['./dialog-addbom.component.scss'],
  /*styles:[`
    :host {
      max-height: 10vh;
    }
  `],*/
})

export class DialogAddBomComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  mainForm: FormGroup;
  dialogForm: FormGroup;
  @Input() currentplant: string;
  @Input() currentStage: string;
  @Input() mappedItems;
  @Input() mappedMixingTank;
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
  returnItemObj =[];
  cpdItemObj = [];

  itemNumber = [];
  currentDateTime;
  keyword = 'name';

  constructor(  protected ref: NbDialogRef<DialogAddBomComponent>,
                private fb: FormBuilder,
                private dialogService: NbDialogService,
                private sessionStorageService: SessionStorageService,
                private cpdBatchOrderService: CPDBatchOrderData,
                private toastrService: NbToastrService,
                private router: Router,) {}

  ngOnInit() {
    console.log(this.productTypeList);
    this.hideMajorDialog = false;
    this.hideStageItemDialog = true;
    this.plant = 'P' + this.currentplant;
    this.currentDateTime = new DatePipe('en-MY').transform(new Date, 'dd/MM/yyyy HH:mm:ss');
    this.mixingTankList = this.getCTank(this.mappedMixingTank[this.plant]);//this.mappedMixingTank[this.plant];
    //console.log(this.mixingTankList);
    //console.log(this.mappedItems);
    this.dialogForm = new FormGroup({
      StageItemId: new FormControl(''),
    });
    let itemIndex = 0;
    while(itemIndex < this.mappedItems.length){
      //console.log(this.mappedItems[itemIndex]['itemGroup']);
      if(this.mappedItems[itemIndex]['itemGroup'] === 'CPD'){
        this.itemNumber.push({
          name: this.mappedItems[itemIndex]['itemId'] ,
          value: this.mappedItems[itemIndex]['itemId'] ,
        });
      }
      itemIndex++;
    }
    //console.log(this.currentDateTime);
    this.mainForm = this.fb.group({
      batchorder: this.fb.group({
        plant: [this.plant],
        cpdbatchno: [''],//, [Validators.required]],
        itemno: [''],//, [Validators.required]],
        producttype: [''],//, [Validators.required]],
        mixingtank: [],//[Validators.required]],
        quantity: [''],//, [Validators.required]],
        scheduledstartdatetime: [this.currentDateTime],//, [Validators.required]],
        scheduledenddatetime: [''],//, [Validators.required]],
      }),

      latex: this.fb.group({
        category: ['Latex'],
        items: this.fb.array([]),
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

    this.mainForm.get('batchorder').get('plant').disable();
  }

  cancel() {
    //console.log(this.mainForm.value);
    this.ref.close();
  }

  getCTank(tankList): Object{
    //let currentTankList = tankList;
    let tankAvailableList = [];
    let indexCount = 0;

    while(indexCount < tankList.length){
      if(tankList[indexCount]['mixingTankNo'].includes('C')){
        tankAvailableList.push({
          mixingTankId: tankList[indexCount]['mixingTankId'],
          mixingTankNo: tankList[indexCount]['mixingTankNo'],
          plant       : tankList[indexCount]['plant'],
        });
      }
      indexCount++;
    }
    return tankAvailableList;
  }

  onSubmit() {
    if(this.mainForm.get('latex').get('items').value.length===0){
      this.showToast('top-right', 'danger', 'Latex Item cannot be empty');
    }
    if(this.mainForm.get('stabilization').get('items').value.length===0){
      this.showToast('top-right', 'danger', 'Stabilization Item cannot be empty');
    }
    if(this.mainForm.get('composite').get('items').value.length===0){
      this.showToast('top-right', 'danger', 'Composite Item cannot be empty');
    }
    if(this.mainForm.get('wax').get('items').value.length===0){
      this.showToast('top-right', 'danger', 'Wax Item cannot be empty');
    }
    if(this.mainForm.get('pigment').get('items').value.length===0){
      this.showToast('top-right', 'danger', 'Pigment Item cannot be empty');
    }
    /*else if(this.mainForm.get('stabilization').get('items').value.length===0){

    }*/
    //this.mainForm.get('batchorder').get('plant').enable();
    else{
      let lineObj = this.buildLineItemObj(this.mainForm.get('latex').get('items').value);
      lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('stabilization').get('items').value));
      lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('composite').get('items').value));
      lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('esd').get('items').value));
      lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('wax').get('items').value));
      lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('pigment').get('items').value));
      //console.log(lineObj);

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
      //console.log(this.mainForm.get('wax').get('items').value);

      this.cpdBatchOrderService.AddBatchOrder(batchOrderDetailsObj).pipe(
        takeUntil(this.destroy$),
        catchError(this.handleError),
      ).subscribe( response => {
        if (response['responseCode'] === '200') {
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['pages/home/cpdbatchorderlist'], { skipLocationChange: false }).then(() => {
              this.showToast('top-right', 'success', 'CPD Batch Order added successfully.');
            });
          });

          this.ref.close();

        }
        else{
        this.showToast('top-right', 'danger', 'Kindly check your CPD Batch details and edit again.');
        }
      });
    }
 }

  getControls(stage: string) {
    return (this.mainForm.get(stage).get('items') as FormArray).controls;
  }

  addLatex(){
    this.currentStage = "Latex";
    //this.populateItem(this.mappedItems, 1);
    this.populateItem(this.mappedItems, 'latex');
    //this.populateItembyStageName(this.mappedItems, 'latex');
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
    //this.openAddStageItemDialog("esd");
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
  }

  removeStabilizationItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('stabilization').get('items') as FormArray;
    items.removeAt(index);
  }

  removeCompositeItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('composite').get('items') as FormArray;
    items.removeAt(index);
  }

  removeESDItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('esd').get('items') as FormArray;
    items.removeAt(index);
  }

  removeWaxItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('wax').get('items') as FormArray;
    items.removeAt(index);
  }

  removePigmentItem(index: number): void{
    //console.log(currentValue);
    //console.log('itemdid' + value.get('itemid').value);
    //console.log(currentValue.parentNode.parentNode.rowIndex);
    const items = this.mainForm.get('pigment').get('items') as FormArray;
    items.removeAt(index);
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
    this.mappedBOMItemsForDialog = new Array<mappedItems>();
    //console.log(allBOMItemList);
    //console.log(allBOMItemList[itemIndex]['stageMapping'][stageName]);

    while(itemIndex < allBOMItemList.length){
      //if(allBOMItemList[itemIndex]['stageId'] === stageId){
      if(allBOMItemList[itemIndex]['stageMapping'][stageName] === true){
        //console.log('true');
        let itemId = allBOMItemList[itemIndex]['itemId'];
        displayItemId = allBOMItemList[itemIndex]['itemId'];
        /*if(itemId.substr(itemId.length - 18) === "SOFTWATER-FLUSHING"){
          displayItemId = "SOFTWATER-FLUSHING";
        }
        else if(itemId.substr(itemId.length - 9) === "SOFTWATER"){
          displayItemId = "SOFTWATER";
        }*/
        /*else{
          displayItemId = allBOMItemList[itemIndex]['itemId'];
        }*/

        this.mappedBOMItemsForDialog.push(
          {
            'itemId': allBOMItemList[itemIndex]['itemId'],
            'itemName': allBOMItemList[itemIndex]['itemName'],
            'unit': allBOMItemList[itemIndex]['unit'],
            'displayItemId': displayItemId,
            'StageName': stageName,
          }
        );
      }

      if(stageName === 'composite'){
        if(allBOMItemList[itemIndex]['itemGroup'] === 'CPD'){
          //console.log(allBOMItemList[itemIndex]['itemId'], '|' ,allBOMItemList[itemIndex]['itemName']);

          this.mappedBOMItemsForDialog.push(
            {
              'itemId': allBOMItemList[itemIndex]['itemId'],
              'itemName': allBOMItemList[itemIndex]['itemName'],
              'unit': allBOMItemList[itemIndex]['unit'],
              'displayItemId': allBOMItemList[itemIndex]['itemId'],
              'StageName': stageName,
          });
          //console.log(this.mappedBOMItemsForDialog);
        }
      }
      itemIndex++;
    }
    this.mappedBOMItemsForDialog.sort((a, b) => a['itemId'].localeCompare(b['itemId']));
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
        StageName: stageName,
       // PHR: ['', [Validators.required]],
       // TSC: ['', [Validators.required]],
        //itemname: ['Item Name selected'],
        //itembatchno: ['', [Validators.required]],
        //targetweight: ['', [Validators.required]],
        //actualweight: ['', [Validators.required]],
    }));
    this.dialogForm = new FormGroup({
      StageItemId: new FormControl(''),
    });
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }

  handleError(error) {

    console.log(error);
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Please check and update your CPD Batch information.`;
    }
    window.alert(error);
    return throwError(errorMessage);
 }

  buildLineItemObj(itemObj){
    this.returnItemObj =[];
    let itemIndex = 0;
    while(itemIndex < itemObj.length){
      this.returnItemObj.push({
        'itemId': itemObj[itemIndex]['itemid'],
        'unit': itemObj[itemIndex]['bomunit'],
        'quantity': itemObj[itemIndex]['quantity'],
        'StageName': itemObj[itemIndex]['StageName'],
        'PHR': 0, //itemObj[itemIndex]['PHR'],
        'TSC': 0, //itemObj[itemIndex]['TSC'],
      });
      itemIndex++;
    }
    //console.log(this.returnItemObj);
    return this.returnItemObj;
  }

  selectEvent(item) {
    if(item.value !== undefined)
    {
      this.producttype = item.value;
      this.mainForm.get('batchorder').get('producttype').setValue(item.value);
    }
   }

}
