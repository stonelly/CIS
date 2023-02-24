/**
 * @license
 * Copyright Akveo. All Rights Reserved.
 * Licensed under the MIT License. See License.txt in the project root for license information.
 */
import { Component, OnInit } from '@angular/core';
import { AnalyticsService } from './@core/utils/analytics.service';
import { BatchListData } from './@core/data/batchlist';
import { NbMenuService } from '@nebular/theme';
import { Router } from '@angular/router';
import { SessionStorage, SessionStorageService } from 'angular-web-storage';

@Component({
  selector: 'ngx-app',
  template: '<router-outlet></router-outlet>',
})
export class AppComponent implements OnInit {
  private sub:any = null;
  constructor(private analytics: AnalyticsService, 
              private menuService: NbMenuService, 
              private router: Router,
              private sessionStorageService: SessionStorageService,
              private batchListService: BatchListData,) {
    this.menuService.onItemClick()
    .subscribe((event) => {
      this.onContextItemSelection();
      this.onMenuOptionClicked(event.item.title);
  });
  }

  ngOnInit(): void {
    this.analytics.trackPageViews();
  }

  onContextItemSelection() {
  }

  onMenuOptionClicked(title) {
    //console.log('click', title);

    if(title == "Profile"){
    }
    if(title == "Notification"){
      this.router.navigate(['/pages/home/dashboard']);
    }
    if(title == "Log out"){
      this.sessionStorageService.clear();
      this.router.navigate(['/#']);
      /*this.batchListService.currentPlant.subscribe( plant => {
        console.log('log out before', plant);
        plant = ''; 
        console.log('log out after', plant);
      });*/
      //this.router.navigateByUrl('./pages/home/batchlist/batchlist.component.html', {skipLocationChange: true}).then(()=>
      //this.router.navigate(["/#"])); 
      if (this.sub != null) {
        this.sub.unsubscribe();
      }
    }
  }

  ngOnDestroy() {
    if (this.sub != null) {
        this.sub.unsubscribe();
    }
} 
}
