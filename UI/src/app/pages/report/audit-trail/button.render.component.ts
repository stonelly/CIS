import { Component, Input, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { DialogStringifiedReturnloadComponent } from './dialog-stringified-returnload/dialog-stringified-returnload.component';

@Component({
  template: `
    <button nbButton size="small" (click) = "showJSON()">Data</button>
  `,
})
export class ButtonRenderComponent implements OnInit {
  @Input() value;
  JSONString;

  constructor(private dialogService: NbDialogService, 
              ) {  }

  ngOnInit() { 
  }

  showJSON(){
    this.dialogService.open( DialogStringifiedReturnloadComponent , 
      { context: {  CurrentObject: this.value,
                    JSONType: this.value.column.id,
      },
        closeOnBackdropClick: true, 
        closeOnEsc: true});
    /*this.auditLogService.getAuditLogbyCount(1).subscribe(data => {
      if (data['responseCode'] === '200') {
        console.log(data);
      }
    });*/
  }
}
