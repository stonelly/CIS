import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `
    <button nbButton (click)="navigateToBomGrid()" size="small">View</button>`,
})
export class ButtonView2RenderComponent implements OnInit {

  public renderValue;

  @Input() value;

  constructor(private router: Router) {  }

  ngOnInit() {
    this.renderValue = this.value;
  }

  navigateToBomGrid(): void {
    this.router.navigate(['/pages/home/bom-grid', { producttype: this.value['ProductType'] }]);
  }
}
