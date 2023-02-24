import { Component, OnInit } from '@angular/core';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { PlantTankMappingData } from '../../../../@core/data/planttankmapping';
import { PlantTankMappingService } from '../../../../@core/mock/planttankmapping.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dialog-add-planttankmapping',
  templateUrl: './dialog-add-planttankmapping.component.html',
  styleUrls: ['./dialog-add-planttankmapping.component.scss']
})
export class DialogAddPlanttankmappingComponent implements OnInit {
  mainForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  defaultChecked: boolean;
  disableOption: boolean;
  groupedTanks;
  mappedTankOptions;
  defaultSelected;

  constructor(protected ref: NbDialogRef<DialogAddPlanttankmappingComponent>, 
              private fb: FormBuilder,
              private plantTankMappingService:PlantTankMappingData,
              private router: Router,
              private toastrService: NbToastrService,
              ) { }

  ngOnInit() {
    this.mainForm = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          Plant: ['', [Validators.required]],
          MixingTankNo: ['', [Validators.required]],
          mappedTank: [''],
        }),
      ]),
    });
    this.mappedTankOptions = '';
    this.defaultChecked = true;
    this.disableOption = false;
    this.mainForm.controls['items']['controls'][0]['controls']['mappedTank'].disable();

    this.plantTankMappingService.getItems().subscribe(data => {
      if (data['responseCode'] === '200') {
        this.groupedTanks = this.groupTankbyPlant(data['data'], "plant");
      }
    });
  }

  plantList = [
    {
      value: 1,
      name: 'P1',
    },
    {
      value: 2,
      name: 'P2',
    },
    {
      value: 3,
      name: 'P3',
    },
    {
      value: 4,
      name: 'P4',
    },
    {
      value: 5,
      name: 'P5',
    },
    {
      value: 6,
      name: 'P6',
    },
  ];

  onSubmit(){
    //let MappedObject = this.mainForm.value.items[0];
    let mappedTank = '';

    //check if option for mappedTank is selected 
    if(this.defaultChecked === false && !this.mainForm.value.items[0]['mappedTank']){
      this.showToast('top-right', 'danger', "Please map \"Tank "+ this.mainForm.value.items[0]['MixingTankNo'] + "\" to its \"Tank C\"");
    }
    else{
      if(typeof(this.mainForm.value.items[0]['mappedTank']) !== undefined){
        mappedTank = this.mainForm.value.items[0]['mappedTank'];
      }    
      let MappedObject = {
        Plant       : this.mainForm.value.items[0]['Plant'],
        MixingTankNo: this.mainForm.value.items[0]['MixingTankNo'].toUpperCase(),
        isMixingTank: true,//!this.defaultChecked,
        mappedTank	: '',//mappedTank,
      };    
      //console.log(MappedObject);
      this.plantTankMappingService.createPlantTankMapping(MappedObject).pipe(
        takeUntil(this.destroy$),
      ).subscribe(response => {      
        if (response['responseCode'] == 200 && response['data']['mixingTankId'] !== null ){
          this.mainForm.value.clear;
          this.ref.close();
          let displaySuccessfulmessage = '';
          displaySuccessfulmessage = 'New \"Plant & Tank\" mapping added successfully.';

          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['pages/mastersetting/planttankmapping'], { skipLocationChange: false }).then(() => {
              this.showToast('top-right', 'success', displaySuccessfulmessage);
            });
          });
        }
        else{
          let displaymessage = '';
          displaymessage = 'Please check the \"Plant & Tank\" mapping details again.';
          this.showToast('top-right', 'danger', displaymessage);
        }
      }); 
    }
  }

  cancel() {
    this.ref.close();
  }

  getControls(stage: string) {
    return (this.mainForm.get('items') as FormArray).controls;
  }

  enableOption(){
    this.defaultChecked = !this.defaultChecked;
    this.disableOption = !this.disableOption;
    if (this.disableOption == false){
      this.mainForm.controls['items']['controls'][0]['controls']['mappedTank'].enable();
    }
    else{
      this.mainForm.controls['items']['controls'][0]['controls']['mappedTank'].disable();
    }
  }

  onPlantSelected(event){
    this.mainForm = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          Plant: [this.mainForm.value.items[0]['Plant'], [Validators.required]],
          MixingTankNo: [this.mainForm.value.items[0]['MixingTankNo'], [Validators.required]],
          mappedTank: [''],
        }),
      ]),
    });
    let strPlant = 'P' + this.mainForm.value.items[0]['Plant'];
    this.mappedTankOptions = this.groupedTanks[strPlant];
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status }
    );
  }

  groupTankbyPlant(arrayData, key){
    return arrayData.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  }
}
