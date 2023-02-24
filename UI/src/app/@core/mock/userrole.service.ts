import { Injectable } from '@angular/core';
import { UserRoleData } from '../data/userrole';
import { throwError, BehaviorSubject } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';
import { catchError } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';

@Injectable()
export class UserRoleService extends UserRoleData {

  data = [/*{
    id: 1,
    rolename: 'Superadmin',
    menuvisibility: 'All',
  }, {
    id: 2,
    rolename: 'Admin',
    menuvisibility: 'All',
  }, {
    id: 3,
    rolename: 'CBL',
    menuvisibility: 'Compounding Batch List',
  }, {
    id: 4,
    rolename: 'BOM',
    menuvisibility: 'BOM',
  }, {
    id: 5,
    rolename: 'CPD',
    menuvisibility: 'CPD Batch Order Tracking',
  }*/];

  constructor(private http: HttpClient, 
                private appConfigService: AppConfigService, 
                private sessionStorageService: SessionStorageService,
                private toastrService: NbToastrService,) {
    super();
  }

  private plantSource = new BehaviorSubject('1');
  currentPlant = this.plantSource.asObservable();

  apiURL= this.appConfigService.apiBaseUrl;
  apiURL8077 = this.appConfigService.apiBaseUrl8077;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.sessionStorageService.get('S_Token'),
    }),
  };

  getData() {
    return this.data;
  }

  registerUser(newUserObject) {
    return this.http.post(this.apiURL8077 + '/users/Register', JSON.stringify(newUserObject), this.httpOptions)
    .pipe(
      catchError(err => this.handleError(err)),
    );
  }

  getScreenRoleList() {
    return this.http.get(this.apiURL8077 + '/Security/GetScreenRoleList', this.httpOptions)
    .pipe(
      catchError(err => this.handleError(err)),
    );
  }

  getRoleList(){
    return this.http.get(this.apiURL8077 + '/Security/GetRoleList', this.httpOptions)
    .pipe(
      catchError(err => this.handleError(err)),
    );
  }

  createRole(rolename){
    return this.http.post(this.apiURL8077 + '/Security/CreateRole', JSON.stringify(rolename), this.httpOptions)
    .pipe(
      catchError(err => this.handleError(err)),
    );
  }

  getScreenRoleInfo(roleId){
    return this.http.get(this.apiURL8077 + '/Security/GetScreenRoleInfo/' + roleId, this.httpOptions)
    .pipe(
      catchError(err => this.handleError(err)),
    );
  }

  assignRoleUser(userObj){
    return this.http.post(this.apiURL8077 + '/Security/AssignRoleUser', JSON.stringify(userObj), this.httpOptions)
    .pipe(
      catchError(err => this.handleError(err)),
    );
  }

  assignRoleScreen(roleScreenObj){
    return this.http.post(this.apiURL8077 + '/Security/AssignRoleScreen', JSON.stringify(roleScreenObj), this.httpOptions)
    .pipe(
      catchError(err => this.handleError(err)),
    );
  }

  assignAPIScreen(roleAPIObj){
    return this.http.post(this.apiURL8077 + '/Security/AssignAPIScreen', JSON.stringify(roleAPIObj), this.httpOptions)
    .pipe(
      catchError(err => this.handleError(err)),
    );
  }

  handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    this.showToast('top-right', 'danger', errorMessage);
    console.log(error);
    return throwError(errorMessage);
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }
}
