import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { loginAPI } from '../data-type/login-api';
import { authRegisterAPI } from '../data-type/login-auth-register-api';
import { searchADAPI } from '../data-type/search-ad-user';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { AppConfigService } from '../../app-config.service';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  // Base url
  baseurl = this.appConfigService.apiBaseUrl;
  baseUrl8077 = this.appConfigService.apiBaseUrl8077;
  baseApiUrl = this.appConfigService.apiBaseApiUrl;

  constructor(private http: HttpClient, private appConfigService: AppConfigService) { }

  // Http Headers
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
    })
  }

  //POST register user and token in database
  loginUser(data): Observable<loginAPI> {
    //return this.http.post<loginAPI>(this.baseurl + '/Auth/Authenticate', JSON.stringify(data), this.httpOptions)
    return this.http.post<loginAPI>(this.baseUrl8077 + '/users/authenticate', JSON.stringify(data), this.httpOptions)
    .pipe(
      //retry(1),
      //catchError(this.errorHandl)
    )
  }  

  
  //POST register user and token in database
  loginSystem(data): Observable<loginAPI> {
    //return this.http.post<loginAPI>(this.baseurl + '/Auth/Authenticate', JSON.stringify(data), this.httpOptions)
    return this.http.post<loginAPI>(this.baseApiUrl + '/users/login', JSON.stringify(data), this.httpOptions)
    .pipe(
      //retry(1),
      //catchError(this.errorHandl)
    )
  }  

  getMachineIP(): Observable<loginAPI> {
    //return this.http.post<loginAPI>(this.baseurl + '/Auth/Authenticate', JSON.stringify(data), this.httpOptions)
    return this.http.get<loginAPI>(this.baseApiUrl + '/users/GetMachineIP', this.httpOptions)
    .pipe(
      //retry(1),
      //catchError(this.errorHandl)
    )
  }  
  
  //POST
  searchADUser(data): Observable<searchADAPI>{
    return this.http.post<searchADAPI>('http://ngc-devvm1:8086/api/data', JSON.stringify(data), this.httpOptions)
    .pipe(
      retry(1),
      catchError(this.errorHandl)
    )
  }
  
  /*getDeepKeys(obj) {
  
    const keys = Object.keys(obj);

    const childKeys = keys
      .map(key => obj[key])
      .map(
        value =>
          Array.isArray(value)
            ? this.getDeepKeys(value[0])
            : typeof value === "object"
              ? this.getDeepKeys(value)
              : []
      )
      .reduce((acc, keys) => [...acc, ...keys], []);
    return [...Object.keys(obj), ...childKeys];
  }*/





  //// GET
  //GetIssue(id): Observable<loginAPI> {
  //  return this.http.get<loginAPI>(this.baseurl + '/bugtracking/' + id)
  //  .pipe(
  //    retry(1),
  //    catchError(this.errorHandl)
  //  )
  //}

  //// GET
  //GetIssues(): Observable<loginAPI> {
  //  return this.http.get<loginAPI>(this.baseurl + '/bugtracking/')
  //  .pipe(
  //    retry(1),
  //    catchError(this.errorHandl)
  //  )
  //}

  //// PUT
  //UpdateBug(id, data): Observable<loginAPI> {
  //  return this.http.put<loginAPI>(this.baseurl + '/bugtracking/' + id, JSON.stringify(data), this.httpOptions)
  //  .pipe(
  //    retry(1),
  //    catchError(this.errorHandl)
  //  )
  //}

  //// DELETE
  //DeleteBug(id){
  //  return this.http.delete<loginAPI>(this.baseurl + '/bugtracking/' + id, this.httpOptions)
  //  .pipe(
  //    retry(1),
  //    catchError(this.errorHandl)
  //  )
  //}

  // Error handling
  errorHandl(error) {
     let errorMessage = '';
     if(error.error instanceof ErrorEvent) {
       // Get client-side error
       errorMessage = error.error.message;
     } else {
       // Get server-side error
       errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
     }
     //window.alert('Invalid account, please enter the correct credentials');
     return throwError(errorMessage);
  }

}