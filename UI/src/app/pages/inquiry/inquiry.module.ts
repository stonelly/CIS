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
  NbTooltipModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { InquiryComponent } from './inquiry.component';
import { InquiryRoutingModule } from './inquiry-routing.module';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ChemicalItemConsumptionComponent } from './chemical-item-consumption/chemical-item-consumption.component';
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
    NbTooltipModule,
    NgxEchartsModule,
    NbInputModule,
    NbTreeGridModule,
    MatTableModule,
    FormsModule,
    ReactiveFormsModule,
    InquiryRoutingModule,
  ],
  declarations: [
    InquiryComponent,
    ChemicalItemConsumptionComponent,
  ],
  entryComponents:[
    ChemicalItemConsumptionComponent,
  ]
})
export class InquiryModule { }
