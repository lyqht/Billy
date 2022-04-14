import {definitions} from '../types/supabase';
export interface ReminderFormData {
  timeUnit: TimeUnit;
  value: string;
}

export enum TimeUnit {
  HOURS = 'hours',
  DAYS = 'days',
  WEEKS = 'weeks',
  MONTHS = 'months',
}

export type ReminderNotification = {
  id: string;
};

export type RecurringReminder = definitions['RecurringReminder'];
export type FixedReminder = definitions['FixedReminder'];
