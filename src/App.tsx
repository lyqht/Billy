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

const init = async () => {
  await SyncService.syncAllData();
  await registerDeviceForRemoteMessages();
};

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
  useEffect(() => {
    init();
  }, []);
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaProvider>
          <NavigationContainer>
            <NavStack />
          </NavigationContainer>
        </SafeAreaProvider>
      </ApplicationProvider>
      <Toast />
    </>
  );
};

export default App;
