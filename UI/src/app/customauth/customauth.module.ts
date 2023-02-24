import { CommonModule } from '@angular/common';
import { NgModule, } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { LoginFailDialogComponent } from './login-fail-dialog/login-fail-dialog.component';
import { NgxAuthRoutingModule } from './customauth-routing.module';
import { NbAuthModule } from '@nebular/auth';
import {
  NbAlertModule,
  NbButtonModule,
  NbCheckboxModule,
  NbInputModule,
  NbCardModule,
  NbSpinnerModule,
} from '@nebular/theme';

import { CustomLoginComponent } from './customlogin/customlogin.component';
import { CookieService } from 'ngx-cookie-service';
import { AngularWebStorageModule } from 'angular-web-storage';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    NbAlertModule,
    NbInputModule,
    NbButtonModule,
    NbCheckboxModule,
    NgxAuthRoutingModule,
    NbAuthModule,
    AngularWebStorageModule,
    NbCardModule,
    NbSpinnerModule,
  ],
  declarations: [
    CustomLoginComponent,
    LoginFailDialogComponent,
  ],
  providers:[
    CookieService,
  ],
  entryComponents: [
    LoginFailDialogComponent
  ],
})
export class NgxAuthModule {
}
