import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { NbDialogRef, NbToastrService } from '@nebular/theme';
import { UserAccessData } from '../../../../@core/data/useraccess';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dialog-select-plant',
  templateUrl: './dialog-select-plant.component.html',
  styleUrls: ['./dialog-select-plant.component.scss']
})
export class DialogSelectPlantComponent implements OnInit {
  mainForm: FormGroup;
  @Input() selectedValue;
  userName;
  checkboxValue: boolean;
  submitPlantObj=[];
  plantList = [
    {
      name: "Plant 1",
      value: "P1",
      checked: false,
    },
    {
      name: "Plant 2",
      value: "P2",
      checked: false,
    },
    {
      name: "Plant 3",
      value: "P3",
      checked: false,
    },
    {
      name: "Plant 4",
      value: "P4",
      checked: false,
    },
    {
      name: "Plant 5",
      value: "P5",
      checked: false,
    },
    {
      name: "Plant 6",
      value: "P6",
      checked: false,
    },
    {
      name: "Plant 7",
      value: "P7",
      checked: false,
    },
  ];
  constructor(protected ref: NbDialogRef<DialogSelectPlantComponent>,
              private fb: FormBuilder,
              private service: UserAccessData,
              private router: Router,
              private toastrService: NbToastrService,) { }

  ngOnInit() {
    this.userName = this.selectedValue.userName;
    //console.log(this.selectedValue.plant);
    let indexCount = 0;
    while(indexCount < this.plantList.length){
      let selectedValueCount = 0;
      while(selectedValueCount < this.selectedValue.plant.length){
        if(this.plantList[indexCount]['value'] === this.selectedValue.plant[selectedValueCount]){
          this.plantList[indexCount]['checked'] = true;
          selectedValueCount = this.selectedValue.plant.length;
        }
        else{
          selectedValueCount++;
        }
      }
      indexCount++;
    }
    this.mainForm = this.fb.group({
      plant: [''],
    });
  }

  cancel() {
    this.ref.close();
  }
  
  changeTick(e, type){
    let indexCount = 0;
    while(indexCount < this.plantList.length){
      if(this.plantList[indexCount]['name'] === type['name']){
        this.plantList[indexCount]['checked'] = !this.plantList[indexCount]['checked'];
      }
      indexCount++;
    }
    this.submitPlantObj.push({
      UserId: this.selectedValue.userId,
      Plant: type.value,
      IsDeleted: !type.checked,
    })
    this.service.assignPlant(this.submitPlantObj[0])
    .subscribe(response => {
      if(response['responseCode'] === '200' && response['data']['result'] === 'Success'){
        //this.showToast('top-right', 'success', 'success');
      }
      else{
        this.showToast('top-right', 'danger', 'Assign Plant Failed');
      }
    });
    this.submitPlantObj = [];
  }

  onSubmit(){
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['pages/usermanagement/useraccess']);
    });
    this.ref.close();
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
