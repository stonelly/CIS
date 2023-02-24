import { Injectable } from '@angular/core';
import { StageOrderMappingData, StageList } from '../data/stageordermapping';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class StageOrderMappingService extends StageOrderMappingData {

  constructor(private http: HttpClient, private appConfigService: AppConfigService, private sessionStorageService: SessionStorageService) {
    super();
  }

  apiURL8077= this.appConfigService.apiBaseUrl8077;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.sessionStorageService.get('S_Token'),
    }),
  };

  getItems(): Observable<StageList> {
    return this.http.get<StageList>(this.apiURL8077 + '/Setup/GetStageListMapping', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

  // Error handling
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

  data = [/*{
    'Order': 1,
    'Stage': 'Latex',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'Order': 2,
    'Stage': 'Stabilization',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'Order': 3,
    'Stage': 'Composite',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'Order': 4,
    'Stage': 'Wax',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'Order': 5,
    'Stage': 'Pigment',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }*/];

  getData() {
    return this.data;
  }
}
