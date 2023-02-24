import { Injectable } from '@angular/core';
import { BomGridData, BomGrid, BomGridArray } from '../data/bom-grid';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';
import { NbToastrService } from '@nebular/theme';

@Injectable()
export class BomGridService extends BomGridData {

  constructor(private http: HttpClient, 
              private appConfigService: AppConfigService, 
              private sessionStorageService: SessionStorageService,
              private toastrService: NbToastrService,) {
    super();
  }

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
  getItems(batchno): Observable<BomGrid> {
    //return this.http.post<BomGrid>(this.apiURL + '/Bom/List',  JSON.stringify(batchno), this.httpOptions)
    return this.http.get<BomGrid>(this.apiURL8077 + '/Bom/GetBomList/' + batchno, this.httpOptions) //'http://hsd-svr-0050-v:8077/Bom/GetBomList/'
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  // HttpClient API post() method => Create batchlist item
  /*createItem(bom): Observable<BomGridArray> {
    return this.http.post<BomGridArray>(this.apiURL + '/Bom/AddBom', JSON.stringify(bom), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }*/
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
