import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { getLocaleDateFormat } from '@angular/common';
import { CpdTrackingData } from '../../../@core/data/cpdtracking';

@Component({
  selector: 'ngx-stepper',
  templateUrl: 'stepper.component.html',
  styleUrls: ['stepper.component.scss'],
})
export class StepperComponent implements OnInit {
  currentstepper: string;
  currentbatchno: string;
  currentline: string;
  currentstage: string;
  firstForm: FormGroup;
  secondForm: FormGroup;
  thirdForm: FormGroup;

  constructor(private fb: FormBuilder, private arouter: ActivatedRoute, private router: Router, private service: CpdTrackingData) {
  }

  ngOnInit() {
    this.currentstepper = this.arouter.snapshot.paramMap.get('column');
    this.currentbatchno = this.arouter.snapshot.paramMap.get('batchno');
    this.currentline = this.arouter.snapshot.paramMap.get('line');
    this.currentstage = this.getDisplayValue(this.currentstepper);
    //console.log('currentstepper: ' + this.currentstepper + '\ncurrentbatchno: ' + this.currentbatchno + '\ncurrentline: ' + this.currentline);
    this.firstForm = this.fb.group({
      firstCtrl: ['', Validators.required],
    });

    this.secondForm = this.fb.group({
      secondCtrl: ['', Validators.required],
    });

    this.thirdForm = this.fb.group({
      thirdCtrl: ['', Validators.required],
    });
  }

  onFirstSubmit() {
    this.firstForm.markAsDirty();
  }

  onSecondSubmit() {
    this.secondForm.markAsDirty();
  }

  onThirdSubmit() {
    this.thirdForm.markAsDirty();
  }

  submitFail() {
    //this.service.postStatus('fail').subscribe();
    this.router.navigate(['/pages/home/cpdbatchordertracking', { data: 'fail' }]);
  }

  submitPass() {
    //this.service.postStatus('pass').subscribe();
    this.router.navigate(['/pages/home/cpdbatchordertracking', { data: 'pass' }]);
  }

  getDisplayValue(stage){
    switch(stage){
      case "latex":         { return 'Latex'; break; }
      case "stabilization": { return 'Stabilization'; break; }
      case "composite":     { return 'Composite'; break; }
      case "aquawax":       { return 'Wax'; break; }
      case "pigment":       { return 'Pigment'; break; }

      default:{return 'Stage Not Found'; break}
    }
  }
}
