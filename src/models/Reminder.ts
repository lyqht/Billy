import {definitions} from '../types/supabase';

export type Reminder = {
  id?: string;
  billID: string;
};

export type RecurringReminder = definitions['RecurringReminder'];
export type FixedReminder = definitions['FixedReminder'];
