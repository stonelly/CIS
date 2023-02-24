import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { CpdTrackingData } from '../../../../@core/data/cpdtracking';
import { Router } from '@angular/router';
import { UserRoleData } from './../../../../@core/data/userrole';
import { SessionStorageService } from 'angular-web-storage';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
import { ThrowStmt } from '@angular/compiler';

@Component({
  selector: 'ngx-dialog-edit-user-role',
  templateUrl: './dialog-edit-user-role.component.html',
  styleUrls: ['./dialog-edit-user-role.component.scss']
})

export class DialogEditUserRoleComponent implements OnInit {
  mainForm: FormGroup;
  @Input() selectedValue;
  roleId;
  roleName;
  checkboxValue: boolean;
  disableHomeScreen: boolean;
  disableInquiryScreen: boolean;
  disableReportScreen: boolean;
  disableMasterSettingScreen: boolean;
  disableUserManagementScreen: boolean;
  isModuleChecked:boolean;
  moduleId;
  childrenHome = [];
  childrenInquiry: FormArray;
  childrenArray=[];
  formArrayItems = [];
  returnItemObj = [];
  currentUserScreenObj = [];
  ScreenObj=[];
  /*ScreenObj1=[
    {
      screenId: 1,
      screenName: 'Home',
      name: 'Home',
      icon: 'home-outline',
      screenChildren: [
        {
          screenId: 2,
          screenName: 'CPDBatchOrderList',
          name: 'CPD Batch Order List',
          isChecked: true,
          apiList: [
            {
              apiId: 1,
              apiName:'CreateBatch',
              isChecked:false,
            }
          ]
        },
        {
          screenId: 3,
          screenName: 'CPDBatchOrderTracking',
          name: 'CPD Batch Order Tracking',
          isChecked: false,
          apiList: [
            {
              apiId: 2,
              apiName:'GetBatchTracking',
              //isChecked: true,
            }
          ]
        },
      ]
    },
    {
      screenId: 4,
      screenName: 'Inquiry',
      name: 'Inquiry',
      icon: 'grid-outline',
      screenChildren: [
        {
          screenId: 5,
          screenName: 'CPDBatchSheet',
          name: 'CPD Batch Sheet',
          isChecked: true,
          apiList: []
        },
      ]
    }
  ];*/

  constructor(protected ref: NbDialogRef<DialogEditUserRoleComponent>,
              private fb: FormBuilder,
              private service: UserRoleData,
              private router: Router, 
              private sessionStorageService: SessionStorageService,
              private toastrService: NbToastrService,) { }

  ngOnInit() {
    this.disableHomeScreen = false;
    this.roleName = this.selectedValue.roleName;
    this.roleId = this.selectedValue.roleId;
    //this.currentUserScreenObj = this.sessionStorageService.get('S_ScreenList');
    
    this.service.getScreenRoleInfo(this.roleId).subscribe(responseScreenRoleInfo => {
      if(responseScreenRoleInfo['responseCode'] === '200'){
        this.currentUserScreenObj = responseScreenRoleInfo['data'];
        //Get all screens and roles
        this.service.getScreenRoleList().subscribe(response => {
          if(response['responseCode'] === "200"){
            this.ScreenObj = response['data'];
            //Compare Module object
            if(this.ScreenObj.length > 0){
              console.log(this.ScreenObj);
              let moduleCount = 0;
              while (moduleCount < this.ScreenObj.length){
                let currentUserModuleCount = 0;
                if(this.currentUserScreenObj.length > 0){
                  while(currentUserModuleCount < this.currentUserScreenObj.length){
                    if(this.ScreenObj[moduleCount]['screenId'] === this.currentUserScreenObj[currentUserModuleCount]['screenId']){
                      this.ScreenObj[moduleCount]['isChecked'] = true;
                      switch(this.ScreenObj[moduleCount]['screenName']){
                        case 'Home': 
                            this.disableHomeScreen = true;
                        break;
                        case 'Inquiry': 
                            this.disableInquiryScreen = true;
                        break;
                        case 'Report': 
                            this.disableReportScreen = true;
                        break;
                        case 'MasterSettings':
                            this.disableMasterSettingScreen = true;
                        break;
                        case 'UserManagement':
                            this.disableUserManagementScreen = true;
                        break;
                      };
                      currentUserModuleCount = this.ScreenObj.length;
                    }
                    else{
                      this.ScreenObj[moduleCount]['isChecked'] = false;
                      currentUserModuleCount++;
                    }
                  }
                }
                else{
                  this.ScreenObj[moduleCount]['isChecked'] = false;
                }
                moduleCount++;
              }

              let responseCount = 0;
              while( responseCount < this.ScreenObj.length){
                let count = 0;
                while(count < this.currentUserScreenObj.length){
                  /*console.log(this.currentUserScreenObj[count]);
                  if(this.ScreenObj[responseCount]['screenId'] === this.currentUserScreenObj[count]['screenId']){
                    this.ScreenObj[responseCount]['isChecked'] = true;
                  }
                  else{
                    this.ScreenObj[responseCount]['isChecked'] = false;
                  }*/
    
                  //Compare Children object
                  let screenChildrenCount = 0;
                  while(screenChildrenCount < this.ScreenObj[responseCount]['screenChildren'].length){
                    let currentRoleScreenChildrenCount = 0;
                    while(currentRoleScreenChildrenCount < this.currentUserScreenObj[count]['screenChildren'].length){
    
                      //Compare API object
                      let apiListCount = 0;
                        while (apiListCount < this.ScreenObj[responseCount]['screenChildren'][screenChildrenCount]['apiList'].length){
                          let currentRoleAPICount = 0;
                            while (currentRoleAPICount < this.currentUserScreenObj[count]['screenChildren'][currentRoleScreenChildrenCount]['apiList'].length){
  
                              if(this.ScreenObj[responseCount]['screenChildren'][screenChildrenCount]['apiList'][apiListCount]['apiId']
                                  === this.currentUserScreenObj[count]['screenChildren'][currentRoleScreenChildrenCount]['apiList'][currentRoleAPICount]['apiId']
                              ){
                                this.ScreenObj[responseCount]['screenChildren'][screenChildrenCount]['apiList'][apiListCount]['isChecked'] = true;
                                currentRoleAPICount = this.ScreenObj[responseCount]['screenChildren'][screenChildrenCount]['apiList'].length;
                              }
                              else{
                                this.ScreenObj[responseCount]['screenChildren'][screenChildrenCount]['apiList'][apiListCount]['isChecked'] = false;
                                currentRoleAPICount++;
                              }
                          }
                          apiListCount++;
                        }
   
                      if(this.ScreenObj[responseCount]['screenChildren'][screenChildrenCount]['screenId'] 
                          === this.currentUserScreenObj[count]['screenChildren'][currentRoleScreenChildrenCount]['screenId']){
                        this.ScreenObj[responseCount]['screenChildren'][screenChildrenCount]['isChecked'] = true;
                        currentRoleScreenChildrenCount = this.currentUserScreenObj[count]['screenChildren'].length;
                      }
                      else{
                        if(this.ScreenObj[responseCount]['screenChildren'][screenChildrenCount]['isChecked'] !== true){
                          this.ScreenObj[responseCount]['screenChildren'][screenChildrenCount]['isChecked'] = false;
                        }
                        currentRoleScreenChildrenCount++;
                      }
                      //currentRoleScreenChildrenCount++;
                    }
                    screenChildrenCount++;
                  }
                  count++;
                }
                responseCount++;
              }
            }//end if(this.ScreenObj.length > 0)
            else{
              this.currentUserScreenObj = this.ScreenObj;
            }
            
          }
          
          let indexCount = 0;
          while(indexCount < this.ScreenObj.length){
            console.log(this.ScreenObj);
            this.getScreens(this.ScreenObj[indexCount]['screenName']);
            indexCount++;
          }
        })
      }
    });
    

    this.mainForm = this.fb.group({
      RoleName: '',
      Home: this.fb.group({
        category: ['Home'],
        items: this.fb.array([]),
      }),
      Inquiry: this.fb.group({
        category: ['Inquiry'],
        items: this.fb.array([]),
      }),
      Report: this.fb.group({
        category: ['Report'],
        items: this.fb.array([]),
      }),
      MasterSettings: this.fb.group({
        category: ['MasterSettings'],
        items: this.fb.array([]),
      }),
      UserManagement: this.fb.group({
        category: ['UserManagement'],
        items: this.fb.array([]),
      }),
    });
  }

  cancel() {
    this.ref.close();
  }

  getControls(screen: string) {
    return (this.mainForm.get(screen).get('items') as FormArray).controls;
  }

  getAPIControls(screen: string, index: number) {
    return (this.mainForm.get(screen).get('items') as FormArray).controls[index].value.API;
  }

  getIsModuleChecked(item){
    //console.log(item);
    switch(item){
      case 'Home': 
          return this.disableHomeScreen;
      break;
      case 'Inquiry': 
          return this.disableInquiryScreen;
      break;
      case 'Report': 
          return this.disableReportScreen;
      break;
      case 'MasterSettings':
          return this.disableMasterSettingScreen;
      break;
      case 'UserManagement':
          return this.disableUserManagementScreen;
      break;
    };
  }

  getIsChecked(item){
    if(typeof item['isChecked'] !== 'undefined'){
      return item['isChecked'];
    }
    else{
      return false;
    }
  }
  
  changeModuleTick(moduleName){
    switch(moduleName){
      case 'Home': 
          this.disableHomeScreen = !this.disableHomeScreen; 
          this.isModuleChecked = this.disableHomeScreen;
      break;
      case 'Inquiry': 
          this.disableInquiryScreen = !this.disableInquiryScreen; 
          this.isModuleChecked = this.disableInquiryScreen;
      break;
      case 'Report': 
          this.disableReportScreen = !this.disableReportScreen; 
          this.isModuleChecked = this.disableReportScreen;
      break;
      case 'MasterSettings': 
          this.disableMasterSettingScreen = !this.disableMasterSettingScreen; 
          this.isModuleChecked = this.disableMasterSettingScreen;
      break;
      case 'UserManagement': 
          this.disableUserManagementScreen = !this.disableUserManagementScreen; 
          this.isModuleChecked = this.disableUserManagementScreen;
      break;
    }
    
    let count = 0;
    while(count < this.ScreenObj.length){
      if(moduleName === this.ScreenObj[count]['screenName']){
        this.moduleId = this.ScreenObj[count]['screenId'];
        count = this.ScreenObj.length;
      }
      else{
        count++;
      }
    }

    //console.log(moduleName, '(', this.moduleId,'): ', this.isModuleChecked);

    let roleScreenObj = {
        RoleId  : this.roleId,
        ScreenId: this.moduleId,
        IsEnabled: this.isModuleChecked,
    };

    this.service.assignRoleScreen(roleScreenObj).subscribe(response => {
      if(response['responseCode'] === '200'){
        //console.log(response);
      }
      else{
        this.showToast('top-right','danger','Assign screen to role failed.');
      }
    });
  }

  changeTick(e, type){
    let screenId = type.controls.screenId.value;
    let isChecked = type.controls.isChecked.value;

    let roleScreenObj = {
        RoleId  : this.roleId,
        ScreenId: screenId,
        IsEnabled: isChecked,
    }
    console.log(roleScreenObj);

    this.service.assignRoleScreen(roleScreenObj).subscribe(response => {
      if(response['responseCode'] === '200'){
        console.log(response);
      }
      else{
        this.showToast('top-right','danger','Assign screen to role failed.');
      }
    });
  }
  
  changeChildTick(e, type, i, j, module){
    
    let isChecked = !(this.mainForm.get(module).get('items') as FormArray).controls[i].value.API[j].isChecked;
    let roleAPIObj = {
      RoleId    : this.roleId,
      APIId     : type.apiId,
      IsEnabled : isChecked,
    };

    console.log(roleAPIObj);

    this.service.assignAPIScreen(roleAPIObj).subscribe(response => {
      if(response['responseCode'] === '200'){
        console.log(response);
      }
      else{
        this.showToast('top-right','danger','Assign screen to role failed.');
      }
    });

    (this.mainForm.get(module).get('items') as FormArray).controls[i].value.API[j].isChecked 
    = !(this.mainForm.get(module).get('items') as FormArray).controls[i].value.API[j].isChecked;
  }

  isScreenDisabled(module){
    //console.log(this.mainForm.get(module));
    return true;
  }

  isDisabled(i, j, module){
    //console.log((this.mainForm.get(module).get('items') as FormArray).controls[i].value.isChecked);
    return !(this.mainForm.get(module).get('items') as FormArray).controls[i].value.isChecked;
  }

  onSubmit(){
    let lineObj = this.buildLineItemObj(this.mainForm.get('Home'));
    lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('Inquiry')));
    lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('Report')));
    lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('MasterSettings')));
    lineObj = lineObj.concat(this.buildLineItemObj(this.mainForm.get('UserManagement')));

    const roleObj = {
      roleName:       this.roleName,
      screenDetails:  lineObj,
    };

    console.log(roleObj);
  }

  getScreens(screenName){
    let indexCount = 0;
    let isScreensDisabled;
    
    while(indexCount < this.ScreenObj.length){
      if(this.ScreenObj[indexCount]['screenName'] === screenName){
        //console.log(this.ScreenObj[indexCount]);
        this.childrenArray = this.ScreenObj[indexCount]['screenChildren'];
        isScreensDisabled = this.ScreenObj[indexCount]['isChecked'];
      }
      indexCount++;
    }
    let stageName = '';
    let itemIndex = 0;
    let Name;
    if(typeof this.childrenArray.length !== 'undefined'){
      while(itemIndex < this.childrenArray.length){

        /*let childItemIndex=0;
        while(childItemIndex < this.childrenArray[itemIndex]['API'].length){
          console.log(this.childrenArray[itemIndex]['API']);

          childItemIndex++;
        }*/
        let ScreenName = this.childrenArray[itemIndex]['screenName'];
        Name = this.childrenArray[itemIndex]['Name'];
        this.formArrayItems.push({
          screenId: this.childrenArray[itemIndex]['screenId'],
          screenName: this.childrenArray[itemIndex]['screenName'],
          displayName: this.childrenArray[itemIndex]['name'],
          API: this.childrenArray[itemIndex]['apiList'],
          isChecked: this.childrenArray[itemIndex]['isChecked'],//{value:this.childrenArray[itemIndex]['isChecked'], disabled: isScreensDisabled},
        });
        this.initializeScreensInDialog(screenName, this.formArrayItems);
        //console.log('this.formArrayItems:',this.formArrayItems);
        itemIndex++;
        this.formArrayItems = [];
      }
      //console.log('this.formArrayItems:',this.formArrayItems);
    }
    //console.log(this.ScreenObj);
  }

  initializeScreensInDialog(screenName: string, dataArray){
    let stageName = '';
    const details = this.mainForm.get(screenName).get('items') as FormArray;
    //console.log('dataArray', dataArray);
    let itemIndex = 0;
    while(itemIndex < dataArray.length){
      let childItemIndex=0;
      let childItem=[];
      while(childItemIndex < dataArray[itemIndex]['API'].length){
        
        childItem.push({
          apiId: dataArray[itemIndex]['API'][childItemIndex]['apiId'],
          apiName: dataArray[itemIndex]['API'][childItemIndex]['apiName'],
          isChecked: dataArray[itemIndex]['API'][childItemIndex]['isChecked'],
        })
        //console.log('api name ', dataArray[itemIndex]['API'][childItemIndex]['apiName']);
        //console.log('initialize ', dataArray[itemIndex]['API'][childItemIndex]['isChecked']);
        childItemIndex++;
      }
      //console.log('child: ', childItem);
      details.push(this.fb.group({
        screenId: dataArray[itemIndex]['screenId'],
        screenName: dataArray[itemIndex]['screenName'],
        name: dataArray[itemIndex]['displayName'],
        isChecked: dataArray[itemIndex]['isChecked'],
        API: this.fb.array(childItem),//dataArray[itemIndex]['API']),
      }));
      itemIndex++;
    }
    //console.log('details: ', details);
    //console.log(this.mainForm.get(screenName));
  }

  buildLineItemObj(itemObj){
    this.returnItemObj =[];
    //console.log(itemObj.value);
    let itemIndex = 0;
    let screenId = '';
    while(itemIndex < this.ScreenObj.length){
      if(this.ScreenObj[itemIndex]['screenName'] === itemObj.value.category){
        screenId = this.ScreenObj[itemIndex]['screenId'];
        itemIndex = this.ScreenObj.length;
      }
      else{
        itemIndex++;
      }
    }
    this.returnItemObj.push({
      'screenId': screenId,
      'screenName': itemObj.value.category,
      'screenChildren': itemObj.value.items,
    });
    //console.log(this.returnItemObj);
    return this.returnItemObj;
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }
}

