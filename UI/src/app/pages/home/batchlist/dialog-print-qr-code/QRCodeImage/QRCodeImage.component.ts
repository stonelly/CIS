import { Component, Input, EventEmitter, Output, OnInit  } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { FormsModule, NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BatchListData } from "../../../../../@core/data/batchlist";
import { GetQRCodeComponent } from "../GetQRCode/GetQRCode.component";
import { UserData } from '../../../../../@core/data/users';

@Component({
    selector: 'ngx-qrcodeimage',
    //template: `<i (click)="openModal()" class="fa fa-qrcode fa-2x"></i>
    template: `
    <button nbButton class="printButton" (click)="openModal()" size="tiny" style="padding: 0.25em 0.25em 0.25em 0.25em;"  nbTooltip="Print QR Code" nbTooltipStatus="primary">
      <i class="fa fa-qrcode fa-2x"></i>
    </button>
    `,
    styles:[`
    @media only screen and (min-width: 360px) and (max-width:640px)  {
      .printButton {
        font-size: 0 !important;
        overflow: hidden !important;
        visibility: hidden !important;
      }
    }
  `],
})
export class QRCodeImageComponent {
  @Input() rowData: any;
  @Input() username: any;

  constructor(private dialogservice: NbDialogService,
    private fb: FormBuilder, private service: BatchListData,
    private userService: UserData) {

  }

    openModal() {

      this.dialogservice.open(GetQRCodeComponent,
        {
          closeOnBackdropClick: false,
          context: { selectedQALabTest: this.rowData, currentUserName: this.username},
        });
    }

    setImage(imageString) {

    }
}
