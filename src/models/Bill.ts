import {definitions} from '../types/supabase';
interface UnsyncBillAttributes {
  id?: number;
  tempID?: string;
  lastSyncedDate?: Date;
}

export type BillID = string | number;

export type Bill = definitions['Bill'] & UnsyncBillAttributes;

export interface UnsyncBill extends UnsyncBillAttributes {
  id?: number;
}
