import { Observable } from 'rxjs';

export interface AuditLogResponse {
  'auditLogId': number,
  'apiOperation': string,
  'apiFunction': string,
  'payLoad': string,
  'returnLoad': string,
  'userId': string,
  'userToken': string,
  'createdDateTime': Date,
}

export abstract class AuditLogData {
  abstract getAuditLogbyCount(count): Observable<AuditLogResponse>;
  abstract getAuditLogbyDate(dateObj): Observable<AuditLogResponse>;
}
