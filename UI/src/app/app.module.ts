/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */

import { registerLocaleData } from '@angular/common';
//import localeFr from '@angular/common/locales/fr';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule, APP_INITIALIZER, LOCALE_ID } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { CoreModule } from './@core/core.module';
import { ThemeModule } from './@theme/theme.module';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import {
  NbChatModule,
  NbDatepickerModule,
  NbDialogModule,
  NbMenuModule,
  NbSidebarModule,
  NbToastrModule,
  NbWindowModule,
  NbCardModule,
  NbButtonModule,
  NbTreeGridModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbStepperModule,
  NbTabsetModule,
  NbAccordionModule,
  NbCheckboxModule,
  NbTooltipModule,
  NbListModule,
} from '@nebular/theme';
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';

//import { MatTableModule } from '@angular/material';

import { NgxAuthModule } from './customauth/customauth.module';
import { LoginService } from '../../src/app/api-class/service/login-api.service';
import { AppConfigService } from './app-config.service';
import { UserRoleEditDialogComponent } from './pages/usermanagement/user-role-edit-dialog/user-role-edit-dialog.component';
import { CreateUserDialogComponent } from './pages/usermanagement/create-user-dialog/create-user-dialog.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { NeedAuthValidation } from './api-class/service/need-auth-validation.service'
import { ButtonSelectRenderComponent } from './pages/usermanagement/create-user-dialog/button-select-user.render.component';//'./pages/usermanagement/button-select-user.render.component';
import { DialogAddBomStageMappingComponent } from './pages/mastersettings/bom-stage-mapping/dialog-add-bom-stage-mapping/dialog-add-bom-stage-mapping.component';
import { DialogAddNewItemComponent } from './pages/mastersettings/bom-stage-mapping/dialog-add-new-item/dialog-add-new-item.component';
import { DialogEditExistingItemComponent } from './pages/mastersettings/bom-stage-mapping/dialog-edit-existing-item/dialog-edit-existing-item.component';
import { ButtonDeleteRenderComponent } from './pages/mastersettings/bom-stage-mapping/button-delete-mapping.render.component';
import { DialogDeleteBomStageMappingComponent } from './pages/mastersettings/bom-stage-mapping/dialog-delete-bom-stage-mapping/dialog-delete-bom-stage-mapping.component';
import { DialogAddPlanttankmappingComponent } from './pages/mastersettings/planttankmapping/dialog-add-planttankmapping/dialog-add-planttankmapping.component';
import { ButtonAddRenderComponent } from './pages/mastersettings/bom-stage-mapping/button-add-mapping.render.component';
import { ButtonEditRenderComponent } from './pages/mastersettings/bom-stage-mapping/button-edit-mapping.render.component';
import { DialogStringifiedReturnloadComponent } from './pages/report/audit-trail/dialog-stringified-returnload/dialog-stringified-returnload.component';
import { DialogSelectRoleComponent } from './pages/usermanagement/user-access-listing/dialog-select-role/dialog-select-role.component';
import { DialogSelectPlantComponent } from './pages/usermanagement/user-access-listing/dialog-select-plant/dialog-select-plant.component';
import { DialogEditUserRoleComponent } from './pages/usermanagement/user-role/dialog-edit-user-role/dialog-edit-user-role.component';
import { DialogCreateUserRoleComponent } from './pages/usermanagement/user-role/dialog-create-user-role/dialog-create-user-role.component';
import { SpikesNg2ComponentsModule } from 'spikes-ng2-components';
import { DialogCreateUserComponent } from './pages/usermanagement/dialog-create-user/dialog-create-user.component';
import {ButtonEditSFWRenderComponent} from './pages/mastersettings/DefaultSFWRatioMapping/button-edit-defaultSFW.render.component';
import {DialogEditDefaultSFWRatioComponent} from './pages/mastersettings/DefaultSFWRatioMapping/dialog-edit-defaultSFWRatio/dialog-edit-defaultSFWRatio.component';
import {DialogEditDefaultSFWFlushComponent} from './pages/mastersettings/DefaultSFWRatioMapping/dialog-edit-defaultSFWFlush/dialog-edit-defaultSFWFlush.component';
import { ButtonDeleteRatioRenderComponent } from './pages/mastersettings/custom-ratio-mapping/button-delete-mapping.render.component'
import { ButtonEditRatioRenderComponent } from './pages/mastersettings/custom-ratio-mapping/button-edit-mapping.render.component'
import { DialogAddCustomRatioMappingComponent} from './pages/mastersettings/custom-ratio-mapping/dialog-add-custom-ratio/dialog-add-custom-ratio.component';
import { DialogDeleteCustomRatioComponent} from './pages/mastersettings/custom-ratio-mapping/dialog-delete-custom-ratio/dialog-delete-custom-ratio.component';
import {DialogEditExistingCustomItemComponent} from './pages/mastersettings/custom-ratio-mapping/dialog-edit-existing-item/dialog-edit-existing-item.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {DialogAddStationMasterComponent} from './pages/mastersettings/stationmaster/dialog-add-stationmaster/dialog-add-stationmaster.component';
import {DialogAddLocationMasterComponent} from './pages/mastersettings/locationmaster/dialog-add-locationmaster/dialog-add-locationmaster.component';

//registerLocaleData(localeFr, 'fr');
@NgModule({
  declarations: [
    AppComponent,
    UserRoleEditDialogComponent,
    CreateUserDialogComponent,
    ButtonSelectRenderComponent,
    DialogAddBomStageMappingComponent,
    DialogAddNewItemComponent,
    DialogEditExistingItemComponent,
    ButtonDeleteRenderComponent,
    DialogDeleteBomStageMappingComponent,
    DialogAddPlanttankmappingComponent,
    ButtonAddRenderComponent,
    ButtonEditRenderComponent,
    DialogStringifiedReturnloadComponent,
    DialogSelectRoleComponent,
    DialogSelectPlantComponent,
    DialogEditUserRoleComponent,
    DialogCreateUserRoleComponent,
    ButtonEditSFWRenderComponent,
    DialogEditDefaultSFWRatioComponent,
    DialogEditDefaultSFWFlushComponent,
    ButtonDeleteRatioRenderComponent,
    ButtonEditRatioRenderComponent,
    DialogAddCustomRatioMappingComponent,
    DialogDeleteCustomRatioComponent,
    DialogEditExistingCustomItemComponent,
    DialogAddStationMasterComponent,
    DialogAddLocationMasterComponent,
  ],

  imports: [
    AutocompleteLibModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxAuthModule,
    ThemeModule.forRoot(),
    NbSidebarModule.forRoot(),
    NbMenuModule.forRoot(),
    NbDatepickerModule.forRoot(),
    NbDialogModule.forRoot(),
    NbWindowModule.forRoot(),
    NbToastrModule.forRoot(),
    NbChatModule.forRoot({
      messageGoogleMapKey: 'AIzaSyA_wNuCzia92MAmdLRzmqitRGvCF7wCZPY',
    }),
    CoreModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    NbCardModule,
    Ng2SmartTableModule,
    NbButtonModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    NbSelectModule,
    NbStepperModule,
    NbTabsetModule,
    NbAccordionModule,
    NbCheckboxModule,
    NbTooltipModule,
    SpikesNg2ComponentsModule,
    NbListModule

  ],
  entryComponents: [
    UserRoleEditDialogComponent,
    CreateUserDialogComponent,
    ButtonSelectRenderComponent,
    DialogAddBomStageMappingComponent,
    DialogAddNewItemComponent,
    DialogEditExistingItemComponent,
    ButtonDeleteRenderComponent,
    DialogDeleteBomStageMappingComponent,
    DialogAddPlanttankmappingComponent,
    ButtonAddRenderComponent,
    ButtonEditRenderComponent,
    DialogStringifiedReturnloadComponent,
    DialogSelectRoleComponent,
    DialogSelectPlantComponent,
    DialogEditUserRoleComponent,
    DialogCreateUserRoleComponent,
    ButtonEditSFWRenderComponent,
    DialogEditDefaultSFWRatioComponent,
    DialogEditDefaultSFWFlushComponent,
    ButtonDeleteRatioRenderComponent,
    ButtonEditRatioRenderComponent,
    DialogAddCustomRatioMappingComponent,
    DialogDeleteCustomRatioComponent,
    DialogEditExistingCustomItemComponent,
    DialogAddStationMasterComponent,
    DialogAddLocationMasterComponent,
  ],


  bootstrap: [AppComponent],
  providers: [
    LoginService,
    NeedAuthValidation,
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [AppConfigService],
      useFactory: (appConfigService: AppConfigService) => {
        return () => {
          //Make sure to return a promise!
          return appConfigService.loadAppConfig();
        };
      },
    },
    /*{ provide: LOCALE_ID,
      useValue: 'fr' },*/
  ],
})
export class AppModule {
}
