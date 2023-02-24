import { Observable } from 'rxjs';

export interface CPDBatchOrder {
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

export interface AddBatchOrderResult{
  result: string;
}

export abstract class CPDBatchOrderData {
  //abstract getData(): any[];
  //abstract getItems(): Observable<BomMapping>;
  abstract currentPlant;
  abstract AddBatchOrder(batchOrder): Observable<any>;
  abstract UpdateBatchOrder(batchOrder): Observable<any>;
}
