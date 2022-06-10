import * as eva from '@eva-design/eva';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import NavigationHeader from './components/Navigation/NavigationHeader';
import {RootStackParamList} from './routes';
import BillFormScreen from './screens/BillFormScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MissedBillsScreen from './screens/MissedBillsScreen';
import SettingsDetailScreen from './screens/SettingsDetailScreen';
import {registerDeviceForRemoteMessages} from './services/NotificationService';
import SyncService from './services/SyncService';
import notifee, {EventType} from '@notifee/react-native';
import {useBilly} from './contexts/useBillyContext';
import BillyContext from './contexts/BillyContext';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const NavStack = () => (
  <RootStack.Navigator
    initialRouteName="Home"
    screenOptions={{
      header: navigationProps => (
        <NavigationHeader navigation={navigationProps} />
      ),
    }}
  >
    <RootStack.Screen
      name={'Home'}
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
    <RootStack.Screen name={'BillForm'} component={BillFormScreen} />
    <RootStack.Screen name={'MissedBills'} component={MissedBillsScreen} />
    <RootStack.Screen name={'Login'} component={LoginScreen} />
    <RootStack.Screen
      name={'AccountSettings'}
      component={SettingsDetailScreen}
    />
  </RootStack.Navigator>
);

const App: React.FC = () => {
  const bills = useBilly();

  const init = async () => {
    await SyncService.syncAllData();
    await registerDeviceForRemoteMessages();
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
              <NavStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </BillyContext.Provider>
      </ApplicationProvider>
      <Toast />
    </>
  );
};

export default App;
