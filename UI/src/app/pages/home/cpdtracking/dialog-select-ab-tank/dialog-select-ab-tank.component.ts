import { Component, OnInit, Input } from '@angular/core';
import { StringifyOptions } from 'querystring';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { NbDialogRef } from '@nebular/theme';
import { EditBOMDetailsFormArray, CpdTrackingData } from '../../../../@core/data/cpdtracking';
import { PlantTankMappingData } from '../../../../@core/data/planttankmapping';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dialog-select-ab-tank',
  templateUrl: './dialog-select-ab-tank.component.html',
  styleUrls: ['./dialog-select-ab-tank.component.scss']
})
export class DialogSelectAbTankComponent implements OnInit {
  @Input() cpdBatchOrderNo: string;
  @Input() mixingTankNo: string;
  @Input() PlantNo: string;
  cpdBatchOrderObj;
  cpdBatchNo: string;
  radioGroupValue;
  transferTankValue;
  ABTankObj:any;
  tankList = [];

  constructor(protected ref: NbDialogRef<DialogSelectAbTankComponent>,
              private cpdTrackingService: CpdTrackingData,
              private plantTankMappingService: PlantTankMappingData,
              private router: Router, ) { }

  ngOnInit() {
    this.radioGroupValue = '';
    this.transferTankValue = '';
    this.plantTankMappingService.getMixingTankMap(this.mixingTankNo).subscribe(data => {
    //this.plantTankMappingService.getMixingTankMapByPlant(this.mixingTankNo).subscribe(data => {
      if (data['responseCode'] === '200') {
        let indexCount = 0;
        while(indexCount < data['data'].length){
          this.tankList.push({  
            tankId: data['data'][indexCount]['mixingTankNo'],
            tankName: data['data'][indexCount]['mixingTankNo'],
          });
          indexCount++;
        }
      }
    });
  }

  onSubmit(){
    this.ABTankObj = {
      CPDBatchOrderNo: this.cpdBatchOrderNo,
      Tank: this.transferTankValue,//this.radioGroupValue,
    }

    this.cpdTrackingService.selectMixingABTank(this.ABTankObj).subscribe(data => {
      if (data['responseCode'] === '200') {
        window.alert('Mixing Tank for Pigment added successfully.');
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/home/cpdbatchordertracking']);
        });
      }
      else{
        window.alert('Mixing Tank for Pigment added failed.');
      }
    }); 
  }

  cancel() {
    this.ref.close();
  }
}
