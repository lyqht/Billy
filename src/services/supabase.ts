import {createClient} from '@supabase/supabase-js';
import {Bill} from '../models/Bill';
import {SUPABASE_URL, SUPABASE_KEY} from '@env';

class SupabaseClient {
  private client;
  constructor() {
    const supabaseUrl = SUPABASE_URL || '';
    const supabaseKey = SUPABASE_KEY || '';
    this.client = createClient(supabaseUrl, supabaseKey);
  }

  getBills = async (): Promise<Bill[]> => {
    let {data: bills, error} = await this.client
      .from<Bill>('bills')
      .select('*');
    if (error) {
      throw new Error('Error retrieving bills');
    }
    return bills!;
  };
}

export default new SupabaseClient();
