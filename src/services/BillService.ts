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

  addBill = async (bill: Bill): Promise<ToastShowParams> => {
    let userId = Cache.getUserId();
    if (userId) {
      const {data, error} = await supabase
        .from<Bill>('bills')
        .insert({...bill, userId});

      if (error) {
        return {
          type: 'warning',
          text1: 'Ops!',
          text2:
            'This bill has been saved locally, but failed to sync to cloud. We will try this again in the background!',
        };
      }

      console.log('Added new bill to DB, new data for this user:');
      console.log({data});

      Cache.setBills([...this.bills, ...data]);
      Cache.setLastSyncDateAsNow();
    } else {
      const updatedBills = [...this.bills, bill];
      Cache.setBills(updatedBills);
    }

    return {
      type: 'success',
      text1: 'Bill saved!',
    };
  };
}

export default new BillService();
