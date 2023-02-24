import { Injectable } from '@angular/core';
import { UserAccessModulesData } from '../data/user-access-modules';

@Injectable()
export class UserAccessModulesService extends UserAccessModulesData {

  data = [
  {
    moduleLists: 'Compounding Batch List',
    viewRights: 'true',
    createRights: 'true',
    editRights: 'false',
    deleteRights: 'false',
  },
  {
    moduleLists: 'CPD Batch Order Tracking',
    viewRights: 'true',
    createRights: 'true',
    editRights: 'false',
    deleteRights: 'false',
  },
  {
    moduleLists: 'User Access',
    viewRights: 'false',
    createRights: 'false',
    editRights: 'false',
    deleteRights: 'false',
  },
  {
    moduleLists: 'User Role',
    viewRights: 'false',
    createRights: 'false',
    editRights: 'false',
    deleteRights: 'false',
  },
  {
    moduleLists: 'Report',
    viewRights: 'true',
    createRights: 'false',
    editRights: 'false',
    deleteRights: 'false',
  },
];

  getData() {
    return this.data;
  }
}
