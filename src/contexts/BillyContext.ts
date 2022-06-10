import {User} from '@supabase/supabase-js';
import {createContext} from 'react';
import {Bill} from '../models/Bill';

export interface Context {
  bills: Bill[];
  missedBills: Bill[];
  upcomingBills: Bill[];
  reminders: Record<string, number>;
  lastSyncDate: string;
  user: User | null;
  setCurrentBills: (bills: Bill[]) => void;
}

const defaultContext: Context = {
  bills: [],
  missedBills: [],
  upcomingBills: [],
  lastSyncDate: '',
  reminders: {},
  user: null,
  setCurrentBills: () => {},
};

const BillyContext = createContext<Context>(defaultContext);
BillyContext.displayName = 'BillyContext'; // easier for debugging

export default BillyContext;
