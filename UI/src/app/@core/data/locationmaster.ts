import { Observable } from 'rxjs';

export interface LocationMasterList {
  'locationId': number,
  'locationType': number,
  'locationName': string,
  'status': number,
  'del': boolean,
  'stationName': string,
  'locationTypeName': string,
}

export interface CreateLocationMasterResult{
  'locationId': number;
}
export interface RemoveLocationMasterResult{
  'locationId': number;
}

export abstract class LocationMasterData {
  abstract getItems(): Observable<LocationMasterList>;
  abstract createLocationMaster(LocationMaster): Observable<CreateLocationMasterResult>;
  abstract removeLocationMaster(LocationMaster): Observable<RemoveLocationMasterResult>;
}
