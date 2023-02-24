import { Injectable } from '@angular/core';
import { EmploymentInfoTableData } from '../data/employment-info-table';

@Injectable()
export class EmploymentInfoTableService extends EmploymentInfoTableData {

  data = [
  {
    id: 1,
    effectiveDate: '01/01/2017',
    department: 'CPD',
    userCategory: '',
    supervisor: '',
    holidayCalendar: '',
    costCenter: 'CPD',
  },
];

  getData() {
    return this.data;
  }
}
