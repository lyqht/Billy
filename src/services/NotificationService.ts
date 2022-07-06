import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  Notification,
  RepeatFrequency,
  TimestampTrigger,
  Trigger,
  TriggerNotification,
  TriggerType,
} from '@notifee/react-native';
import dayjs from 'dayjs';
import {v4} from 'uuid';
import {BillID} from '../models/Bill';
import {TimeUnit} from './../models/Reminder';
import {ReminderFormData} from '../models/Reminder';

//Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel.
const LOGGER_PREFIX = '[NotificationService]';
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

    const channel = await notifee.getChannel(ANDROID_CHANNEL_ID);
    if (channel?.blocked) {
      console.debug(
        `${LOGGER_PREFIX} Channel ${ANDROID_CHANNEL_ID} is disabled`,
      );
    } else {
      console.debug(
        `${LOGGER_PREFIX} Channel ${ANDROID_CHANNEL_ID} is enabled`,
      );
    }
  };

  private createBaseNotification = (
    title: string,
    body: string,
    data: {[key: string]: string},
  ): Notification => ({
    id: v4(),
    title,
    body,
    data,
    android: {
      channelId: ANDROID_CHANNEL_ID,
      pressAction: {
        id: 'default', // for iOS, this is already the default behavior and no way to override.
      },
    },
  });

  public createPendingBillNotification = async (notificationDetails: {
    billID: BillID;
    payee: string;
    deadline: string;
    value: string;
    timeUnit: TimeUnit;
    reminderDate: string;
  }): Promise<void> => {
    const notificationData = {
      billID: `${notificationDetails.billID}`,
      deadline: `${notificationDetails.deadline}`,
      value: `${notificationDetails.value}`,
      timeUnit: `${notificationDetails.timeUnit}`,
    };

    const {payee, deadline, reminderDate} = notificationDetails;
    const notification = this.createBaseNotification(
      'Your bill is due!',
      `You have a pending bill to ${payee} due on ${dayjs(deadline).format(
        'DD/MM/YYYY',
      )}`,
      notificationData,
    );

    await this.createTimestampNotification(
      dayjs(reminderDate).startOf('minutes').toDate(),
      notification,
    );
  };

  private checkAndroidAlarmPermissionSettings = async () => {
    const settings = await notifee.getNotificationSettings();
    if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
      await notifee.openAlarmPermissionSettings();
    }
  };

  private createTimestampNotification = async (
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

    console.debug(
      `${LOGGER_PREFIX} A notification has been created successfully for: ${dayjs(
        createdNotif.trigger.timestamp,
      ).format()}`,
    );
  };

  public getReminderNotificationsForBill = async (
    billID: string,
  ): Promise<TriggerNotification[]> => {
    const triggerNotifs = await notifee.getTriggerNotifications();
    return (
      triggerNotifs.filter(
        ({notification}) => notification.data?.billID === billID,
      ) || []
    );
  };

  public getRelativeReminderNotificationDatesForBill = async (
    billID: string,
  ): Promise<ReminderFormData[]> => {
    const notifications = await this.getReminderNotificationsForBill(billID);
    const relativeReminderDates: ReminderFormData[] = [];
    notifications.forEach(notifTrigger => {
      const {data} = notifTrigger.notification;
      if (data?.timeUnit && data.value) {
        relativeReminderDates.push({
          timeUnit: data.timeUnit as TimeUnit,
          value: data.value,
        });
      }
    });
    return relativeReminderDates;
  };

  public updateNotificationsWithNewBillId = async (
    triggerNotifications: TriggerNotification[],
    billID: string,
    repeatFrequency?: RepeatFrequency,
  ) => {
    const notificationsInFuture = triggerNotifications.filter(triggerNotif =>
      dayjs(triggerNotif.trigger.timestamp).isAfter(dayjs()),
    );
    const promises = notificationsInFuture.map(triggerNotif =>
      notifee.createTriggerNotification(
        {
          ...triggerNotif.notification,
          data: {...triggerNotif.notification.data, billID},
        },
        {...triggerNotif.trigger, repeatFrequency} as Trigger,
      ),
    );

    try {
      const updatedNotificationsWithNewBillId = await Promise.all(promises);
      console.debug({updatedNotificationsWithNewBillId});
    } catch (err) {
      console.error(err);
    }
  };

  public deleteNotificationsForBill = async (billID: string) => {
    const triggerNotifications = await this.getReminderNotificationsForBill(
      billID,
    );

    await notifee.cancelTriggerNotifications(
      triggerNotifications.map(triggerNotif => triggerNotif.notification.id!),
    );
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
