import { Observable } from 'rxjs';

/*export class BomMapping {
  ResponseCode: string;
  ResponseMessage: string;
  Data?: DataContent;
}

class DataContent{
  'stageId':number;
  'stageName':string;
  'itemId': string;
  'itemName': string;
  'isDeleted': boolean;
  'modifiedBy': string;
  'modifiedDate': Date;
  'createdBy': string;
  'createdDate': Date;
  'itemGroup': string;
}*/

export interface BomMapping {
  'id': number;
  'stageId':number;
  'stageName':string;
  'itemId': string;
  'itemName': string;
  'itemGroup': string;
  'unit': string;
  'isDeleted': boolean;
  'modifiedBy': string;
  'modifiedDate': Date;
  'createdBy': string;
  'createdDate': Date;
}

export interface CreateBomMappingResult{
  result: string;
}

export interface mappedBOMItems{
  'stageId':number;
  'stageName':string;
  'itemId': string;
  'itemName': string;
  'isDeleted': boolean;
  'modifiedBy': string;
  'modifiedDate': Date;
  'createdBy': string;
  'createdDate': Date;
  'itemGroup': string;
}

export interface mappedItems{
  'itemId': string;
  'itemName': string;
  'unit': string;
  'displayItemId':string;
  'StageName': string;
}

export abstract class BomMappingData {
  abstract getItems(): Observable<BomMapping>;
  abstract currentPlant;
  abstract createBomMapping(BomStageMapping): Observable<CreateBomMappingResult>;
  abstract editBomItem(ItemObject);
  abstract deleteBomMapping(MappingID): Observable<CreateBomMappingResult>;
  abstract addItemMapping(MappingObject);
}
