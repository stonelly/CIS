import { Component, OnInit } from '@angular/core';
import { LocationMasterData } from '../../../@core/data/locationmaster';
import { LocalDataSource } from 'ng2-smart-table';
import { NbDialogService, NbToastrService, NbSortDirection, NbSortRequest } from '@nebular/theme';
import { DialogAddLocationMasterComponent } from './dialog-add-locationmaster/dialog-add-locationmaster.component';
import { DatePipe } from '@angular/common';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-locationmaster',
  templateUrl: './locationmaster.component.html',
  styleUrls: ['./locationmaster.component.scss'],
})
export class LocationMasterComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  settings = {
    mode: external,
    actions: {
      add: false,
      edit: false,
    },
    delete: {
      confirmDelete: true,
      deleteButtonContent: '<i class="nb-trash"></i>',
    },
    columns: {
      'locationId': {
        title: 'Location ID',
        type: 'number',
      },
      'locationName': {
        title: 'Location Name',
        type: 'string',
      },
      'locationTypeName': {
        title: 'Location Type',
        type: 'string',
      }
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: LocationMasterData,
              private dialogService: NbDialogService,
              private datePipe: DatePipe,
              private router: Router,
              private toastrService: NbToastrService,
              ) {
    this.service.getItems().subscribe(data => {
      if (data['responseCode'] === '200') {
        this.source.load(data['data']);
      }
    });
  }

  ngOnInit() {
  }

  onDeleteConfirm(event): void {
    var data = event.data;
    console.log("Delete Event In Console")
    console.log(event);
    console.log(data);
    if (window.confirm('Are you sure you want to delete?')) { 

      this.service.removeLocationMaster(data).pipe(
        takeUntil(this.destroy$),
      ).subscribe(response => {      
        if (response['responseCode'] == 200 && response['data']['locationId'] !== null ){
          let displaySuccessfulmessage = '';
          displaySuccessfulmessage = 'Location removed successfully.';
          this.showToast('top-right', 'success', displaySuccessfulmessage);  
        }
        else{
          let displaymessage = '';
          displaymessage = 'Please check the \"Location\" details again.';
          this.showToast('top-right', 'danger', displaymessage);
        }
      });


      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  openModal(): void {
    this.dialogService.open(DialogAddLocationMasterComponent, 
                            {closeOnBackdropClick: false, 
                            closeOnEsc: false})
    .onClose.subscribe(data =>  {
      if (data !== undefined) {

        console.log(data);
      }
    });
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status }
    );
  }
}
