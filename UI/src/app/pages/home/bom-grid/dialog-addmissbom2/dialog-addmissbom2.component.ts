import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';

@Component({
  selector: 'ngx-dialog-addmissbom2',
  templateUrl: './dialog-addmissbom2.component.html',
  styleUrls: ['./dialog-addmissbom2.component.scss']
})

export class DialogAddMissBom2Component implements OnInit {
  selectedValue1: number = 0;
  selectedValue2: number = 0;
  selectedValue3: number = 0;
  mainForm: FormGroup;

  @Input() currentbatchno: string;
  cpdbatchno: string;
  itemno: string;
  producttype: string;
  quantity: number;

  constructor(protected ref: NbDialogRef<DialogAddMissBom2Component>, private fb: FormBuilder) {}

  ngOnInit() {
    this.mainForm = this.fb.group({
      stabilization: this.fb.group({
        category: ['Stabilization'],
        selectedItem: ['0'],
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
        selectedItem: ['0'],
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
        selectedItem: ['0'],
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

    this.onChanges();
  }

  onChanges(): void {
    this.mainForm.get('stabilization').get('selectedItem').valueChanges.subscribe(val => {
      this.selectedValue1 = +val;
    });
    this.mainForm.get('composite').get('selectedItem').valueChanges.subscribe(val => {
      this.selectedValue2 = +val;
    });
    this.mainForm.get('wax').get('selectedItem').valueChanges.subscribe(val => {
      this.selectedValue3 = +val;
    });
  }

  getControls(stage: string) {
    return (this.mainForm.get(stage).get('items') as FormArray).controls;
  }

  cancel() {
    this.ref.close();
  }

  onSubmit() {
    this.ref.close(this.mainForm.value);
  }
}
