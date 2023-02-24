import { Injectable } from '@angular/core';
import { BomData } from '../data/bom';

@Injectable()
export class BomService extends BomData {

  data = [{
    id: 1,
    chemical: 'Agwet HT',
    batchno: '499',
    targetweight: 120.6,
    actualweight: 120.6,
    varianceweight: 0.0,
    variancepercent: 0.00,
  }, {
    id: 2,
    chemical: 'Soft Water',
    batchno: 'Mat 5',
    targetweight: 180.9,
    actualweight: 183.6,
    varianceweight: 2.7,
    variancepercent: 1.50,
  }, {
    id: 3,
    chemical: 'Soft Water (Flushing)',
    batchno: 'Mat 7',
    targetweight: 300.0,
    actualweight: 302.6,
    varianceweight: 2.6,
    variancepercent: 0.90,
  }, {
    id: 1,
    chemical: 'Octocure HCLP-60(YS)',
    batchno: '2526',
    targetweight: 144.8,
    actualweight: 143.2,
    varianceweight: -1.6,
    variancepercent: -1.10,
  }, {
    id: 2,
    chemical: 'Octocure ZDE 50',
    batchno: '815',
    targetweight: 71.4,
    actualweight: 71.4,
    varianceweight: 0.0,
    variancepercent: 0.00,
  }, {
    id: 3,
    chemical: 'Octotint 705',
    batchno: '1637',
    targetweight: 320.6,
    actualweight: 320.4,
    varianceweight: -0.2,
    variancepercent: -0.10,
  }, {
    id: 4,
    chemical: 'Octocure 573',
    batchno: '2325',
    targetweight: 145.4,
    actualweight: 145.2,
    varianceweight: -0.2,
    variancepercent: -0.10,
  }, {
    id: 5,
    chemical: 'Soft Water',
    batchno: 'Mat 5',
    targetweight: 682.2,
    actualweight: 686.0,
    varianceweight: 3.8,
    variancepercent: 0.60,
  }, {
    id: 6,
    chemical: 'Soft Water (Flushing)',
    batchno: 'Mat 7',
    targetweight: 300.0,
    actualweight: 301.8,
    varianceweight: 1.8,
    variancepercent: 0.60,
  }, {
    id: 1,
    chemical: 'Aquawax 48',
    batchno: '3293',
    targetweight: 301.5,
    actualweight: 301.8,
    varianceweight: 0.3,
    variancepercent: 0.10,
  }, {
    id: 2,
    chemical: 'Soft Water',
    batchno: 'Mat 5',
    targetweight: 452.3,
    actualweight: 455.0,
    varianceweight: 2.7,
    variancepercent: 0.60,
  }, {
    id: 3,
    chemical: 'Soft Water (Flushing)',
    batchno: 'Mat 7',
    targetweight: 300.0,
    actualweight: 302.2,
    varianceweight: 2.2,
    variancepercent: 0.70,
  }];

  getData() {
    return this.data;
  }
}
