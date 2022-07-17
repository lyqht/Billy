import {AuthSession, User} from '@supabase/supabase-js';
import dayjs from 'dayjs';
import {MMKV} from 'react-native-mmkv';
import {initializeMMKVFlipper} from 'react-native-mmkv-flipper-plugin';
import {Bill, UnsyncBill} from '../models/Bill';

export enum STORAGE_KEYS {
  LAST_SYNC_DATE = 'lastSyncDate',
  BILLS = 'bills',
  USER_ID = 'userId',
  USER = 'user',
  AUTH_TOKEN = 'supabase.auth.token',
}
class Cache {
  private storage;
  constructor() {
    this.storage = new MMKV();
    if (__DEV__) {
      initializeMMKVFlipper({default: this.storage});
    }
  }

  // -------------------------------------
  // these methods are added so that the Supabase client can access MMKV as cache

  getItem(key: string) {
    return this.storage.getString(key);
  }

  setItem(key: string, value: string) {
    return this.storage.set(key, value);
  }

  removeItem(key: string) {
    if (this.storage.contains(key)) {
      this.storage.delete(key);
    }

    console.debug(
      `Tried to remove item from cache, but does not contain ${key}`,
    );
  }

  // -------------------------------------

  getStorage() {
    return this.storage;
  }

  getLastSyncDate(format = 'DD MMM h:mm a'): string | undefined {
    if (this.storage.contains(STORAGE_KEYS.LAST_SYNC_DATE)) {
      return dayjs(this.storage.getString(STORAGE_KEYS.LAST_SYNC_DATE)).format(
        format,
      );
    }
  }

  setLastSyncDate(date: string): void {
    this.storage.set(STORAGE_KEYS.LAST_SYNC_DATE, date);
  }

  setLastSyncDateAsNow(): void {
    this.setLastSyncDate(new Date().toISOString());
  }

  getBills(): Bill[] | undefined {
    const retrievedBills = this.storage.getString(STORAGE_KEYS.BILLS);
    if (retrievedBills) {
      return JSON.parse(retrievedBills);
    }
  }

  setBills(bills: Partial<Bill | UnsyncBill>[]): void {
    this.storage.set(STORAGE_KEYS.BILLS, JSON.stringify(bills));
  }

  getUser(): User | null {
    if (this.storage.contains(STORAGE_KEYS.AUTH_TOKEN)) {
      const authInfo = JSON.parse(
        this.storage.getString(STORAGE_KEYS.AUTH_TOKEN)!,
      );
      const session: AuthSession = authInfo.currentSession;
      return session.user;
    }

    return null;
  }

  deleteUser(): void {
    if (this.storage.contains(STORAGE_KEYS.USER)) {
      this.storage.delete(STORAGE_KEYS.USER);
    }
  }

  clearAllData(): void {
    console.debug('Clearing all cache');
    this.storage.clearAll();
  }
}

export default new Cache();
