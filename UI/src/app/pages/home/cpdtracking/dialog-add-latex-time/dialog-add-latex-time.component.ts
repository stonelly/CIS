import { Component, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'ngx-dialog-add-latex-time',
  templateUrl: './dialog-add-latex-time.component.html',
  styleUrls: ['./dialog-add-latex-time.component.scss']
})
export class DialogAddLatexTimeComponent implements OnInit {
  mainForm: FormGroup;
  
  constructor(protected ref: NbDialogRef<DialogAddLatexTimeComponent>,
              private fb: FormBuilder,
    ) { }

  ngOnInit() {
    this.mainForm = this.fb.group({
      plant:['2'],
      cpdbatchno: [''],
    });

  }

  cancel() {
    this.ref.close();
  }

}
