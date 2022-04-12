import {Bill} from '../models/Bill';

export type UpcomingBillStatus = Pick<Bill, 'completedDate'>;
