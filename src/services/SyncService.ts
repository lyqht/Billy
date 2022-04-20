import {v4} from 'uuid';
import {getUnsyncBills} from '../helpers/BillFilter';
import BillService from './BillService';
import Cache from './Cache';
import {
  clearAllNotifications,
  getReminderNotificationsForBill,
  updateNotificationsWithNewBillId,
} from './NotificationService';
import UserService from './UserService';

class SyncService {
  addTempIDToUnsyncedBills = async () => {
    const bills = await BillService.getBills();
    const unsyncBills = getUnsyncBills(bills);
    if (unsyncBills.length > 0) {
      const unsyncBillIndexes = unsyncBills.map(bill =>
        bills.findIndex(b => Object.is(b, bill)),
      );
      unsyncBillIndexes.forEach(index => {
        if (bills[index].tempID === undefined) {
          bills[index].tempID = v4();
        }
      });
      Cache.setBills(bills);
    }
  };

  syncAllData = async (): Promise<void> => {
    console.debug('Attempting to sync data...');
    this.addTempIDToUnsyncedBills();

    if (UserService.getUser() === null) {
      console.debug('No user found, not syncing to cloud');
      return;
    }

    const bills = await BillService.getBills();
    const unsyncBills = getUnsyncBills(bills);
    console.debug(`Number of unsync bills: ${unsyncBills.length}`);
    for (let bill of unsyncBills) {
      const newBill = await BillService.addBill({...bill, tempID: undefined});
      console.debug(
        `Bill tempID ${bill.tempID} has been sync to obtain new id ${newBill.id}`,
      );

      try {
        const triggerNotifications = await getReminderNotificationsForBill(
          bill.tempID!,
        );
        await updateNotificationsWithNewBillId(
          triggerNotifications,
          newBill.id,
        );
      } catch (err) {
        console.error(err);
      }
    }

    await BillService.getBillsFromDB();
  };

  clearAllData = async (): Promise<void> => {
    await UserService.logOutUser();
    await clearAllNotifications();
    Cache.clearAllData();
  };
}

export default new SyncService();
