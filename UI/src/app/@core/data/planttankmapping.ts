import { Observable } from 'rxjs';

export interface PlantTankMappingList {
  'mixingTankId': number,
  'plant': string,
  'mixingTankNo': string,
  'isDeleted': boolean,
  'modifiedBy': string,
  'modifiedDate': Date,
  'createdBy': string,
  'createdDate': Date
}

export interface CreatePlantTankMappingResult{
  'mixingTankId': number;
}

export abstract class PlantTankMappingData {
  abstract currentPlant;
  abstract getItems(): Observable<PlantTankMappingList>;
  abstract createPlantTankMapping(PlantTankMapping): Observable<CreatePlantTankMappingResult>;
  abstract getMixingTankMap(TankNo);
}
