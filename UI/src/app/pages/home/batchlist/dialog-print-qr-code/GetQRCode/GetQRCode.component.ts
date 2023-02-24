import { Component, TemplateRef, NgModule, OnInit, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { NbToastrService, NbComponentStatus, NbToastrConfig } from '@nebular/theme';
import { FormsModule, NgForm, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NbDialogService, NbDialogRef } from '@nebular/theme';
import { BatchListData } from "../../../../../@core/data/batchlist";
import { SessionStorageService } from 'angular-web-storage';
import { UserData } from '../../../../../@core/data/users';
import { map, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
//import { NgxPrinterService } from "ngx-printer";
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import printJS from 'print-js';

@Component({
  selector: 'ngx-getqrcode',
  templateUrl: './GetQRCode.component.html',
  styleUrls: ['./GetQRCode.component.scss']
})

@NgModule({
  imports: [
    FormsModule,
    NgForm,
  ],
})

export class GetQRCodeComponent implements OnInit {

  // Properties
  @Input() selectedQALabTest: any;
  @Input() currentUserName; any;
  @Output() qrCodeValue = new EventEmitter();
  config: NbToastrConfig;
  generateQRForm: FormGroup;
  qrCodeImage;
  loadedImage;
  userDetails;
  username = '';
  private destroy$: Subject<void> = new Subject<void>();
  arrayQAList = [
    {
      name: 'pH',
      value: 'pH',
    },
    {
      name: 'TSC',
      value: 'TSC',
    },
    {
      name: 'CG',
      value: 'CG',
    },
    /*{
      name: 'Colour',
      value: 'Colour',
    },*/
  ];

  constructor(private dialogservice: NbDialogService,
    private fb: FormBuilder, private service: BatchListData,
    private userService: UserData,
    private toastrService: NbToastrService,
    //private printerService: NgxPrinterService,
    private sanitizer: DomSanitizer,
    private datePipe: DatePipe,
    private ref: NbDialogRef<GetQRCodeComponent>,
    private sessionStorageService: SessionStorageService) {}

  ngOnInit() {
    const date = this.getDate();
    console.log(this.getDate());
    //new DatePipe('en-MY').transform(, 'dd/MM/yyyy');
    this.generateQRForm = this.fb.group({
        TestType: [''],
        CPDBatchNo: [this.selectedQALabTest.batchNo],
        MixingTank: [this.selectedQALabTest.mixingTankNo],
        Plant: [this.selectedQALabTest.plant],
        ItemNo: [this.selectedQALabTest.itemNo],
        Quantity: [this.selectedQALabTest.quantity],
        Date: [date],
        PreparedBy: [this.sessionStorageService.get('S_UserId')],
    });
  }

  // ngAfterViewInit() {
  //   const date = this.getDate();
  //     this.generateQRForm = this.fb.group({
  //       CPDBatchNo: [this.selectedQALabTest.batchNo],
  //       MixingTank: [this.selectedQALabTest.mixingTankNo],
  //       Plant: [this.selectedQALabTest.plant],
  //       Quantity: [this.selectedQALabTest.quantity],
  //       Date: [date],
  //       PreparedBy: ['Vinoden'],
  //     });
  // }



  open(dialog: TemplateRef<any>) {

    this.dialogservice.open(dialog,
      { closeOnBackdropClick: false }).onClose.
      subscribe(formData => {
        if (this.constructURLParams(this.generateQRForm.value)) {
          (this.service.generateQRBarcode(this.generateQRForm.value).subscribe(
            (response: any) => {
              this.loadedImage = response;
              
              // binaryData.push(response);
              // let downloadLink = document.createElement('a');
              // downloadLink.href = window.URL.createObjectURL(new Blob(binaryData, { type: dataType }));

              // this.printerService.printImg(downloadLink.href);
            },
          ));
        } else {
          status;
          this.toastrService.show(
            '',
            'All Fields are required to generate label', { status: 'danger' });
        }
      });
      this.qrCodeImage = this.transform(this.loadedImage)['changingThisBreaksApplicationSecurity'];
  }

  transform(base64img) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(base64img);
  }

  Submit() {
    //console.log(this.generateQRForm.value.Date);
    //let QRDate =  new DatePipe('en-MY').transform(this.generateQRForm.value.Date, 'dd/MM/yyyy');
    //console.log(QRDate);
    //this.generateQRForm.value.Date = QRDate;
    this.ref.close();
    if (this.constructURLParams(this.generateQRForm.value)) {
    this.service.generateQRBarcode(this.generateQRForm.value).subscribe(
      data => {
        const base64String = this.transform(data)['changingThisBreaksApplicationSecurity'];
        this.qrCodeImage = 'data:image/png;base64,' + base64String;
        printJS({printable: this.qrCodeImage, type: 'image', base64: true,});
        this.qrCodeValue.emit(this.qrCodeImage);
      },
    );
    }
  }

  closeModal() {
    this.ref.close();
  }

  constructURLParams(formData) {

    if (formData['CPDBatchNo'] !== '' && formData['MixingTank'] !== ''
      && formData['Plant'] !== ''
      && formData['Quantity'] !== ''
      && formData['Date'] !== ''
      && formData['PreparedBy'] !== '') {
      return true;
    } else {
      return false;
    }
  }

  getDate() {
    let today = new Date();
    let convertedDate;
    let dd = today.getDate();
    let finaldd;
    let finalmm;
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    if (dd < 10) {
      finaldd = `0${dd}`;
    }
    if(dd>10){
      finaldd = `${dd}`;
    }
    if (mm < 10) {
      finalmm = `0${mm}`;
    }
    if(mm>10){
      finalmm = `${mm}`;
    }
    convertedDate = `${finaldd}/${finalmm}/${yyyy}`;
    return convertedDate;
  }

}

