import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ArrayType } from '@angular/compiler';
import { SessionStorageService } from 'angular-web-storage';
import { BomMappingData } from '../../../../@core/data/bommapping';
import { DialogMappingAddedSuccessfullyComponent } from './../dialog-mapping-added-successfully/dialog-mapping-added-successfully.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dialog-add-bom-stage-mapping',
  templateUrl: './dialog-add-bom-stage-mapping.component.html',
  styleUrls: ['./dialog-add-bom-stage-mapping.component.scss']
})

export class DialogAddBomStageMappingComponent implements OnInit {
  @Input() selectedRowValue;
  mainForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  
  @Input() currentplant: string;
  plant: string;
  cpdbatchno: string;
  itemno: string;
  producttype: string;
  quantity: number;
  renderValue;
  itemNo: string;
  latexChecked: boolean;
  stabilizationChecked: boolean;
  compositeChecked: boolean;
  esdChecked: boolean;
  waxChecked: boolean;
  pigmentChecked: boolean;
  itemStageObj:any;
  allowMultipleMapping: boolean;

  bomstages = [
    {
      value: 1,
      name: 'Latex',
    },
    {
      value: 2,
      name: 'Stabilization',
    },
    {
      value: 3,
      name: 'Composite',
    },
    {
      value: 4,
      name: 'Wax',
    },
    {
      value: 5,
      name: 'Pigment',
    },
  ];

  defaultStage = 'Latex';

  constructor(protected ref: NbDialogRef<DialogAddBomStageMappingComponent>, 
              private fb: FormBuilder,
              private bomMappingService: BomMappingData,
              private sessionStorageService: SessionStorageService,
              private dialogService: NbDialogService,
              private router: Router,
              private toastrService: NbToastrService,
              ) {}

  ngOnInit() {
    this.plant = 'Plant ' + this.currentplant;
    
    this.renderValue = this.selectedRowValue;
    console.log(this.renderValue['itemGroup']);
    if(this.renderValue['itemGroup'].toUpperCase() === 'OTHER'){
      this.allowMultipleMapping = true;
    }
    else{
      this.allowMultipleMapping = false;
    }
    console.log(this.allowMultipleMapping);
    this.itemNo = this.renderValue.itemId;
    this.latexChecked         = this.renderValue.stageMapping['latex'];
    this.stabilizationChecked = this.renderValue.stageMapping['stabilization'];
    this.compositeChecked     = this.renderValue.stageMapping['composite'];
    this.esdChecked           = this.renderValue.stageMapping['esd'];
    this.waxChecked           = this.renderValue.stageMapping['aquawax'];
    this.pigmentChecked       = this.renderValue.stageMapping['pigment'];


    /*console.log(this.renderValue.stageMapping['latex']);
    console.log(this.renderValue.stageMapping['stabilization']);
    console.log(this.renderValue.stageMapping['composite']);
    console.log(this.renderValue.stageMapping['esd']);
    console.log(this.renderValue.stageMapping['aquawax']);
    console.log(this.renderValue.stageMapping['pigment']);*/

    //console.log(this.renderValue);
    /*this.mainForm = this.fb.group({
        items: this.fb.array([
          this.fb.group({
            ItemId: ['', [Validators.required]],
            ItemName: [this.renderValue.itemId, [Validators.required]],
            //StageId: ['', [Validators.required]],
            ItemGroup: [''],
            Unit:['', [Validators.required]],
          }),
        ]),
    });*/
  }

  cancel() {
    this.ref.close();
  }

  addMapping(stageName){
    switch(stageName){
      case('latex')         : { this.latexChecked = !this.latexChecked;
                                if(this.allowMultipleMapping === false){
                                  this.uncheckOtherMapping(stageName, this.latexChecked);
                                }
                                break; }
      case('stabilization') : { this.stabilizationChecked = !this.stabilizationChecked  ;
                                if(this.allowMultipleMapping === false){
                                  this.uncheckOtherMapping(stageName, this.stabilizationChecked);
                                } break; }
      case('composite')     : { this.compositeChecked = !this.compositeChecked          ;
                                if(this.allowMultipleMapping === false){
                                  this.uncheckOtherMapping(stageName, this.compositeChecked);
                                } break; }
      case('esd')           : { this.esdChecked = !this.esdChecked                      ;
                                if(this.allowMultipleMapping === false){
                                  this.uncheckOtherMapping(stageName, this.esdChecked);
                                } break; }
      case('wax')           : { this.waxChecked = !this.waxChecked                      ;
                                if(this.allowMultipleMapping === false){
                                  this.uncheckOtherMapping(stageName, this.waxChecked);
                                } break; }
      case('pigment')       : { this.pigmentChecked = !this.pigmentChecked              ;
                                if(this.allowMultipleMapping === false){
                                  this.uncheckOtherMapping(stageName, this.pigmentChecked);
                                } break; }
      default               : { break; } 
    };
    //console.log(this.itemNo,': ', stageName, ', current:', this.latexChecked);
  }

  addItemMapping(){
    console.log('true');
  }

  uncheckOtherMapping(stageName, currentCheckedStatus){
    this.latexChecked = false;
    this.stabilizationChecked = false;
    this.compositeChecked = false;      
    this.esdChecked = false;                    
    this.waxChecked = false;                    
    this.pigmentChecked = false;    
    switch(stageName){

      case('latex')         : { this.latexChecked = currentCheckedStatus                ; break; }
      case('stabilization') : { this.stabilizationChecked = currentCheckedStatus        ; break; }
      case('composite')     : { this.compositeChecked = currentCheckedStatus            ; break; }
      case('esd')           : { this.esdChecked = currentCheckedStatus                  ; break; }
      case('wax')           : { this.waxChecked = currentCheckedStatus                  ; break; }
      case('pigment')       : { this.pigmentChecked = currentCheckedStatus              ; break; }
    };
  }

  onSubmit() {
    //this.ref.close();
    //window.alert('BOM & Stage mapped successfully.');
    this.itemStageObj = {
      ItemId: this.itemNo,
      Lines: {
        Latex:          this.latexChecked,
        Stabilization:  this.stabilizationChecked,
        Composite:      this.compositeChecked,
        ESD:            this.esdChecked,
        Aquawax:        this.waxChecked,
        Pigment:        this.pigmentChecked,
      }
    }
    console.log(this.itemStageObj);
    this.bomMappingService.addItemMapping(this.itemStageObj).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {
      //console.log(response['responseCode']);
      if (response['responseCode'] === '200'){
        //window.alert("Mapping added successfully.");
        this.ref.close();

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/mastersetting/itemmastermapping'], { skipLocationChange: false }).then(() => {
            this.showToast('top-right', 'success', 'Mapping added successfully.');
          });
        });
      }
      else{
        window.alert("Maping between item and stage failed.");
      }
    });
    /*let MappedObject = this.mainForm.value.items[0];    
    this.bomMappingService.createBomMapping(MappedObject).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {
     // console.log(response['data']['result']);
      
      if (response['data']['id'] !== null){
        this.mainForm.value.clear;
        this.ref.close();
        let displaySuccessfulmessage = '';
        displaySuccessfulmessage = 'New \"BOM & Stages\" mapping added successfully.';
        window.alert(displaySuccessfulmessage);
        //window.location.reload();
        // this.router.navigate(['/pages/report']);
        // this.router.navigate(['/pages/mastersetting/itemmastermapping']);
      }
      else{
        let displaymessage = '';
        displaymessage = 'Please check the \"BOM & Stages\" mapping details again.';
        window.alert(displaymessage);
      }
    }); */

  }

  getControls(stage: string) {
    return (this.mainForm.get('items') as FormArray).controls;
  }

  getStageId(stage:string){
    switch(stage){
      case "Latex":         { return 1; break; }
      case "Stabilization": { return 2; break; }
      case "Composite":     { return 3; break; }
      case "Wax":           { return 4; break; }
      case "Pigment":       { return 5; break; }

      default:{return 0; break}
    }
  }

  checkBOMItemName(event): void{
    if(event.target.value === "SOFTWATER"){
      window.alert(event.target.value + " is a reserved word for \"Soft Water\"");
      //document.getElementById("BOMItemID").focus();
    }
    else if(event.target.value ==="SOFTWATER-FLUSHING"){
      window.alert(event.target.value + " is a reserved word for \"Soft Water (Flushing)\"");
      //document.getElementById("BOMItemID").focus();
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
