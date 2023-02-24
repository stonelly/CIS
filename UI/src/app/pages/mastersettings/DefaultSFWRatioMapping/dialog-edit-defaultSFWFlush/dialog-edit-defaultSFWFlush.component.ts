import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { takeUntil, catchError } from 'rxjs/operators';
import { Subject, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { sfwRatioMapping } from '../../../../@core/data/sfwRatioMapping';

@Component({
  selector: 'app-dialog-edit-defaultSFWFlush',
  templateUrl: './dialog-edit-defaultSFWFlush.component.html',
  styleUrls: ['./dialog-edit-defaultSFWFlush.component.scss']
})
export class DialogEditDefaultSFWFlushComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  mainForm: FormGroup;
  @Input() selectedValue;
  submitObj: any;
  disableSubmit: boolean;

  constructor(private fb: FormBuilder, protected ref: NbDialogRef<DialogEditDefaultSFWFlushComponent>,
    private service: sfwRatioMapping, private router: Router, private toastrService: NbToastrService,) { }

  ngOnInit() {
    this.disableSubmit = true;
    this.mainForm = this.fb.group({
      SFWFlushValue: [this.selectedValue, [Validators.required]],
    });
  }


  onSubmit() {

    if (this.mainForm.get("SFWFlushValue").value != null) {
      this.service.editDefaultSFWFlush(this.mainForm.get("SFWFlushValue").value).pipe(
        takeUntil(this.destroy$),
      ).subscribe(response => {
        if (response['responseCode'] === '200') {
          //window.location.reload();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['pages/mastersetting/defaultratiosfw'], { skipLocationChange: false }).then(() => {
              this.showToast('top-right', 'success', 'Updated successfully.');
            });
          });
          this.ref.close();
        }
        else {
          this.showToast('top-right', 'danger', 'Error has occured');
          //window.alert('Kindly check your CPD Batch details and edit again.');
        }
      });

    }
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }


  checkValueChange(event) {
    if (event.target.value != this.selectedValue) {
      this.disableSubmit = false;
    } else {
      this.disableSubmit = true;
    }
  }

  cancel() {
    this.ref.close();
  }
}
