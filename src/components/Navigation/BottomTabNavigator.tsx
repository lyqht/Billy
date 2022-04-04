import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Icon} from '@ui-kitten/components';
import React from 'react';
import {TabParamList} from '../../routes';
import SettingsScreen from '../../screens/SettingsScreen';
import UpcomingBillsScreen from '../../screens/UpcomingBillsScreen';
import BottomTabBar from './BottomTabBar';

const Tab = createBottomTabNavigator<TabParamList>();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="UpcomingBills"
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}>
      <Tab.Screen name="UpcomingBills" component={UpcomingBillsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
