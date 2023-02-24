import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { CpdTrackingData } from '../../../../@core/data/cpdtracking';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dialog-add-flowin-time',
  templateUrl: './dialog-add-flowin-time.component.html',
  styleUrls: ['./dialog-add-flowin-time.component.scss']
})
export class DialogAddFlowinTimeComponent implements OnInit {
  mainForm: FormGroup;
  @Input() selectedCPDBatch;
  currentBatchNo;
  constructor(protected ref: NbDialogRef<DialogAddFlowinTimeComponent>,
              private fb: FormBuilder,
              private service: CpdTrackingData,
              private router: Router,
              private toastrService: NbToastrService,) { }

  ngOnInit() {
    const date = this.getDate();
    this.currentBatchNo = this.selectedCPDBatch;
    console.log(date);
    this.mainForm = this.fb.group({
      flowintime:[date, Validators.required],
    });
  }

  cancel() {
    this.ref.close();
  }

  onSubmit(){
    //console.log(this.mainForm.get('flowintime').value);

    let CPDObject = {
      CPDBatchOrderNo: this.currentBatchNo,
      FlowInTime: this.mainForm.get('flowintime').value,
    }
    //console.log(CPDObject);
    this.service.startFlowInTime(CPDObject).subscribe(response => {
      if (response['responseCode'] === '200' && response['data']['result'] === 'Success') {
            window.alert("FlowIn time added successfully");
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
              this.router.navigate(['pages/home/cpdbatchordertracking']);
            });
          }
      else{
       // window.alert(response['responseCode']);
        this.showToast('top-right', 'danger', response['responseMessage']);
      }
      });
  }

  getDate() {
    let today = new Date();
    let convertedDate;
    let dd = today.getDate();
    let finaldd;
    let finalmm;
    let finalhh;
    let finalminute;
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
    let hh = today.getHours();
    let minute = today.getMinutes();
    if (dd < 10) {
      finaldd = `0${dd}`;
    }
    if (dd > 10) {
      finaldd = dd;
    }

    if (mm < 10) {
      finalmm = `0${mm}`;
    }
    if (mm > 10) {
      finalmm = mm;
    }

    
    if(hh < 10){
      finalhh = `0${hh}`;
    }
    if(hh > 10){
      finalhh = hh;
    }

    if(minute < 10){
      finalminute = `0${minute}`;
    }
    if(minute > 10){
      finalminute = minute;
    }

    //convertedDate = `${finaldd}/${finalmm}/${yyyy}T${finalhh}:${finalminute}`; 
    convertedDate = `${yyyy}-${finalmm}-${finaldd}T${finalhh}:${finalminute}`; //yyyy-MM-ddThh:mm
    return convertedDate;
  }

  showToast(position, status, errMessage) {
    const index = 1;
    this.toastrService.show(
      '',
      errMessage,
      { position, status }
    );
  }
}
