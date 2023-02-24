import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ReportComponent } from './report.component';
import { AuditTrailComponent } from './audit-trail/audit-trail.component';
import { CPDBatchTraceabilityComponent } from './cpd-batch-traceability/cpd-batch-traceability.component';

const routes: Routes = [{
  path: '',
  component: ReportComponent,
  children: [
    {
      path: 'auditlog',
      component: AuditTrailComponent,
    },
    {
      path: 'traceability',
      component: CPDBatchTraceabilityComponent,
    },
  ],
}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ReportRoutingModule { }

export const routedComponents = [
    AuditTrailComponent,
    CPDBatchTraceabilityComponent,
];
