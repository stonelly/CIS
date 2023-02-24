import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BatchListData } from '../../../@core/data/batchlist';
import { flatMap, takeWhile } from 'rxjs/operators';
import { NbToastrService } from '@nebular/theme';

@Component({
  template: `
    <button nbButton (click)="syncCPDBatchOrder()" size="small"  nbTooltip="Sync this CPD to ACCS" nbTooltipStatus="primary" 
      style="padding: 0.25em 0.25em 0.25em 0.25em;" [disabled]="disableSyncButton"
    >
    <nb-icon icon="repeat"></nb-icon></button>`,
})//<nb-icon icon="list"></nb-icon>
export class ButtonSyncRenderComponent implements OnInit {

  public renderValue;
  disableSyncButton: boolean = true;
  alive = true;
  @Input() value;

  constructor(  private router: Router,
                private batchListService: BatchListData,
                private toastrService: NbToastrService,
    ) {  }

  ngOnInit() {
    this.renderValue = this.value;

    if(this.renderValue['syncStatus'] !== 'Synced'){
      this.disableSyncButton = false;
    }

    if(this.renderValue['productType'] == null){
      this.disableSyncButton = true;
    }
  }

  syncCPDBatchOrder(): void {
    this.syncBatchData(this.renderValue['batchNo'], this.renderValue['syncStatus']);
    //If productType == null, cannot sync 
    if(this.renderValue['productType'] == null){
      this.showToast('top-right', 'danger', "Please update \"Product Type\" in order to sync");
    }
    else{
      this.syncBatchData(this.renderValue['batchNo'], this.renderValue['syncStatus']);
    }
    
  }


  syncBatchData(cpdBatchOrderNo: string, syncStatus: string):void{
    switch(syncStatus){
      case 'Synced': { break; }

      case 'NotSync':{
        //console.log(cpdBatchOrderNo + ", " + syncStatus);
        //console.log('NotSync, "startSync" triggered');
        this.batchListService.addSync(cpdBatchOrderNo).subscribe(stageItemData => {
          if (stageItemData['responseCode'] === '200') {
            this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['pages/home/cpdbatchorderlist'], { skipLocationChange: false }).then(() => {
                  this.showToast('top-right', 'success', 'Sync successfully.');
                });
            });
          }
          else{
            //console.log("Sync CPD Batch Data failed for " + cpdBatchOrderNo);
            this.batchListService.rollbackSync(cpdBatchOrderNo).subscribe(stageItemData => {
              if (stageItemData['responseCode'] === '200') {
                //this.router.navigate(['pages/home/cpdbatchorderlist'], { skipLocationChange: false }).then(() => {
                  this.showToast('top-right', 'danger', 'Sync failed.');
                //});
                //console.log("Rollback sync for CPD Batch No: " + cpdBatchOrderNo);
              }
              else{
                //console.log('Fail sync for CPD Batch Order: '+ cpdBatchOrderNo);
                //this.router.navigate(['pages/home/cpdbatchorderlist'], { skipLocationChange: false }).then(() => {
                  this.showToast('top-right', 'danger', 'Sync failed.');
                //});
              }
            }); 
          }
        }); break;
      }

      case 'RequireSync':{
        //console.log(cpdBatchOrderNo + ", " + syncStatus);
        //console.log('RequireSync - UpdateSync triggered');
        this.batchListService.updateSync(cpdBatchOrderNo).subscribe(stageItemData => {
          if (stageItemData['responseCode'] === '200') {
            if (stageItemData['responseCode'] === '200') {
             //console.log('**update success');
              this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                this.router.navigate(['pages/home/cpdbatchorderlist'], { skipLocationChange: false }).then(() => {
                  this.showToast('top-right', 'success', 'Sync successfully.');
                });
              });
              
            }
            else{
              this.batchListService.rollbackSync(cpdBatchOrderNo).subscribe(stageItemData => {
                if (stageItemData['responseCode'] === '200') {
                  //console.log('**rollback success');
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['pages/home/cpdbatchorderlist'], { skipLocationChange: false }).then(() => {
                      this.showToast('top-right', 'danger', 'Sync failed.');
                    });
                  });
                  //console.log("Rollback sync for CPD Batch No: " + cpdBatchOrderNo);
                }
                else{
                  this.showToast('top-right', 'danger', 'Sync failed.');
                  //this.showToast('top-right', 'danger', "Failed to rollback for CPD Batch Order: " + cpdBatchOrderNo + ' (RequireSync)');
                
                  //console.log('**failed');
                  this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
                    this.router.navigate(['pages/home/cpdbatchorderlist'], { skipLocationChange: false }).then(() => {
                      this.showToast('top-right', 'danger', 'Sync failed.');
                    });
                  });
                }
              }); 
            }
          }
          else{
            this.showToast('top-right', 'danger', 'Sync failed.');
            //this.showToast('top-right', 'danger', "Sync CPD Batch Data failed for " + cpdBatchOrderNo + ' (RequireSync)');
            //window.alert('Fail sync for CPD Batch Order (outside else): '+ cpdBatchOrderNo);
            //console.log(stageItemData['responseCode']);
            this.batchListService.rollbackSync(cpdBatchOrderNo).subscribe(stageItemData => {
              if (stageItemData['responseCode'] === '200') {
                /*this.batchListService.currentPlant.pipe(
                  takeWhile(() => this.alive),
                  flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                ).subscribe(data => {
                  if (data['responseCode'] === '200') {
                    //console.log('**else rollback success');
                    //this.source.load(data['data']);
                  }
                });*/
                //console.log("Rollback sync for CPD Batch No: " + cpdBatchOrderNo);
              }
              else{
                this.showToast('top-right', 'danger', 'Sync failed.');
                //this.showToast('top-right', 'danger', "Fail sync for CPD Batch Order: " + cpdBatchOrderNo + ' (RequireSync)');
                //window.alert('Fail sync for CPD Batch Order: '+ cpdBatchOrderNo);
                /*this.batchListService.currentPlant.pipe(
                  takeWhile(() => this.alive),
                  flatMap((plant) => this.batchListService.getItemByPlant(plant)),
                ).subscribe(data => {
                  if (data['responseCode'] === '200') {
                    
                    //console.log('**else lod success');
                    //this.source.load(data['data']);
                  }
                });*/
              }
            }); 
          }

        }); break;
      }
    }
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
