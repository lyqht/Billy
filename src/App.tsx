import * as eva from '@eva-design/eva';
import notifee, {EventType} from '@notifee/react-native';
import {NavigationContainer} from '@react-navigation/native';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {RootNavStack} from './components/Navigation/RootNavStack';
import BillyContext from './contexts/BillyContext';
import {useBilly} from './contexts/useBillyContext';
import FCMService from './services/FCMService';
import SyncService from './services/SyncService';

const App: React.FC = () => {
  const bills = useBilly();

  const init = async () => {
    await SyncService.syncAllData();
    await FCMService.registerDeviceForRemoteMessages();
  };

  useEffect(() => {
    init();

    return notifee.onForegroundEvent(({type, detail}) => {
      if (type === EventType.APP_BLOCKED) {
        console.error('User toggled app blocked', detail.blocked);
      }

      if (type === EventType.CHANNEL_BLOCKED) {
        console.error(
          'User toggled channel block',
          detail.channel?.id,
          detail.blocked,
        );
      }

      if (type === EventType.CHANNEL_GROUP_BLOCKED) {
        console.error(
          'User toggled channel group block',
          detail.channelGroup?.id,
          detail.blocked,
        );
      }

      if (type === EventType.DISMISSED) {
        console.debug('User dismissed notif');
      }

      if (type === EventType.PRESS) {
        console.debug('User pressed notif');
      }
    });
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <BillyContext.Provider value={bills}>
          <SafeAreaProvider>
            <NavigationContainer>
              <RootNavStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </BillyContext.Provider>
      </ApplicationProvider>
      <Toast />
    </>
  );
};

export default App;
