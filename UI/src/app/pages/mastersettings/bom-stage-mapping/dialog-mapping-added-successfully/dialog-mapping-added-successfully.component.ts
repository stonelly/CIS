import { Component, OnInit } from '@angular/core';
import { NbDialogRef} from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-mapping-added-successfully',
  templateUrl: './dialog-mapping-added-successfully.component.html',
  styleUrls: ['./dialog-mapping-added-successfully.component.scss']
})
export class DialogMappingAddedSuccessfullyComponent implements OnInit {

  constructor(protected ref: NbDialogRef<DialogMappingAddedSuccessfullyComponent>, ) {

  }

  ngOnInit() {
  }

  close() {
    this.ref.close();
  }
}
