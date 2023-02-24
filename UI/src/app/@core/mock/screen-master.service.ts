import { Injectable } from '@angular/core';
import { ScreenMasterData, PlantTankMappingList, CreatePlantTankMappingResult } from '../data/screen-master';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class ScreenMasterService extends ScreenMasterData {

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

  getItems(): Observable<PlantTankMappingList> {
    return this.http.get<PlantTankMappingList>(this.apiURL8077 + '/Setup/GetMixingTankMapping', this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/GetMixingTankMapping
    .pipe(
      retry(1),
      catchError(this.handleError),
    );
  }

  createPlantTankMapping(PlantTankMapping): Observable<CreatePlantTankMappingResult> {
    return this.http.post<CreatePlantTankMappingResult>(this.apiURL8077 + '/Setup/AddMixingTankMapping', JSON.stringify(PlantTankMapping), this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/AddMixingTankMapping
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
