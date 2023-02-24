import { NgModule } from '@angular/core';
import { NbMenuModule } from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';
import { PagesComponent } from './pages.component';
import { DashboardModule } from './dashboard/dashboard.module';
import { ECommerceModule } from './e-commerce/e-commerce.module';
import { ReportModule } from './report/report.module';
import { PagesRoutingModule } from './pages-routing.module';
import { MiscellaneousModule } from './miscellaneous/miscellaneous.module';
import { CpdStatusModule } from './cpdstatus/cpdstatus.module';
import { MasterSettingsModule } from './mastersettings/mastersettings.module';
import { NotificationComponent } from './notification/notification.component';
import { DahsboardComponent } from './notification/dahsboard/dahsboard.component';
import { CheckinModule } from './checkin/checkin.module';
//import { CheckinComponent } from './checkin/checkin.component';



@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    DashboardModule,
    ECommerceModule,
    MiscellaneousModule,
    ReportModule,
    CpdStatusModule,
    MasterSettingsModule,
    CheckinModule,
  ],
  declarations: [
    PagesComponent,
    NotificationComponent,
    DahsboardComponent,
    //CheckinComponent,
  ],
})
export class PagesModule {
}
