import {createNativeStackNavigator} from '@react-navigation/native-stack';
import React from 'react';
import {RootStackParamList} from '../../routes';
import BillDetailScreen from '../../screens/BillDetailScreen';
import BillFormScreen from '../../screens/BillFormScreen';
import HomeScreen from '../../screens/HomeScreen';
import LoginScreen from '../../screens/LoginScreen';
import MissedBillsScreen from '../../screens/MissedBillsScreen';
import SettingsDetailScreen from '../../screens/SettingsDetailScreen';
import NavigationHeader from './NavigationHeader';

const RootStack = createNativeStackNavigator<RootStackParamList>();

export const RootNavStack = () => (
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
    <RootStack.Screen name={'BillDetails'} component={BillDetailScreen} />
  </RootStack.Navigator>
);
