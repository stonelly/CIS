import { Component, Input} from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { LocalDataSource } from 'ng2-smart-table';
import { UserAccessModulesData } from '../../../@core/data/user-access-modules';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'ngx-user-role-edit-dialog',
  templateUrl: './user-role-edit-dialog.component.html',
  styleUrls: ['./user-role-edit-dialog.component.scss']
})

export class UserRoleEditDialogComponent {

  @Input() title: string;

  source: LocalDataSource = new LocalDataSource();
  public input: string = '<input type="checkbox"></input>';

  constructor(protected ref: NbDialogRef<UserRoleEditDialogComponent>,
              private service: UserAccessModulesData,
              private _sanitizer: DomSanitizer) {
                const data = this.service.getData();
                this.source.load(data);
              }

  dismiss() {
    this.ref.close();
  }ad

  settings = {
    mode: 'external',

    actions: {
      add: false,
      delete: false,
      edit: false,
    },

    columns: {
      moduleLists:{
        title: 'Modules',
        type: 'string',
      },
      viewRights: {
        title: 'View',
        type: 'html',
        valuePrepareFunction: (value) => { 
                return this._sanitizer.bypassSecurityTrustHtml(this.input); },
        filter: false,
      },
      createRights: {
        title: 'Create',
        type: 'html',
        valuePrepareFunction: (value) => { 
                return this._sanitizer.bypassSecurityTrustHtml(this.input); },
        filter: false,
      },
      editRights: {
        title: 'Edit',
        type: 'html',
        valuePrepareFunction: (value) => { 
                return this._sanitizer.bypassSecurityTrustHtml(this.input); },
        filter: false,
      },
      deleteRights: {
        title: 'Delete',
        type: 'html',
        valuePrepareFunction: (value) => { 
                return this._sanitizer.bypassSecurityTrustHtml(this.input); },
        filter: false,
      },
    },
  };

  

    
}
