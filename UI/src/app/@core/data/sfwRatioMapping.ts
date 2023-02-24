import { Observable } from 'rxjs';


export interface sfwDefaultRatioData {
  StageName: string;
  Ratio: string;
  IsDeleted: boolean;
}

export interface customRatio {
  Id: string;
  ItemId: string;
  ItemName: string;
  Stabilization: number;
  Composite: number;
  ESD: number;
  Wax: number;
}

export interface CreateCustomRatioResult {
  result: string;
}

export interface cpdItem {
  ItemId: string;
  ItemName: string;
}



export abstract class sfwRatioMapping {
  abstract getDefaultSFWRatio(): Observable<sfwDefaultRatioData>;
  abstract getDefaultSFWFlush(): Observable<any>;

  abstract editDefaultSFWRatio(responseObj): Observable<any>;
  abstract editDefaultSFWFlush(responseObj): Observable<any>;
  abstract getStageRatios(): Observable<customRatio>;

  abstract getCPDItems(): Observable<cpdItem>;

  abstract createCustomRatio(customRatio): Observable<CreateCustomRatioResult>;

  abstract editCustomRatio(customRatio): Observable<CreateCustomRatioResult>;

  abstract deleteCustomRatio(id): Observable<CreateCustomRatioResult>;
}
