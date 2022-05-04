import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  Notification,
  TimestampTrigger,
  Trigger,
  TriggerNotification,
  TriggerType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import {v4} from 'uuid';
import supabase from '../api/supabase';
import UserService from './UserService';
import dayjs from 'dayjs';

// --------- FCM ---------- //

export const requestUserPermissionOnIOS = async (): Promise<boolean> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  console.debug(
    `User permission for notifications: ${
      enabled ? 'Authorized' : 'Not given'
    }`,
  );

  return enabled;
};

export const onMessageReceived = async message => {
  notifee.displayNotification(JSON.parse(message.data.notifee));
};

export const registerDeviceForRemoteMessages = async () => {
  let permissionGranted = true;
  if (Platform.OS === 'ios') {
    permissionGranted = await requestUserPermissionOnIOS();
  }

  if (permissionGranted) {
    // You only need to register if auto-registration is disabled in your 'firebase.json' configuration file via the 'messaging_ios_auto_register_for_remote_messages' property
    // await messaging().registerDeviceForRemoteMessages();

    // Get the token
    const token = await messaging().getToken();
    const deviceId = getUniqueId();

    // Save the token
    const {data, error} = await supabase
      .from('FCMToken')
      .upsert([{userId: UserService.getUser()?.id, token, deviceId}]);

    if (error) {
      throw Error(error.message);
    }
  }
};

// --------- Notifee ---------- //

//Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel.
const ANDROID_CHANNEL_ID = 'billy-notifs';

export const createAndroidNotifChannel = async () => {
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

export const createBaseNotification = (
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

const checkAndroidAlarmPermissionSettings = async () => {
  const settings = await notifee.getNotificationSettings();
  if (settings.android.alarm !== AndroidNotificationSetting.ENABLED) {
    await notifee.openAlarmPermissionSettings();
  }
};

// currently only used for testing, no functionality uses this yet.
export const displayNotification = async () => {
  await createAndroidNotifChannel();
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

export const createTimestampNotification = async (
  date: Date,
  notification: Notification,
): Promise<void> => {
  await createAndroidNotifChannel();
  await checkAndroidAlarmPermissionSettings();
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

export const getReminderNotificationsForBill = async (
  billID: string,
): Promise<TriggerNotification[]> => {
  const triggerNotifs = await notifee.getTriggerNotifications();
  return (
    triggerNotifs.filter(
      trigger => trigger.notification.data?.billId === billID,
    ) || []
  );
};

export const getReminderNotificationIdsForBill = async (
  billID: string,
): Promise<string[]> => {
  const triggerNotifs = await getReminderNotificationsForBill(billID);

  return triggerNotifs.map(triggerNotif => triggerNotif.notification.id!) || [];
};

export const updateNotificationsWithNewBillId = async (
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

export const clearAllNotifications = async () => {
  console.debug('Clearing all notifications');
  await notifee.cancelAllNotifications();
};
