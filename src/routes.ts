import {NativeStackNavigationProp} from '@react-navigation/native-stack';
import {LoginMode} from './types/loginMode';

export type RootStackParamList = {
  Home: undefined;
  BillForm: undefined;
  Login: {loginMode: LoginMode};
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;