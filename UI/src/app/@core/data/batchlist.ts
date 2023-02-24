import { Observable } from 'rxjs';

export interface BatchList {
  plant: string;
  cpdbatchno: string;
  itemno: string;
  producttype: string;
  quantity: number;
  createdby: string;
  createddate: Date;
}

export interface CPDBatchList{
  id: number,
  plant: string,
  batchNo: string,
  itemNo: string,
  productType: string,
  quantity: number,
  description: string,
  modifiedBy: string,
  scheduledStartDatetime: Date,
  scheduledEndDatetime: Date,
  modifiedDate: Date,
  createdBy: string,
  createdDate: Date,
  mixingTankNo: string,
  syncStatus: string,
}

export interface SyncedResponse{
  result: string,
}

export abstract class BatchListData {
  abstract currentPlant;
  //abstract defaultPlant(plant);
  abstract getItems(): Observable<CPDBatchList>;
  abstract getItemByPlant(plantId): Observable<CPDBatchList>;
  /*abstract createItem(batchlist): Observable<any>;
  abstract updateItem(batchlist): Observable<BatchList>;
  abstract deleteItem(request): Observable<any>;*/
  abstract changePlant(plantId);
  abstract addSync(batchOrder): Observable<SyncedResponse>;
  abstract updateSync(batchOrder): Observable<SyncedResponse>;
  abstract rollbackSync(batchOrder): Observable<SyncedResponse>;
  abstract getHistoryByPageNumber(pageNumber): Observable<CPDBatchList>;
  abstract generateQRBarcode(formData);
  abstract getProductTypeList();
}
