import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-login-fail-dialog',
  templateUrl: 'login-fail-dialog.component.html',
  styleUrls: ['login-fail-dialog.component.scss'],
})
export class LoginFailDialogComponent {

  @Input() title: string;

  constructor(protected ref: NbDialogRef<LoginFailDialogComponent>) {}

  dismiss() {
    this.ref.close();
  }
}
