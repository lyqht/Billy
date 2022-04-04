import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Bill} from './models/Bill';
import {LoginMode} from './types/loginMode';

export type RootStackParamList = {
  Home: undefined;
  BillForm: undefined;
  Login: {loginMode: LoginMode};
  MissedBills: {bills: Bill[]};
  Settings: undefined;
};

export type TabParamList = {
  UpcomingBills: undefined;
  Settings: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProps = NativeStackNavigationProp<TabParamList>;
