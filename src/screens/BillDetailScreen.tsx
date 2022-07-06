import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Layout, Text} from '@ui-kitten/components';
import React, {useCallback, useState} from 'react';
import {SafeAreaView} from 'react-native';
import {ReminderFormData} from '../models/Reminder';
import {NavigationProps, RootStackParamList} from '../routes';
import BillService from '../services/BillService';
import NotificationService from '../services/NotificationService';

type BillDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BillDetails'
>;

const BillDetailScreen: React.FC<BillDetailsScreenProps> = ({route}) => {
  const {bill} = route.params;
  const navigation = useNavigation<NavigationProps>();
  const [relativeReminderDates, setRelativeReminderDates] = useState<
    ReminderFormData[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const getNotifs = async () => {
        setRelativeReminderDates(
          await NotificationService.getRelativeReminderNotificationDatesForBill(
            `${bill.id ?? bill.tempID}`,
          ),
        );
      };

      getNotifs();
    }, []),
  );

  return (
    <SafeAreaView>
      <Layout>
        <Text category={'h4'}>Bill Details</Text>
        <Text>{bill.payee}</Text>
        <Text>{bill.amount}</Text>
        <Text>{bill.category}</Text>
        <Text>Due on: {bill.deadline}</Text>
        {relativeReminderDates.length > 0 && (
          <Layout>
            <Text category={'s1'}>Pending reminders</Text>
            {relativeReminderDates.map((relativeReminderDate, index) => (
              <Layout key={`reminder-${index}`}>
                <Text>{relativeReminderDate.value}</Text>
                <Text>{relativeReminderDate.timeUnit}</Text>
              </Layout>
            ))}
          </Layout>
        )}
        {bill.completedDate && <Text>Completed on {bill.completedDate}</Text>}
        {bill.archivedDate && <Text>Archived on {bill.archivedDate}</Text>}
        <Button
          onPress={() =>
            navigation.navigate('BillForm', {
              bill: {...bill, relativeReminderDates},
            })
          }
        >
          Edit Bill
        </Button>
        <Button
          onPress={() => {
            BillService.deleteBill(bill.id || bill.tempID!);
          }}
        >
          Delete Bill
        </Button>
      </Layout>
    </SafeAreaView>
  );
};

export default BillDetailScreen;
