import {v4} from 'uuid';
import BillService from '../services/BillService';
import Cache from '../services/Cache';

export const addTempIDToUnsyncedBills = async () => {
  const bills = await BillService.getBills();
  const unsyncBills = BillService.getUnsyncBills(bills);
  const unsyncBillIndexes = unsyncBills.map(bill =>
    bills.findIndex(b => Object.is(b, bill)),
  );
  unsyncBillIndexes.forEach(index => (bills[index].tempID = v4()));
  Cache.setBills(bills);
};
