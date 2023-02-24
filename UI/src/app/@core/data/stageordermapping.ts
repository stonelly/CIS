import { Observable } from 'rxjs';

export interface StageOrderMapping {
  'Order': number;
  'Stage': string;
  'CreatedOn': Date;
  'CreatedBy': string;
}


export interface StageList{
  'stageId': number,
  'stageName': string,
  'isDeleted': boolean
}


export abstract class StageOrderMappingData {
  abstract getData(): any[];
  abstract getItems(): Observable<StageList>;
}
