import notifee, {
  AndroidImportance,
  AndroidNotificationSetting,
  Notification,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import supabase from '../api/supabase';
import UserService from './UserService';

// --------- FCM ---------- //

export const requestUserPermissionOnIOS = async (): Promise<boolean> => {
  const authStatus = await messaging().requestPermission();
  const enabled =
    authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
    authStatus === messaging.AuthorizationStatus.PROVISIONAL;

  if (enabled) {
    console.log('Authorization status:', authStatus);
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
      .upsert([{userId: UserService.getUser(), token, deviceId}]);

    if (error) {
      throw Error(error.message);
    }
  }
};

// --------- Notifee ---------- //

//Starting in Android 8.0 (API level 26), all notifications must be assigned to a channel.
const ANDROID_CHANNEL_ID = 'billy-notifs';

export const createAndroidNotifChannel = async () => {
  await notifee.createChannel({
    id: ANDROID_CHANNEL_ID,
    name: 'Billy',
    lights: false,
    vibration: true,
    importance: AndroidImportance.DEFAULT,
  });
};

export const createBaseNotification = (
  id: string,
  title: string,
  body: string,
): Notification => ({
  id, // this id should follow either bill.tempID or bill.id
  title,
  body,
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
  checkAndroidAlarmPermissionSettings(async () => {
    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: date.getTime(),
    };

    await notifee.createTriggerNotification(notification, trigger);
  });
};
