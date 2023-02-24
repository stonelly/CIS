import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MasterSettingsComponent } from './mastersettings.component';
//import { BommappingComponent } from './bommapping/bommapping.component';
import { PlanttankmappingComponent } from './planttankmapping/planttankmapping.component';
import { StageordermappingComponent } from './stageordermapping/stageordermapping.component';
import { BOMStageMappingComponent } from './bom-stage-mapping/bom-stage-mapping.component';
import { ScreenMasterComponent } from './screen-master/screen-master.component';
import { DefaultSFWRatioComponent } from './DefaultSFWRatioMapping/DefaultSFWRatio.component';
import {CustomRatioMappingComponent} from './custom-ratio-mapping/custom-ratio-mappingcomponent';
import {StationMasterComponent} from './stationmaster/stationmaster.component';
import {LocationMasterComponent} from './locationmaster/locationmaster.component';
const routes: Routes = [{
  path: '',
  component: MasterSettingsComponent,
  children: [
    {
      path: 'itemmastermapping',
      component: BOMStageMappingComponent, //BommappingComponent,
    },
    {
      path: 'planttankmapping',
      component: PlanttankmappingComponent,
    },
    {
      path: 'cpdstagemapping',
      component: StageordermappingComponent,
    },
    {
      path: 'screenmaster',
      component: ScreenMasterComponent,
    },
    {
      path: 'defaultratiosfw',
      component: DefaultSFWRatioComponent,
    },
    {
      path: 'customratiosfw',
      component: CustomRatioMappingComponent
    },
    {
      path: 'stationmaster',
      component: StationMasterComponent
    },
    {
      path: 'locationmaster',
      component: LocationMasterComponent
    }
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MasterSettingsRoutingModule { }

export const routedComponents = [
    //BommappingComponent,
    PlanttankmappingComponent,
    StageordermappingComponent,
    BOMStageMappingComponent,
    ScreenMasterComponent,
    DefaultSFWRatioComponent,
    StationMasterComponent,
    LocationMasterComponent
];
