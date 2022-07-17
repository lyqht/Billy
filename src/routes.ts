import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Bill, BillWithRelativeReminderDates} from './models/Bill';
import {LoginMode} from './types/LoginMode';

export type RootStackParamList = {
  Home: undefined;
  Login: {loginMode: LoginMode};
  MissedBills: undefined;
  Settings: undefined;
  AccountSettings: undefined;
  BillDetails: {bill: Bill};
  BillForm: {bill?: BillWithRelativeReminderDates};
};

export type TabParamList = {
  Bills: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProps = NativeStackNavigationProp<TabParamList>;
