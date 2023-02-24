import { Injectable } from '@angular/core';
import { PlantTankMappingData, PlantTankMappingList, CreatePlantTankMappingResult } from '../data/planttankmapping';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class PlantTankMappingService extends PlantTankMappingData {

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
 
  getMixingTankMap(TankNo){
    return this.http.get(this.apiURL8077 + '/Setup/GetMixingTankMap/'+TankNo, this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/AddMixingTankMapping
    .pipe(
      catchError(this.handleError),
    );
  }

  /*getMixingTankMapByPlant(PlantNo){
    return this.http.get(this.apiURL8077 + '/Setup/GetMixingTankMapByPlant/'+ PlantNo, this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/AddMixingTankMapping
    .pipe(
      catchError(this.handleError),
    );
  }*/

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

  /*data = [{
    'No': 1,
    'Plant': 'Plant 1',
    'MixingTankNo': '11C',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'No': 2,
    'Plant': 'Plant 1',
    'MixingTankNo': '12C',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'No': 3,
    'Plant': 'Plant 1',
    'MixingTankNo': '13C',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'No': 4,
    'Plant': 'Plant 1',
    'MixingTankNo': '14C',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'No': 5,
    'Plant': 'Plant 1',
    'MixingTankNo': '15C',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'No': 6,
    'Plant': 'Plant 1',
    'MixingTankNo': '16C',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'No': 7,
    'Plant': 'Plant 1',
    'MixingTankNo': '17C',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'No': 8,
    'Plant': 'Plant 1',
    'MixingTankNo': '18C',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'No': 9,
    'Plant': 'Plant 1',
    'MixingTankNo': '19C',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }, {
    'No': 10,
    'Plant': 'Plant 1',
    'MixingTankNo': '20C',
    'CreatedOn': '10/10/2019 12:00:00',
    'CreatedBy': 'SYSTEM',
  }];

  getData() {
    return this.data;
  }*/
}
