import dayjs from 'dayjs';
import {ToastShowParams} from 'react-native-toast-message';
import {v4} from 'uuid';
import supabase from '../api/supabase';
import {Bill, BillID} from '../models/Bill';
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
        .eq('userId', user.id)
        .is('deletedDate', null);

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
    let result: Bill[] = billsFromCache
      ? billsFromCache.filter(bill => !bill.deletedDate)
      : [];
    return result;
  };

  editBill = async (bill: Partial<Bill>) => {
    const bills = await this.getBills();
    const updatedBills: Partial<Bill>[] = [...bills];
    const billID = bill.id ?? bill.tempID;

    console.debug('Editing Bill');
    const billToUpdateIndex = bills.findIndex(b =>
      bill.id ? bill.id === b.id : bill.tempID === b.tempID,
    );
    updatedBills[billToUpdateIndex] = {
      ...updatedBills[billToUpdateIndex],
      ...bill,
    };

    Cache.setBills(updatedBills);

    return {
      type: 'success',
      text1: 'Bill saved!',
      id: billID,
    };
  };

  addBill = async (
    bill: Partial<Bill>,
  ): Promise<ToastShowParams & {id: string}> => {
    const bills = await this.getBills();
    const updatedBills: Partial<Bill>[] = [...bills];

    console.debug('Adding Bill');
    const tempID = v4();
    const updatedBill = {...bill, tempID};
    updatedBills.push(updatedBill);

    console.debug('Updating bills locally');
    Cache.setBills(updatedBills);

    return {
      type: 'success',
      text1: 'Bill saved!',
      id: tempID,
    };
  };

  addBillToCloud = async (bill: Bill): Promise<Bill | null> => {
    const user = UserService.getUser();
    if (user) {
      console.debug('Adding bill to cloud');
      const {tempID, ...billDetails} = bill;
      const updatedBill = {...billDetails, userId: user.id};
      const {data, error} = await supabase
        .from<Bill>('Bill')
        .upsert(updatedBill);
      console.debug('API returned');
      if (error) {
        console.error(error);
        return null;
      }
      console.debug('Added bill successfully to cloud:', data);
      return data[0];
    }
    return null;
  };

  setBillAsComplete = async (
    completed: boolean,
    id?: number,
  ): Promise<void> => {
    const bills = await this.getBills();
    const billIndex = bills.findIndex(bill =>
      bill.id ? bill.id === id : bill.tempID === id,
    );
    if (billIndex === -1) {
      throw Error('Cannot find bill');
    }
    const updatedBill = bills[billIndex];
    let completedDate = completed ? dayjs().toDate().toISOString() : undefined;
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
    const bills = await this.getBills();
    const billIndex = bills.findIndex(b =>
      b.id ? b.id === bill.id : b.tempID === bill.tempID,
    );
    if (billIndex === -1) {
      throw Error('Cannot find bill');
    }

    const updatedBills = [...bills];
    updatedBills[billIndex].archivedDate = archivedDate;
    Cache.setBills(updatedBills);
  };

  setBillsAsArchived = async (missedBills: Bill[]): Promise<void> => {
    const archivedDate = dayjs().toDate().toISOString();
    const bills = await this.getBills();
    const updatedBills = [...bills];

    for (const bill of missedBills) {
      const billIndex = updatedBills.findIndex(b =>
        b.id ? b.id === bill.id : b.tempID === bill.tempID,
      );
      if (billIndex === -1) {
        throw Error('Cannot find bill');
      }

      updatedBills[billIndex].archivedDate = archivedDate;

      Cache.setBills(updatedBills);
    }
  };

  setBillAsDeleted = async (bill: Bill): Promise<void> => {
    const deletedDate = dayjs().toDate().toISOString();
    const bills = await this.getBills();
    const billIndex = bills.findIndex(b =>
      b.id ? b.id === bill.id : b.tempID === bill.tempID,
    );
    if (billIndex === -1) {
      throw Error('Cannot find bill');
    }

    const updatedBills = [...bills];
    updatedBills[billIndex].deletedDate = deletedDate;
    Cache.setBills(updatedBills);
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
