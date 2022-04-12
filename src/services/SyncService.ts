import {addTempIDToUnsyncedBills} from '../helpers/migrate-cache';
import {Bill} from '../models/Bill';
import BillService from './BillService';
import Cache from './Cache';
import UserService from './UserService';

class SyncService {
  syncAllData = async (): Promise<void> => {
    console.log('Attempting to sync data...');
    addTempIDToUnsyncedBills();

    if (UserService.getUser() === null) {
      console.warn('No user found, unable to sync');
      return;
    }

    const billsFromCache = Cache.getBills();
    if (billsFromCache) {
      const bills: Bill[] = JSON.parse(billsFromCache);
      const unsyncBills = BillService.getUnsyncBills(bills);
      console.log({unsyncBills});
      console.log(`Number of unsync bills: ${unsyncBills.length}`);
      const promises = [];
      unsyncBills.forEach(bill =>
        promises.push(BillService.addBill({...bill, tempID: undefined})),
      );
      try {
        const result = await Promise.all(unsyncBills);
        console.log(`Number of bills sync to cloud: ${result.length}`);
        await BillService.getBillsFromDB();
      } catch (err) {
        console.error(err);
      }
    }
  };
}

export default new SyncService();