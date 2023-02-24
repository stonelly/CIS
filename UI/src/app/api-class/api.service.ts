import { Injectable } from '@angular/core';
import { AppConfigService } from '../app-config.service';

@Injectable({
  providedIn: 'root',
})
export class ApiService {
  constructor(private appConfigService: AppConfigService) { }
  baseUrl: string = this.appConfigService.apiLoginUrl;

}
