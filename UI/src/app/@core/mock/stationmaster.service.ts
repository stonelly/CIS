import { Injectable } from '@angular/core';
import { StationMasterData, StationMasterList, CreateStationMasterResult } from '../data/StationMaster';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class StationMasterService extends StationMasterData {

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

  getItems(): Observable<StationMasterList> {
    return this.http.get<StationMasterList>(this.apiURL + '/station/GetAllStation', this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/GetMixingTankMapping
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

  createStationMaster(StationMaster): Observable<CreateStationMasterResult> {
    return this.http.post<CreateStationMasterResult>(this.apiURL + '/station/UpdateStation', JSON.stringify(StationMaster), this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/AddMixingTankMapping
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
