import {Bill} from '../models/Bill';
import NotificationService from '../services/NotificationService';

export const getBillIdToNumRemindersMap = async (bills: Bill[]) => {
  const retrievedReminders: Record<string, number> = {};
  for (let bill of bills) {
    const identifier = `${bill.tempID || bill.id}`;
    const remindersForBill =
      await NotificationService.getReminderNotificationsForBill(
        `${identifier}`,
      );
    retrievedReminders[identifier] = remindersForBill.length;
  }
  return retrievedReminders;
};
