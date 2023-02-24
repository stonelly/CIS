import { Component, Input, OnInit } from '@angular/core';
import { NbDialogRef, NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { takeUntil,catchError } from 'rxjs/operators';
import { Subject,throwError } from 'rxjs';
import { Router } from '@angular/router';
import { sfwRatioMapping } from '../../../../@core/data/sfwRatioMapping';

@Component({
  selector: 'app-dialog-edit-defaultSFWRatio',
  templateUrl: './dialog-edit-defaultSFWRatio.component.html',
  styleUrls: ['./dialog-edit-defaultSFWRatio.component.scss']
})
export class DialogEditDefaultSFWRatioComponent implements OnInit {
  private destroy$: Subject<void> = new Subject<void>();
  mainForm: FormGroup;
  @Input() selectedRow;
  submitObj: any;
  disableSubmit: boolean;

  constructor(private fb: FormBuilder, protected ref: NbDialogRef<DialogEditDefaultSFWRatioComponent>,
    private service: sfwRatioMapping,private router: Router,private toastrService: NbToastrService,) { }

  ngOnInit() {
    this.disableSubmit = true;
    this.mainForm = this.fb.group({
      StageName: [this.selectedRow['stageName'], [Validators.required]],
      Ratio: [this.selectedRow['ratio'], [Validators.required]],
    });
  }


  onSubmit() {
    if (this.mainForm.get("StageName").value != null || this.mainForm.get("Ratio").value != null) {
      this.submitObj = {
        StageName: this.mainForm.get("StageName").value,
        Ratio: this.mainForm.get("Ratio").value,
        IsDeleted: this.selectedRow['isDeleted']
      };

      this.service.editDefaultSFWRatio(this.submitObj).pipe(
        takeUntil(this.destroy$),
      ).subscribe( response => {
        if (response['responseCode'] === '200') {
          //window.location.reload();
          this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
            this.router.navigate(['pages/mastersetting/defaultratiosfw'], { skipLocationChange: false }).then(() => {
              this.showToast('top-right', 'success', 'Updated successfully.');
            });
          });
          this.ref.close();
        }
        else{
          this.showToast('top-right', 'danger', 'Error has occured');
          //window.alert('Kindly check your CPD Batch details and edit again.');
        }
      });
    }
  }

  handleError(error) {

  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status });
  }

  checkValueChange(event) {
    if (event.target.value != this.selectedRow['ratio']) {
      this.disableSubmit = false;
    } else {
      this.disableSubmit = true;
    }
  }

  cancel() {
    this.ref.close();
  }
}
