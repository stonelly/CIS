import { Injectable } from '@angular/core';
import { CPDBatchSheetData, CPDBatchSheetList } from '../data/cpd-batch-sheet-summary';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of as observableOf} from 'rxjs';
import { catchError, retry, timestamp } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class CPDBatchSheetService extends CPDBatchSheetData {

  constructor(private http: HttpClient,
    private appConfigService: AppConfigService,
    private sessionStorageService: SessionStorageService) {
    super();
  }
  apiURL = this.appConfigService.apiBaseUrl;
  apiURL8077 = this.appConfigService.apiBaseUrl8077;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.sessionStorageService.get('S_Token'),
    }),
  };
  data: CPDBatchSheetList = {
    header: {
      cpdBatchOrderNo: '',
      productType: '',
      compoundingDate: null,
      createdBy: '',
    },
    result: [],
  };

  initBatchSheetByBatchOrder() {
    return observableOf(this.data);
  }


  getBatchSheetByBatchOrder(cpdBatchOrder) {
    if (cpdBatchOrder !== null && cpdBatchOrder !== '' ) {
      return this.http.get<CPDBatchSheetList>(this.apiURL8077 + '/Batch/BatchSheet/' + cpdBatchOrder, this.httpOptions) //http://hsd-svr-0050-v:8077/Batch/BatchSheet/
      .pipe(
        retry(1),
        catchError(this.handleError),
      );
    } else {
      return observableOf(this.data);
    }
  }

  getBatchSheetWithActualWeightByBatchOrder(cpdBatchOrder) {
    if (cpdBatchOrder !== null && cpdBatchOrder !== '' ) {
      return this.http.get<CPDBatchSheetList>(this.apiURL8077 + '/Posting/PostPreparation/' + cpdBatchOrder, this.httpOptions) //http://hsd-svr-0050-v:8077/Batch/BatchSheet/
      .pipe(
        retry(1),
        catchError(this.handleError),
      );
    } else {
      return observableOf(this.data);
    }
  }

  postBatchSheetDetailsToD365(cpdBatchOrder) {
    console.log(cpdBatchOrder);
    return this.http.post(this.apiURL8077 + '/Posting/Posting', JSON.stringify(cpdBatchOrder), this.httpOptions) //http://hsd-svr-0050-v:8077/Batch/BatchSheet/
    .pipe(
      retry(1),
      catchError(this.handleError),
    )
  }

  // Error handling
  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
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
