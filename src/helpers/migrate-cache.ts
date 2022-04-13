import {v4} from 'uuid';
import BillService from '../services/BillService';
import Cache from '../services/Cache';
import {getUnsyncBills} from './bill-filter';

export const addTempIDToUnsyncedBills = async () => {
  const bills = await BillService.getBills();
  const unsyncBills = getUnsyncBills(bills);
  const unsyncBillIndexes = unsyncBills.map(bill =>
    bills.findIndex(b => Object.is(b, bill)),
  );
  unsyncBillIndexes.forEach(index => (bills[index].tempID = v4()));
  Cache.setBills(bills);
};
