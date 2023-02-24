import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  template: `
    <button nbButton (click)="navigateToBomGrid()" size="small"  nbTooltip="View CPD BOM" nbTooltipStatus="primary" 
    style="padding: 0.25em 0.25em 0.25em 0.25em;">
    BOM</button>`,
})//<nb-icon icon="list"></nb-icon>
export class ButtonViewRenderComponent implements OnInit {

  public renderValue;

  @Input() value;

  constructor(private router: Router) {  }

  ngOnInit() {
    this.renderValue = this.value;
  }

  navigateToBomGrid(): void {
    this.router.navigate(['/pages/home/bom-grid', { batchno: this.value['batchNo'], 
                                                    producttype: this.value['productType'],
                                                    tankno: this.value['mixingTankNo'],
                                                  }]);
  }
}
