import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LoginMode} from './types/LoginMode';

export type RootStackParamList = {
  Home: undefined;
  BillForm: undefined;
  Login: {loginMode: LoginMode};
  MissedBills: undefined;
  Settings: undefined;
  AccountSettings: undefined;
};

export type TabParamList = {
  Bills: undefined;
  Settings: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
export type TabNavigationProps = NativeStackNavigationProp<TabParamList>;
