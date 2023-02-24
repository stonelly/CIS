import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-add-stage-item',
  templateUrl: './dialog-add-stage-item.component.html',
  styleUrls: ['./dialog-add-stage-item.component.scss']
})
export class DialogAddStageItemComponent implements OnInit {
  @Input() currentStage: string;
  @Input() mainFormValue;
  
  constructor(protected ref: NbDialogRef<DialogAddStageItemComponent>,
              ) { }

  ngOnInit() {
    //console.log(this.mainFormValue);
    //this.mainFormValue.get('batchorder').get('plant') = 'p2';
  }

  cancel(){
    this.ref.close();
  }
}
