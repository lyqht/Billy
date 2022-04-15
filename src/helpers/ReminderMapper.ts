import {Bill} from '../models/Bill';
import {getReminderNotificationIdsForBill} from '../services/NotificationService';

export const getBillIdToNumRemindersMap = async (bills: Bill[]) => {
  const retrievedReminders: Record<string, number> = {};
  for (let bill of bills) {
    const identifier = `${bill.tempID || bill.id}`;
    const remindersForBill = await getReminderNotificationIdsForBill(
      `${identifier}`,
    );
    retrievedReminders[identifier] = remindersForBill.length;
  }
  return retrievedReminders;
};
