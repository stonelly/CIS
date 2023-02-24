import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { StationMasterData } from '../../../../@core/data/stationmaster';
import { LocationMasterData } from '../../../../@core/data/locationmaster';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dialog-add-stationmaster',
  templateUrl: './dialog-add-stationmaster.component.html',
  styleUrls: ['./dialog-add-stationmaster.component.scss']
})
export class DialogAddStationMasterComponent implements OnInit {
  mainForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  defaultChecked: boolean;
  disableOption: boolean;
  locationList;
  mappedTankOptions;
  defaultSelected;

  constructor(protected ref: NbDialogRef<DialogAddStationMasterComponent>, 
              private fb: FormBuilder,
              private stationMasterService:StationMasterData,
              private locationMasterService:LocationMasterData,
              private router: Router,
              private toastrService: NbToastrService,
              ) { }

  ngOnInit() {
    this.mainForm = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          LocationId: ['', [Validators.required]],
          StationName: ['', [Validators.required]],
        }),
      ]),
    });
    this.mappedTankOptions = '';
    this.locationList = [];
    this.defaultChecked = true;
    this.disableOption = false;

    this.locationMasterService.getItems().subscribe(data => {
      if (data['responseCode'] === '200') {
        this.locationList = data['data'];
        console.log(this.locationList);
      }
    });

  }


  onSubmit(){      
    let MappedObject = {
      LocationId: this.mainForm.value.items[0]['LocationId'],
      StationName: this.mainForm.value.items[0]['StationName'].toUpperCase(),
    };    
    console.log(MappedObject);
    this.stationMasterService.createStationMaster(MappedObject).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {      
      if (response['responseCode'] == 200 && response['data']['stationId'] !== null ){
        this.mainForm.value.clear;
        this.ref.close();
        let displaySuccessfulmessage = '';
        displaySuccessfulmessage = 'New \"Station\" added successfully.';

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/mastersetting/stationmaster'], { skipLocationChange: false }).then(() => {
            this.showToast('top-right', 'success', displaySuccessfulmessage);
          });
        });
      }
      else{
        let displaymessage = '';
        displaymessage = 'Please check the \"Station\" details again.';
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

  onLocationSelected(event){
    this.mainForm = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          LocationId: [this.mainForm.value.items[0]['LocationId'], [Validators.required]],
          StationName: [this.mainForm.value.items[0]['StationName'], [Validators.required]],
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
