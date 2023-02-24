import { Observable } from 'rxjs';

export interface CPDTraceabilityList {
  header: CPDTraceabilityHeader;
  result: CPDTraceabilityResult[];
}

export interface CPDTraceabilityHeader {
  cpdBatchOrderNo: string;
  plant: string;
  mixingTank: string;
  cpdBatchQuantity: string;
  cpdStageStatus: string;
  cpdStageDateTime: string;
}

export interface CPDTraceabilityResult {
  No: number;
  actionDatetime: string;
  actionText: string;
  actionBy: string;
  actionStatus: string;
  actionPayload: string;
}


export abstract class CPDTraceabilityListData {
  abstract gettraceabilityByBatchOrder(cpdBatchOrder): Observable<CPDTraceabilityList>;
  abstract inittraceabilityByBatchOrder(): Observable<CPDTraceabilityList>;
}
