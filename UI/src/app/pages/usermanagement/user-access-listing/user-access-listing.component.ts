import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { CreateUserDialogComponent } from './../create-user-dialog/create-user-dialog.component';
//import { ButtonSelectPlantMappingRenderComponent } from './../user-access-listing/buttonSelectPlantMapping.render.component';
//import {NeedAuthValidation} from './../../../api-class/service/need-auth-validation.service';
import { TokenService } from './../../../api-class/service/token.service';
import { DatePipe } from '@angular/common';
import { UserAccessData } from '../../../@core/data/useraccess';
import { ButtonRoleMappingRenderComponent } from './buttonRoleMapping.render.component';
import { ButtonPlantMappingRenderComponent } from './buttonPlantMapping.render.component';
import { AUTO_STYLE } from '@angular/animations';

@Component({
  selector: 'ngx-user-access-listing',
  templateUrl: './user-access-listing.component.html',
  styleUrls: ['./user-access-listing.component.scss'],
})

export class UserAccessListingComponent implements OnInit {
  data;
  settings = {
    mode: 'external',
    actions: {
      add: false,
      delete: false,
      edit: false,
      /*custom: [ { name: 'routeToUserAccessPage', 
                  title: '<i class="nb-search"></i>'
                },
              ]*/
    },
    
    /*add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-search"></i>',
    },*/
    
    columns: {
      /*Actions:{
        title: 'Action',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return '<a title="View user" href="./pages/tables/smart-table"> <i class="nb-search"></i></a>'
        },
        filter: false,
        position: 'center',
      },*/

      /*id: {
        title: 'ID',
        type: 'number',
      },*/

      userId: {
        title: 'User ID',
        type: 'string',
        sortDirection: 'asc',
      },

      userName: {
        title: 'User Name',
        type: 'string',
      },

      buttonSelectPlantMapping: {
        title: 'Plant',
        type: 'custom',
        renderComponent: ButtonPlantMappingRenderComponent,
        width: '5%',
        defaultValue: 'View',
        //valuePrepareFunction: (value) => value,
        valuePrepareFunction: (cell, row) => row,
      },

      buttonSelectRoleMapping: {
        title: 'Role',
        type: 'custom',
        renderComponent: ButtonRoleMappingRenderComponent,
        width: 'auto',//'12%',
        defaultValue: 'View',
        //valuePrepareFunction: (value) => value,
        valuePrepareFunction: (cell, row) => row,
      },

      lastLogin: {
        title: 'Last Login',
        type: 'string',
        valuePrepareFunction: (lastLogin) => {
          if(lastLogin){
            return new DatePipe('en-MY').transform(lastLogin, 'dd/MM/yyyy HH:mm:ss');
          }
          else{
            return null;
          }
        },
      },

      createdDate: {
        title: 'Created Date',
        type: 'string',
        valuePrepareFunction: (CreatedDate) => {
          if(CreatedDate){
            return new DatePipe('en-MY').transform(CreatedDate, 'dd/MM/yyyy HH:mm:ss');
          }
          else{
            return null;
          }
        },
      },

      isDisabled: {
        title: 'Inactive',
        type: 'string',
        width:'5%',
        valuePrepareFunction: (isDisabled) => {
          if(isDisabled === true){
            return 'True';
          }
          else{
            return 'False';
          }
        },
      },
      
      isLocalAccount: {
        title: 'Acc',
        type: 'string',
        width:'5%',
        valuePrepareFunction: (isLocalAccount) => {
          if(isLocalAccount === true){
            return 'System';
          }
          else{
            return 'AD';
          }
        },
      },

      /*status: {
        title: 'Status',
        type: 'string',
      },

      userRole: {
        title: 'Role',
        type: 'string',
      },*/

      /* buttonColumn:{
        title: 'Last',
        type: 'html',
        valuePrepareFunction: (cell, row) => {
          return '<button>Go</button>'
        },
        filter: false,
        position: 'center',
      }, */
    },
  };

  source: LocalDataSource = new LocalDataSource();

  //constructor(private service: SmartTableData) {
  constructor(private service: UserAccessData, 
              private router: Router, 
              private dialogService: NbDialogService, 
              private tokenService: TokenService,
              /*private needAuth: NeedAuthValidation*/) {

  }

  ngOnInit(){
    this.service.getUserListing()
    .subscribe(response => {
      if (response['responseCode'] === '200') {
        this.source.load(response['data']);
        //console.log(response['data']);
      }
      else{
        console.log(response);
      }
    });
  }

  onDeleteConfirm(event): void {  
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  /*navigateToPage(event){
    switch (event.action) {
      case 'routeToUserAccessPage':
        this.accessUserPage(event.data);
        break;
    }
  }*/

  /*accessUserPage (formData: any){
    this.router.navigate(['./pages/tables/smart-table']);
//    this.router.navigate(['./pages/tables/smart-table'], {queryParams: {user: this.service.getData().}});
  }*/

  accessUserPage (event){
    this.router.navigate(['./pages/usermanagement/user-access']);
//    this.router.navigate(['./pages/tables/smart-table'], {queryParams: {user: this.service.getData().}});
  }

  openDialog(){
    this.dialogService.open(CreateUserDialogComponent, {
      context: {
        title: 'Create User' ,
      },
      closeOnBackdropClick: false,
      closeOnEsc: false, 
    });

    //console.log(NeedAuthValidation);
    //console.log(this.tokenService.isLogged());
  }

  openCreateUser(event: Event){
    this.router.navigate(['./pages/usermanagement/create-new-user']); //../create-new-user/create-new-user.component.html']);
    //this.router.navigate(['./pages/usermanagement/user-access']);
  }

}
