import { Injectable } from '@angular/core';
import {sfwRatioMapping,sfwDefaultRatioData ,customRatio,cpdItem,CreateCustomRatioResult} from '../data/sfwRatioMapping';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class SfwRatioMappingService extends sfwRatioMapping {


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

  // getDefaultSFWRatio(): any[] {
  //   throw new Error('Method not implemented.');
  // }


  getDefaultSFWRatio(): Observable<sfwDefaultRatioData>{
    return this.http.get<sfwDefaultRatioData>(this.apiURL8077 + '/Setup/GetDefaultSFW',
    this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  getDefaultSFWFlush() {
    return this.http.get(this.apiURL8077 + '/Setup/GetDefaultSFWFlush',
    this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  editDefaultSFWRatio(responseObj: any): Observable<any> {
    return this.http.post(this.apiURL8077 + '/Setup/EditDefaultSFW', JSON.stringify(responseObj), this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  editDefaultSFWFlush(responseObj: string): Observable<any> {
    return this.http.post(this.apiURL8077 + '/Setup/EditDefaultSFWFlush', JSON.stringify(responseObj), this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  getStageRatios(): Observable<customRatio> {
    return this.http.get<customRatio>(this.apiURL8077 + '/Setup/GetSWCustomRatio', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

  getCPDItems(): Observable<cpdItem> {
    return this.http.get<customRatio>(this.apiURL8077 + '/Setup/GetCPDItemId', this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

  deleteCustomRatio(id): Observable<CreateCustomRatioResult> {
    return this.http.post<CreateCustomRatioResult>(this.apiURL8077 + '/Setup/DeleteSWCustomRatio', JSON.stringify(id), this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/DeleteBomMapping
    .pipe(
      //retry(1),
      catchError(this.handleError),
    );
  }

  editCustomRatio(customRatio): Observable<CreateCustomRatioResult> {
    return this.http.post<CreateCustomRatioResult>(this.apiURL8077 + '/Setup/EditSWCustomRatio', JSON.stringify(customRatio), this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/DeleteBomMapping
    .pipe(
      //retry(1),
      catchError(this.handleError),
    );
  }
  //Create new item
  createCustomRatio(customRatio): Observable<CreateCustomRatioResult>{
    return this.http.post<CreateCustomRatioResult>(this.apiURL8077 + '/Setup/AddSWCustomRatio', JSON.stringify(customRatio), this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/AddItem
    .pipe(
      //retry(1),
      catchError(this.duplicateMappingIDError),
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

  duplicateMappingIDError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: The Item No exists in ACMS, please enter a new Item No.`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
 }

}
