import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { BatchListComponent } from './batchlist/batchlist.component';
import { BomGridComponent } from './bom-grid/bom-grid.component';
import { BatchlistHistoryComponent } from './batchlist-history/batchlist-history.component';
import { CpdTrackingComponent } from './cpdtracking/cpdtracking.component';
import { StepperComponent } from './stepper/stepper.component';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [{
  path: '',
  component: HomeComponent,
  children: [
    {
      path: 'cpdbatchorderlist',
      component: BatchListComponent,
    },
    {
      path: 'bom-grid',
      component: BomGridComponent,
    },
    /* {
      path: 'cpdtracking',
      loadChildren: () => import('./cpdtracking/cpdtracking.module')
        .then(m => m.CpdTrackingModule),
    }, */
    {
      path: 'cpdbatchordertracking',
      component: CpdTrackingComponent,
    },
    {
      path: 'stepper',
      component: StepperComponent,
    },
    {
      path: 'cpdbatchhistory',
      component: BatchlistHistoryComponent,
    },
    {
      path: 'dashboard',
      component: DashboardComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HomeRoutingModule { }

export const routedComponents = [
    BatchListComponent,
    BomGridComponent,
    CpdTrackingComponent,
    StepperComponent,
    DashboardComponent,
];
