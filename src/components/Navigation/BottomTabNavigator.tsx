import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {TabParamList} from '../../routes';
import AnalyticsScreen from '../../screens/AnalyticsScreen';
import SettingsScreen from '../../screens/SettingsScreen';
import UpcomingBillsScreen from '../../screens/UpcomingBillsScreen';
import BottomTabBar from './BottomTabBar';

const Tab = createBottomTabNavigator<TabParamList>();

const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Bills"
      tabBar={props => <BottomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tab.Screen name="Bills" component={UpcomingBillsScreen} />
      <Tab.Screen name="Analytics" component={AnalyticsScreen} />
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
