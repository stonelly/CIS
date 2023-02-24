import { Injectable } from '@angular/core';
import { CheckInData, SOList, CheckInResult, ValidatePalletResult,ValidateEmployeeIdResult} from '../data/checkin';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class CheckInService extends CheckInData {

  constructor(private http: HttpClient, private appConfigService: AppConfigService, private sessionStorageService: SessionStorageService) {
    super();
  }

  apiURL= this.appConfigService.apiBaseApiUrl;

  // Http Options
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.sessionStorageService.get('S_Token'),
    }),
  };

  getItems(): Observable<SOList> {
    return this.http.get<SOList>(this.apiURL + '/StockMaster/GetPalletInfo', this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/GetMixingTankMapping
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

  checkInPallet(palletInfo): Observable<CheckInResult> {
    return this.http.post<CheckInResult>(this.apiURL + '/stockmaster/CheckInPallet', JSON.stringify(palletInfo), this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/AddMixingTankMapping
    .pipe(
      catchError(this.handleError),
    );
  }

  validateEmployeeId(EmployeeInfo): Observable<ValidateEmployeeIdResult> {
    return this.http.get<ValidateEmployeeIdResult>(this.apiURL + '/Users/ValidateEmployeeID?employeeID='+ EmployeeInfo,  this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/AddMixingTankMapping
    .pipe(
      catchError(this.handleError),
    );
  }

  validatePallet(palletID): Observable<ValidatePalletResult> {
    return this.http.get<ValidatePalletResult>(this.apiURL + '/stockmaster/GetPalletInfo?palletNo='+ palletID, this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/AddMixingTankMapping
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
