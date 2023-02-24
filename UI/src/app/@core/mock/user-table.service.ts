import { Injectable } from '@angular/core';
import { UserTableData } from '../data/user-table';

@Injectable()
export class UserTableService extends UserTableData {

  data = [
  /*{
    id: 1,
    fullName: 'Leang Wah Choon',
    username: 'leang.wahchoon',
    status: 'Active',
    userRole: 'System Admin',
    department: 'MIS',
    email: 'leang.wahchoon@hartalega.com.my',
  },
  {
    id: 2,
    fullName: 'Koo Chung Peng',
    username: 'koo.cp',
    status: 'Active',
    userRole: 'System Admin',
    department: 'MIS',
    email: 'koo.cp@hartalega.com.my',
  },
  {
    id: 3,
    fullName: 'Azman Kasim',
    username: 'azman.kasim',
    status: 'Active',
    userRole: 'System Admin',
    department: 'MIS',
    email: 'azman.kasim@hartalega.com.my',
  },
  {
    id: 4,
    fullName: 'Pang Yik Siu',
    username: 'ys.pang',
    status: 'Active',
    userRole: 'System Admin',
    email: 'ys.pang@hartalega.com.my',
  },
  {
    id: 5,
    fullName: 'CPD Supervisor',
    username: 'cpd.supervisor',
    status: 'Active',
    userRole: 'CPD User',
    email: 'cpd.user@hartalega.com.my',
  },*/
];

  getData() {
    return this.data;
  }
}
