import { Injectable } from '@angular/core';
import { ItemMasterMappingData } from '../data/item-master-mapping';

@Injectable()
export class ItemMasterMappingService extends ItemMasterMappingData {

  data = [{
    id: 1,
    rolename: 'Superadmin',
    menuvisibility: 'All',
  }, {
    id: 2,
    rolename: 'Admin',
    menuvisibility: 'All',
  }, {
    id: 3,
    rolename: 'CBL',
    menuvisibility: 'Compounding Batch List',
  }, {
    id: 4,
    rolename: 'BOM',
    menuvisibility: 'BOM',
  }, {
    id: 5,
    rolename: 'CPD',
    menuvisibility: 'CPD Batch Order Tracking',
  }];

  getData() {
    return this.data;
  }
}
