import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { ButtonView2RenderComponent } from './buttonView2.render.component';
import { BatchListData } from '../../../@core/data/batchlist';

@Component({
  selector: 'ngx-batchlist2',
  templateUrl: './batchlist2.component.html',
  styleUrls: ['./batchlist2.component.scss'],
})
export class BatchList2Component {
  settings = {
    actions: {
      edit: false,
      delete: false,
    },
    add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
    /*
     edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    }, */
    columns: {
      'Plant': {
        title: 'Plant',
        type: 'string',
        width: '20px',
      },
      'BatchNo': {
        title: 'CPD Batch No.',
        type: 'string',
      },
      'ItemNo': {
        title: 'Item No.',
        type: 'string',
      },
      'ProductType': {
        title: 'Product Type',
        type: 'string',
      },
      'Quantity': {
        title: 'Quantity (kg)',
        type: 'html',
        width: '2em',
        valuePrepareFunction: (value) => {
          return '<div class="cell_right">' + value + '</div>';
        },
      },
      'Id': {
        type: 'custom',
        renderComponent: ButtonView2RenderComponent,
        width: '2em',
        defaultValue: 'View',
        valuePrepareFunction: (cell, row) => row,
        editor: {
          type: 'custom',
          component: ButtonView2RenderComponent,
        },
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: BatchListData) {
    this.service.getItems().subscribe(data => {
      if (data['ResponseCode'] === '200') {
        this.source.load(data['Data']);
      }
    });
  }

  /*deleteRecord(event): void {
    const request = {
      'Id': event.data['Id'],
      'ModifiedBy': 'anuar.arsyad',
    };

    if (window.confirm('Are you sure you want to delete?')) {
      this.service.deleteItem(request).subscribe(response => {
        if (response['RequestReponse'] === 'SUCCESS') {
          this.source.update(event.newData, event.newData);
          event.confirm.resolve();
        } else {
          event.confirm.reject();
        }
      });
    } else {
      event.confirm.reject();
    }
  }

  addRecord(event): void {
    const data = {
      'Id': undefined,
      'Plant': event.newData['Plant'],
      'BatchNo': event.newData['BatchNo'],
      'ItemNo': event.newData['ItemNo'],
      'ProductType': event.newData['ProductType'],
      'Quantity': event.newData['Quantity'],
      'Description': undefined,
      'ModifiedBy': undefined,
      'ModifiedDate': undefined,
      'CreatedBy': 'anuar.arsyad',
      'CreatedDate': undefined,
    };

    this.service.createItem(data).subscribe(response => {
        this.source.update(event.newData, event.newData);
        event.confirm.resolve();
    });
  }

  editRecord(event): void {
    const data = {
      'Id': event.data['Id'],
      'Plant': event.newData['Plant'],
      'BatchNo': event.newData['BatchNo'],
      'ItemNo': event.newData['ItemNo'],
      'ProductType': event.newData['ProductType'],
      'Quantity': event.newData['Quantity'],
      'Description': undefined,
      'ModifiedBy': 'anuar.arsyad',
      'ModifiedDate': undefined,
      'CreatedBy': undefined,
      'CreatedDate': undefined,
    };

    this.service.updateItem(data).subscribe(response => {
      this.source.update(event.newData, event.newData);
      event.confirm.resolve();
    });
  }*/
}
