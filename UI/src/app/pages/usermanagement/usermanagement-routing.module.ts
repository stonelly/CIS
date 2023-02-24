import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { UserManagementComponent } from './usermanagement.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserAccessListingComponent } from './user-access-listing/user-access-listing.component';
import { UserAccessComponent } from './user-access/user-access.component';
//import { UserRoleEditComponent } from './user-role-edit/user-role-edit.component';
//import { CreateNewUserComponent } from './create-new-user/create-new-user.component';



const routes: Routes = [{
  path: '',
  component: UserManagementComponent,
  children: [
    {
      path: 'useraccess',
      component: UserAccessListingComponent,
    },
    {
      path: 'user-access',
      component: UserAccessComponent,
    },
    {
      path: 'userrole',
      component: UserRoleComponent,
    },
    {
      //path: 'user-role-edit',
      //component: UserRoleEditComponent,
    },
    {
      //path: 'create-new-user',
      //component: CreateNewUserComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserManagementRoutingModule { }

export const routedComponents = [
    UserAccessComponent,
    UserRoleComponent,
    UserAccessListingComponent,
    //CreateNewUserComponent,
];
