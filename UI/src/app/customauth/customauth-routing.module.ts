import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { NbAuthComponent } from '@nebular/auth';

import { CustomLoginComponent } from './customlogin/customlogin.component';

export const routes: Routes = [
    {
        path: 'customauth',
        component: NbAuthComponent,
        children: [
            {
                path: 'customlogin',
                component: CustomLoginComponent,
            },
        ],
    },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class NgxAuthRoutingModule {
}