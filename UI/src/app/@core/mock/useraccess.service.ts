import { Injectable } from '@angular/core';
import { UserAccessData } from '../data/useraccess';import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class UserAccessService extends UserAccessData {

  data = [];

  constructor(private http: HttpClient, 
                private appConfigService: AppConfigService, 
                private sessionStorageService: SessionStorageService) {
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
      //catchError(this.handleError),
    );
  }

  getUserListing() {
    return this.http.get(this.apiURL8077 + '/users/UserListing', this.httpOptions)
    .pipe(
      //catchError(this.handleError),
    );
  }

  searchADUser(ADUsernameText) {
    return this.http.get(this.apiURL8077 + '/Users/Search/'+ADUsernameText, this.httpOptions)
    .pipe(
      //catchError(this.handleError),
    );
  }

  assignPlant(userPlant){
    return this.http.post(this.apiURL8077 + '/Security/AssignPlant', JSON.stringify(userPlant), this.httpOptions)
    .pipe(
      catchError(this.handleError),
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
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
