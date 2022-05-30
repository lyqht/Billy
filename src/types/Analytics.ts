import {BillStatus} from './BillStatus';
import dayjs from 'dayjs';

export interface ChartDataPt extends ChartData {
  status: BillStatus;
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

export type ChartDataDateRange = {
  startDate: dayjs.Dayjs;
  endDate: dayjs.Dayjs;
};
