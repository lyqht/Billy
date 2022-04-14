import dayjs from 'dayjs';
import {ToastShowParams} from 'react-native-toast-message';
import {v4} from 'uuid';
import supabase from '../api/supabase';
import {Bill, UnsyncBill} from '../models/Bill';
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
    let result: Bill[] = billsFromCache || [];

    try {
      if (UserService.getUser()) {
        result = await this.getBillsFromDB();
      }
    } catch (err) {
      console.error(err);
    }

    return result;
  };

  addBill = async (
    bill: Partial<Bill>,
  ): Promise<ToastShowParams & {id: string}> => {
    const user = Cache.getUser();
    const bills = await this.getBills();

    if (user) {
      const updatedBill = {...bill, userId: user.id};
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
          id: v4(),
        };
      }

      Cache.setBills([...bills, ...data]);
      Cache.setLastSyncDateAsNow();

      return {
        type: 'success',
        text1: 'Bill saved!',
        id: `${data[0].id}`,
      };
    } else {
      console.log('Updating bills locally');
      const tempID = v4();
      const updatedBill: UnsyncBill = {...bill, tempID};
      const updatedBills = [...bills, updatedBill];
      Cache.setBills(updatedBills);
      return {
        type: 'success',
        text1: 'Bill saved!',
        id: tempID,
      };
    }
  };

  setBillAsComplete = async (
    completed: boolean,
    id?: number,
  ): Promise<void> => {
    const bills = await this.getBills();
    const billIndex = bills.findIndex(bill => bill.id === id);
    if (billIndex === -1) {
      throw Error('Cannot find bill');
    }
    const updatedBill = bills[billIndex];
    let completedDate;
    if (completed) {
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

  setBillAsArchived = async (bill: Bill): Promise<void> => {
    const archivedDate = dayjs().toDate().toISOString();

    const user = Cache.getUser();
    if (user && bill.id) {
      const {error} = await supabase
        .from<Bill>('Bill')
        .update({archivedDate})
        .eq('id', bill.id);

      if (error) {
        throw Error(error.message);
      }
      await this.getBillsFromDB();
    } else {
      const bills = await this.getBills();
      let updatedBill: Bill;
      const billIndex = bills.findIndex(
        b => b.id === bill.id || b.tempID === bill.tempID,
      );
      if (billIndex === -1) {
        throw Error('Cannot find bill');
      }
      updatedBill = bills[billIndex];

      updatedBill.archivedDate = archivedDate;
      console.log({bill, updatedBill});
      Cache.setBills(bills);
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
