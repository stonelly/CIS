import { Component } from '@angular/core';

import { MENU_ITEMS } from './pages-menu';
import { SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu" class="print"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})
export class PagesComponent {
  constructor(private sessionStorageService: SessionStorageService){}
  //original menu
  menu = MENU_ITEMS;

  //menu = this.sessionStorageService.get('S_ScreenList');
}
