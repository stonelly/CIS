import { Component, OnInit } from '@angular/core';
import { StationMasterData } from '../../../@core/data/stationmaster';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbSortDirection, NbSortRequest } from '@nebular/theme';
import { DialogAddStationMasterComponent } from './dialog-add-stationmaster/dialog-add-stationmaster.component';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'ngx-StationMaster',
  templateUrl: './stationmaster.component.html',
  styleUrls: ['./StationMaster.component.scss'],
})
export class StationMasterComponent implements OnInit {
  settings = {
    mode: external,
    actions: {
      add: false,
      edit: false,
      delete: false,
    },
    columns: {
      'stationId': {
        title: 'StationID',
        type: 'number',
      },
      'stationName': {
        title: 'Station Name',
        type: 'string',
      },
      'locationName': {
        title: 'Location',
        type: 'string',
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: StationMasterData,
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
    this.dialogService.open(DialogAddStationMasterComponent, 
                            {closeOnBackdropClick: false, 
                            closeOnEsc: false})
    .onClose.subscribe(data =>  {
      if (data !== undefined) {

        console.log(data);
      }
    });
  }
}
