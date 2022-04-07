import dayjs from 'dayjs';
import {ToastShowParams} from 'react-native-toast-message';
import supabase from '../api/supabase';
import {Bill} from '../models/Bill';
import Cache from './Cache';
import UserService from './UserService';
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

    const user = Cache.getUser();
    console.log(`Getting bills, does user exists? ${user}`);

    if (user) {
      console.debug('Retrieving bills from DB');
      let {data: bills, error} = await supabase
        .from<Bill>('Bill')
        .select('*')
        .eq('userId', user.id);

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
    const user = Cache.getUser();
    const updatedBill = {...bill, userId: user?.id};
    if (user) {
      const {data, error} = await supabase
        .from<Bill>('Bill')
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
    id: number,
  ): Promise<void> => {
    const billIndex = this.bills.findIndex(bill => bill.id === id);
    if (billIndex === -1) {
      throw Error('Cannot find bill');
    }
    const updatedBill = this.bills[billIndex];
    let completedDate = '';
    if (completedStatus) {
      completedDate = dayjs().toDate().toISOString();
    }

    updatedBill.completedDate = completedDate;
    Cache.setBills(this.bills);

    const user = Cache.getUser();
    if (user) {
      const {error} = await supabase
        .from<Bill>('Bill')
        .update({completedDate})
        .eq('id', id);

      if (error) {
        throw Error('Error syncing to cloud');
      }
    }
  };

  uploadFile = async (
    file: any,
    filename: string,
  ): Promise<{Key: string} | null> => {
    const user = UserService.getUser();
    const {data, error} = await supabase.storage
      .from('documents')
      .upload(`${user?.id}/${filename}`, file);

    if (error) {
      throw Error(error.message);
    }

    return data;
  };
}

export default new BillService();
