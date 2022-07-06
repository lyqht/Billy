import {User} from '@supabase/supabase-js';
import {createContext} from 'react';
import {Bill} from '../models/Bill';

export interface Context {
  bills: Bill[];
  missedBills: Bill[];
  upcomingBills: Bill[];
  latestBillDate?: string;
  reminders: Record<string, number>;
  lastSyncDate?: string;
  user: User | null;
  setCurrentBills: (bills: Bill[]) => void;
  syncLocally: () => void;
}

const defaultContext: Context = {
  bills: [],
  missedBills: [],
  upcomingBills: [],
  reminders: {},
  user: null,
  setCurrentBills: () => {},
  syncLocally: () => {},
};

const BillyContext = createContext<Context>(defaultContext);
BillyContext.displayName = 'BillyContext'; // easier for debugging

export default BillyContext;
