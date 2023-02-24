import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { CpdTrackingData } from '../../../../@core/data/cpdtracking';
import { Router } from '@angular/router';
import { UserRoleData } from './../../../../@core/data/userrole';

@Component({
  selector: 'ngx-dialog-create-user-role',
  templateUrl: './dialog-create-user-role.component.html',
  styleUrls: ['./dialog-create-user-role.component.scss']
})
export class DialogCreateUserRoleComponent implements OnInit {

  mainForm: FormGroup;
  @Input() selectedValue;
  userName;
  checkboxValue: boolean;
  isHomeChecked:boolean;
  childrenHome = [];
  childrenInquiry: FormArray;
  childrenArray=[];
  userRoleObj=[];
  formArrayItems = [];
  returnItemObj = [];
  ScreenObj=[];/*
    {
      screenName: 'Home',
      name: 'Home',
      icon: 'home-outline',
      screenChildren: [
        {
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
          screenName: 'CPDBatchOrderTracking',
          name: 'CPD Batch Order Tracking',
          isChecked: true,
          apiList: [
            {
              apiId: 2,
              apiName:'GetBatchTracking',
              isChecked: true,
            }
          ]
        },
      ]
    },
    {
      screenName: 'Inquiry',
      name: 'Inquiry',
      icon: 'grid-outline',
      children: [
        {
          screenName: 'CPDBatchSheet',
          name: 'CPD Batch Sheet',
          isChecked: true,
          apiList: [
            {
              apiId: 15,
              apiName:'GetBatchList',
            }
          ]
        },
      ]
    }
  ]*/
  constructor(protected ref: NbDialogRef<DialogCreateUserRoleComponent>,
              private fb: FormBuilder,
              private service: UserRoleData,
              private router: Router,
              private toastrService: NbToastrService,) { }

  ngOnInit() {
    this.isHomeChecked=false;
    /*this.service.getScreenRoleList().subscribe(response => {
      if(response['responseCode'] === "200"){
        console.log(response['data']);
        this.ScreenObj = response['data'];
        //console.log(this.ScreenObj);
      }
      let indexCount = 0;
      while(indexCount < this.ScreenObj.length){
        this.getScreens(this.ScreenObj[indexCount]['screenName']);
        indexCount++;
      }
    })*/

    this.mainForm = this.fb.group({
      RoleName: '',
      /*Home: this.fb.group({
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
      }),*/
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
  
  changeTick(e, item){
    console.log(item.value);
    //console.log((this.mainForm.get('Home').get('items') as FormArray).controls[1].value.API);
    //console.log((this.mainForm.get('Home').get('items') as FormArray).controls);
    //console.log(type);
    /*let indexCount = 0;
    while(indexCount < this.plantList.length){
      if(this.plantList[indexCount]['name'] === type['name']){
        this.plantList[indexCount]['checked'] = !this.plantList[indexCount]['checked'];
      }
      indexCount++;
    }*/
  }
  
  changeChildTick(e, type, i, j, module){
    (this.mainForm.get(module).get('items') as FormArray).controls[i].value.API[j].isChecked 
    = !(this.mainForm.get(module).get('items') as FormArray).controls[i].value.API[j].isChecked;
  }

  isDisabled(i, j, module){
    return !(this.mainForm.get(module).get('items') as FormArray).controls[i].value.isChecked;
  }

  onSubmit(){
    let roleObj = this.mainForm.value;
    this.service.createRole(roleObj).subscribe(response => {
      if(response['responseCode'] === '200' && response['data']['result'] === 'Success'){
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/usermanagement/userrole']);
        });
        this.ref.close();
      }
      else{
        this.showToast('top-right','danger','Create User Failed');
      }
    });

  }

  getScreens(screenName){
    let indexCount = 0;
    while(indexCount < this.ScreenObj.length){
      if(this.ScreenObj[indexCount]['screenName'] === screenName){
        this.childrenArray = this.ScreenObj[indexCount]['screenChildren'];
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
        });
        this.initializeScreensInDialog(screenName, this.formArrayItems);
        //console.log('this.formArrayItems:',this.formArrayItems);
        itemIndex++;
        this.formArrayItems = [];
      }
      //console.log('this.formArrayItems:',this.formArrayItems);
    }
  }

  initializeScreensInDialog(screenName: string, dataArray){
    let stageName = '';

    const details = this.mainForm.get(screenName).get('items') as FormArray;
    let itemIndex = 0;
    while(itemIndex < dataArray.length){
      let childItemIndex=0;
      let childItem=[];
      while(childItemIndex < dataArray[itemIndex]['API'].length){
        childItem.push({
          apiId: dataArray[itemIndex]['API'][childItemIndex]['apiId'],
          apiName: dataArray[itemIndex]['API'][childItemIndex]['apiName'],
          isChecked: false,
        })
        childItemIndex++;
      }
      //console.log('child: ', childItem);
      details.push(this.fb.group({
        screenId: dataArray[itemIndex]['screenId'],
        screenName: dataArray[itemIndex]['screenName'],
        name: dataArray[itemIndex]['displayName'],
        isChecked: false,
        API: this.fb.array(childItem),//dataArray[itemIndex]['API']),
      }));
      itemIndex++;
    }
  }

  buildLineItemObj(itemObj){
    this.returnItemObj =[];
    console.log(this.ScreenObj);
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
      { position, status }
    );
  }
}
