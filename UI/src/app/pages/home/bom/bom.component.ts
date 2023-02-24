import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { BomData } from '../../../@core/data/bom';

@Component({
  selector: 'ngx-bom',
  templateUrl: './bom.component.html',
  styleUrls: ['./bom.component.scss'],
})
export class BomComponent {

  settings = {
    actions: {
      add: false,
      delete: false,
      edit: false,
    },
    /* add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    }, */
    columns: {
      id: {
        title: 'No',
        type: 'number',
      },
      chemical: {
        title: 'Chemical',
        type: 'string',
      },
      batchno: {
        title: 'Batch No',
        type: 'string',
      },
      targetweight: {
        title: 'Target Weight(kg)',
        type: 'number',
      },
      actualweight: {
        title: 'Actual Weight(kg)',
        type: 'number',
      },
      varianceweight: {
        title: 'Variance(kg)',
        type: 'number',
      },
      variancepercent: {
        title: 'Variance(%)',
        type: 'number',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: BomData) {
    const data = this.service.getData();
    this.source.load(data);
  }

  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }
}
