import { Injectable } from '@angular/core';
import { BatchListData, BatchList, CPDBatchList, SyncedResponse } from '../data/batchlist';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';
import { NbToastrService } from '@nebular/theme';

@Injectable()
export class BatchListService extends BatchListData {
  currentPlantSubject = '';
  //private plantSource;
  //currentPlant;

  constructor(private http: HttpClient,
              private appConfigService: AppConfigService,
              private sessionStorageService: SessionStorageService,
              private toastrService: NbToastrService,) {
    super();

  }

  private plantSource = new BehaviorSubject(this.sessionStorageService.get('S_CurrentPlant'));

  currentPlant =  this.plantSource.asObservable();

  apiURL= this.appConfigService.apiBaseUrl;
  apiURL8077 = this.appConfigService.apiBaseUrl8077;
  apiURL8076 = this.appConfigService.apiBaseUrl8076;
  currentCPDBatchNo = '';

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.sessionStorageService.get('S_Token'),
    }),
  };

  // HttpClient API get() method => Fetch batchlist items
  getItems(): Observable<CPDBatchList> {
    return this.http.get<CPDBatchList>(this.apiURL8077 + '/Batch/GetBatchList', this.httpOptions) //http://hsd-svr-0050-v:8077/Batch/GetBatchList
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  // HttpClient API get() method => Fetch batchlist item
  getItemByPlant(plantId): Observable<CPDBatchList> {
    return this.http.get<CPDBatchList>(this.apiURL8077 + '/Batch/GetBatchList/' + plantId, this.httpOptions) //http://hsd-svr-0050-v:8077/Batch/GetBatchList/
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  // HttpClient API get() method => Fetch batchlist history item
  getHistoryByPageNumber(pageNumber): Observable<CPDBatchList> {
    return this.http.get<CPDBatchList>(this.apiURL8077 + '/Batch/GetBatchListHistory/' + pageNumber, this.httpOptions) //http://hsd-svr-0050-v:8077/Batch/GetBatchListHistory/{PageNumber}
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  addSync(batchOrder): Observable<SyncedResponse>{
    this.currentCPDBatchNo = batchOrder;
    console.log(this.currentCPDBatchNo);
    return this.http.get<SyncedResponse>(this.apiURL8077 + '/Integration/StartSync/' + batchOrder, this.httpOptions) //http://hsd-svr-0050-v:8077/Batch/GetBatchList/
    .pipe(
      retry(1),
      catchError(this.handleSyncError),
    );
  }

  updateSync(batchOrder): Observable<SyncedResponse>{
    this.currentCPDBatchNo = batchOrder;
    return this.http.get<SyncedResponse>(this.apiURL8077 + '/Integration/UpdateSync/' + batchOrder, this.httpOptions) //http://hsd-svr-0050-v:8077/Batch/GetBatchList/
    .pipe(
      retry(1),
      catchError(this.handleSyncError),
    );
  }

  rollbackSync(batchOrder): Observable<SyncedResponse>{
    this.currentCPDBatchNo = batchOrder;
    return this.http.get<SyncedResponse>(this.apiURL8077 + '/Integration/RollbackSync/' + batchOrder, this.httpOptions) //http://hsd-svr-0050-v:8077/Batch/GetBatchList/
    .pipe(
      retry(1),
      catchError(this.handleSyncError),
    );
  }

  generateQRBarcode(formData) {
    const tokenHeader = new HttpHeaders({ 'Authorization': 'Bearer ' + this.sessionStorageService.get('token') });
    return this.http.post<any>(this.apiURL8076 + '/ApprovedTagDetails/GenerateQRBarcode',
    JSON.stringify(formData),
    { headers: this.httpOptions.headers,
      //responseType: 'blob' as 'json'
    });
  }
  getProductTypeList() {
    return this.http.get<CPDBatchList>(this.apiURL8077 + '/Batch/GetProductType', this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }
  // HttpClient API post() method => Create batchlist item
  /*createItem(batchlist): Observable<any> {
    return this.http.post<any>(this.apiURL + '/Batch/CreateBatch', JSON.stringify(batchlist), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

  // HttpClient API put() method => Update batchlist item
  updateItem(batchlist): Observable<BatchList> {
    return this.http.post<BatchList>(this.apiURL + '/Batch/EditBatch', JSON.stringify(batchlist), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

  // HttpClient API delete() method => Delete batchlist item
  deleteItem(request): Observable<any> {
    return this.http.post<any>(this.apiURL + '/Batch/DeleteBatch', JSON.stringify(request), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }*/

  changePlant(plantId: string) {
    this.plantSource.next(plantId);
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.sessionStorageService.get('S_Token'),
      }),
    };
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }

  // Error handling
  handleError(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`; //error.message
     }
     this.showToast('top-right', 'danger', errorMessage);
     //window.alert(errorMessage);
     return throwError(errorMessage);
  }

  // StartSync & UpdateSync Error handling
  handleSyncError(error, cpdBatchOrderNo) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     console.log('Fail sync for ', this.currentCPDBatchNo, ' failed');
     //this.rollbackSync(this.currentCPDBatchNo);
     //console.log(cpdBatchOrderNo);
     return throwError(errorMessage);
  }

  // RollbackSync Error handling
  handleRollBackSyncError(error, cpdBatchOrderNo) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log('Fail sync for ', this.currentCPDBatchNo, ' failed');
    //console.log(cpdBatchOrderNo);
    return throwError(errorMessage);
 }
}
