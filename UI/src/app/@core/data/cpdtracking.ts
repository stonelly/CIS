import { Observable } from 'rxjs';

export interface CpdTracking2 {
  id: number;
  plant: string;
  line: string;
  batchno: string;
  startdate: Date;
  enddate: Date;
  transferlatex: boolean;
  stabilization: boolean;
  phadjustment: boolean;
  phtest1: boolean;
  composite: boolean;
  phtest2: boolean;
  tsctest: boolean;
  phdilution: boolean;
  phtest3: boolean;
  aquawax: boolean;
  transfertank: boolean;
  qalastcheck: boolean;
}

export interface CpdTracking {
  id: number;
  plant: string;
  mixingTankNo: string;
  batchNo: string;
  startDate: Date;
  endDate: Date;
  latex: boolean;
  stabilization: boolean;
  composite: boolean;
  wax: boolean;
  pigment: boolean;
}

export interface CpdTracking {
  id: number,
  plant: string,
  mixingTankNo: string,
  batchNo: string,
  startDate: Date,
  endDate: Date,
  stages: Array<StageStatus>,
}

export interface StageStatus {
  stageId: number,
  stageName: string,
  stageStatus: string,
  isAllowedToStart: boolean,
}

export interface StartStageResponse{
  result: string,
}

export interface EditBOMDetailsFormArray{
  itemid: string,
  bomunit: string,
  quantity: number,
}

export interface addPHAdjustment{

}

export abstract class CpdTrackingData {
  abstract currentPlant;
  abstract getData(): any[];
  abstract getItems(plantId): Observable<CpdTracking>;
  abstract getItems2(): Observable<CpdTracking2>;
  abstract postStatus(input): Observable<any>;
  abstract changePlant(plantId);
  //abstract startStage(cpdBatchOrderNo, stageName): Observable<StartStageResponse>;
  abstract startStage(cpdBatchOrderNo, stageName);
  abstract startFlowInTime(cpdObject);
  abstract addPigmentResult(resultObject):Observable<StartStageResponse>;
  abstract addPHAdjustment(phAdjustmentItem)/*: Observable<addPHAdjustment>*/;
  abstract selectMixingABTank(ABTankObj);
  abstract showToast(position, status, errMessage, destroyByClick);
}
