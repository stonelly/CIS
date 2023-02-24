import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'ngx-dialog-add',
  templateUrl: './dialog-add.component.html',
  styleUrls: ['./dialog-add.component.scss']
})

export class DialogAddComponent implements OnInit {
  selectedValue1: number = 0;
  selectedValue2: number = 0;
  selectedValue3: number = 0;
  mainForm: FormGroup;

  @Input() currentplant: string;
  plant: string;
  cpdbatchno: string;
  itemno: string;
  producttype: string;
  quantity: number;

  constructor(protected ref: NbDialogRef<DialogAddComponent>, private fb: FormBuilder) {}

  ngOnInit() {
    this.plant = 'Plant ' + this.currentplant;

    this.mainForm = this.fb.group({
      batchorder: this.fb.group({
        plant: [this.plant, [Validators.required]],
        cpdbatchno: ['', [Validators.required]],
        itemno: ['', [Validators.required]],
        producttype: ['', [Validators.required]],
        quantity: ['', [Validators.required]],
      }),
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

    this.mainForm.get('batchorder').get('plant').disable();

    this.onChanges();
  }

  cancel() {
    this.ref.close();
  }

  onSubmit() {
    this.mainForm.get('batchorder').get('plant').enable();
    this.ref.close(this.mainForm.value);
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

/*   onOptionSelected(event): void {
    console.log(event.target.value);
    if (event.target.id === 'select1') {
      this.selectedValue1 = event.target.value;
    }
    else if (event.target.id === 'select2') {
      this.selectedValue2 = event.target.value;
    }
    else if (event.target.id === 'select3') {
      this.selectedValue3 = event.target.value;
    }
  } */

  checkFormGroup(value): string {
    let id = '';
    if (value === '1')
      id = 'item1';
    else if (value === '2')
      id = 'item2';
    else if (value === '3')
      id = 'item3';
    else if (value === '4')
      id = 'item4';
    else if (value === '5')
      id = 'item5';
    else if (value === '6')
      id = 'item6';

    return id;
  }
}
