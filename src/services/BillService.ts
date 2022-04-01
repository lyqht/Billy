import {SUPABASE_KEY, SUPABASE_URL} from '@env';
import {createClient} from '@supabase/supabase-js';
import {Bill} from '../models/Bill';
import storage from './Storage';
class BillService {
  private client;
  private bills: Bill[];

  constructor() {
    const supabaseUrl = SUPABASE_URL || '';
    const supabaseKey = SUPABASE_KEY || '';
    this.client = createClient(supabaseUrl, supabaseKey);
    this.bills = [];
  }

  getClient = () => this.client;

  getBills = async (): Promise<Bill[]> => {
    const billsFromCache = storage.getString('bills');
    if (billsFromCache) {
      console.debug('returning bills from cache!');
      this.bills = JSON.parse(billsFromCache);
      return this.bills;
    }

    let {data: bills, error} = await this.client
      .from<Bill>('bills')
      .select('*');
    if (error) {
      throw new Error('Error retrieving bills');
    }

    storage.set('bills', JSON.stringify(bills));
    this.bills = bills!;
    return this.bills;
  };

  addBill = async (bill: Bill): Promise<Bill> => {
    const updatedBills = [...this.bills, bill];
    storage.set('bills', JSON.stringify(updatedBills));

    return bill;
  };
}

export default new BillService();
