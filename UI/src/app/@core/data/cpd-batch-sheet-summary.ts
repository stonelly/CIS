import { Observable } from 'rxjs';

export interface CPDBatchSheetList {
  header: CPDBatchSheetHeader;
  result: CPDBatchSheetResult[];
}

export interface CPDBatchSheetHeader {
  cpdBatchOrderNo: string,
  productType: string,
  compoundingDate: Date,
  createdBy: string,
}

export interface CPDBatchSheetResult {
  No: number;
  stageName: string,
  itemID: string,
  batchNo: string,
  targetWeight: number,
  actualWeight: number,
  varianceWeight: number,
  variancePercentage: number,
}


export abstract class CPDBatchSheetData {
  abstract getBatchSheetByBatchOrder(cpdBatchOrder): Observable<CPDBatchSheetList>;
  abstract getBatchSheetWithActualWeightByBatchOrder(cpdBatchOrder);
  abstract postBatchSheetDetailsToD365(cpdBatchOrder);
  abstract initBatchSheetByBatchOrder(): Observable<CPDBatchSheetList>;
}