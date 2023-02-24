import { FormBuilder, Validators, FormControl, FormGroup } from '@angular/forms';
import { Component, NgModule, OnInit, Input } from '@angular/core';
import { takeWhile, flatMap } from 'rxjs/operators';
import { BatchListData } from '../../../../@core/data/batchlist';
import { CpdTrackingData } from '../../../../@core/data/cpdtracking';
import { NbDialogRef } from '@nebular/theme';
import { SessionStorageService } from 'angular-web-storage';
import { RouterModule, Router } from '@angular/router';
//import { QAVerificationListData } from "../../../../../@core/data/qaVerificationlist";


@Component({
  selector: 'ngx-ph-adjustment-component',
  templateUrl: './ph-adjustment-component.component.html',
  styleUrls: ['./ph-adjustment-component.component.scss']
})

export class phAdjustmentComponent implements OnInit {

  // Properties
  @Input() selectedCPDBatch;
  @Input() currentStage;
  //@Input() qaProcessList: any;
  phAdjustmentForm: FormGroup;
  alive = true;
  selectedPlant;
  productType;
  ItemId;

  // enums
  Outcomes = [
    {
      status: 'Pass',
      value: '1',
    },
    {
      status: 'Fail',
      value: '2',
    },
  ];

  // constructor
  constructor(protected ref: NbDialogRef<phAdjustmentComponent>,
              //private service: QAVerificationListData, 
              private batchService: BatchListData,
              private cpdTrackingService: CpdTrackingData,
              private fb: FormBuilder,
              private sessionStorageService: SessionStorageService,
              private router: Router,
              ) {

  }

  ngOnInit() {
    const date = this.getDate();
    //const date = new Date().getTime();
    console.log('date here: ', date);
    /*this.cpdTrackingService.getItems(this.selectedCPDBatch.batchNo).subscribe(data => {

      if (data['responseCode'] === '200') {

      }
    });*/

    //console.log(this.selectedCPDBatch);

    this.phAdjustmentForm = this.fb.group({
      Plant: [''],
      ProcessStage: [''],
      TestedOn: [date, Validators.required],
      BatchNo: [this.selectedCPDBatch.batchNo],
      UserId:[''],
      ItemCode: [''],
      ProductType: [''],
      ACMSStage: [this.selectedCPDBatch.stageName],
      Oven: [''],
      Weighing_Scale: [''],
      phMeter: [this.selectedCPDBatch.pH_Meter, Validators.required],
      Mixing_Tank: [this.selectedCPDBatch.mixingTankNo],
      Remarks: [''],
      Thickness_GaugeNo: [''],
      SpectrophotometerNo: [''],
      TSC_Spec: [''],
      TSC_Final: [''],
      TSC_TestedBy: [''],
      TSC_Status: [''],
      TSC_Details_In: this.fb.group({
        OvenTime: [''],
        Sample_Name: [''],
        A: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        B: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        C: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        Percentage: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
      }),
      TSC_Details_Out: this.fb.group({
        OvenTime: [''],
        Sample_Name: [''],
        A: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        B: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        C: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        Percentage: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
      }),
      CG_Final: [''],
      CG_Status: [''],
      CG_Details_In: this.fb.group({
        OvenTime: [''],
        Sample_Name: [''],
        A: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        B: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        C: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        Percentage: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
      }),
      CG_Details_Out: this.fb.group({
        OvenTime: [''],
        Sample_Name: [''],
        A: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        B: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        C: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
        Percentage: ['', Validators.pattern(/^([0-9]*\.)?\d+$/)],
      }),
      ph_Spec: [this.selectedCPDBatch.pH_Spec, Validators.required],
      ph_Final: [this.selectedCPDBatch.pH_Spec, Validators.required],
      pH_Status: [''],
      Colour_Details: this.fb.group({
        Sample: [''],
        L: [''],
        a: [''],
        b: [''],
        Strength: [''],
        Opacity: [''],
        Thickness: [''],
        Amount: [''],
        Final: [''],
        Remarks: [''],
        ApprovedBy: [''],
        Acknowledgement: [''],
        TestSample: this.fb.group({
          ProductCode: [''],
          PigmentType: [''],
          LatexType: [''],
          BatchNumber: [''],
          SerialNumber: [''],
        }),
        ControlSample: this.fb.group({
          ProductCode: [''],
          PigmentType: [''],
          LatexType: [''],
          BatchNumber: [''],
          SerialNumber: [''],
        }),
      }),
    });
}


  getDate() {
    let today = new Date();
    let convertedDate;
    let dd = today.getDate();
    let finaldd;
    let finalmm;
    let finalhh;
    let finalminute;
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    let hh = today.getHours();
    let minute = today.getMinutes();
    if (dd < 10) {
      finaldd = `0${dd}`;
    }
    if (dd > 10) {
      finaldd = dd;
    }

    if (mm < 10) {
      finalmm = `0${mm}`;
    }
    if (mm > 10) {
      finalmm = mm;
    }

    
    if(hh < 10){
      finalhh = `0${hh}`;
    }
    if(hh > 10){
      finalhh = hh;
    }

    if(minute < 10){
      finalminute = `0${minute}`;
    }
    if(minute > 10){
      finalminute = minute;
    }

    //convertedDate = `${finaldd}/${finalmm}/${yyyy}T${finalhh}:${finalminute}`; 
    convertedDate = `${yyyy}-${finalmm}-${finaldd}T${finalhh}:${finalminute}`; //yyyy-MM-ddThh:mm
    return convertedDate;
  }

  currentDate() {
    const currentDate = new Date();
    return currentDate.toISOString();//.substring(0,10);
    //return moment(new Date()).format('YYYY-MM-DDTHH:mm');
  }

  changeProcessStage(selectedStage) {
    this.currentStage = selectedStage;
    this.phAdjustmentForm.get('ACMSStage').setValue(selectedStage);
  }
  Submit() {
    //this.ref.close();
    this.batchService.currentPlant.pipe(
      takeWhile(() => this.alive),
    ).subscribe(
      plant => {
        this.selectedPlant = plant;
      });

    this.phAdjustmentForm.get('Plant').setValue(this.selectedPlant);
    this.phAdjustmentForm.get('ACMSStage').setValue(this.currentStage);
    this.phAdjustmentForm.get('UserId').setValue(this.sessionStorageService.get('S_UserId'));
    //console.log('after get plant and processstage:', this.phAdjustmentForm.value);
    
    if (this.phAdjustmentForm.value['BatchNo'] !== '') {
      this.cpdTrackingService.addPHAdjustment(this.phAdjustmentForm.value).subscribe(
        data => {
          if (data['StatusCode'] === 200) {
            window.alert('ph adjustment added successfully.');
            this.ref.close();
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['pages/home/cpdbatchordertracking']);
            });
          }
          else{
            window.alert('ph adjustment added failed.');
          }
          //console.log(data);
        },
      );
    }
  }

  close() {
    this.ref.close();
  }
}
