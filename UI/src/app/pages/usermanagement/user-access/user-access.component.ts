import { Component } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { NbComponentStatus } from '@nebular/theme';
import { EmploymentInfoTableData } from '../../../@core/data/employment-info-table';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-user-access',
  styleUrls: ['./user-access.component.scss'],
  templateUrl: './user-access.component.html',
})
export class UserAccessComponent {
  statuses: NbComponentStatus[] = [ 'primary', 'success', 'info', 'warning', 'danger' ];

  settings = {
    mode: 'external',
    actions: {
      add: false,
      delete: false,
      edit: true,
    },
    edit: {
      editButtonContent: '<i class="nb-search"></i>',
    },
    
    columns: {

      effectiveDate: {
        title: 'Effective Date',
        type: 'string',
      },

      department: {
        title: 'Department',
        type: 'string',
      },

      userCategory: {
        title: 'User Category',
        type: 'string',
      },

      supervisor: {
        title: 'Supervisor',
        type: 'string',
      },

      holidayCalendar: {
        title: 'Holiday Calendar',
        type: 'string',
      },

      costCenter:{
        title: 'Cost Center',
        type: 'string',
      },
    },
  };

  source: LocalDataSource = new LocalDataSource();

  constructor(private service: EmploymentInfoTableData,private router: Router) {
    const data = this.service.getData();
    this.source.load(data);
  }

  //Button back 
  backUserPage (event){
    this.router.navigate(['./pages/usermanagement/user-access-listing']);
  }

  //Button edit 
  editUser (event){
    //  inputStatus inputUserRole inputFirstName inputLastName 
    // inputEmployeeNo inputJoinDate inputResignDate 
    //inputEmail inputMobilePhone
    this.router.navigate(['./pages/usermanagement/user-access-listing']);
    //expect(element(by.css('button')).getAttribute('disabled')).toBeFalsy();
  }
}
