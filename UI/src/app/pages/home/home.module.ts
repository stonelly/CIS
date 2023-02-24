import { NgModule } from '@angular/core';
//import { NbCardModule, NbDatepickerModule, NbIconModule, NbInputModule, NbTreeGridModule, NbButtonModule, NbDialogModule, NbStepperModule, NbTabsetModule, NbRouteTabsetModule, NbAccordionModule, NbSelectModule } from '@nebular/theme';
import { NbCardModule, NbIconModule, NbInputModule, NbTreeGridModule, NbButtonModule, NbDialogModule,
  NbStepperModule, NbTabsetModule, NbRouteTabsetModule,
  NbAccordionModule, NbSelectModule, NbDatepickerModule,
  NbSpinnerModule, NbRadioModule,NbCheckboxModule,
  NbTooltipModule} from '@nebular/theme';
import { Ng2SmartTableModule } from 'ng2-smart-table';
import { ThemeModule } from '../../@theme/theme.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { BatchListComponent } from './batchlist/batchlist.component';
import { BomGridComponent } from './bom-grid/bom-grid.component';
import { FsIconComponent } from './bom-grid/bom-grid.component';
import { ButtonViewRenderComponent } from './batchlist/buttonView.render.component';
import { ButtonSyncRenderComponent } from './batchlist/buttonSync.render.component';
import { ButtonHistoryViewRenderComponent } from './batchlist-history/buttonView.render.component';
import { ButtonEditRenderComponent } from './batchlist/buttonEdit.render.component';
import { DialogAddComponent } from './batchlist/dialog-add/dialog-add.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CpdTrackingComponent } from './cpdtracking/cpdtracking.component';
import { ButtonRenderComponent } from './cpdtracking/button.render.component';
import { ButtonSelectABTankRenderComponent } from './cpdtracking/buttonSelectABTank.render.component';
import { ButtonPostToD365RenderComponent } from './cpdtracking/buttonPostToD365.render.component';
import { StepperComponent } from './stepper/stepper.component';
import { DialogAddBomComponent } from './batchlist/dialog-addbom/dialog-addbom.component';
import { DialogImportComponent } from './batchlist/dialog-import/dialog-import.component';
import { DialogAddMissBomComponent } from './bom-grid/dialog-addmissbom/dialog-addmissbom.component';
import { DialogAddMissBom2Component } from './bom-grid/dialog-addmissbom2/dialog-addmissbom2.component';
import { DialogAddStageItemComponent } from './batchlist/dialog-add-stage-item/dialog-add-stage-item.component';
import { DialogEditBomComponent } from './batchlist/dialog-editbom/dialog-editbom.component';
import { DialogStageTestResultComponent } from './cpdtracking/dialog-stage-test-result/dialog-stage-test-result.component';
import { DialogPigmentAdditionComponent } from './cpdtracking/dialog-pigment-addition/dialog-pigment-addition.component';
import { ButtonStartFlowInRenderComponent } from './cpdtracking/buttonStartFlowIn.render.component';
import { CPDBatchNoRenderComponent } from './cpdtracking/cpdBatchNo.render.component';
import { BatchlistCPDBatchNoRenderComponent } from './batchlist/cpdBatchNo.render.component';
import { phAdjustmentComponent } from './cpdtracking/ph-adjustment-component/ph-adjustment-component.component';
import { DialogSelectAbTankComponent } from './cpdtracking/dialog-select-ab-tank/dialog-select-ab-tank.component';
import { BatchlistHistoryComponent } from './batchlist-history/batchlist-history.component';
import { DialogBatchSheetComponent } from './dialog-batch-sheet/dialog-batch-sheet.component';
import { DialogAddLatexTimeComponent } from './cpdtracking/dialog-add-latex-time/dialog-add-latex-time.component';
import { DialogAddFlowinTimeComponent } from './cpdtracking/dialog-add-flowin-time/dialog-add-flowin-time.component';
import { DialogPrintQRCodeComponent } from './batchlist/dialog-print-qr-code/dialog-print-qr-code.component';
import { GetQRCodeComponent } from './batchlist/dialog-print-qr-code/GetQRCode/GetQRCode.component';
import { QRCodeImageComponent } from './batchlist/dialog-print-qr-code/QRCodeImage/QRCodeImage.component';
import { DialogBatchSheetSummaryComponent } from './batchlist/dialog-batch-sheet-summary/dialog-batch-sheet-summary.component';
import { MatTableModule } from '@angular/material/table';
import { DashboardComponent } from './dashboard/dashboard.component';
import {AutocompleteLibModule} from 'angular-ng-autocomplete';
import {BomComponent} from './bom/bom.component';
import {BatchList2Component} from './batchlist2/batchlist2.component';
import {ButtonView2RenderComponent} from './batchlist2/buttonView2.render.component';

@NgModule({
  imports: [
    NbCardModule,
    NbTreeGridModule,
    NbIconModule,
    NbInputModule,
    NbTabsetModule,
    NbRouteTabsetModule,
    ThemeModule,
    HomeRoutingModule,
    Ng2SmartTableModule,
    NbAccordionModule,
    NbButtonModule,
    FormsModule,
    ReactiveFormsModule,
    NbStepperModule,
    NbSelectModule,
    NbDialogModule.forChild(),
    NbDatepickerModule,
    NbSpinnerModule,
    NbTooltipModule,
    NbRadioModule,
    NbCheckboxModule,
    MatTableModule,
    AutocompleteLibModule
  ],
  declarations: [
    HomeComponent,
    BatchListComponent,
    BomGridComponent,
    FsIconComponent,
    ButtonViewRenderComponent,
    ButtonSyncRenderComponent,
    ButtonHistoryViewRenderComponent,
    ButtonEditRenderComponent,
    ButtonStartFlowInRenderComponent,
    ButtonRenderComponent,
    ButtonSelectABTankRenderComponent,
    ButtonPostToD365RenderComponent,
    DialogAddComponent,
    DialogAddBomComponent,
    DialogImportComponent,
    DialogAddMissBomComponent,
    DialogAddMissBom2Component,
    CpdTrackingComponent,
    StepperComponent,
    DialogAddStageItemComponent,
    DialogEditBomComponent,
    DialogStageTestResultComponent,
    DialogPigmentAdditionComponent,
    phAdjustmentComponent,
    DialogSelectAbTankComponent,
    BatchlistHistoryComponent,
    DialogBatchSheetComponent,
    DialogAddLatexTimeComponent,
    DialogAddFlowinTimeComponent,
    DialogPrintQRCodeComponent,
    GetQRCodeComponent,
    QRCodeImageComponent,
    CPDBatchNoRenderComponent,
    BatchlistCPDBatchNoRenderComponent,
    DialogBatchSheetSummaryComponent,
    DashboardComponent,
    BomComponent,
    BatchList2Component,
    ButtonView2RenderComponent
  ],
  entryComponents: [
    ButtonRenderComponent,
    ButtonSelectABTankRenderComponent,
    ButtonPostToD365RenderComponent,
    ButtonEditRenderComponent,
    ButtonViewRenderComponent,
    ButtonSyncRenderComponent,
    ButtonHistoryViewRenderComponent,
    ButtonStartFlowInRenderComponent,
    DialogAddComponent,
    DialogAddBomComponent,
    DialogEditBomComponent,
    DialogImportComponent,
    DialogAddMissBomComponent,
    DialogAddMissBom2Component,
    DialogAddStageItemComponent,
    DialogPigmentAdditionComponent,
    phAdjustmentComponent,
    DialogSelectAbTankComponent,
    DialogAddLatexTimeComponent,
    DialogAddFlowinTimeComponent,
    GetQRCodeComponent,
    QRCodeImageComponent,
    CPDBatchNoRenderComponent,
    BatchlistCPDBatchNoRenderComponent,
    DialogBatchSheetSummaryComponent,
  ],
})
export class HomeModule { }
