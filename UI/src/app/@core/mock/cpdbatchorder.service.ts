import { Injectable } from '@angular/core';
import { CPDBatchOrderData, AddBatchOrderResult } from '../data/cpdbatchorder';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class CPDBatchOrderService extends CPDBatchOrderData {

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

  // HttpClient API post() method => add cpd bacth order items
  AddBatchOrder(batchOrder): Observable<AddBatchOrderResult> {
    return this.http.post<AddBatchOrderResult>(this.apiURL8077 + '/Batch/AddBatchOrder', JSON.stringify(batchOrder), this.httpOptions) //http://hsd-svr-0050-v:8077/Batch/AddBatchOrder
    .pipe(
      //retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  UpdateBatchOrder(batchOrder): Observable<AddBatchOrderResult> {
    return this.http.post<AddBatchOrderResult>(this.apiURL8077 + '/Batch/UpdateBatchOrder', JSON.stringify(batchOrder), this.httpOptions) 
    .pipe(
      //retry(1),
      catchError(err => this.handleError(err)),
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
     //window.alert(errorMessage);
     return throwError(errorMessage);
  }

  /*  getData() {
    return this.data;
  }*/
}
