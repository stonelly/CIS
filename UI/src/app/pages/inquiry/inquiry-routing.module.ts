import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InquiryComponent } from './inquiry.component';
import { ChemicalItemConsumptionComponent } from './chemical-item-consumption/chemical-item-consumption.component';

const routes: Routes = [{
  path: '',
  component: InquiryComponent,
  children: [
    {
      path: 'cpdbatchsheet',
      component: ChemicalItemConsumptionComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InquiryRoutingModule { }

export const routedComponents = [
    ChemicalItemConsumptionComponent,
];
