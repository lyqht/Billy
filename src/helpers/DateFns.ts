import {TimeUnit} from '../models/Reminder';
import dayjs from 'dayjs';

export const getReminderDate = (
  deadline: Date,
  value: string,
  timeUnit: TimeUnit,
): Date => dayjs(deadline).subtract(parseInt(value, 10), timeUnit).toDate();
