import {CanActivate, Router} from '@angular/router';
import {Injectable} from '@angular/core';
import {TokenService} from './token.service';
import {ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router/';
import { SessionStorageService } from 'angular-web-storage';
//'@angular/router/src/router_state';

@Injectable()
export class NeedAuthValidation implements CanActivate {
  authScreenList = [];
  constructor(private tokenService: TokenService,
              private router: Router,
              private sessionStorageService: SessionStorageService,) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {

    const redirectUrl = route['_routerState']['url'];
    //console.log(redirectUrl);

    if (this.tokenService.isLogged()) {
      //remove access right
      // this.authScreenList = this.sessionStorageService.get('S_ScreenList');
      // let moduleIndex = 0;
      // while(moduleIndex < this.authScreenList.length){
      //   let childrenIndex = 0;
      //   while(childrenIndex < this.authScreenList[moduleIndex]['children'].length){
      //     if(this.authScreenList[moduleIndex]['children'][childrenIndex]['link'] === redirectUrl){
      //       //console.log('redirect',this.authScreenList[moduleIndex]['children'][childrenIndex]['link']);
      //       return true;
      //     }
      //     childrenIndex++;
      //   }
      //   moduleIndex++;
      // }
      // //console.log('redirect 2:');

      // this.router.navigate(['../../pages/home/cpdbatchorderlist']);
      // return false;
      return true;
    }

    this.router.navigateByUrl(
      this.router.createUrlTree(
        ['/customauth/customlogin'], {
          queryParams: {
            redirectUrl
          }
        }
      )
    );

    return false;
  }
}