import {definitions} from '../types/supabase';

interface UnsyncBillAttributes {
  tempID?: string;
  lastSyncedDate?: Date;
}

export interface UnsyncBill extends UnsyncBillAttributes, Omit<Bill, 'id'> {
  id?: number | undefined;
}

export type BillID = string | number;

export type Bill = definitions['Bill'] & UnsyncBillAttributes;
