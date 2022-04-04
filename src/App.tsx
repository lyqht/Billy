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
import {RootStackParamList} from './routes';
import BillFormScreen from './screens/BillFormScreen';
import HomeScreen from './screens/HomeScreen';
import MissedBillsScreen from './screens/MissedBillsScreen';

const RootStack = createNativeStackNavigator<RootStackParamList>();

const NavStack = () => (
  <RootStack.Navigator initialRouteName="Home">
    <RootStack.Screen
      name={'Home'}
      component={HomeScreen}
      options={{
        headerShown: false,
      }}
    />
    <RootStack.Screen
      name={'BillForm'}
      component={BillFormScreen}
      options={{
        headerShown: false,
      }}
    />
    <RootStack.Screen
      name={'MissedBills'}
      component={MissedBillsScreen}
      options={{
        headerTitle: 'Missed Bills',
      }}
    />
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
