import { Component, Input } from '@angular/core';
import { NbSortDirection, NbSortRequest, NbTreeGridDataSource, NbTreeGridDataSourceBuilder, NbDialogService } from '@nebular/theme';
import { ActivatedRoute } from '@angular/router';
import { BomGridData, BomGrid } from '../../../@core/data/bom-grid';
import { Location, DatePipe } from '@angular/common';
import { DialogAddMissBomComponent } from './dialog-addmissbom/dialog-addmissbom.component';
import { DialogAddMissBom2Component } from './dialog-addmissbom2/dialog-addmissbom2.component';

interface TreeNode<T> {
  data: T;
  children?: TreeNode<T>[];
  expanded?: boolean;
}

interface BatchBOMDetails {
  'Direct Chemical': string;
  'Chemical Batch No'?: string;
  //'PHR'?: string;
  //'TSC%'?: string;
  'Target Weight (kg)'?: string;
  'Actual Weight (kg)'?: string;
  'Variance Weight (kg)'?: string;
  'Variance Percentage (%)'?: string;
  kind?: string;
}

@Component({
  selector: 'ngx-bom-grid',
  templateUrl: './bom-grid.component.html',
  styleUrls: ['./bom-grid.component.scss'],
})
export class BomGridComponent {
  @Input() producttype: string;
  @Input() batchno: string;
  @Input() tankno: string;
  @Input() createdby: string; 
  startCompoundingDate;
  jsondata: any;

  customColumn = 'Direct Chemical';
  defaultColumns = [ 'Chemical Batch No', /*'PHR', 'TSC%',*/ 'Target Weight (kg)', 'Actual Weight (kg)', 'Variance Weight (kg)', 'Variance Percentage (%)' ];
  allColumns = [ this.customColumn, ...this.defaultColumns ];
  allColumnsHeader = [ 'Direct Chemical', 'Chemical Batch No', /*'PHR', 'TSC%',*/ 'Target Weight (kg)', 'Actual Weight (kg)', 'Variance Weight (kg)', 'Variance Percentage (%)' ];

  dataSource: NbTreeGridDataSource<BatchBOMDetails>;

  sortColumn: string;
  isDataEmpty: boolean = false;
  sortDirection: NbSortDirection = NbSortDirection.NONE;

  constructor(private dataSourceBuilder: NbTreeGridDataSourceBuilder<BatchBOMDetails>, private router: ActivatedRoute,
              private service: BomGridData, private location: Location, private dialogService: NbDialogService) {
  }

  backClicked() {
    this.location.back();
  }

  ngOnInit() {
    this.batchno = this.router.snapshot.paramMap.get('batchno');
    this.producttype = this.router.snapshot.paramMap.get('producttype');
    this.tankno = this.router.snapshot.paramMap.get('tankno');
    //this.createdby = this.router.snapshot.paramMap.get('createdby');

    this.jsondata = {
      'BatchNo': this.batchno,
    };

    this.populateData();
  }

  updateSort(sortRequest: NbSortRequest): void {
    this.sortColumn = sortRequest.column;
    this.sortDirection = sortRequest.direction;
  }

  getSortDirection(column: string): NbSortDirection {
    if (this.sortColumn === column) {
      return this.sortDirection;
    }
    return NbSortDirection.NONE;
  }

  populateData(): void {
    const treenodearray: TreeNode<BatchBOMDetails>[] = [];
    let treenodedata: TreeNode<BatchBOMDetails>;
    let childdata: TreeNode<BatchBOMDetails>;
    let bomgriddata = [];
    //this.service.getItems(this.jsondata).subscribe(data => {
    this.service.getItems(this.batchno).subscribe(data => {
      if (data['responseCode'] === '200') {
        bomgriddata = data['data']['bomDetail'];
        this.createdby = data['data']['createdBy'];
        this.startCompoundingDate = new DatePipe('en-MY').transform(data['data']['createdDate'], 'dd/MM/yyyy HH:mm:ss');
        if (bomgriddata.length > 0) {
          bomgriddata.forEach(element => {
            treenodedata = {
              expanded: true,
              data: { 'Direct Chemical': element['category'], kind: 'dir'},
              children: [],
            };
            if (treenodearray.length === 0) {
              treenodearray.push(treenodedata);
            }
            else if (!treenodearray.some(x => x.data['Direct Chemical'] === element['category'])) {
              treenodearray.push(treenodedata);
            }
          });
          bomgriddata.forEach(element => {
            for (const node of treenodearray) {
              /*if(element['phr'] === null){
                element['phr'] = 'NA';
              }
              if(element['tsc'] === null){
                element['tsc'] = 'NA';
              }*/
              childdata = {
                data: { 'Direct Chemical': element['itemId'], 'Chemical Batch No': element['batchNo'],
                            /*'PHR': element['phr'], 'TSC%': element['tsc'],*/ //uncomment to display phr and tsc
                            'Target Weight (kg)': element['targetWeight'].toFixed(4), 'Actual Weight (kg)': element['actualWeight'].toFixed(4),
                            'Variance Weight (kg)': element['varianceWeight'].toFixed(4), 'Variance Percentage (%)': element['variancePercentage'].toFixed(2),
                },
              };
              if (node.data['Direct Chemical'] === element['category']) {
                node.children.push(childdata);
              }
            }
          });
          this.dataSource = this.dataSourceBuilder.create(treenodearray);
        }
        else {
          this.isDataEmpty = true;
        }
      }
    });
  }

  /* private data: TreeNode<BatchBOMDetails>[] = [
    {
      expanded: true,
      data: { 'Direct Chemical': 'Stabilization', kind: 'dir'},
      children: [
        { data: { 'Direct Chemical': 'Agwet HT', 'Chemical Batch No': '499', 'Target Weight (kg)': '120.60',  'Actual Weight (kg)': '120.60', 'Variance Weight (kg)': '0.00', 'Variance Percentage (%)': '0.00'} },
        { data: { 'Direct Chemical': 'Soft Water', 'Chemical Batch No': 'Mat 5', 'Target Weight (kg)': '180.90',  'Actual Weight (kg)': '183.60', 'Variance Weight (kg)': '2.70', 'Variance Percentage (%)': '1.50'} },
        { data: { 'Direct Chemical': 'Soft Water (Flushing)', 'Chemical Batch No': 'Mat 7', 'Target Weight (kg)': '300.00',  'Actual Weight (kg)': '302.60', 'Variance Weight (kg)': '2.90', 'Variance Percentage (%)': '0.90'} },
      ],      
    },
    {
      expanded: true,
      data: { 'Direct Chemical': 'Composite', kind: 'dir'},
      children: [
        { data: { 'Direct Chemical': 'Octocure HCLP-60(YS)', 'Chemical Batch No': '2526', 'Target Weight (kg)': '144.80',  'Actual Weight (kg)': '143.20', 'Variance Weight (kg)': '-1.50', 'Variance Percentage (%)': '-1.10'} },
        { data: { 'Direct Chemical': 'Octocure ZDE 50', 'Chemical Batch No': '815', 'Target Weight (kg)': '71.40',  'Actual Weight (kg)': '71.40', 'Variance Weight (kg)': '0.00', 'Variance Percentage (%)': '0.00'} },
        { data: { 'Direct Chemical': 'Octotint 705', 'Chemical Batch No': '1637', 'Target Weight (kg)': '320.60',  'Actual Weight (kg)': '320.40', 'Variance Weight (kg)': '-0.20', 'Variance Percentage (%)': '-0.10'} },
        { data: { 'Direct Chemical': 'Octocure 573', 'Chemical Batch No': '2325', 'Target Weight (kg)': '145.40',  'Actual Weight (kg)': '145.20', 'Variance Weight (kg)': '-0.20', 'Variance Percentage (%)': '-0.10'} },
        { data: { 'Direct Chemical': 'Soft Water', 'Chemical Batch No': 'Mat 5', 'Target Weight (kg)': '682.20',  'Actual Weight (kg)': '686.00', 'Variance Weight (kg)': '3.80', 'Variance Percentage (%)': '0.60'} },
        { data: { 'Direct Chemical': 'Soft Water (Flushing)', 'Chemical Batch No': 'Mat 7', 'Target Weight (kg)': '300.00',  'Actual Weight (kg)': '301.80', 'Variance Weight (kg)': '1.80', 'Variance Percentage (%)': '0.60'} },
      ],      
    },
    {
      expanded: true,
      data: { 'Direct Chemical': 'Wax', kind: 'dir'},
      children: [
        { data: { 'Direct Chemical': 'Aquawax 48', 'Chemical Batch No': '3293', 'Target Weight (kg)': '301.50',  'Actual Weight (kg)': '301.80', 'Variance Weight (kg)': '0.30', 'Variance Percentage (%)': '0.10'} },
        { data: { 'Direct Chemical': 'Soft Water', 'Chemical Batch No': 'Mat 5', 'Target Weight (kg)': '452.30',  'Actual Weight (kg)': '455.00', 'Variance Weight (kg)': '2.70', 'Variance Percentage (%)': '0.60'} },
        { data: { 'Direct Chemical': 'Soft Water (Flushing)', 'Chemical Batch No': 'Mat 7', 'Target Weight (kg)': '300.00',  'Actual Weight (kg)': '302.20', 'Variance Weight (kg)': '2.20', 'Variance Percentage (%)': '0.70'} },
      ],      
    },
  ]; */

  getShowOn(index: number) {
    const minWithForMultipleColumns = 400;
    const nextColumnStep = 100;
    return minWithForMultipleColumns + (nextColumnStep * index);
  }

  addBom() {
    this.dialogService.open(DialogAddMissBomComponent, { context: { currentbatchno: this.batchno } })
    .onClose.subscribe(data =>  {
      if (data !== undefined) {

        console.log(data);


      }
    });
  }

  addBom2() {
    this.dialogService.open(DialogAddMissBom2Component, { context: { currentbatchno: this.batchno } })
    .onClose.subscribe(data =>  {
      if (data !== undefined) {

        console.log(data);


      }
    });
  }
}

@Component({
  selector: 'ngx-fs-icon',
  template: `
    <nb-tree-grid-row-toggle [expanded]="expanded" *ngIf="isDir(); else fileIcon">
    </nb-tree-grid-row-toggle>
    <ng-template #fileIcon>
      <nb-icon icon="file-text-outline" class="chemical-icon"></nb-icon>
    </ng-template>
  `,
  styleUrls:['./bom-grid.component.scss'],
})
export class FsIconComponent {
  @Input() kind: string;
  @Input() expanded: boolean;

  isDir(): boolean {
    return this.kind === 'dir';
  }
}
