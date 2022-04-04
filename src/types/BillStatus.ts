import {Bill} from '../models/Bill';

export type BillStatus = Pick<Bill, 'completedDate'> & Pick<Bill, 'id'>;
