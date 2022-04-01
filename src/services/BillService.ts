import {createClient} from '@supabase/supabase-js';
import {Bill} from '../models/Bill';
import {SUPABASE_URL, SUPABASE_KEY} from '@env';
import storage from './Storage';

class BillService {
  private client;
  constructor() {
    const supabaseUrl = SUPABASE_URL || '';
    const supabaseKey = SUPABASE_KEY || '';
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  getClient = () => this.client;

  getBills = async (): Promise<Bill[]> => {
    const billsFromCache = storage.getString('bills');
    if (billsFromCache) {
      console.debug('returning bills from cache!');
      return JSON.parse(billsFromCache);
    }

    let {data: bills, error} = await this.client
      .from<Bill>('bills')
      .select('*');
    if (error) {
      throw new Error('Error retrieving bills');
    }

    storage.set('bills', JSON.stringify(bills));
    return bills!;
  };
}

export default new BillService();
