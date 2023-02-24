import { Component, OnInit, Input } from '@angular/core';
import { StringifyOptions } from 'querystring';
import { FormGroup, FormBuilder, FormArray, FormControl, Validators } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { EditBOMDetailsFormArray, CpdTrackingData } from '../../../../@core/data/cpdtracking';
import { Router } from '@angular/router';
import { BomMappingData } from '../../../../@core/data/bommapping';

@Component({
  selector: 'ngx-dialog-pigment-addition',
  templateUrl: './dialog-pigment-addition.component.html',
  styleUrls: ['./dialog-pigment-addition.component.scss']
})
export class DialogPigmentAdditionComponent implements OnInit {
  @Input() cpdBatchOrderDetails;
  @Input() cpdBatchOrderNo: string;
  cpdBatchOrderObj;
  cpdBatchNo: string;
  mainForm: FormGroup;
  dialogForm: FormGroup;
  formArrayBOM = new Array<any>();
  currentStage;
  mappedItems;
  stageNumber;
  hideMajorDialog: boolean ;
  hideStageItemDialog: boolean ;
  mappedBOMItemsForDialog;
  returnItemObj;
  selectedOption = '';
  rawValue;

  constructor(private fb: FormBuilder,
              protected ref: NbDialogRef<DialogPigmentAdditionComponent>,
              private cpdTrackingService: CpdTrackingData,
              private bomMappingService: BomMappingData,
              private router: Router,  ) { }

  ngOnInit() {
    this.hideMajorDialog = false;
    this.hideStageItemDialog = true;
    this.cpdBatchOrderObj = this.cpdBatchOrderDetails;
    this.cpdBatchNo = this.cpdBatchOrderNo;
    this.bomMappingService.getItems().subscribe(stageItemData => {
      if (stageItemData['responseCode'] === '200') {
        this.mappedItems = stageItemData['data'];
      }
    });
    
    this.mainForm = this.fb.group({
      /*pigment: this.fb.group({
        category: ['Pigment'],
        items: this.fb.array([
        ]),
      }),*/
      latex: this.fb.group({
        category: ['Stabilization'],
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
        category: ['ESD'],
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

    this.getPigmentBOM(1);
    this.getPigmentBOM(2);
    this.getPigmentBOM(3);
    this.getPigmentBOM(4);
    this.getPigmentBOM(5);
    this.getPigmentBOM(6);

    this.dialogForm = new FormGroup({
      StageItemId: new FormControl(''),
    });
  }

  getControls(stage) {
    return (this.mainForm.get(stage).get('items') as FormArray).controls;
  }

  onSubmit(){
    let pigmentResult = this.buildLineItemObj(this.mainForm.get('pigment').get('items').value, 'Pigment');
    pigmentResult = pigmentResult.concat(this.buildLineItemObj(this.mainForm.get('latex').get('items').value, 'Latex'));
    pigmentResult = pigmentResult.concat(this.buildLineItemObj(this.mainForm.get('stabilization').get('items').value, 'Stabilization'));
    pigmentResult = pigmentResult.concat(this.buildLineItemObj(this.mainForm.get('composite').get('items').value, 'Composite'));
    pigmentResult = pigmentResult.concat(this.buildLineItemObj(this.mainForm.get('esd').get('items').value, 'ESD'));
    pigmentResult = pigmentResult.concat(this.buildLineItemObj(this.mainForm.get('wax').get('items').value, 'Wax'));
    let pigmentObj;
    /*while (itemIndex < pigmentResult.length){
      pigmentItemLine.push({
        ItemId:          pigmentResult[itemIndex]['itemId'],
        ItemBatchNo:     pigmentResult[itemIndex]['itemBatchNo'],
        Value:           pigmentResult[itemIndex]['actualWeight'],
      });
      itemIndex++;
    }*/

    pigmentObj = {
      CPDBatchOrderNo: this.cpdBatchOrderNo,
      //StageName:       'Pigment',
      Lines: pigmentResult,
    };

    console.log('JSON:', pigmentObj);
    this.cpdTrackingService.addPigmentResult(pigmentObj)
    .subscribe(data => {
      if (data['responseCode'] === '200' && data['data']['result'] === 'Success') {
        window.alert('Pigment result added successfully.');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/home/cpdbatchordertracking']);
        });
      }
      else{
        window.alert('Pigment unable to be added. Please check again');
        //console.log(data);
      }
    });
  }

  cancel() {
    this.ref.close();
  }

  groupBOMItemsbyStage(arrayData, key){
    return arrayData.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }

  getPigmentBOM(stageID){
    let groupedBomGridData;
   // let stageName = 'Pigment';
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

    groupedBomGridData = this.groupBOMItemsbyStage(this.cpdBatchOrderObj['bomDetail'], 'category');
    let itemIndex = 0;
    let displayItemId;
    let isDisabled;
    if(typeof groupedBomGridData[stageName] !== 'undefined'){
      if(typeof groupedBomGridData[stageName].length !== 'undefined'){
        while(itemIndex < groupedBomGridData[stageName].length){
          let itemId = groupedBomGridData[stageName][itemIndex]['itemId'];
          //if(itemId.substr(itemId.length - 18) === "SOFTWATER-FLUSHING"){
          //  displayItemId = "SOFTWATER-FLUSHING";
          //}
          //else if(itemId.substr(itemId.length - 9) === "SOFTWATER"){
          //  displayItemId = "SOFTWATER";
          //}
          //else{
            displayItemId = groupedBomGridData[stageName][itemIndex]['itemId'];
          //}

          if(groupedBomGridData[stageName][itemIndex]['targetWeight'] !== null){
            isDisabled = true;
          }
          else{
            isDisabled = false;
          }
          this.formArrayBOM.push({
            itemId: groupedBomGridData[stageName][itemIndex]['itemId'],
            targetWeight: groupedBomGridData[stageName][itemIndex]['targetWeight'],
            actualWeight:groupedBomGridData[stageName][itemIndex]['actualWeight'],
            displayitemid: displayItemId,
            itemBatchNo: '',
            isDisabled: isDisabled,
          });
          this.initializeOriginalBOMinDialog(stageID,this.formArrayBOM);
          itemIndex++;
          this.formArrayBOM = [];
        }
      }
    }
    
  }

  initializeOriginalBOMinDialog(stageID:Number, dataArray){
    //let stageName = 'pigment';
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

    while(itemIndex < dataArray.length){
      //console.log(dataArray[itemIndex]['itemId'], dataArray[itemIndex]['isDisabled']);
      details.push(this.fb.group({
        itemId: dataArray[itemIndex]['itemId'],
        itemBatchNo: dataArray[itemIndex]['itemBatchNo'],
        targetWeight: dataArray[itemIndex]['targetWeight'].toFixed(4),
        actualWeight: dataArray[itemIndex]['actualWeight'].toFixed(4),
        addonWeight: 0,
        displayItemId: dataArray[itemIndex]['displayitemid'],
        //displayItemId: [{value: dataArray[itemIndex]['displayitemid'], disabled: dataArray[itemIndex]['isDisabled']}],
        isDisabled: dataArray[itemIndex]['isDisabled'],
      }));
      itemIndex++;
    }

    const formControlItem = this.mainForm.controls[stageName].get('items') as FormArray;

    for (let i = 0; i < formControlItem.length; i++)
    {
      const formControlTargetWeight = formControlItem.controls[i] as FormArray;
      // formControlTargetWeight.controls['targetWeight'].disable();
      // formControlTargetWeight.controls['actualWeight'].disable();
    }
   
    //console.log(this.mainForm.get('stabilization').get('items').controls[0].value.get('targetWeight'));
    //this.mainForm.get('batchorder').get('plant').disable();
  }

  addLatex(){ 
    console.log("Clicked add Latex");
    this.currentStage = "Latex";
    this.populateItem(this.mappedItems, 'latex');
    this.stageNumber = 1;
    this.hideMajorDialog = true;
    this.hideStageItemDialog = false; 
  }

  addStabilization(){ 
    //console.log(this.mainForm.getRawValue()['stabilization']['items'][0]['targetWeight']);//['stabilization']['items'][0]['targetWeight']);
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
  }

  removeLatexItem(index: number): void{
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
    const items = this.mainForm.get('composite').get('items') as FormArray;
    items.removeAt(index);
  }

  removeESDItem(index: number): void{
    const items = this.mainForm.get('esd').get('items') as FormArray;
    items.removeAt(index);
  }

  removeWaxItem(index: number): void{
    const items = this.mainForm.get('wax').get('items') as FormArray;
    items.removeAt(index);
  }

  removePigmentItem(index: number): void{
    const items = this.mainForm.get('pigment').get('items') as FormArray;
    items.removeAt(index);
  }

  populateItem(allBOMItemList, stageName){
    let itemIndex = 0;
    let displayItemId;
    let stageNameString;
    this.mappedBOMItemsForDialog = new Array();
    if (stageName === 'aquawax'){
      stageNameString = 'wax';
    }
    else{
      stageNameString = stageName;
    }

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
            'disableDelete': false,
            'actualWeight': 0,
            'targetWeight':0
            //'actualWeight': 100,
          }
        );
      }
      itemIndex++;
    }
  }

  addStageItem(){
    this.mappedBOMItemsForDialog = null;
    this.hideMajorDialog = false;
    this.hideStageItemDialog = true;
    //console.log(this.dialogForm.value);
    let selectedItem = this.dialogForm.get('StageItemId').value;
    this.populateNewRowInBOM(this.stageNumber, selectedItem);
  }

  cancelStageItem(){
    //this.dialogForm.reset();
    this.hideMajorDialog = false;
    this.hideStageItemDialog = true;
  }

  populateNewRowInBOM(stageID: number, itemIdSelected){
    let stageName = '';
    let targetWeight;
    let actualWeight;
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
    
    let indexCount = 0;
    while(indexCount < this.mainForm.get(stageName).get('items').value.length){
      let currentItemId = this.mainForm.get(stageName).get('items').value[indexCount].itemId;
      //console.log(currentItemId);
      if(currentItemId === itemIdSelected['itemId']){
        //console.log('same', this.mainForm.get(stageName).get('items'));
        this.rawValue = this.mainForm.getRawValue();
        //console.log('same', rawValue[stageName]['items'][indexCount]['targetWeight']);
        targetWeight = 0;
        actualWeight = 0;
        //console.log(targetWeight);
      }

      indexCount++
    }
    details.push(this.fb.group({
        itemId: itemIdSelected['itemId'],
        bomunit: itemIdSelected['unit'],
        quantity: ['', [Validators.required]],
        displayItemId: itemIdSelected['displayItemId'],
        StageName:  itemIdSelected['StageName'],
        //itemname: ['Item Name selected'],
        itemBatchNo: ['', [Validators.required]],
        targetWeight: [targetWeight, [Validators.required]],
        actualWeight: [actualWeight,[Validators.required]],
        addonWeight: ['', [Validators.required]],
        disableDelete: itemIdSelected['disableDelete'],
    }));

    this.dialogForm = new FormGroup({
      StageItemId: new FormControl(''),
    });
  }

  buildLineItemObj(itemObj, stageName){
    this.returnItemObj =[];
    let itemIndex = 0;
    console.log(itemObj);
    while(itemIndex < itemObj.length){
      if(itemObj[itemIndex]['addonWeight'] !== null){
        this.returnItemObj.push({
          ItemId:       itemObj[itemIndex]['itemId'],
          ItemBatchNo:  itemObj[itemIndex]['itemBatchNo'],
          Value:        itemObj[itemIndex]['addonWeight'],
          TargetValue:  itemObj[itemIndex]['targetWeight'],
          StageName:    stageName,
        });
      }
      itemIndex++;
    }
    return this.returnItemObj;
  }
}
