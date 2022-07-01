import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Bill} from './models/Bill';
import {LoginMode} from './types/LoginMode';

export type RootStackParamList = {
  Home: undefined;
  BillForm: {bill?: Bill};
  Login: {loginMode: LoginMode};
  MissedBills: undefined;
  Settings: undefined;
  AccountSettings: undefined;
  BillDetails: {bill: Bill};
};

export type TabParamList = {
  Bills: undefined;
  Analytics: undefined;
  Settings: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProps = NativeStackNavigationProp<TabParamList>;
