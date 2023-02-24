import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ArrayType } from '@angular/compiler';
import { SessionStorageService } from 'angular-web-storage';
import { BomMappingData } from '../../../../@core/data/bommapping';
// import { DialogMappingAddedSuccessfullyComponent } from './../dialog-mapping-added-successfully/dialog-mapping-added-successfully.component';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';
import { sfwRatioMapping } from '../../../../@core/data/sfwRatioMapping';

@Component({
  selector: 'ngx-dialog-edit-existing-item',
  templateUrl: './dialog-edit-existing-item.component.html',
  styleUrls: ['./dialog-edit-existing-item.component.scss']
})
export class DialogEditExistingCustomItemComponent implements OnInit {
  mainForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();

  @Input() itemList;
  @Input() selectedRowValue: object;
  itemId: string;
  plant: string;
  cpdbatchno: string;
  itemno: string;
  producttype: string;
  quantity: number;
  keyword = 'name';

  constructor(protected ref: NbDialogRef<DialogEditExistingCustomItemComponent>,
              private fb: FormBuilder,
              private customSWRatioService: sfwRatioMapping,
              private sessionStorageService: SessionStorageService,
              private dialogService: NbDialogService,
              private router: Router,
              private toastrService: NbToastrService,
              ) {}

  ngOnInit() {
    this.itemId = this.selectedRowValue['itemId'];
    this.mainForm = this.fb.group({
            ItemId    : [this.selectedRowValue['itemId'], [Validators.required]],
            ItemName  : [this.selectedRowValue['itemName'], [Validators.required]],
            Stabilization: [this.selectedRowValue['stabilization'], [Validators.required]],
            Composite: [this.selectedRowValue['composite'], [Validators.required]],
            ESD: [this.selectedRowValue['esd'], [Validators.required]],
            Wax:[this.selectedRowValue['wax'], [Validators.required]],
    });
  }

  selectEvent(item) {

    if(item.value !== undefined)
    {
      this.itemId = item.value;
      this.mainForm.get('ItemId').setValue(item.value);
    }
   }

  cancel() {
    this.ref.close();
  }

  onSubmit() {
    let MappedObject = this.mainForm.value;

    this.customSWRatioService.editCustomRatio(MappedObject).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {
     // console.log(response['data']['result']);

      //if (response['data']['id'] !== null){
      if (response['responseCode'] === '200'){
        this.mainForm.value.clear;
        this.ref.close();
        let displaySuccessfulmessage = '';
        displaySuccessfulmessage = 'Item Edit successfully.';

        window.alert(displaySuccessfulmessage);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/mastersetting/customratiosfw']);
        });
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
