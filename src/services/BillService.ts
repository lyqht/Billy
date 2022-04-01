import {SUPABASE_KEY, SUPABASE_URL} from '@env';
import {createClient} from '@supabase/supabase-js';
import {Bill} from '../models/Bill';
import Cache from './Cache';
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
    const billsFromCache = Cache.getBills();
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

    Cache.setBills(bills!);
    Cache.setLastSyncDateAsNow();
    this.bills = bills!;
    return this.bills;
  };

  addBill = async (bill: Bill): Promise<Bill> => {
    const updatedBills = [...this.bills, bill];
    Cache.setBills(updatedBills);

    const {data, error} = await this.client.from<Bill>('bills').insert(bill);

    if (error) {
      throw new Error('Error syncing bills');
    }

    Cache.setLastSyncDateAsNow();

    return bill;
  };
}

export default new BillService();
