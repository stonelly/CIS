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
  selector: 'ngx-dialog-edit-existing-item',
  templateUrl: './dialog-edit-existing-item.component.html',
  styleUrls: ['./dialog-edit-existing-item.component.scss']
})
export class DialogEditExistingItemComponent implements OnInit {
  mainForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  
  @Input() currentplant: string;
  @Input() selectedRowValue: object;
  itemId: string;
  plant: string;
  cpdbatchno: string;
  itemno: string;
  producttype: string;
  quantity: number;

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

  itemTypes = [
    {
      value: 0,
      name: 'Chemical',
    },
    {
      value: 1,
      name: 'Soft Water Mix',
    },
    {
      value: 2,
      name: 'Soft Water Flushing',
    },
    {
      value: 3,
      name: 'Latex',
    },
    {
      value: 4,
      name: 'Pigment',
    },
    {
      value: 5,
      name: 'Filler',
    },
  ];

  itemGroups = [
    {
      value: 'CPD',
      name: 'CPD',
    },
    {
      value: 'IDC',
      name: 'IDC',
    },
    {
      value: 'DC',
      name: 'DC',
    },
    {
      value: 'LTX',
      name: 'LTX',
    },
    {
      value: 'NLTX',
      name: 'NLTX',
    },
    {
      value: 'SLTX',
      name: 'SLTX',
    },
    {
      value: 'OTHER',
      name: 'OTHER',
    },
  ];

  defaultStage = 'Latex';

  constructor(protected ref: NbDialogRef<DialogEditExistingItemComponent>, 
              private fb: FormBuilder,
              private bomMappingService: BomMappingData,
              private sessionStorageService: SessionStorageService,
              private dialogService: NbDialogService,
              private router: Router,
              private toastrService: NbToastrService,
              ) {}

  ngOnInit() {
    this.plant = 'Plant ' + this.currentplant;
    this.itemId = this.selectedRowValue['itemId'];
    console.log('item type:', Number(this.selectedRowValue['itemType']));
    console.log('item group:', this.selectedRowValue['itemGroup']);
    console.log(this.itemTypes[0]['value']==Number(this.selectedRowValue['itemType']));
    this.mainForm = this.fb.group({
            ItemId    : [this.selectedRowValue['itemId'], [Validators.required]],
            ItemName  : [this.selectedRowValue['itemName'], [Validators.required]],
            ItemType  : [Number(this.selectedRowValue['itemType']), [Validators.required]],
            //StageId : ['', [Validators.required]],
            ItemGroup : [this.selectedRowValue['itemGroup']],
            //PHR:['', [Validators.required]],
            Unit      :[this.selectedRowValue['unit'], [Validators.required]],
            //TSC:['',[Validators.required, Validators.pattern(/^([0-9]*\.)?\d+$/)]],
    });
  }

  cancel() {
    this.ref.close();
  }

  onSubmit() {
    let MappedObject = this.mainForm.value;    
    //console.log(this.mainForm.value.items[0]['TSC']);
    //this.mainForm.value.items[0]['TSC'] += '%';
    //console.log(this.mainForm.value);

    this.bomMappingService.editBomItem(MappedObject).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {
     // console.log(response['data']['result']);
      
      //if (response['data']['id'] !== null){
      if (response['responseCode'] === '200'){
        this.mainForm.value.clear;
        this.ref.close();
        let displaySuccessfulmessage = '';
        displaySuccessfulmessage = 'New item added successfully.';
        
        window.alert(displaySuccessfulmessage);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/mastersetting/itemmastermapping']);
        });
        // this.router.navigate(['/pages/report']);
        // this.router.navigate(['/pages/mastersettings/itemmastermapping']);
      }
      else{
        let displaymessage = '';
        displaymessage = 'Please check the item details again.';
        //window.alert(displaymessage);
        this.showToast('top-right', 'danger', displaymessage);
      }
    }); 

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
      { position, status }
    );
  }
}
