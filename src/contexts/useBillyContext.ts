import {User} from '@supabase/supabase-js';
import {useCallback, useState, useEffect} from 'react';
import {getMissedBills, getUpcomingBills} from '../helpers/BillFilter';
import {getBillIdToNumRemindersMap} from '../helpers/ReminderMapper';
import {Bill} from '../models/Bill';
import BillService from '../services/BillService';
import Cache, {STORAGE_KEYS} from '../services/Cache';
import UserService from '../services/UserService';
import {Context} from './BillyContext';
import {getLastBillDate} from '../helpers/AnalyticsFns';

export const useBilly = (): Context => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [upcomingBills, setUpcomingBills] = useState<Bill[]>([]);
  const [missedBills, setMissedBills] = useState<Bill[]>([]);
  const [latestBillDate, setLatestBillDate] = useState<string>();
  const [lastSyncDate, setLastSyncDate] = useState<string>();
  const [reminders, setReminders] = useState<Record<string, number>>({});
  const [user, setUser] = useState<User | null>(null);

  const init = async () => {
    setCurrentBills(await BillService.getBills());
    setLastSyncDate(Cache.getLastSyncDate() ?? '');
    setUser(await UserService.getUser());
  };

  const syncLocally = async () => {
    console.debug('[BillyContext] Refreshing states...');
    const currentBills = await BillService.getBills();
    setUpcomingBills(getUpcomingBills(currentBills));
    setMissedBills(getMissedBills(currentBills));
    getBillIdToNumRemindersMap(currentBills).then(retrievedReminders => {
      setReminders(retrievedReminders);
    });

    if (currentBills.length > 0) {
      setLatestBillDate(getLastBillDate(currentBills).format('DD MMM YYYY'));
    }
  };

  useEffect(() => {
    init();

    console.debug('[BillyContext] Adding cache listener');
    const listener = Cache.getStorage().addOnValueChangedListener(
      changedKey => {
        console.debug(`[BillyContext] Cache updated for ${changedKey}`);
        if (changedKey === STORAGE_KEYS.AUTH_TOKEN) {
          setUser(UserService.getUser());
        } else if (changedKey === STORAGE_KEYS.BILLS) {
          setBills(Cache.getBills() ?? []);
        } else if (changedKey === STORAGE_KEYS.LAST_SYNC_DATE) {
          setLastSyncDate(Cache.getLastSyncDate() ?? '');
        }
      },
    );

    return () => {
      console.debug('[BillyContext] Removing cache listener');
      listener.remove();
    };
  }, []);

  useEffect(() => {
    syncLocally();
  }, [bills]);

  const setCurrentBills = useCallback((items: Bill[]) => {
    setBills(items);
  }, []);

  return {
    bills,
    missedBills,
    upcomingBills,
    latestBillDate,
    reminders,
    lastSyncDate,
    user,
    setCurrentBills,
    syncLocally,
  };
};
