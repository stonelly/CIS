import { Component, OnInit, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';
import { BomMappingData } from '../../../../@core/data/bommapping';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'ngx-dialog-delete-bom-stage-mapping',
  templateUrl: './dialog-delete-bom-stage-mapping.component.html',
  styleUrls: ['./dialog-delete-bom-stage-mapping.component.scss']
})
export class DialogDeleteBomStageMappingComponent implements OnInit {
  @Input() selectedRowValue;
  private destroy$: Subject<void> = new Subject<void>();

  itemId: string;
  mappingId:number;
  jsondata: any;
  constructor(protected ref: NbDialogRef<DialogDeleteBomStageMappingComponent>,
              private bomMappingService: BomMappingData,
              private router: Router,
    ) { }

  ngOnInit() {
    this.itemId = this.selectedRowValue.itemId;
    this.mappingId = this.selectedRowValue.id;

    this.jsondata = {
      'Id': this.mappingId,
    };
  }

  close(){
    this.ref.close();
  }

  confirmDelete(){
    console.log('button triggered');
    this.bomMappingService.deleteBomMapping(this.jsondata).pipe(
      takeUntil(this.destroy$),
    ).subscribe(response => {
      console.log(response['data']['result']);
      
      if (response['data']['result'] !== null && response['data']['result'] == "Success"){
        
        this.ref.close();
        let displaySuccessfulmessage = '';
        displaySuccessfulmessage = '\"'+this.itemId+'\" deleted successfully.';
        window.alert(displaySuccessfulmessage);
        this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
          this.router.navigate(['pages/mastersetting/itemmastermapping']);
        });
        // this.router.navigate(['/pages/mastersettings']);
        // this.router.navigate(['/pages/mastersetting/itemmastermapping']);
      }
      else{
        let displaymessage = '';
        displaymessage = 'Please refresh the page to perform the action again.';
        window.alert(displaymessage);
      }
    }); 

  }

}
