import {v4} from 'uuid';
import {getUnsyncBills} from '../helpers/BillFilter';
import BillService from './BillService';
import Cache from './Cache';
import UserService from './UserService';
class SyncService {
  addTempIDToUnsyncedBills = async () => {
    const bills = await BillService.getBills();
    const unsyncBills = getUnsyncBills(bills);
    const unsyncBillIndexes = unsyncBills.map(bill =>
      bills.findIndex(b => Object.is(b, bill)),
    );
    unsyncBillIndexes.forEach(index => (bills[index].tempID = v4()));
    Cache.setBills(bills);
  };

  syncAllData = async (): Promise<void> => {
    console.log('Attempting to sync data...');
    this.addTempIDToUnsyncedBills();

    if (UserService.getUser() === null) {
      console.warn('No user found, unable to sync');
      return;
    }

    const bills = await BillService.getBills();
    const unsyncBills = getUnsyncBills(bills);
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
  };
}

export default new SyncService();
