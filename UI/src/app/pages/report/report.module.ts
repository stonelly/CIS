import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbInputModule,
  NbTreeGridModule,
  NbCheckboxModule,
  NbDatepickerModule,
  NbSpinnerModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { ReportComponent } from './report.component';
import { ReportRoutingModule } from './report-routing.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { CPDBatchTraceabilityComponent } from './cpd-batch-traceability/cpd-batch-traceability.component';
import {MaterialComsumptionComponent} from './material-comsumption/material-comsumption.component';
//import { DialogStringifiedReturnloadComponent } from './audit-trail/dialog-stringified-returnload/dialog-stringified-returnload.component';
import { ButtonRenderComponent } from './audit-trail/button.render.component';

@NgModule({
  imports: [
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbRadioModule,
    NbSelectModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    NbInputModule,
    NbTreeGridModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    ReportRoutingModule,
    Ng2SmartTableModule,
    NbCheckboxModule,
    NbDatepickerModule,
    NbSpinnerModule,
  ],
  declarations: [
    ReportComponent,
    AuditTrailComponent,
    CPDBatchTraceabilityComponent,
    //DialogStringifiedReturnloadComponent,
    ButtonRenderComponent,
    MaterialComsumptionComponent
  ],
  entryComponents:[
    ButtonRenderComponent,
  ],
})
export class ReportModule { }
