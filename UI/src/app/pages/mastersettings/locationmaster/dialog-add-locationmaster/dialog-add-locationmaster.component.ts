import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { LocationMasterData } from '../../../../@core/data/locationmaster';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dialog-add-locationmaster',
  templateUrl: './dialog-add-locationmaster.component.html',
  styleUrls: ['./dialog-add-locationmaster.component.scss']
})
export class DialogAddLocationMasterComponent implements OnInit {
  mainForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  defaultChecked: boolean;
  defaultSelected;

  constructor(protected ref: NbDialogRef<DialogAddLocationMasterComponent>, 
              private fb: FormBuilder,
              private LocationMasterService:LocationMasterData,
              private router: Router,
              private toastrService: NbToastrService,
              ) { }

  ngOnInit() {
    this.mainForm = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          Type: ['', [Validators.required]],
          LocationName: ['', [Validators.required]],
        }),
      ]),
    });
    this.defaultChecked = true;
  }

  typeList = [
    {
      value: 2,
      name: 'Warehouse',
    }
  ];

  onSubmit(){      
    let MappedObject = {
      LocationType: this.mainForm.value.items[0]['Type'],
      LocationName: this.mainForm.value.items[0]['LocationName'].toUpperCase(),
    };    
    console.log(MappedObject);
    this.LocationMasterService.createLocationMaster(MappedObject).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {      
      if (response['responseCode'] == 200 && response['data']['locationId'] !== null ){
        this.mainForm.value.clear;
        this.ref.close();
        let displaySuccessfulmessage = '';
        displaySuccessfulmessage = 'New \"Location\" added successfully.';

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/mastersetting/locationmaster'], { skipLocationChange: false }).then(() => {
            this.showToast('top-right', 'success', displaySuccessfulmessage);
          });
        });
      }
      else{
        let displaymessage = '';
        displaymessage = 'Please check the \"Location\" details again.';
        this.showToast('top-right', 'danger', displaymessage);
      }
    });     
  }

  cancel() {
    this.ref.close();
  }

  getControls(stage: string) {
    return (this.mainForm.get('items') as FormArray).controls;
  }

  enableOption(){
    this.defaultChecked = !this.defaultChecked;
  }

  onTypeSelected(event){
    this.mainForm = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          Type: [this.mainForm.value.items[0]['Type'], [Validators.required]],
          LocationName: [this.mainForm.value.items[0]['LocationName'], [Validators.required]],
        }),
      ]),
    }); 
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
