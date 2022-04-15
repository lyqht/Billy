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
import supabase from '../api/supabase';
import UserService from './UserService';
import {v4} from 'uuid';

// --------- FCM ---------- //

export const requestUserPermissionOnIOS = async (): Promise<boolean> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('User permission for notifications:', authStatus);
  }

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
  if (!notifee.isChannelCreated(ANDROID_CHANNEL_ID)) {
    await notifee.createChannel({
      id: ANDROID_CHANNEL_ID,
      name: 'Billy',
      lights: false,
      vibration: true,
      importance: AndroidImportance.DEFAULT,
    });
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

const checkAndroidAlarmPermissionSettings = async (
  callback: () => Promise<void>,
) => {
  const settings = await notifee.getNotificationSettings();
  if (settings.android.alarm === AndroidNotificationSetting.ENABLED) {
    await callback();
  } else {
    await notifee.openAlarmPermissionSettings();
  }
};

export const createTimestampNotification = async (
  date: Date,
  notification: Notification,
): Promise<void> => {
  await createAndroidNotifChannel();
  await checkAndroidAlarmPermissionSettings(async () => {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    const createdNotification = await notifee.createTriggerNotification(
      notification,
      trigger,
    );

    console.debug({createdNotification});
  });
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
