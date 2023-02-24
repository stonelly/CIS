import { Observable } from 'rxjs';

export interface SOList {
  'locationId': number,
  'locationType': number,
  'locationName': string,
  'status': number,
  'del': boolean,
  'stationName': string,
  'locationTypeName': string,
}

export interface CheckInResult{
  'palletId': number;
}
export interface ValidatePalletResult{
  'palletId': number;
}
export interface ValidateEmployeeIdResult{
  'palletId': number;
}

export abstract class CheckInData {
  abstract getItems(): Observable<SOList>;
  abstract checkInPallet(palletInfo): Observable<CheckInResult>;
  abstract validatePallet(palletInfo): Observable<ValidatePalletResult>;
  abstract validateEmployeeId(EmployeeInfo): Observable<ValidateEmployeeIdResult>;
}
