import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { StageOrderMappingData } from '../../../@core/data/stageordermapping';

@Component({
  selector: 'ngx-stageordermapping',
  templateUrl: './stageordermapping.component.html',
  styleUrls: ['./stageordermapping.component.scss']
})
export class StageordermappingComponent implements OnInit {

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
      'stageId': {
        title: 'Id',
        type: 'number',
        width: '20px',
      },
      'stageName': {
        title: 'Stage Name',
        type: 'string',
      },
      /*'isDeleted': {
        title: 'Is Deleted',
        type: 'Boolean',
      },*/
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: StageOrderMappingData) {

    this.service.getItems().subscribe(data => {
      if (data['responseCode'] === '200') {
        this.source.load(data['data']);
      }
    });
    /*const data = this.service.getData();
    this.source.load(data);*/
  }

  ngOnInit() {
  }

}
