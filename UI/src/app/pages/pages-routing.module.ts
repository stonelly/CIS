import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';

import { PagesComponent } from './pages.component';
import { ReportComponent } from './report/report.component';
import { NotFoundComponent } from './miscellaneous/not-found/not-found.component';
import { CpdStatusComponent } from './cpdstatus/cpdstatus.component';
import { CheckInComponent } from './checkin/checkin.component';
import { MasterSettingsComponent } from './mastersettings/mastersettings.component';
import { NotificationComponent } from './notification/notification.component';
import { NeedAuthValidation } from '../api-class/service/need-auth-validation.service';
//import { NeedAuthValidation } from '../api-class/service/need-auth-validation.service';

const routes: Routes = [{
  path: '',
  component: PagesComponent,
  children: [
    {
      path: 'checkin',
      canActivate:[NeedAuthValidation],
      component: CheckInComponent,
    },
    // {
    //   path: 'mastersetting',
    //   canActivate:[NeedAuthValidation],
    //   loadChildren: () => import('./mastersettings/mastersettings.module')
    //     .then(m => m.MasterSettingsModule),
    // },
    {
      path: 'notification',
      component: NotificationComponent,
    },
    {
      path: '**',
      //redirectTo:'customauth/customlogin',
      component: NotFoundComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PagesRoutingModule {
}
