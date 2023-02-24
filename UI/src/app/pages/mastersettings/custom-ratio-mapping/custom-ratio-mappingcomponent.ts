import { Component, TemplateRef, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService } from '@nebular/theme';
 import { DialogAddCustomRatioMappingComponent } from './dialog-add-custom-ratio/dialog-add-custom-ratio.component';
import { ButtonDeleteRatioRenderComponent } from './button-delete-mapping.render.component';
// import { ButtonAddRatioRenderComponent } from './button-add-mapping.render.component';
import { ButtonEditRatioRenderComponent } from './button-edit-mapping.render.component';
import { sfwRatioMapping } from '../../../@core/data/sfwRatioMapping';

@Component({
  selector: 'ngx-custom-ratio-mapping',
  templateUrl: './custom-ratio-mapping.component.html',
  styleUrls: ['./custom-ratio-mapping.component.scss'],
})
export class CustomRatioMappingComponent implements OnDestroy {

  itemList;
  alive = true;
  clickedStatus: string;
  settings = {
    mode: external,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      'itemId': {
        title: 'Item Number',
        type: 'string',
        sortDirection: 'asc',
      },
      'itemName': {
        title: 'Item Name',
        type: 'string',
        //width: '5em',
      },
      /*'stageName': {
        title: 'BOM Stage',
        type: 'string',
        width: '1em',
      },*/
      'stabilization': {
        title: 'Stabilization',
        type: 'string',
        width: '0.5em',
      },
      'composite': {
        title: 'Composite',
        type: 'string',
        width: '0.5em',
      },
      'esd': {
        title: 'ESD',
        type: 'string',
        width: '0.5em',
      },
      'wax': {
        title: 'Wax',
        type: 'string',
        width: '0.5em',
      },
      'editItem': {
        title:'',
        type: 'custom',
        renderComponent: ButtonEditRatioRenderComponent,
        width: '0.5em',
        defaultValue: 'View',
        // valuePrepareFunction: (value) => value,
        valuePrepareFunction: (cell, row) => row,
      },
      'id': {
        title:'',
        type: 'custom',
        renderComponent: ButtonDeleteRatioRenderComponent,
        width: '0.5em',
        defaultValue: 'View',
        // valuePrepareFunction: (value) => value,
        valuePrepareFunction: (cell, row) => row,
      },

    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private customSWRatioService: sfwRatioMapping/*BatchListData*/,
              private dialogService: NbDialogService) {

    this.customSWRatioService.getStageRatios().subscribe(data => {
      if (data['responseCode'] === '200') {
        this.source.load(data['data']);
      }
    });
    this.customSWRatioService.getCPDItems().subscribe(data => {
      this.itemList = data['data'];
    });

  }

  openModal(): void {



    this.dialogService.open(DialogAddCustomRatioMappingComponent,
      { context:
        {
        itemList: this.itemList
        },
        closeOnBackdropClick: false,
        closeOnEsc: false,
      })
      .onClose.subscribe(data =>  {
      if (data !== undefined) {

      console.log(data);
      }
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
