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
  selector: 'ngx-dialog-add-custom-ratio',
  templateUrl: './dialog-add-custom-ratio.component.html',
  styleUrls: ['./dialog-add-custom-ratio.component.scss']
})

export class DialogAddCustomRatioMappingComponent implements OnInit {
  mainForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  @Input() itemList;

  customRatioObj:any;
  itemId: string;
  stabilization: number;
  composite: number;
  esd: number;
  wax: number;
  keyword = 'name';

  constructor(protected ref: NbDialogRef<DialogAddCustomRatioMappingComponent>,
              private fb: FormBuilder,
              private customSWRatioService: sfwRatioMapping,
              private dialogService: NbDialogService,
              private router: Router,
              private toastrService: NbToastrService,
              ) {}

  ngOnInit() {
    console.log(this.itemList);
    this.mainForm = this.fb.group({
      ItemId: ['', [Validators.required]],
      Stabilization: ['', [Validators.required]],
      Composite: ['', [Validators.required]],
      ESD: ['', [Validators.required]],
      Wax:['', [Validators.required]],
    });
  }

  cancel() {
    this.ref.close();
  }

  selectEvent(item) {
    console.log(item.value);
    if(item.value !== undefined)
    {
      this.itemId = item.value;
      this.mainForm.get('ItemId').setValue(item.value);
    }
   }

  onSubmit() {
    let MappedObject = this.mainForm.value;

    const batchOrderDetailsObj = {
      ItemId: MappedObject["ItemId"].value,
      Stabilization: MappedObject["Stabilization"],
      Composite:MappedObject["Composite"],
      ESD: MappedObject["ESD"],
      Wax:MappedObject["Wax"],
    };

    this.customSWRatioService.createCustomRatio(batchOrderDetailsObj).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {

      if (response['responseCode'] === '200'){
        this.mainForm.value.clear;
        this.ref.close();
        let displaySuccessfulmessage = '';
        displaySuccessfulmessage = 'Custom Ratio added successfully.';
        window.alert(displaySuccessfulmessage);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/mastersetting/customratiosfw']);
        });
      }
      else{
        let displaymessage = '';
        displaymessage = 'Please check the details again.';
        window.alert(displaymessage);
      }
    });
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }
}
