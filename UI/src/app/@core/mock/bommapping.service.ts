import { Injectable } from '@angular/core';
import { BomMappingData, BomMapping, CreateBomMappingResult } from '../data/bommapping';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError, BehaviorSubject } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';
import { SessionStorageService } from 'angular-web-storage';

@Injectable()
export class BomMappingService extends BomMappingData {

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

  // HttpClient API get() method => Fetch batchlist items
  getItems(): Observable<BomMapping> {
    return this.http.get<BomMapping>(this.apiURL8077 + '/Setup/GetBomMappingList', this.httpOptions) //'http://hsd-svr-0050-v:8077/Setup/GetBomMappingList'
    .pipe(
      //retry(1),
      catchError(this.handleError),
    );
  }

  addItemMapping(MappingObject){
    return this.http.post(this.apiURL8077 + '/Setup/AddMapping', JSON.stringify(MappingObject), this.httpOptions) 
    .pipe(
      //retry(1),
      catchError(this.handleError),
    );
  }
  /*getMappedItems(): Observable<BomMapping>{
    return true;
  }*/

  //Create new item
  createBomMapping(ItemObject): Observable<CreateBomMappingResult>{
    return this.http.post<CreateBomMappingResult>(this.apiURL8077 + '/Setup/AddItem', JSON.stringify(ItemObject), this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/AddItem 
    .pipe(
      //retry(1),
      catchError(this.duplicateMappingIDError),
    );
  }

  //Edit existing item
  editBomItem(ItemObject){
    return this.http.post<CreateBomMappingResult>(this.apiURL8077 + '/Setup/EditItem', JSON.stringify(ItemObject), this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/AddItem 
    .pipe(
      //retry(1),
      catchError(this.duplicateMappingIDError),
    );
  }

  // HttpClient API delete() method => Delete batchlist item
  deleteBomMapping(MappingID): Observable<CreateBomMappingResult> {
    return this.http.post<CreateBomMappingResult>(this.apiURL8077 + '/Setup/DeleteBomMapping', JSON.stringify(MappingID), this.httpOptions) //http://hsd-svr-0050-v:8077/Setup/DeleteBomMapping
    .pipe(
      //retry(1),
      catchError(this.handleError),
    );
  }

  // Error handling
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
  /*data = [{
    'No': 1,
    'ItemNumber': 'CH-LI-NBR 48C40',
    'ItemName': 'Nitrile Latex-Synthomer 48C40',
    'BomStage': 'Latex',
    'ItemGroup': 'SLTX',
  }, {
    'No': 2,
    'ItemNumber': 'CH-LI-NBR LX550',
    'ItemName': 'Nitrile Latex-Nipol LX550L',
    'BomStage': 'Latex',
    'ItemGroup': 'SLTX',
  }, {
    'No': 3,
    'ItemNumber': 'CH-LI-NBR NPLX556',
    'ItemName': 'Nitrile Latex-Nipol LX556',
    'BomStage': 'Latex',
    'ItemGroup': 'SLTX',
  }, {
    'No': 4,
    'ItemNumber': 'CH-LI-NBR NTX6720',
    'ItemName': 'Nitrile Latex-Nantex 6720',
    'BomStage': 'Latex',
    'ItemGroup': 'SLTX',
  }, {
    'No': 5,
    'ItemNumber': 'CH-LI-NBR NTX6755',
    'ItemName': 'Nitrile Latex-Nantex 6755',
    'BomStage': 'Latex',
    'ItemGroup': 'SLTX',
  }, {
    'No': 1,
    'ItemNumber': 'CH-LI-AGWET DPEDS',
    'ItemName': 'AGWET DEPDS',
    'BomStage': 'Stabilization',
    'ItemGroup': 'DC',
  }, {
    'No': 2,
    'ItemNumber': 'CH-LI-SDBS',
    'ItemName': 'Agwet 1050 - SDBS Stabilizer',
    'BomStage': 'Stabilization',
    'ItemGroup': 'DC',
  }, {
    'No': 3,
    'ItemNumber': 'CH-LI-AGWET DPO',
    'ItemName': 'AGWET DPO',
    'BomStage': 'Stabilization',
    'ItemGroup': 'DC',
  }, {
    'No': 4,
    'ItemNumber': 'CH-LI-SDBS',
    'ItemName': 'Agwet 1050 - SDBS Stabilizer',
    'BomStage': 'Stabilization',
    'ItemGroup': 'DC',
  }, {
    'No': 5,
    'ItemNumber': 'CH-LI-AGWET HT',
    'ItemName': 'AGWET HT (TSC 25%)',
    'BomStage': 'Stabilization',
    'ItemGroup': 'DC',
  }, {
    'No': 1,
    'ItemNumber': 'CH-LI-SULPHUR OCT HCLP60',
    'ItemName': 'Octocure HCLP-60 (YS) - Sulphur',
    'BomStage': 'Composite',
    'ItemGroup': 'DC',
  }, {
    'No': 2,
    'ItemNumber': 'CH-LI-Ti02 OCT705',
    'ItemName': 'Octotint 705 - Titanium Dioxide',
    'BomStage': 'Composite',
    'ItemGroup': 'DC',
  }, {
    'No': 3,
    'ItemNumber': 'CH-LI-ZnO2 OCT573',
    'ItemName': 'Octocure 573 - Zinc Oxide',
    'BomStage': 'Composite',
    'ItemGroup': 'DC',
  }, {
    'No': 1,
    'ItemNumber': 'CH-LI-AQUAAX',
    'ItemName': 'Aquawax 48 - Wax',
    'BomStage': 'Wax',
    'ItemGroup': 'DC',
  }, {
    'No': 2,
    'ItemNumber': 'CH-LI-WAXL',
    'ItemName': 'Aquawax 58',
    'BomStage': 'Wax',
    'ItemGroup': 'DC',
  }, {
    'No': 1,
    'ItemNumber': 'CH-LI-BLU MPL1274',
    'ItemName': 'Pigment - Farsperse Blue MPL1274',
    'BomStage': 'Pigment',
    'ItemGroup': 'DC',
  }, {
    'No': 2,
    'ItemNumber': 'CH-LI-BLU MPL1826',
    'ItemName': 'Pigment - Farsperse Blue MPL1826',
    'BomStage': 'Pigment',
    'ItemGroup': 'DC',
  }, {
    'No': 3,
    'ItemNumber': 'CH-LI-BLU MPV1340',
    'ItemName': 'Pigment - BLU MPV 1340',
    'BomStage': 'Pigment',
    'ItemGroup': 'DC',
  }, {
    'No': 4,
    'ItemNumber': 'CH-LI-MPG1554',
    'ItemName': 'Pigment - Farsperse Green',
    'BomStage': 'Pigment',
    'ItemGroup': 'DC',
  }, {
    'No': 5,
    'ItemNumber': 'CH-LI-MPL2358',
    'ItemName': 'Pigment - Farsperse Green MPG-2358',
    'BomStage': 'Pigment',
    'ItemGroup': 'DC',
  }, {
    'No': 1,
    'ItemNumber': 'SOFTWATER',
    'ItemName': 'Soft Water',
    'BomStage': 'Other',
    'ItemGroup': 'Other',
  }, {
    'No': 2,
    'ItemNumber': 'SOFTWATER-FLUSHING',
    'ItemName': 'Soft Water (Flushing)',
    'BomStage': 'Other',
    'ItemGroup': 'Other',
  }];

  getData() {
    return this.data;
  }*/
}
