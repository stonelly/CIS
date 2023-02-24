import { Component, TemplateRef, OnDestroy } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
//import { ButtonViewRenderComponent } from './buttonView.render.component';
import { BatchListData, BatchList } from '../../../@core/data/batchlist';
import { NbDialogService } from '@nebular/theme';
import { DialogAddBomStageMappingComponent } from './dialog-add-bom-stage-mapping/dialog-add-bom-stage-mapping.component';
import { DialogAddNewItemComponent } from './dialog-add-new-item/dialog-add-new-item.component';
import { flatMap, takeUntil, takeWhile } from 'rxjs/operators';
import { BomGridData, BomGridArray, ItemLine } from '../../../@core/data/bom-grid';
import { BomMappingData } from '../../../@core/data/bommapping';
import { NONE_TYPE } from '@angular/compiler/src/output/output_ast';
import { ButtonDeleteRenderComponent } from './button-delete-mapping.render.component';
import { ButtonAddRenderComponent } from './button-add-mapping.render.component';
import { ButtonEditRenderComponent } from './button-edit-mapping.render.component';

@Component({
  selector: 'ngx-bom-stage-mapping',
  templateUrl: './bom-stage-mapping.component.html',
  styleUrls: ['./bom-stage-mapping.component.scss'],
})
export class BOMStageMappingComponent implements OnDestroy {
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
      'itemGroup': {
        title: 'Item Group',
        type: 'string',
        width: '0.5em',
      },
      'itemType': {
        title: 'Type',
        type: 'string',
        width: '2em',
        valuePrepareFunction: (itemType) => {
          let displayItemType;
          switch(itemType){
            case '0': displayItemType = 'Chemical'; break;
            case '1': displayItemType = 'Soft Water'; break;
            case '2': displayItemType = 'Soft Water (Flushing)'; break;
            case '3': displayItemType = 'Latex'; break;
            case '4': displayItemType = 'Pigment'; break;
            case '5': displayItemType = 'Filler'; break;
          }

          return displayItemType;
        }
      },
      /*'phr': {
        title: 'PHR',
        type: 'string',
        width: '0.5em',
      },
      'tsc': {
        title: 'TSC%',
        type: 'string',
        width: '0.5em',
      },*/
      'unit':{
        title: 'Unit',
        type: 'string',
        width: '0.5em',
      },
      'addMappingButton': {
        title:'',
        type: 'custom',
        renderComponent: ButtonAddRenderComponent,
        width: '0.5em',
        defaultValue: 'View',
        //valuePrepareFunction: (value) => value,
        valuePrepareFunction: (cell, row) => row,
      },
      'editItem': {
        title:'',
        type: 'custom',
        renderComponent: ButtonEditRenderComponent,
        width: '0.5em',
        defaultValue: 'View',
        //valuePrepareFunction: (value) => value,
        valuePrepareFunction: (cell, row) => row,
      },
      'id': {
        title:'',
        type: 'custom',
        renderComponent: ButtonDeleteRenderComponent,
        width: '0.5em',
        defaultValue: 'View',
        //valuePrepareFunction: (value) => value,
        valuePrepareFunction: (cell, row) => row,
      },

    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private bomMappingService: BomMappingData/*BatchListData*/, 
              private bomGridService: BomGridData/*BomMappingData/*BomGridData*/, 
              private dialogService: NbDialogService) {

    this.bomMappingService.getItems().subscribe(data => {
      if (data['responseCode'] === '200') {
        this.source.load(data['data']);
      }
    });
  }

  deleteMapping(event):void{
    let mappinID: number;
    this.clickedStatus = 'showDelete';
    
  }

  openModal(): void {
    let localplant: string;
    let batchlistdata: BatchList;
    let bomgriddata: BomGridArray;
    let itemlinedata: ItemLine;

    this.bomMappingService.currentPlant.subscribe(plant => {
      localplant = plant;
    });

    //this.dialogService.open(DialogAddBomStageMappingComponent, {context: { currentplant: localplant } })
    this.dialogService.open(DialogAddNewItemComponent, 
                              {context: { currentplant: localplant },
                                closeOnBackdropClick: false,
                                closeOnEsc: false,  },
                                )
    .onClose.subscribe(data =>  {
      if (data !== undefined) {

        console.log(data);
      }
    });
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

    /*this.bomMappingService.createItem(data).subscribe(response => {
        this.source.update(event.newData, event.newData);
        event.confirm.resolve();
    });*/
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

    /*this.bomMappingService.updateItem(data).subscribe(response => {
      this.source.update(event.newData, event.newData);
      event.confirm.resolve();
    });*/
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
