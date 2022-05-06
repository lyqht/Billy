import {Bill} from '../models/Bill';

export type UpcomingBill = Pick<Bill, 'completedDate'>;

export enum BillStatus {
  UPCOMING = 'UPCOMING',
  COMPLETED = 'COMPLETED',
  MISSED = 'MISSED',
}
