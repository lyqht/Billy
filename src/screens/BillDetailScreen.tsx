import {Button, Text} from '@ui-kitten/components';
import {SafeAreaView} from 'react-native';
import React from 'react';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {NavigationProps, RootStackParamList} from '../routes';
import {useNavigation} from '@react-navigation/native';
import BillService from '../services/BillService';

type BillDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BillDetails'
>;

const BillDetailScreen: React.FC<BillDetailsScreenProps> = ({route}) => {
  const {bill} = route.params;
  const navigation = useNavigation<NavigationProps>();
  return (
    <SafeAreaView>
      <Text category={'h4'}>Bill Details</Text>
      <Text>{bill.payee}</Text>
      <Text>{bill.amount}</Text>
      <Text>{bill.category}</Text>
      <Text>Due on: {bill.deadline}</Text>
      {bill.completedDate && <Text>Completed on {bill.completedDate}</Text>}
      {bill.archivedDate && <Text>Archived on {bill.archivedDate}</Text>}
      <Button onPress={() => navigation.navigate('BillForm', {bill})}>
        Edit Bill
      </Button>
      <Button
        onPress={() => {
          BillService.deleteBill(bill.id || bill.tempID);
        }}
      >
        Delete Bill
      </Button>
    </SafeAreaView>
  );
};

export default BillDetailScreen;
