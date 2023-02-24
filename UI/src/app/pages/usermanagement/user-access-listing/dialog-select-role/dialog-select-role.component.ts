import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { UserRoleData } from '../../../../@core/data/userrole';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dialog-select-role',
  templateUrl: './dialog-select-role.component.html',
  styleUrls: ['./dialog-select-role.component.scss']
})

export class DialogSelectRoleComponent implements OnInit {
  mainForm: FormGroup;
  @Input() selectedValue;
  userName;
  userRoleList = [
    /*{
      name: "Group Leader",
      value: "Group Leader",
    },
    {
      name: "Supervisor",
      value: "Supervisor",
    },
    {
      name: "Executive",
      value: "Executive",
    },
    {
      name: "Manager",
      value: "Manager",
    },*/
  ];
  constructor(protected ref: NbDialogRef<DialogSelectRoleComponent>,
              private fb: FormBuilder,
              private service: UserRoleData,
              private router: Router,
              private toastrService: NbToastrService, ) { }

  ngOnInit() {
    this.userName = this.selectedValue.userName;
    this.service.getRoleList().subscribe(response => {
      if(response['responseCode'] === '200'){
        this.userRoleList = response['data'];
        this.userRoleList.sort((a, b) => a.roleName < b.roleName ? -1 : a.roleName > b.roleName ? 1 : 0);
      }
    })

    this.mainForm = this.fb.group({
      userRole: [''],
    });
  }

  cancel() {
    this.ref.close();
  }

  onSubmit(){
    let roleId = this.mainForm.get('userRole').value;
    let userId = this.selectedValue.userId;
    let userObj = {
      UserId: userId,
      RoleId: roleId
    }
    
    this.service.assignRoleUser(userObj).subscribe(response => {
      if (response['responseCode'] === '200') {
            this.showToast('top-right', 'success', 'Role assigned successfully');
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['pages/usermanagement/useraccess']);
            });
          }
      else{
        this.showToast('top-right', 'danger', 'Error ' + response['responseCode'] + ': Please try again');
      }
      });
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }
}
