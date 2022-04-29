import {SUPABASE_KEY, SUPABASE_URL} from '@env';
import {createClient} from '@supabase/supabase-js';
import Cache from '../services/Cache';

const supabaseUrl = SUPABASE_URL || '';
const supabaseKey = SUPABASE_KEY || '';

const supabase = createClient(supabaseUrl, supabaseKey, {
  localStorage: Cache,
});

export default supabase;
