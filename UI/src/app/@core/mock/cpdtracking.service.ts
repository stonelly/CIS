import { Injectable } from '@angular/core';
import { CpdTrackingData, CpdTracking ,CpdTracking2, StartStageResponse } from '../data/cpdtracking';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';
import { retry, catchError } from 'rxjs/operators';
import { throwError, Observable, BehaviorSubject } from 'rxjs';
import { NbToastrService, NbGlobalLogicalPosition } from '@nebular/theme';

@Injectable()
export class CpdTrackingService extends CpdTrackingData {

  data = [{
    id: 1,
    line: 'L49',
    batchno: 'HNBON000086750',
    startdate: '06/07/2019',
    enddate: '09/07/2019',
    latex: 'pass',
    stabilization: 'start',
    composite: 'startdisable',
    aquawax: 'startdisable',
    pigment: 'startdisable',
  }, {
    id: 2,
    line: 'L50',
    batchno: 'HNBON000086748',
    startdate: '07/07/2019',
    enddate: '10/07/2019',
    latex: 'start',
    stabilization: 'startdisable',
    composite: 'startdisable',
    aquawax: 'startdisable',
    pigment: 'startdisable',
  }];

  constructor(private http: HttpClient, 
              private appConfigService: AppConfigService, 
              private sessionStorageService: SessionStorageService,
              private toastrService: NbToastrService,) {
    super();
  }

  private plantSource = new BehaviorSubject(this.sessionStorageService.get('S_CurrentPlant'));
  currentPlant = this.plantSource.asObservable();

  //

  apiURL= this.appConfigService.apiBaseUrl;
  apiURL8077= this.appConfigService.apiBaseUrl8077;
  apiURL8076= this.appConfigService.apiBaseUrl8076;

  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + this.sessionStorageService.get('S_Token'),
    }),
  };

  getData() {
    return this.data;
  }

  getItems(plantId): Observable<CpdTracking>{
    //this.httpOptions = this.sessionStorageService.get('S_HttpOptions');
    
    return this.http.get<CpdTracking>(this.apiURL8077 + '/Batch/GetBatchTracking/P' + plantId, this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  //startStage(cpdBatchOrderNo, stageName): Observable<StartStageResponse>{
  startStage(cpdBatchOrderNo, stageName){
    return this.http.get<StartStageResponse>(this.apiURL8077 + '/Batch/StartStage/' + cpdBatchOrderNo + '/' + stageName, this.httpOptions)
    .pipe(
      retry(1),
      //catchError(err => this.handleStartStageError(err, cpdBatchOrderNo, stageName)),
    );
  }

  startFlowInTime(cpdObject){
    return this.http.post(this.apiURL8077 + '/Batch/AddFlowInTime/', JSON.stringify(cpdObject), this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  addPigmentResult(resultObject): Observable<StartStageResponse>{
    return this.http.post<StartStageResponse>(this.apiURL8077 + '/Bom/AddPigmentWeight', JSON.stringify(resultObject), this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  addPHAdjustment(phAdjustmentItem){
    return this.http.post(this.apiURL8076 + '/QAVerificationDetails/cpd', JSON.stringify(phAdjustmentItem), this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  selectMixingABTank(ABTankObj){
    return this.http.post(this.apiURL8077 + '/Batch/AddPigmentTank', JSON.stringify(ABTankObj), this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  getItems2(): Observable<CpdTracking2>{
    return this.http.get<CpdTracking2>(this.apiURL8077 + '/Batch/GetBatchTracking', this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  postStatus(input): Observable<any> {
    return this.http.post<CpdTracking2>(this.apiURL8077 + '/Batch/PostBatchTracking', JSON.stringify(input), this.httpOptions)
    .pipe(
      retry(1),
      catchError(err => this.handleError(err)),
    );
  }

  changePlant(plantId: string) {
    this.httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + this.sessionStorageService.get('S_Token'),
      }),
    };
    this.plantSource.next(plantId);
  }

  showToast(position, status, errMessage, destroyByClick ) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status, destroyByClick  });
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    }
    else {
      // Get server-side error
      errorMessage = `Error ${error.status}\n: ${error.message}`; //error.error.title
    }
    this.showToast('top-right', 'danger', errorMessage, false);
    return throwError(errorMessage);
  }

  handleStartStageError(error, cpdBatchOrderNo, currentStage) {
    let errorMessage = '';
    let displayMessage = cpdBatchOrderNo + ': Unable to start \"' + currentStage + '\" stage. Please contact supervisor for further action.';
    this.showToast('top-right', 'danger', displayMessage, true);
    /*if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    }
    else {
      // Get server-side error
      errorMessage = `Error ${error.status}\n: ${error.message}`; //error.error.title
    }
    this.showToast('top-right', 'danger', errorMessage, true);*/
    return throwError(errorMessage);
  }
}


