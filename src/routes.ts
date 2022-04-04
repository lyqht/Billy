import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {Bill} from './models/Bill';
import {LoginMode} from './types/loginMode';

export type RootStackParamList = {
  Home: undefined;
  BillForm: undefined;
  Login: {loginMode: LoginMode};
  MissedBills: {bills: Bill[]};
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
