import { Component, OnInit, NgZone, Inject, ChangeDetectorRef } from '@angular/core';
import { NbLoginComponent, NbAuthService, NB_AUTH_OPTIONS } from '@nebular/auth';
import { NbDialogService, NbToastrService } from '@nebular/theme';
import { FormBuilder, FormGroup, NgForm } from '@angular/forms';
import { LoginService } from '../../api-class/service/login-api.service';
import { Router } from '@angular/router';
import { LoginFailDialogComponent } from '../login-fail-dialog/login-fail-dialog.component';
//import { ApiService } from '../../api-class/api.service';
import { CookieService } from 'ngx-cookie-service';
import { SessionStorageService } from 'angular-web-storage';
import { TokenService } from '../../api-class/service/token.service';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { BatchListData } from '../../@core/data/batchlist';
import { CpdTrackingData } from '../../@core/data/cpdtracking';
import { ApiService } from '../../api-class/api.service';
import { HttpClient } from '@angular/common/http';
declare let ClientIP: any;

@Component({
  selector: 'ngx-customlogin',
  templateUrl: './customlogin.component.html',
  styleUrls: ['./customlogin.component.scss'],
})

export class CustomLoginComponent extends NbLoginComponent {
  ipAddress;
  loadingSpinner = false;
  APIAccessible: boolean;
  userToken = '';
  textButtonClicked = 'Initialize';
  constructor(private http:HttpClient,
              private fb: FormBuilder, 
              private loginService: LoginService,
              private dialogService: NbDialogService,
              private cookieService: CookieService,
              private sessionStorageService: SessionStorageService,
              private tokenService: TokenService,
              private toastrService: NbToastrService,
              private batchListService: BatchListData,
              private cpdTrackingService: CpdTrackingData,
              service: NbAuthService, 
              @Inject(NB_AUTH_OPTIONS) 
              options:{},
              cd: ChangeDetectorRef, router: Router) 
  {
    super(service, options, cd, router);
  }

  ngOnInit() {
    //this.ipAddress = ClientIP;
    this.getIPAddress();
  }

  submitForm(f: NgForm): void {
    this.textButtonClicked = 'clicked';
    let username = f.controls['username'].value;
    const data = {
      /*'UserId': f.controls['username'].value,
      'Password':f.controls['password'].value,*/
      'IpAddress': this.ipAddress,//f.controls['username'].value,
      'UserId': username,//f.controls['username'].value,
      'Password':f.controls['password'].value,
    };

    this.loadingSpinner = true;
    this.textButtonClicked = 'spinner true';
    this.loginService.loginSystem(data)./*pipe(
      catchError(this.errorHandl)
    ).*/subscribe(response => {
      this.textButtonClicked = 'response log in user';
      if(response.responseCode  == "200"){
        if(response.data !== null){
          this.textButtonClicked = 'response != null';
          this.sessionStorageService.clear();
          this.sessionStorageService.set('S_Token', response.data.token);
          this.sessionStorageService.set('S_TokenExpiry', response.data.tokenExpiry.toString());
          this.sessionStorageService.set('S_base64img', response.data.base64img);
          this.sessionStorageService.set('S_Name', response.data.name);
          this.sessionStorageService.set('S_UserId', username);
          this.sessionStorageService.set('S_RoleId', response.data.roleId);
          this.sessionStorageService.set('S_LocationId', response.data.locationId);
          this.sessionStorageService.set('S_Location', response.data.location);
          this.tokenService.setToken(response.data.token);

          
          this.router.navigate(['../../pages/checkin']);
       
        }
        else{
          this.dialogService.open(LoginFailDialogComponent, {
            context: {
              title: 'Error ',// + response.responseCode,
            },
          });
          
          this.loadingSpinner = false;
        }
      }

      else{
        this.dialogService.open(LoginFailDialogComponent, {
          context: {
            title: 'Error ',// + response.responseCode,
          },
        });
        
        this.loadingSpinner = false;
      }
      
    },
    err => {
      console.log(err);
      this.textButtonClicked = err.message;
      //this.textButtonClicked = err.error.responseCode + " /n " + err.error.responseMessage;
      if (err.status === 400) {
        this.showToast('top-right', 'danger', 'Incorrect Username or Password.Please try again');
      } else if (err.status === 500) {
        this.showToast('top-right', 'danger', 'Incorrect Username or Password.Please try again');
      }
      else if (err === null){
        this.showToast('top-right', 'danger', 'Incorrect Username or Password.Please try again');
      }
      this.loadingSpinner = false;
    },
    );

    () =>{
      this.loadingSpinner = false;
      this.showToast('top-right', 'danger', 'Incorrect Username or Password.Please try again');
    }
  }


  verifyUser(userToken){
    userToken = this.sessionStorageService.get('S_AppId');

  }

  errorHandl(error) {
    this.loadingSpinner = false;
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
      this.loadingSpinner = false;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      this.loadingSpinner = false;
    }
    this.loadingSpinner = false;
    //window.alert('Incorrect username/password. Please enter again.');

    /*this.dialogService.open(LoginFailDialogComponent, {
      context: {
        title: 'Log In Failed',
      },
    });*/
    return throwError(errorMessage);
 }

 showToast(position, status, errMessage) {
  const index = 1;
  this.toastrService.show(
    '',
    errMessage,
    { position, status });
  }

  getUserToken(){
    return this.userToken;
  }

  getIPAddress()
  {

    this.loginService.getMachineIP().subscribe(data => {
      if (data['responseCode'] === '200') {
        this.ipAddress = data['data'];
      }
    });

    // this.http.get('https://ipv4.jsonip.com').subscribe(
    //   (value:any) => {
    //     console.log(value);
    //     this.ipAddress = value.ip;
    //   },
    //   (error) => {
    //     console.log(error);
    //   }
    // );
  }
}
