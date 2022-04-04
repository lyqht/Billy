import * as eva from '@eva-design/eva';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {ApplicationProvider, IconRegistry} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import React from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import {SupabaseContextProvider} from 'use-supabase';
import supabase from './api/supabase';
import NavigationHeader from './components/Navigation/NavigationHeader';
import {RootStackParamList} from './routes';
import BillFormScreen from './screens/BillFormScreen';
import HomeScreen from './screens/HomeScreen';
import LoginScreen from './screens/LoginScreen';
import MissedBillsScreen from './screens/MissedBillsScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const NavStack = () => (
  <RootStack.Navigator
    initialRouteName="Home"
    screenOptions={{
      header: navigationProps => (
        <NavigationHeader navigation={navigationProps} />
      ),
    }}>
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
  </RootStack.Navigator>
);

const App: React.FC = () => {
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SupabaseContextProvider client={supabase}>
          <SafeAreaProvider>
            <NavigationContainer>
              <NavStack />
            </NavigationContainer>
          </SafeAreaProvider>
        </SupabaseContextProvider>
      </ApplicationProvider>
      <Toast />
    </>
  );
};

export default App;
