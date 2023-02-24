import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { catchError } from 'rxjs/operators';
import { sfwRatioMapping } from '../../../@core/data/sfwRatioMapping';
import { ButtonEditSFWRenderComponent } from '../DefaultSFWRatioMapping/button-edit-defaultSFW.render.component';
import { NbDialogService } from '@nebular/theme';
import { DialogEditDefaultSFWFlushComponent } from './dialog-edit-defaultSFWFlush/dialog-edit-defaultSFWFlush.component';

@Component({
  selector: 'ngx-DefaultSFWRatio',
  templateUrl: './DefaultSFWRatio.component.html',
  styleUrls: ['./DefaultSFWRatio.component.scss']
})
export class DefaultSFWRatioComponent implements OnInit {

  settings = {
    mode: external,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    /*add: {
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
      confirmCreate: true,
    },
     edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
    }, */
    columns: {
      // 'stageId': {
      //   title: 'Id',
      //   type: 'number',
      //   width: '20px',
      // },
      'stageName': {
        title: 'Stage Name',
        type: 'string',
      },
      'ratio': {
        title: 'Ratio',
        type: 'number',
        width: '30px'
      },
      'isDeleted': {
        title: 'Is Deleted',
        type: 'Boolean',
      },
      'editItem': {
        title: '',
        type: 'custom',
        renderComponent: ButtonEditSFWRenderComponent,
        width: '0.5em',
        defaultValue: 'View',
        //valuePrepareFunction: (value) => value,
        valuePrepareFunction: (cell, row) => row,
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();
  sfwFlushValue: string;
  constructor(private service: sfwRatioMapping, private dialogService: NbDialogService) {

  }

  ngOnInit() {
    this.service.getDefaultSFWFlush().subscribe(res => {
      if (res['responseCode'] === '200') {
        this.sfwFlushValue = res['data']
      }
    })

    this.service.getDefaultSFWRatio().subscribe(res => {

      if (res['responseCode'] === '200') {
        this.source.load(res['data']);
      }
    });
  }


  openEditDialog() {
    this.dialogService.open(DialogEditDefaultSFWFlushComponent, {
      context: { selectedValue: this.sfwFlushValue },
      closeOnBackdropClick: false,
      closeOnEsc: false,
    });
  }

}
