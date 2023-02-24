import { Injectable } from '@angular/core';
import { CPDTraceabilityListData, CPDTraceabilityList } from '../data/cpd-traceability';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject, of as observableOf} from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class CPDTraceabilityService extends CPDTraceabilityListData {

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
  data: CPDTraceabilityList = {
    header: {
      cpdBatchOrderNo: '',
      plant: '',
      mixingTank: '',
      cpdBatchQuantity: '',
      cpdStageStatus: '',
      cpdStageDateTime: '',
    },
    result: [],
  };

  inittraceabilityByBatchOrder() {

    return observableOf(this.data);
  }


  gettraceabilityByBatchOrder(cpdBatchOrder) {
    if (cpdBatchOrder !== null && cpdBatchOrder !== '' ) {
      return this.http.get<CPDTraceabilityList>(this.apiURL8077 + '/Audit/GetBatchOrderTraceability/?BatchNo=' + cpdBatchOrder, this.httpOptions) //http://hsd-svr-0050-v:8077/Audit/GetBatchOrderTraceability/?BatchNo=
      .pipe(
        retry(1),
        catchError(this.handleError),
      );
    } else {
      return observableOf(this.data);
    }
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
