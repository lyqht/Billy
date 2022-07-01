import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {Platform} from 'react-native';
import {getUniqueId} from 'react-native-device-info';
import supabase from '../api/supabase';
import UserService from './UserService';

class FCMService {
  private requestUserPermissionOnIOS = async (): Promise<boolean> => {
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

  public registerDeviceForRemoteMessages = async (): Promise<void> => {
    let permissionGranted = true;
    if (Platform.OS === 'ios') {
      permissionGranted = await this.requestUserPermissionOnIOS();
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

  public onReceiveFCM = async message => {
    notifee.displayNotification(JSON.parse(message.data.notifee));
  };
}

export default new FCMService();
