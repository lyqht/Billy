import {SUPABASE_KEY, SUPABASE_URL} from '@env';
import {createClient} from '@supabase/supabase-js';

const supabaseUrl = SUPABASE_URL || '';
const supabaseKey = SUPABASE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;
