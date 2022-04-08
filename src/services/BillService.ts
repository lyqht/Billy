import dayjs from 'dayjs';
import {ToastShowParams} from 'react-native-toast-message';
import supabase from '../api/supabase';
import {Bill} from '../models/Bill';
import Cache from './Cache';
import UserService from './UserService';
class BillService {
  getBillsFromDB = async (): Promise<Bill[]> => {
    const user = Cache.getUser();

    if (user) {
      console.debug('Retrieving bills from DB');
      let {data, error} = await supabase
        .from<Bill>('Bill')
        .select('*')
        .eq('userId', user.id);

      if (error) {
        throw new Error('Error retrieving bills');
      }

      const bills = data || [];
      Cache.setBills(bills);
      Cache.setLastSyncDateAsNow();
      return bills;
    }

    throw Error('Not able to get bills, no user in cache');
  };

  getBills = async (): Promise<Bill[]> => {
    const billsFromCache = Cache.getBills();
    if (billsFromCache) {
      console.debug('Returning bills from cache!');
      return JSON.parse(billsFromCache);
    }

    let result: Bill[] = [];

    try {
      result = await this.getBillsFromDB();
    } catch (err) {
      console.error(err);
    }

    return result;
  };

  addBill = async (bill: Partial<Bill>): Promise<ToastShowParams> => {
    const user = Cache.getUser();
    const updatedBill = {...bill, userId: user?.id};
    const bills = await this.getBills();

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

      Cache.setBills([...bills, ...data]);
      Cache.setLastSyncDateAsNow();
    } else {
      console.log('Updating bills locally');
      const updatedBills = [...bills, updatedBill];
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
    const bills = await this.getBills();
    const billIndex = bills.findIndex(bill => bill.id === id);
    if (billIndex === -1) {
      throw Error('Cannot find bill');
    }
    const updatedBill = bills[billIndex];
    let completedDate;
    if (completedStatus) {
      completedDate = dayjs().toDate().toISOString();
    }

    updatedBill.completedDate = completedDate;
    Cache.setBills(bills);

    const user = Cache.getUser();
    if (user) {
      const {error} = await supabase
        .from<Bill>('Bill')
        .update({completedDate})
        .eq('id', id);

      if (error) {
        throw Error(error.message);
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
