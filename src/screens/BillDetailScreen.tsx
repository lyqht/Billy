import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Button,
  Icon,
  Layout,
  StyleService,
  Text,
  useStyleSheet,
  useTheme,
} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React, {useCallback, useState} from 'react';
import {SafeAreaView, View} from 'react-native';
import {defaultCategoryIcons} from '../constants/PayeeOptions';
import {ReminderFormData} from '../models/Reminder';
import {NavigationProps, RootStackParamList} from '../routes';
import BillService from '../services/BillService';
import NotificationService from '../services/NotificationService';
import {Category} from '../types/AutocompleteOption';

type BillDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BillDetails'
>;

const BillDetailScreen: React.FC<BillDetailsScreenProps> = ({route}) => {
  const {bill} = route.params;
  const theme = useTheme();
  const styles = useStyleSheet(themedStyles);
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
      <Layout style={styles.main}>
        <Layout>
          <Text category={'h2'}>Bill Details</Text>
          <Layout style={[styles.row, styles.div, styles.center]}>
            <Layout
              testID={'bill-container'}
              style={[styles.center, styles.column, styles.billContainer]}
            >
              <Text category={'h4'} style={styles.contentTitle}>
                ${bill.amount}
              </Text>
              <View style={[styles.center]}>
                <Text category={'s1'}>
                  By {dayjs(bill.deadline).local().format('DD MMM YYYY')}
                </Text>
                <Text category={'p1'}>
                  {dayjs(bill.deadline).local().format('hh:mm a')}
                </Text>
              </View>
            </Layout>
            <Icon
              name="arrow-circle-right-outline"
              style={[styles.icon, styles.horizontalMargin]}
              fill={theme['color-primary-500']}
            />
            <Layout
              testID="payee-container"
              style={[styles.center, styles.column, styles.payeeContainer]}
            >
              <Text category={'h6'}>{bill.payee}</Text>
              {bill.category && (
                <View
                  style={[styles.row, styles.center, styles.categoryContainer]}
                >
                  <Text
                    category={'s1'}
                    style={{color: theme['color-basic-700']}}
                  >
                    {bill.category}
                  </Text>
                  <Icon
                    name={defaultCategoryIcons[bill.category as Category]}
                    style={[styles.icon]}
                    fill={theme['color-basic-700']}
                  />
                </View>
              )}
            </Layout>
          </Layout>
          {bill.completedDate && <Text>Completed on {bill.completedDate}</Text>}
          {bill.archivedDate && <Text>Archived on {bill.archivedDate}</Text>}
          {relativeReminderDates.length > 0 && (
            <Layout>
              <View style={[styles.row, {alignItems: 'center'}]}>
                <Text category={'s1'} style={[styles.div, styles.subheader]}>
                  Upcoming reminders
                </Text>
              </View>
              {relativeReminderDates.map((relativeReminderDate, index) => (
                <Layout
                  style={styles.reminderDateContainer}
                  key={`reminder-${index}`}
                >
                  <Text category={'p1'}>
                    {dayjs(bill.deadline)
                      .add(
                        parseInt(relativeReminderDate.value, 10),
                        relativeReminderDate.timeUnit,
                      )
                      .format('DD MMM YYYY hh:mm a')}
                  </Text>
                  <Text category={'c1'}>
                    {relativeReminderDate.value} {relativeReminderDate.timeUnit}{' '}
                    before deadline
                  </Text>
                </Layout>
              ))}
            </Layout>
          )}
        </Layout>
        <Layout>
          <Button
            style={styles.div}
            accessoryLeft={<Icon name="edit-2-outline" />}
            onPress={() =>
              navigation.navigate('BillForm', {
                bill: {...bill, relativeReminderDates},
              })
            }
          >
            Edit Bill
          </Button>
          <Button
            status={'danger'}
            style={styles.div}
            accessoryLeft={<Icon name="trash-2-outline" />}
            onPress={() => {
              BillService.deleteBill(bill.id || bill.tempID!);
            }}
          >
            Delete Bill
          </Button>
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  main: {
    padding: 16,
    height: '100%',
    justifyContent: 'space-between',
  },
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  column: {
    flexGrow: 1,
    paddingVertical: 16,
    marginVertical: 8,
  },
  contentTitle: {
    marginBottom: 8,
  },
  billContainer: {
    backgroundColor: 'color-success-200',
    borderRadius: 8,
    borderColor: 'color-success-100',
    borderWidth: 1,
  },
  payeeContainer: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'color-warning-100',
    backgroundColor: 'color-warning-200',
  },
  categoryContainer: {
    marginTop: 8,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'color-basic-400',
    backgroundColor: 'color-basic-300',
  },
  div: {
    marginVertical: 16,
  },
  reminderHeader: {
    marginBottom: 8,
  },
  horizontalMargin: {
    marginHorizontal: 12,
  },
  icon: {
    width: 24,
    height: 24,
  },
  row: {
    flexDirection: 'row',
  },
  subheader: {
    color: 'color-basic-700',
  },
  reminderDateContainer: {
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    paddingHorizontal: 16,
    borderColor: 'color-basic-400',
  },
});

export default BillDetailScreen;
