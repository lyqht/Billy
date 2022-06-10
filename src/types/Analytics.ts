import {BillStatus} from './BillStatus';

export interface ChartDataPt extends ChartData {
  status?: BillStatus;
  category?: string;
}

export interface ChartData {
  month: number;
  amount: number;
}

export type ChartDataFilter = {
  status?: string[];
  category?: string[];
};
