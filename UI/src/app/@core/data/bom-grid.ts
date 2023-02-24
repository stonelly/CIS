import { Observable } from 'rxjs';

export interface BomGrid {
  //batchNo: string;
  category: string;
  itemId: string;
  batchNo: string;
  targetWeight: number;
  actualWeight: number;
  varianceWeight: number;
  variancePercentage: number;
  createdby: string;
}

export interface BomGridArray {
  cpdbatchno: string;
  createdby: string;
  itemlinedata: Array<ItemLine>;
}

export interface ItemLine {
  category: string;
  itemid: string;
  itembatchno: string;
  targetweight: number;
  actualweight: number;
}

export interface EditBOMDetailsFormArray{
  itemid: string,
  bomunit: string,
  quantity: number,
  displayitemid: string,
  StageName:string,
  PHR:number,
  TSC:number,
}

export abstract class BomGridData {
    abstract getItems(batchno): Observable<BomGrid>;
    //abstract createItem(bom): Observable<BomGridArray>;
}
