import { NgModule } from '@angular/core';
import {  NbCardModule, 
          NbIconModule, 
          NbInputModule, 
          NbTreeGridModule, 
          NbActionsModule,
          NbButtonModule,
          NbRadioModule,
          NbSelectModule,
          NbLayoutModule,
          NbTooltipModule,
           } from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';

import { ThemeModule } from '../../@theme/theme.module';
import { UserManagementRoutingModule } from './usermanagement-routing.module';
import { UserManagementComponent } from './usermanagement.component';
//import { UserAccessComponent } from './useraccess/useraccess.component';
import { UserRoleComponent } from './user-role/user-role.component';
import { UserAccessListingComponent } from './user-access-listing/user-access-listing.component';
import { UserAccessComponent } from './user-access/user-access.component';
//import { UserRoleEditComponent } from './user-role-edit/user-role-edit.component';
import { UserRoleEditDialogComponent } from './user-role-edit-dialog/user-role-edit-dialog.component';
import { CreateUserDialogComponent } from './create-user-dialog/create-user-dialog.component';
import { DialogCreateUserComponent } from './dialog-create-user/dialog-create-user.component';
import { ButtonRoleMappingRenderComponent } from './user-access-listing/buttonRoleMapping.render.component';
import { ButtonPlantMappingRenderComponent } from './user-access-listing/buttonPlantMapping.render.component';
import { ButtonHistoryViewRenderComponent } from '../home/batchlist-history/buttonView.render.component';
import { ButtonEditRoleRenderComponent } from './user-role/buttonEditRole.render.component';
//import { DialogCreateUserRoleComponent } from './user-role/dialog-create-user-role/dialog-create-user-role.component';
//import { DialogSelectPlantComponent } from './user-access-listing/dialog-select-plant/dialog-select-plant.component';
//import { DialogSelectRoleComponent } from './user-access-listing/dialog-select-role/dialog-select-role.component';
//import { CreateNewUserComponent } from './create-new-user/create-new-user.component';
//import { ButtonSelectRenderComponent } from './create-user-dialog/button-select-user.render.component';

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    ThemeModule,
    UserManagementRoutingModule,
    Ng2SmartTableModule,
    NbActionsModule,
    NbButtonModule, 
    NbRadioModule,
    NbSelectModule,
    NbLayoutModule,
    NbTooltipModule,
  ],
  declarations: [
    UserManagementComponent,
    UserRoleComponent,
    UserAccessListingComponent,
    UserAccessComponent,
    DialogCreateUserComponent,
    ButtonRoleMappingRenderComponent,
    ButtonPlantMappingRenderComponent,
    ButtonEditRoleRenderComponent,
    //DialogCreateUserRoleComponent,
    //DialogSelectPlantComponent,
    //DialogSelectRoleComponent,
    //ButtonSelectRenderComponent,
    //UserAccessComponent,
    //UserRoleEditComponent,
    //CreateNewUserComponent,
    //CreateUserDialogComponent, // imported in app.module.ts
    //UserRoleEditDialogComponent, // imported in app.module.ts
  ],
  entryComponents: [
    //ButtonSelectRenderComponent,
    //UserRoleEditDialogComponent,
    //CreateUserDialogComponent,
    ButtonRoleMappingRenderComponent,
    ButtonPlantMappingRenderComponent,
    ButtonEditRoleRenderComponent,
    //DialogSelectRoleComponent,
  ],
})
export class UserManagementModule { }
