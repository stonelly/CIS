import { Component } from '@angular/core';

@Component({
  selector: 'ngx-two-columns-layout',
  styleUrls: ['./two-columns.layout.scss'],
  template: `
    <nb-layout windowMode [withScroll]="false">
      <nb-layout-header class="layout-header" fixed>
        <ngx-header></ngx-header>
      </nb-layout-header>

      <nb-sidebar class="menu-sidebar" tag="menu-sidebar" responsive state="compacted">
        <ng-content select="nb-menu"></ng-content>
      </nb-sidebar>

      <nb-layout-column class="small">
      </nb-layout-column>

      <nb-layout-column style="padding: 0.5rem 0.5rem 0.75rem">
        <ng-content select="router-outlet"></ng-content>
      </nb-layout-column>

      <nb-layout-footer class="layout-footer" fixed>
        <ngx-footer></ngx-footer>
      </nb-layout-footer>

    </nb-layout>
  `,
})
export class TwoColumnsLayoutComponent {}
