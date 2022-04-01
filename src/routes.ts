import {NativeStackNavigationProp} from '@react-navigation/native-stack';

export type RootStackParamList = {
  Home: undefined;
  BillForm: undefined;
};

export type NavigationProps = NativeStackNavigationProp<RootStackParamList>;
