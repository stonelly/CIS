import { Component, OnInit, NgModule } from '@angular/core';
import {
  NbCardModule,
} from '@nebular/theme';


@NgModule({
  imports: [
    NbCardModule,
  ]
})

@Component({
  selector: 'ngx-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.scss']
})
export class NotificationComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
