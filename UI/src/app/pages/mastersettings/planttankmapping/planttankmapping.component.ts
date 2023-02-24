import { Component, OnInit } from '@angular/core';
import { PlantTankMappingData } from '../../../@core/data/planttankmapping';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbSortDirection, NbSortRequest } from '@nebular/theme';
import { DialogAddPlanttankmappingComponent } from './dialog-add-planttankmapping/dialog-add-planttankmapping.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-planttankmapping',
  templateUrl: './planttankmapping.component.html',
  styleUrls: ['./planttankmapping.component.scss'],
})
export class PlanttankmappingComponent implements OnInit {
  settings = {
    mode: external,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      'plant': {
        title: 'Plant',
        type: 'string',
      },
      'mixingTankNo': {
        title: 'Mixing Tank No',
        type: 'string',
      },
      'createdBy': {
        title: 'Created By',
        type: 'string',
      },
      'createdDate': {
        title: 'Created Date',
        type: 'Date',
        valuePrepareFunction: (created) => {
          return this.datePipe.transform(new Date(created), 'dd/MM/yyyy HH:mm:ss');
        }
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: PlantTankMappingData,
              private dialogService: NbDialogService,
              private datePipe: DatePipe,
              ) {
    this.service.getItems().subscribe(data => {
      if (data['responseCode'] === '200') {
        this.source.load(data['data']);
      }
    });
  }

  ngOnInit() {
  }

  openModal(): void {
    this.dialogService.open(DialogAddPlanttankmappingComponent, 
                            {closeOnBackdropClick: false, 
                            closeOnEsc: false})
    .onClose.subscribe(data =>  {
      if (data !== undefined) {

        console.log(data);
      }
    });
  }
}
