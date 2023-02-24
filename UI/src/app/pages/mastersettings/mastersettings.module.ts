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
  NbAccordionModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { MasterSettingsRoutingModule } from './mastersettings-routing.module';
import { MasterSettingsComponent } from './mastersettings.component';
import { StageordermappingComponent } from './stageordermapping/stageordermapping.component';
import { PlanttankmappingComponent } from './planttankmapping/planttankmapping.component';
//import { BommappingComponent } from './bommapping/bommapping.component';
import { BOMStageMappingComponent } from './bom-stage-mapping/bom-stage-mapping.component';
import { Ng2SmartTableModule } from 'ng2-smart-table';
//import { DialogAddBomStageMappingComponent } from './bom-stage-mapping/dialog-add-bom-stage-mapping/dialog-add-bom-stage-mapping.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DialogMappingAddedSuccessfullyComponent } from './bom-stage-mapping/dialog-mapping-added-successfully/dialog-mapping-added-successfully.component';
import { ScreenMasterComponent } from './screen-master/screen-master.component';
import {DefaultSFWRatioComponent} from './DefaultSFWRatioMapping/DefaultSFWRatio.component';
import {CustomRatioMappingComponent} from './custom-ratio-mapping/custom-ratio-mappingcomponent';
import { StationMasterComponent } from './stationmaster/stationmaster.component';
//import { AddStationMasterComponent } from './stationmaster/addstationmaster/addstationmaster.component';
import { LocationMasterComponent } from './locationmaster/locationmaster.component';
//import { AddlocationmasterComponent } from './location/locationmaster/addlocationmaster/addlocationmaster.component';
//import { DialogEditExistingItemComponent } from './bom-stage-mapping/dialog-edit-existing-item/dialog-edit-existing-item.component';
//import { DialogAddNewItemComponent } from './bom-stage-mapping/dialog-add-new-item/dialog-add-new-item.component';
//import { DialogAddPlanttankmappingComponent } from './planttankmapping/dialog-add-planttankmapping/dialog-add-planttankmapping.component';
//import { DialogDeleteBomStageMappingComponent } from './bom-stage-mapping/dialog-delete-bom-stage-mapping/dialog-delete-bom-stage-mapping.component';

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
    Ng2SmartTableModule,
    NbAccordionModule,
    FormsModule,
    ReactiveFormsModule,
    MasterSettingsRoutingModule
  ],
  declarations: [
    MasterSettingsComponent,
    StageordermappingComponent,
    PlanttankmappingComponent,
    //DialogAddBomStageMappingComponent,
    BOMStageMappingComponent,
    DialogMappingAddedSuccessfullyComponent,
    ScreenMasterComponent,
    DefaultSFWRatioComponent,
    CustomRatioMappingComponent,
    StationMasterComponent,
    //AddStationMasterComponent,
    LocationMasterComponent,
    //DialogEditExistingItemComponent,
    //DialogAddNewItemComponent,
    //DialogAddPlanttankmappingComponent,
    //DialogDeleteBomStageMappingComponent,
    //BommappingComponent,
  ],
  entryComponents:[
    //DialogAddBomStageMappingComponent,
    //DialogAddNewItemComponent,
  ],
})
export class MasterSettingsModule { }
