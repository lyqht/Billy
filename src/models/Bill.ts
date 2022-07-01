import {definitions} from '../types/supabase';

interface UnsyncBillAttributes {
  tempID?: string;
  lastSyncedDate?: Date;
}

export interface UnsyncBill extends UnsyncBillAttributes, Omit<Bill, 'id'> {
  id?: number | undefined;
}

export type BillID = Pick<UnsyncBill, 'id'> | Pick<UnsyncBill, 'tempID'>;

export type Bill = definitions['Bill'] & UnsyncBillAttributes;
