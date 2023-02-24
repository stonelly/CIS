import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialog-stringified-returnload',
  templateUrl: './dialog-stringified-returnload.component.html',
  styleUrls: ['./dialog-stringified-returnload.component.scss']
})
export class DialogStringifiedReturnloadComponent implements OnInit {
  @Input() CurrentObject;
  @Input() JSONType;
  JSONobj;
  payloadType;
  titleText;
  constructor(protected ref: NbDialogRef<DialogStringifiedReturnloadComponent>, ) { }

  ngOnInit() {
    this.JSONobj = this.CurrentObject.row.data;
    this.payloadType = this.JSONType;
    this.titleText = this.CurrentObject.column.settings.title;
    if(this.titleText === 'Payload'){
      this.JSONobj = JSON.parse(this.CurrentObject.row.data.payLoad);
      console.log(this.JSONobj);
    }
    if(this.titleText === 'Return Load'){
      //this.JSONobj = JSON.stringify(this.CurrentObject.row.data.returnLoad)
      console.log('this.JSONObj: ',JSON.parse(this.CurrentObject.row.data.returnLoad));
      this.JSONobj = JSON.parse(this.CurrentObject.row.data.returnLoad);

    }
  }

  close(){
    this.ref.close();
  }
}
