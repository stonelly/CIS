import {Injectable} from '@angular/core';

const TOKEN = 'TOKEN';

@Injectable({
  providedIn: 'root'
})
export class TokenService {

  setToken(token: string): void {
    sessionStorage.setItem(TOKEN, token);
  }

  isLogged() {
    return sessionStorage.getItem(TOKEN) != null;
  }
}