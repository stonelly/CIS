import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'ngx-dialog-addmissbom',
  templateUrl: './dialog-addmissbom.component.html',
  styleUrls: ['./dialog-addmissbom.component.scss']
})

export class DialogAddMissBomComponent implements OnInit {
  mainForm: FormGroup;

  @Input() currentbatchno: string;
  cpdbatchno: string;
  itemno: string;
  producttype: string;
  quantity: number;

  constructor(protected ref: NbDialogRef<DialogAddMissBomComponent>, private fb: FormBuilder) {}

  ngOnInit() {
    this.mainForm = this.fb.group({
      stabilization: this.fb.group({
        category: ['Stabilization'],
        items: this.fb.array([
          this.fb.group({
            itemid: ['Agwet HT'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
          this.fb.group({
            itemid: ['Soft Water'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
          this.fb.group({
            itemid: ['Soft Water (Flushing)'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
        ]),
      }),
      composite: this.fb.group({
        category: ['Composite'],
        items: this.fb.array([
          this.fb.group({
            itemid: ['Octocure HCLP-60(YS)'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
          this.fb.group({
            itemid: ['Octocure ZDE 50'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
          this.fb.group({
            itemid: ['Octotint 705'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
          this.fb.group({
            itemid: ['Octocure 573'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
          this.fb.group({
            itemid: ['Soft Water'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
          this.fb.group({
            itemid: ['Soft Water (Flushing)'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
        ]),
      }),
      wax: this.fb.group({
        category: ['Wax'],
        items: this.fb.array([
          this.fb.group({
            itemid: ['Aquawax 48'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
          this.fb.group({
            itemid: ['Soft Water'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
          this.fb.group({
            itemid: ['Soft Water (Flushing)'],
            itembatchno: ['', [Validators.required]],
            targetweight: ['', [Validators.required]],
            actualweight: ['', [Validators.required]],
          }),
        ]),
      }),
    });
  }

  cancel() {
    this.ref.close();
  }

  onSubmit() {
    this.ref.close(this.mainForm.value);
  }

  getControls(stage: string) {
    return (this.mainForm.get(stage).get('items') as FormArray).controls;
  }
}
