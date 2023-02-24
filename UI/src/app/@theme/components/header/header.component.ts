import { Component, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { NbMediaBreakpointsService, NbMenuService, NbSidebarService, NbThemeService, NbMenuItem } from '@nebular/theme';

import { UserData } from '../../../@core/data/users';
import { LayoutService } from '../../../@core/utils';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { SessionStorage, SessionStorageService } from 'angular-web-storage'
import { NbIconLibraries } from '@nebular/theme';
import { BatchListData } from '../../../@core/data/batchlist';
import { CpdTrackingData } from '../../../@core/data/cpdtracking';

@Component({
  selector: 'ngx-header',
  styleUrls: ['./header.component.scss'],
  templateUrl: './header.component.html',
})

export class HeaderComponent implements OnInit, OnDestroy {
  private destroy$: Subject<void> = new Subject<void>();
  userPictureOnly: boolean = false;
  user: any;

  themes = [
    {
      value: 'default',
      name: 'Light',
    },
    {
      value: 'dark',
      name: 'Dark',
    },
    {
      value: 'cosmic',
      name: 'Cosmic',
    },
    {
      value: 'corporate',
      name: 'Corporate',
    },
  ];

  plants = [ ];

  currentTheme = 'default';

  currentPlant = '';

  userMenu = [  /*{ title: 'Profile', icon: 'person'}, */
               // { title: 'Notification', icon: 'bell-outline'},//{ icon: 'notification-true', pack: 'external'}},
                { title: 'Log out', icon: 'log-out-outline'} ];

  currentUserName = this.sessionStorageService.get('S_Name') + ' - ' +this.sessionStorageService.get('S_Location');
  currentUserAvatar = this.sessionStorageService.get('S_base64img');

  constructor(private sidebarService: NbSidebarService,
              private menuService: NbMenuService,
              private themeService: NbThemeService,
              private userService: UserData,
              private layoutService: LayoutService,
              private breakpointService: NbMediaBreakpointsService,
              private sessionStorageService: SessionStorageService,
              private iconLibraries: NbIconLibraries, 
              private batchlistService: BatchListData,
              private cpdTrackingService: CpdTrackingData) {

    /*this.plants = [
      {
        value: '1',
        name: 'Plant 1',
      },
      {
        value: '2',
        name: 'Plant 2',
      },
      {
        value: '3',
        name: 'Plant 3',
      },
      {
        value: '4',
        name: 'Plant 4',
      },
      {
        value: '5',
        name: 'Plant 5',
      },
      {
        value: '6',
        name: 'Plant 6',
      },
    ];*/

    this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.currentUser);
    this.iconLibraries.registerFontPack('fa', { packClass: 'fa', iconClassPrefix: 'fa' });
    this.iconLibraries.registerSvgPack('external', { 
                                                      'notification-false': '<img src="../../../../assets/icons/notification-false.png" width="25px">', 
                                                      'notification-true': '<img src="../../../../assets/icons/notification-true.png" >', 
                                                    });

  }

  ngOnInit() {
    this.currentTheme = this.themeService.currentTheme;

    /*this.userService.getUsers()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users.currentUser);*/

    const { xl } = this.breakpointService.getBreakpointsMap();
    this.themeService.onMediaQueryChange()
      .pipe(
        map(([, currentBreakpoint]) => currentBreakpoint.width < xl),
        takeUntil(this.destroy$),
      )
      .subscribe((isLessThanXl: boolean) => this.userPictureOnly = isLessThanXl);

    this.themeService.onThemeChange()
      .pipe(
        map(({ name }) => name),
        takeUntil(this.destroy$),
      )
      .subscribe(themeName => this.currentTheme = themeName);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  changePlant(plantId: string) {
    this.batchlistService.changePlant(plantId);
    this.cpdTrackingService.changePlant(plantId);
    this.sessionStorageService.set('S_CurrentPlant', plantId);
  }

  changeTheme(themeName: string) {
    this.themeService.changeTheme(themeName);
  }

  toggleSidebar(): boolean {
    this.sidebarService.toggle(true, 'menu-sidebar');
    this.layoutService.changeLayoutSize();

    return false;
  }

  navigateHome() {
    this.menuService.navigateHome();
    return false;
  }

}
