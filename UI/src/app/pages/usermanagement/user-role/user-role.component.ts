import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { CreateUserDialogComponent } from './../create-user-dialog/create-user-dialog.component';
import { DialogCreateUserRoleComponent } from './../user-role/dialog-create-user-role/dialog-create-user-role.component';
//import { ButtonSelectPlantMappingRenderComponent } from './../user-access-listing/buttonSelectPlantMapping.render.component';
//import {NeedAuthValidation} from './../../../api-class/service/need-auth-validation.service';
import { TokenService } from './../../../api-class/service/token.service';
import { DatePipe } from '@angular/common';
import { UserAccessData } from '../../../@core/data/useraccess';
import { UserRoleData } from '../../../@core/data/userrole';
//import { ButtonRoleMappingRenderComponent } from './buttonRoleMapping.render.component';
import { ButtonEditRoleRenderComponent } from './buttonEditRole.render.component';
import { DialogCreateUserComponent } from '../dialog-create-user/dialog-create-user.component';

@Component({
  selector: 'ngx-user-role',
  templateUrl: './user-role.component.html',
  styleUrls: ['./user-role.component.scss'],
})

export class UserRoleComponent implements OnInit {
  data;
  settings = {
    mode: 'external',
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
        
    columns: {
      roleName: {
        title: 'User Role',
        type: 'string',
        sortDirection: 'asc',
      },

      /*isDisabled: {
        title: 'Is Disabled',
        type: 'string',
        valuePrepareFunction: (isDisabled) => {
          if(isDisabled === true){
            return 'True';
          }
          else{
            return 'False';
          }
        },
      },*/
      
      buttonEditRole: {
        title: '',
        type: 'custom',
        renderComponent: ButtonEditRoleRenderComponent,
        width: '0.5em',
        defaultValue: 'View',
        valuePrepareFunction: (cell, row) => row,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: UserRoleData,
              private router: Router, 
              private dialogService: NbDialogService, 
              private tokenService: TokenService,) {

  }

  ngOnInit(){
    this.service.getRoleList()
    .subscribe(response => {
      if (response['responseCode'] === '200') {
        this.source.load(response['data']);
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

  accessUserPage (event){
    this.router.navigate(['./pages/usermanagement/user-access']);
  }

  openDialog(){
    this.dialogService.open(DialogCreateUserRoleComponent, {
      /*context: {
        title: 'Create User' ,
      },*/
      closeOnBackdropClick: false,
      closeOnEsc: false, 
    });
  }

  openCreateUser(event: Event){
    this.router.navigate(['./pages/usermanagement/create-new-user']); 
  }
}

