import { Observable } from 'rxjs';

export interface StationMasterList {
  'stationId': number,
  'stationName': string,
  'locationId': number,
  'status': number,
  'del': boolean,
  'locationName': string,
}

export interface CreateStationMasterResult{
  'stationId': number;
}

export abstract class StationMasterData {
  abstract getItems(): Observable<StationMasterList>;
  abstract createStationMaster(PlantTankMapping): Observable<CreateStationMasterResult>;
}
