import { Injectable } from '@angular/core';
import { AuditLogData, AuditLogResponse } from '../data/audit-log';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class AuditLogService extends AuditLogData {

  constructor(private http: HttpClient, private appConfigService: AppConfigService, private sessionStorageService: SessionStorageService) {
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

  // HttpClient API get() method => Fetch batchlist items
  getAuditLogbyCount(count): Observable<AuditLogResponse> {
    return this.http.get<AuditLogResponse>(this.apiURL8077 + '/Audit/GetAuditLog/' + count, this.httpOptions) // http://hsd-svr-0050-v:8077/Audit/GetAuditLog/1
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

  getAuditLogbyDate(dateObj): Observable<AuditLogResponse> {
    return this.http.post<AuditLogResponse>(this.apiURL8077 + '/Audit/GetAuditLog/', JSON.stringify(dateObj), this.httpOptions) // http://hsd-svr-0050-v:8077/Audit/GetAuditLog/1
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
}
