import dayjs from 'dayjs';
import {ToastShowParams} from 'react-native-toast-message';
import supabase from '../api/supabase';
import {Bill} from '../models/Bill';
import Cache from './Cache';
class BillService {
  private bills: Bill[];

  constructor() {
    this.bills = [];
  }

  getBills = async (): Promise<Bill[]> => {
    const billsFromCache = Cache.getBills();
    if (billsFromCache) {
      console.debug('Returning bills from cache!');
      this.bills = JSON.parse(billsFromCache);
      return this.bills;
    }

    let userId = Cache.getUserId();
    if (userId) {
      console.debug('Retrieving bills from DB');
      let {data: bills, error} = await supabase
        .from<Bill>('bills')
        .select('*')
        .eq('userId', userId);

      if (error) {
        throw new Error('Error retrieving bills');
      }
      Cache.setBills(bills!);
      this.bills = bills!;
      Cache.setLastSyncDateAsNow();
    }
    return this.bills;
  };

  addBill = async (bill: Partial<Bill>): Promise<ToastShowParams> => {
    let userId = Cache.getUserId();
    const updatedBill = {...bill, userId};
    if (userId) {
      const {data, error} = await supabase
        .from<Bill>('bills')
        .insert(updatedBill);

      if (error) {
        console.debug({error});
        return {
          type: 'error',
          text1: 'Ops!',
          text2:
            'This bill has been saved locally, but failed to sync to cloud. We will try this again in the background!',
        };
      }

      Cache.setBills([...this.bills, ...data]);
      Cache.setLastSyncDateAsNow();
    } else {
      const updatedBills = [...this.bills, updatedBill];
      Cache.setBills(updatedBills);
    }

    return {
      type: 'success',
      text1: 'Bill saved!',
    };
  };

  setBillCompleteStatus = async (
    completedStatus: boolean,
    id: string,
  ): Promise<void> => {
    const billIndex = this.bills.findIndex(bill => bill.id === id);
    if (billIndex === -1) {
      throw Error('Cannot find bill');
    }
    const updatedBill = this.bills[billIndex];
    let completedDate = null;
    if (completedStatus) {
      completedDate = dayjs().toDate();
    }

    updatedBill.completedDate = completedDate;
    Cache.setBills(this.bills);

    let userId = Cache.getUserId();
    if (userId) {
      const {error} = await supabase
        .from<Bill>('bills')
        .update({completedDate})
        .eq('id', id);

      if (error) {
        throw Error('Error syncing to cloud');
      }
    }
  };
}

export default new BillService();
