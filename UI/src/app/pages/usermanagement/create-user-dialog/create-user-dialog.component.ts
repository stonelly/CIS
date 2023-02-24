import { Component, Input, ViewChild, } from '@angular/core';
import { NbDialogRef, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbToastrService, } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { UserAccessModulesData } from '../../../@core/data/user-access-modules';
import { DomSanitizer } from '@angular/platform-browser';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { LoginService } from '../../../api-class/service/login-api.service';
import { SessionStorageService } from 'angular-web-storage';
import { ButtonSelectRenderComponent } from './button-select-user.render.component';
import { UserAccessData } from '../../../@core/data/useraccess';

//import { MatTableDataSource, MatSort } from '@angular/material';
import { DataSource } from '@angular/cdk/table';
import { ClickHandler } from 'angular2-toaster';
import { Subject, throwError } from 'rxjs';
import { takeUntil, catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

interface TreeNode<T>{
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface SearchADAccountData{
    'Name' : string;
    'Email': string;
    'UserId': string;
}

@Component({
  selector: 'ngx-create-user-dialog',
  templateUrl: './create-user-dialog.component.html',
  styleUrls: ['./create-user-dialog.component.scss']
})

export class CreateUserDialogComponent {
  private destroy$: Subject<void> = new Subject<void>();
  adResultData: any;
  dataSource;
  ADTableSource: LocalDataSource = new LocalDataSource();
  mainform: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;
  @Input() title: string;
  accountName: string;
  jsondata: any;
  customColumn = 'Data';
  defaultColumns = [ 'Name', 'Email', 'UserId'];
  allColumns = [ this.customColumn, ...this.defaultColumns ];
  allColumnsHeader = [ 'Name', 'Email', 'UserId' ];
  password;
  userObject:any;
  selectedOption = '';
  usernameKeyUpvalue='';
  keyCount = 0;
  userList;
  ADUsernameList = [];
  userFullNameIndex = 0;

  source: LocalDataSource = new LocalDataSource();
  public input: string = '<input type="checkbox"></input>';

  constructor(protected ref: NbDialogRef<CreateUserDialogComponent>,
              private service: UserAccessModulesData,
              private _sanitizer: DomSanitizer,
              private loginService: LoginService,
              private sessionStorageService: SessionStorageService,
              private fb: FormBuilder,
              private dataSourceBuilder: NbTreeGridDataSourceBuilder<SearchADAccountData>,
              //private buttonSelectRenderComponent: ButtonSelectRenderComponent,
              private userAccessService: UserAccessData,
              private router: Router,
              private toastrService: NbToastrService,
               ) {
                const data = this.service.getData();
                this.source.load(data);
              }

  cancel() {
    this.ref.close();
  }

  ngOnInit() {
    this.mainform = this.fb.group({
      formAuthType: ['', Validators.required],
      formADUserName: ['', Validators.required],
      formADFullName: ['', Validators.required],
      formSysUserName: ['', Validators.required],
      formSysPassword: ['', Validators.required],
      formSysFullName: ['', Validators.required],
      //formRole: ['', Validators.required],
    });

    /*this.secondForm = this.fb.group({
      secondCtrl: ['', Validators.required],
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: ['', Validators.required],
    });*/
  }

  onSubmit(){
    //console.log('hs', this.mainform.value);
    
    //this.userAccessService.registerUser();
    if (this.mainform.get('formAuthType').value === 1){
      this.userObject = {
        UserId : this.mainform.get('formADUserName').value,
        Password: "",
        UserName:this.mainform.get('formADFullName').value,
        IsLocalAccount: false,
      }
    }
    else{
      this.userObject = {
        UserId : this.mainform.get('formSysUserName').value,
        Password: this.mainform.get('formSysPassword').value,
        UserName:this.mainform.get('formSysFullName').value,
        IsLocalAccount: true,
      }
    }

    //console.log('userobject: ',this.userObject);
    this.userAccessService.registerUser(this.userObject).pipe(
      takeUntil(this.destroy$),
      catchError(this.handleError),
    ).subscribe( response => {
      //console.log('response' + response);
      if (response['responseCode'] === '200') {
        //window.alert("User added successfully.");
        this.showToast('top-right', 'success', 'User added successfully.');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/usermanagement/useraccess']);
        });
        this.ref.close();
      }
      else{
        //window.alert(response['responseCode'] + ": " + response['responseMessage']);
        this.showToast('top-right', 'danger', 'Kindly check your Username again.');
      }
    });
  }
  /*onFirstSubmit() {
    this.mainform.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }*/
  
  /*ngOnInit(){
    this.createUserFormGroup = this.fb.group({
      valAuthType: new FormControl(),
    })
  }*/
  

  radioGroupValue = 'This is value 2';
  
  options = [
    { value: 'This is value 1', label: 'Option 1' },
    { value: 'This is value 2', label: 'Option 2' },
    { value: 'This is value 3', label: 'Option 3' },
    { value: 'This is value 4', label: 'Option 4' },
  ];
  option;
  responseDataArr = [];
  authenticationType = [
      {
        name: 'Active Directory',
        value: 1
      },
      {
        name: 'System',
        value: 0
      },
  ];

  showAD      = true;
  showSystem  = true;
  hideADTable = true;
  hideADDetails = true;
  buttonVerified = "primary";
  responseArr = [];

  authTypeClick(selectedType: number){
    if (selectedType == 1){
      this.showAD = false; //show AD content if AD selected
      this.showSystem = !this.showAD;
    }
    if (selectedType == 0){
      this.showSystem = false;
      this.showAD = !this.showSystem;
    }
  }

  searchAD(){
    this.accountName = document.getElementById("inputADName")["value"];
    console.log(this.sessionStorageService.get('S_Token'));
    
    const data = {
      'AppToken': 'V8uhHc2HiWhPyKLV',
      'UserToken': this.sessionStorageService.get('S_Token'),
      'AppMethod': 'searchad',
      'AppParameter': document.getElementById("inputADName")["value"],
    };
    console.log(data);
    this.buttonVerified = "success";


    this.loginService.searchADUser(data).subscribe(response => {
      if (response.ResponseCode != 200){//== 401){
        this.hideADTable = true;
        console.log(response.ResponseCode + "   :   " + response.ResponseMessage);
      }

      if(response.ResponseCode  == 200){
        if(response.Data == null || response.Data == "[]"){
          this.hideADTable = true;
        }
        else{
          this.hideADTable = false;
        }
          var myArr = JSON.parse(response['Data']);
          const stringifyData = JSON.stringify(myArr);
          this.adResultData = myArr;
          this.ADTableSource.load(myArr);
      }
    });
  }

  settings = {
    mode: external,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },

    hideSubHeader:true,

    columns: {
      'SelectUser': {
        title:'Select',
        type: 'custom',
        renderComponent: ButtonSelectRenderComponent,
        width: '0.5em',
        defaultValue: 'View',
        valuePrepareFunction: (cell, row) => row,
        onComponentInitFunction:(instance:any ) => {
          instance.hideADTable.subscribe(row => {
            // console.log("Emit: " + row['UserId']);
            // console.log("Emit: " + row['Name']);
            // console.log("Emit: " + row['Email']);
            // console.log("Emit: " + row['hideADTable']);
            this.hideADTable = row['hideADTable'];
            this.hideADDetails = !this.hideADTable;
            //console.log(this.hideADDetails);
          })
        },
      },

      'Name': {
        title: 'Name',
        type: 'string',
        //width: '2em',
      },

      'UserId': {
        title: 'User ID',
        type: 'string',
        //width: '2em',
      },
      
      'Email': {
        title: 'Email',
        type: 'string',
        //width: '3em',
      },
    },
  };


  selectUser(event){
    console.log("selectUser() clicked");
  }

  keyUp(event){
    this.keyCount += 1;
    if (this.keyCount >= 3){     
      this.userAccessService.searchADUser(this.mainform.get('formADUserName').value).pipe(
        takeUntil(this.destroy$),
      ).subscribe( response => {
        this.ADUsernameList = [];
        this.keyCount = 0;
        if(response["responseCode"] === "200"){
          //console.log(response["data"]);
          let indexCount = 0;
          while(indexCount < response["data"].length){
            //this.mainform.controls['formADFullName'].setValue(response["data"][indexCount]["name"]);
            this.ADUsernameList.push({
              name: response["data"][indexCount]["name"],
              email: response["data"][indexCount]["email"],
              userId: response["data"][indexCount]["userId"],
            });
            this.userFullNameIndex = indexCount - 1;
            //console.log(response["data"][indexCount]["name"]);
            //console.log(indexCount, ': ', response["data"][indexCount]["name"]);
            indexCount++;
          }
        }
      });
    }
  }

  /*setFullName(){
    let userId = this.mainform.get('formADUserName').value;
    console.log(this.ADUsernameList);
    let indexCount = 0;
    console.log(indexCount < this.ADUsernameList.length);
    while(indexCount < this.ADUsernameList.length){
      console.log(this.ADUsernameList[indexCount]["userId"]);
      if(this.ADUsernameList[indexCount]["userId"] === userId){
        this.mainform.controls['formADFullName'].setValue(this.ADUsernameList[indexCount]["name"] );
        
      }
      indexCount++;
    }
  }*/

  setFullName(searchValue: string): void {  
    let userId = this.mainform.get('formADUserName').value;
    let indexCount = 0;
    while(indexCount < this.ADUsernameList.length){
      if(this.ADUsernameList[indexCount]["userId"] === userId){
        this.mainform.controls['formADFullName'].setValue(this.ADUsernameList[indexCount]["name"] );
        
      }
      indexCount++;
    }
  }

  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = 'Create new user failed.';
    }
    //window.alert(errorMessage);
    this.showToast('top-right', 'danger', 'Kindly check your Username again.');
    return throwError(errorMessage);
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
