import {definitions} from '../types/supabase';
import {ReminderFormData} from './Reminder';
interface UnsyncBillAttributes {
  tempID?: string;
  lastSyncedDate?: Date;
}

export type BillID = string | number;

export type Bill = definitions['Bill'] & UnsyncBillAttributes;

export interface UnsyncBill extends Omit<Bill, 'id'> {
  tempID: string;
}

export interface BillWithRelativeReminderDates extends Bill {
  relativeReminderDates: ReminderFormData[];
}
