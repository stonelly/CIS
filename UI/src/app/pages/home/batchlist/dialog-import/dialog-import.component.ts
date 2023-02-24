import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-import',
  templateUrl: './dialog-import.component.html',
  styleUrls: ['./dialog-import.component.scss'],
})

export class DialogImportComponent implements OnInit {
  fileToUpload: File = null;

  constructor(protected ref: NbDialogRef<DialogImportComponent>) {}

  ngOnInit() {
   
  }

  cancel() {
    this.ref.close();
  }

  onSubmit() {
    this.ref.close();
  }

  handleFileInput(files: FileList) {
    this.fileToUpload = files.item(0);
  }
}
