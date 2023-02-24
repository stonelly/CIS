import { Component, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormArray, FormGroup, Validators } from '@angular/forms';
import { LocalDataSource } from 'ng2-smart-table';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';
import { SessionStorage, SessionStorageService } from 'angular-web-storage'
import { LocationMasterData } from '../../@core/data/locationmaster';
import { CheckInData } from '../../@core/data/checkin';

@Component({
  selector: 'ngx-checkin',
  templateUrl: './checkin.component.html',
  styleUrls: ['./checkin.component.scss']
})
export class CheckInComponent implements OnInit {
  mainForm: FormGroup;
  private destroy$: Subject<void> = new Subject<void>();
  defaultChecked: boolean;
  defaultSelected;
  binLocationList;
  ewN_CompletedPalletList;

  constructor(
              private datePipe: DatePipe,
              private fb: FormBuilder,
              private router: Router,
              private toastrService: NbToastrService,
              private sessionStorageService: SessionStorageService,
              private service: LocationMasterData,
              private checkInDataService: CheckInData,
              ) { }


  source: LocalDataSource = new LocalDataSource();
  sourceMTS: LocalDataSource = new LocalDataSource();


  settings = {
    hideSubHeader: true,
    mode: external,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      'poNumber': {
        title: 'SO No.',
        type: 'string',
      },
      'item': {
        title: 'Item ID',
        type: 'string',
      },
      'qty': {
        title: 'Quantity',
        type: 'number',
      },
      'customerPONumber': {
        title: 'Customer PO No.',
        type: 'string',
      },
      'planDay': {
        title: 'Plan Date',
        type: 'date',
        valuePrepareFunction: (date) => {      
          return new DatePipe('en-EN').transform(date, 'dd/MM/yyyy');
        },
      }
    },
  };
  settingsMTS = {
    hideSubHeader: true,
    mode: external,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      'forecastSO': {
        title: 'SO',
        type: 'string',
      },
      'forecastWO': {
        title: 'Work Order',
        type: 'string',
      },
      'fgCode': {
        title: 'FG Code',
        type: 'string',
      },
      'size': {
        title: 'Size',
        type: 'string',
      },
      'batchLotNo': {
        title: 'Lot No.',
        type: 'string',
      },
      'cartonNo': {
        title: 'Carton No',
        type: 'number',
      },
      'batchMfgDate': {
        title: 'Mfg Date',
        type: 'date',
        valuePrepareFunction: (date) => {      
          return new DatePipe('en-EN').transform(date, 'dd/MM/yyyy');
        },
      },
      'expiryDate': {
        title: 'Expiry Date',
        type: 'date',
        valuePrepareFunction: (date) => {      
          return new DatePipe('en-EN').transform(date, 'dd/MM/yyyy');
        },
      },
      'qaiDate': {
        title: 'Qai Date',
        type: 'date',
        valuePrepareFunction: (date) => {      
          return new DatePipe('en-EN').transform(date, 'dd/MM/yyyy');
        },
      },
      'innerBoxPerCarton': {
        title: 'Inner Box/Carton',
        type: 'number',
      },
      'innerBoxPackingSize': {
        title: 'Inner Box Packing Size',
        type: 'number',
      }
    },
  };

  ngOnInit() {
    this.mainForm = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          inputPalletID: ['', [Validators.required]],
          inputEmployeeID: ['', [Validators.required]],
          inputWarehouse: ['', [Validators.required]],
        }),
      ]),
    });
    this.defaultChecked = true;
    this.binLocationList = [];
  }

  warehouse = this.sessionStorageService.get('S_Location');
  palletErrorMessage ="";
  employeeValidationMessage ="";
  isMTO = false;
  isMTS = false;
  palletType = "";
  stockId = 0;
  isNoWarehouse = (this.warehouse === null);
  isNotValid = true;
  
  onSubmit(){ 

    //to disable button to prevent double click
    if(this.isNotValid)
    {
      this.showToast('top-rigth', 'danger', "Double submission");
      return false;
    }

    //to disable button to prevent double click
    this.isNotValid = true;   

    let MappedObject = {
      UserId : this.sessionStorageService.get('S_UserId'),
      PalletType: this.palletType,
      PalletNo: this.mainForm.value.items[0]['inputPalletID'],
      LocationId: this.sessionStorageService.get('S_LocationId'),
      LocationName: this.sessionStorageService.get('S_Location'),
      StockId : this.stockId,
      EmployeeId: this.mainForm.value.items[0]['inputEmployeeID'],
      Plant : '',
      eWN_CompletedPalletList : this.ewN_CompletedPalletList,
    };    
    console.log(MappedObject);
    this.checkInDataService.checkInPallet(MappedObject).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {      
      if (response['responseCode'] == 200 ){
        let responseMessage = response['responseMessage']
        this.mainForm.value.clear; 
 
        let displaySuccessfulmessage = '';
        displaySuccessfulmessage = 'Check In successfully.';

        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['/pages/checkin'], { skipLocationChange: false }).then(() => {
            this.showToast('top-right', 'success', displaySuccessfulmessage);
          });
        });
        this.isNotValid = false;  
      }
      else if (response['responseCode'] == 204 ){
        //do nothing for duplicated submission
      }
      else{
        let responseMessage = response['responseMessage']

        this.showToast('top-rigth', 'danger', responseMessage);
        this.isNotValid = false; 
      }
    });     
  }

  onPalletChange(event): void {
    this.palletErrorMessage ="";
    this.source = new LocalDataSource();
    this.sourceMTS = new LocalDataSource();
    var data = this.mainForm.value.items[0]['inputPalletID'];
    this.isMTO = false;
    this.isMTS = false;
    this.stockId = 0;
    this.palletType = "";

    if(data !== "")
    {
      this.checkInDataService.validatePallet(data).pipe(
        takeUntil(this.destroy$),
      ).subscribe(response => {      
        if (response['responseCode'] == 200 && response['data']['isValidCheckIn'] !== false ){
          this.palletErrorMessage ="Validated";
        }
        else{          
          if(response['data']['errorMessage']  !== null){
            this.palletErrorMessage = response['data']['errorMessage'] ;
          }
          else
            this.palletErrorMessage = "Can't find any Pallet ID in records. Please key in the correct Pallet ID.";
        }

        if(response['data']['palletType'] === 'MTO'){
          this.isMTO = true;
          this.palletType = response['data']['palletType'];
          var result = response['data']['ewN_CompletedPalletList'];
          this.ewN_CompletedPalletList = result;
          this.source.load(result);
        }
        else if(response['data']['palletType'] === 'MTS')
        {
          this.isMTS = true;
          this.palletType = response['data']['palletType'];
          var result = response['data']['palletDetailList'];
          this.sourceMTS.load(result);
          // this.binLocationList = response['data']['tblBinLocation'];
          this.stockId = response['data']['stockId']
        }
        
        this.enableSubmit();

      });
    }
    else
    {
      this.palletErrorMessage ="Required Pallet ID";
    }

    this.enableSubmit();
  }

  onEmployeeIdChange(event): void { 
    this.employeeValidationMessage ="";
    var data = this.mainForm.value.items[0]['inputEmployeeID']; 

    if(data !== "")
    {
      this.checkInDataService.validateEmployeeId(data).pipe(
        takeUntil(this.destroy$),
      ).subscribe(response => {      
        if (response['responseCode'] == 200 && response['data']['isValid'] !== false ){
          this.employeeValidationMessage ="Validated";
        }
        else{          
          this.employeeValidationMessage ="Invalid Employee ID";
        }
        
        this.enableSubmit();
      });
    }
    else
    {
      this.employeeValidationMessage ="Required Employee ID";
    }
    
    this.mainForm = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          inputPalletID: [this.mainForm.value.items[0]['inputPalletID'], [Validators.required]],
          inputEmployeeID: [this.mainForm.value.items[0]['inputEmployeeID'], [Validators.required]],
          inputWarehouse: [this.mainForm.value.items[0]['inputWarehouse'], [Validators.required]],
        }),
      ]),
    }); 
    this.enableSubmit();
  }

  onLocationSelected(event){
    this.mainForm = this.fb.group({
      items: this.fb.array([
        this.fb.group({
          inputPalletID: [this.mainForm.value.items[0]['inputPalletID'], [Validators.required]],
          inputEmployeeID: [this.mainForm.value.items[0]['inputEmployeeID'], [Validators.required]],
          inputWarehouse: [this.mainForm.value.items[0]['inputWarehouse'], [Validators.required]],
        }),
      ]),
    }); 
  }

  cancel() {
     
  }

  getControls(stage: string) {
    return (this.mainForm.get('items') as FormArray).controls;
  }

  enableOption(){
    this.defaultChecked = !this.defaultChecked;
  }

  enableSubmit(){
    this.isNotValid = (this.palletErrorMessage !=="Validated" || this.employeeValidationMessage !=="Validated" || this.sessionStorageService.get('S_Location') === "");
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
