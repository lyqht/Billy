import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  Notification,
  TimestampTrigger,
  Trigger,
  TriggerNotification,
  TriggerType,
} from '@notifee/react-native';
import dayjs from 'dayjs';
import {v4} from 'uuid';

//Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel.
const ANDROID_CHANNEL_ID = 'billy-notifs';

class NotificationService {
  private createAndroidNotifChannel = async () => {
    await notifee.deleteChannel(ANDROID_CHANNEL_ID);
    await notifee.createChannel({
      id: ANDROID_CHANNEL_ID,
      name: ANDROID_CHANNEL_ID,
      lights: false,
      vibration: true,
      importance: AndroidImportance.DEFAULT,
      sound: 'default',
    });
    console.debug('Created Android Channel');

    const channel = await notifee.getChannel(ANDROID_CHANNEL_ID);
    if (channel?.blocked) {
      console.debug(`Channel ${ANDROID_CHANNEL_ID} is disabled`);
    } else {
      console.debug(`Channel ${ANDROID_CHANNEL_ID} is enabled`);
    }
  };

  public createBaseNotification = (
    billId: string,
    title: string,
    body: string,
  ): Notification => ({
    id: v4(),
    title,
    body,
    data: {
      billId,
    },
    android: {
      channelId: ANDROID_CHANNEL_ID,
      pressAction: {
        id: 'default', // for iOS, this is already the default behavior and no way to override.
      },
    },
  });

  private checkAndroidAlarmPermissionSettings = async () => {
    const settings = await notifee.getNotificationSettings();
    if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
      await notifee.openAlarmPermissionSettings();
    }
  };

  public createTimestampNotification = async (
    date: Date,
    notification: Notification,
  ): Promise<void> => {
    await this.createAndroidNotifChannel();
    await this.checkAndroidAlarmPermissionSettings();
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    const createdNotificationId = await notifee.createTriggerNotification(
      notification,
      trigger,
    );

    const triggerNotifs = await notifee.getTriggerNotifications();
    const createdNotif = triggerNotifs.filter(
      t => t.notification.id === createdNotificationId,
    )[0];

    console.debug(JSON.stringify(createdNotif));

    // @ts-ignore
    console.debug(dayjs(createdNotif.trigger.timestamp).format());
  };

  public getReminderNotificationsForBill = async (
    billID: string,
  ): Promise<TriggerNotification[]> => {
    const triggerNotifs = await notifee.getTriggerNotifications();
    return (
      triggerNotifs.filter(
        trigger => trigger.notification.data?.billId === billID,
      ) || []
    );
  };

  public getReminderNotificationIdsForBill = async (
    billID: string,
  ): Promise<string[]> => {
    const triggerNotifs = await this.getReminderNotificationsForBill(billID);

    return (
      triggerNotifs.map(triggerNotif => triggerNotif.notification.id!) || []
    );
  };

  public updateNotificationsWithNewBillId = async (
    triggerNotifications: TriggerNotification[],
    billID: string,
  ) => {
    const promises = triggerNotifications.map(triggerNotif =>
      notifee.createTriggerNotification(
        {...triggerNotif.notification, data: {billId: billID}},
        {...triggerNotif.trigger, repeatFrequency: undefined} as Trigger,
      ),
    );

    try {
      const updatedNotifications = await Promise.all(promises);
      console.debug({updatedNotifications});
    } catch (err) {
      console.error(err);
    }
  };

  public clearAllNotifications = async () => {
    console.debug('Clearing all notifications');
    await notifee.cancelAllNotifications();
  };

  // currently only used for testing, no functionality uses this yet.
  public displayNotification = async () => {
    await this.createAndroidNotifChannel();
    await notifee.displayNotification({
      title: 'Test notification',
      android: {
        channelId: ANDROID_CHANNEL_ID,
        pressAction: {
          id: 'default',
        },
      },
    });
  };
}

export default new NotificationService();
