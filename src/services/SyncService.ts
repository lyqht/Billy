import supabase from '../api/supabase';
import {getUnsyncBills} from '../helpers/BillFilter';
import {Bill, UnsyncBill} from '../models/Bill';
import BillService from './BillService';
import Cache from './Cache';
import NotificationService from './NotificationService';
import UserService from './UserService';
import NetInfo from '@react-native-community/netinfo';

const LOGGER_PREFIX = '[SyncService]';

class SyncService {
  private replaceUnsyncBillsTempIDWithCloudID = async (
    newIDMap: Record<string, number>,
  ) => {
    const bills = Cache.getBills();
    const updatedBills: Bill[] = [...bills!];
    Object.entries(newIDMap).forEach(([tempID, newID]) => {
      const billIndex = updatedBills.findIndex(bill => bill.tempID === tempID);
      updatedBills[billIndex].id = newID;
      updatedBills[billIndex].tempID = undefined;
    });

    Cache.setBills(updatedBills);
  };

  syncAllData = async (): Promise<void> => {
    console.debug(`${LOGGER_PREFIX} Attempting to sync data...`);

    const networkState = await NetInfo.fetch();
    if (!networkState.isConnected) {
      console.debug(
        `${LOGGER_PREFIX} User is not connected to internet, not syncing.`,
      );
      return;
    }

    if (UserService.getUser() === null) {
      console.debug(
        `${LOGGER_PREFIX} User does not have an account, not syncing to cloud`,
      );
      return;
    }

    const bills = Cache.getBills() || [];
    const unsyncBills = getUnsyncBills(bills);
    console.debug(
      `${LOGGER_PREFIX} Number of unsync bills: ${unsyncBills.length}`,
    );
    const newIDMap: Record<string, number> = {};
    for (let bill of unsyncBills) {
      const unsyncBill = bill as UnsyncBill;
      const newBill = await BillService.addBillToCloud(bill);

      if (newBill) {
        console.debug(
          `${LOGGER_PREFIX} Local Bill ${bill.tempID} has been sync to obtain new id on cloud: ${newBill.id}`,
        );

        try {
          const triggerNotifications =
            await NotificationService.getReminderNotificationsForBill(
              bill.tempID!,
            );
          await NotificationService.updateNotificationsWithNewBillId(
            triggerNotifications,
            `${newBill.id}`,
          );
        } catch (err) {
          console.error(err);
        }

        newIDMap[unsyncBill.tempID] = newBill.id;
      }
    }

    if (Object.keys(newIDMap).length > 0) {
      await this.replaceUnsyncBillsTempIDWithCloudID(newIDMap);
    }

    const retrievedBills = Cache.getBills();
    if (retrievedBills) {
      const updatedBills: Bill[] = Cache.getBills()!.map(bill => {
        const {tempID, ...billDetails} = bill;
        return {
          ...billDetails,
          userId: UserService.getUser()!.id,
        };
      });
      try {
        // At the moment due to how PostgREST is implemented, upsert does not work as intended
        // https://github.com/supabase/postgrest-js/issues/173
        // Hence we could have temporary workaround to split into 2 calls: toUpdate, toCreate

        // However, it seems that even though it is recommended not to use insert with the upsert parameter
        // this somehow works as intended.
        const {data, error} = await supabase
          .from<Bill>('Bill')
          .insert(updatedBills, {upsert: true});

        if (error) {
          console.error(`${LOGGER_PREFIX} ${JSON.stringify(error)}`);
          throw new Error('Error syncing to cloud');
        }
        console.debug({data});
        await BillService.getBillsFromDB();
      } catch (err) {
        console.error(`${LOGGER_PREFIX} ${JSON.stringify(err)}`);
        throw new Error('Error syncing to cloud');
      }
    }
  };

  clearAllData = async (): Promise<void> => {
    await UserService.logOutUser();
    await NotificationService.clearAllNotifications();
    Cache.clearAllData();
  };
}

export default new SyncService();
