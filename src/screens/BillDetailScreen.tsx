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
import {DeleteBillButton} from '../components/ModalButtons/DeleteBillButton';
import {
  defaultCategories,
  defaultCategoryIcons,
} from '../constants/PayeeOptions';
import {ReminderFormData} from '../models/Reminder';
import {NavigationProps, RootStackParamList} from '../routes';
import NotificationService from '../services/NotificationService';
import {Category} from '../types/AutocompleteOption';
import Colors from '../constants/customColors';
import BillService from '../services/BillService';
import {Bill} from '../models/Bill';

type BillDetailsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'BillDetails'
>;

const BillDetailScreen: React.FC<BillDetailsScreenProps> = ({route}) => {
  const {bill: passedBill} = route.params;
  const theme = useTheme();
  const styles = useStyleSheet(themedStyles);
  const navigation = useNavigation<NavigationProps>();
  const [bill, setBill] = useState<Bill>(passedBill);
  const [relativeReminderDates, setRelativeReminderDates] = useState<
    ReminderFormData[]
  >([]);

  useFocusEffect(
    useCallback(() => {
      const getNotifs = async () => {
        const retrievedBill = (await BillService.getBills()).find(b =>
          passedBill.id
            ? b.id === passedBill.id
            : b.tempID === passedBill.tempID,
        )!;
        setBill(retrievedBill);
        setRelativeReminderDates(
          await NotificationService.getRelativeReminderNotificationDatesForBill(
            `${retrievedBill.id ?? retrievedBill.tempID}`,
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
          <Layout
            style={[
              styles.div,
              styles.center,
              styles.row,
              styles.billDetailsContainer,
            ]}
          >
            <Layout
              testID={'bill-container'}
              style={[styles.center, styles.column, styles.billContainer]}
            >
              <Text
                category={'h4'}
                style={styles.contentTitle}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
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
              fill={theme['color-basic-700']}
            />
            <Layout
              testID="payee-container"
              style={[styles.center, styles.column, styles.payeeContainer]}
            >
              <Text
                category={'h6'}
                style={styles.contentTitle}
                numberOfLines={2}
                adjustsFontSizeToFit
              >
                {bill.payee}
              </Text>
              {bill.category ? (
                <Layout
                  style={[
                    styles.row,
                    styles.center,
                    styles.categoryContainer,
                    defaultCategories.includes(bill.category)
                      ? {paddingLeft: 14, paddingRight: 4}
                      : {},
                  ]}
                >
                  <Text
                    category={'s1'}
                    style={{color: theme['color-basic-700']}}
                    numberOfLines={1}
                    adjustsFontSizeToFit
                  >
                    {bill.category}
                  </Text>
                  {defaultCategories.includes(bill.category) && (
                    <Icon
                      name={defaultCategoryIcons[bill.category as Category]}
                      style={[styles.icon]}
                      fill={theme['color-basic-700']}
                    />
                  )}
                </Layout>
              ) : null}
            </Layout>
          </Layout>
          {bill.completedDate && <Text>Completed on {bill.completedDate}</Text>}
          {bill.archivedDate && <Text>Archived on {bill.archivedDate}</Text>}
          {relativeReminderDates.length > 0 ? (
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
          ) : (
            <>
              <Text category={'p1'} style={[styles.div, styles.subheader]}>
                You have no reminders set for this bill.
              </Text>
              <Text category={'p2'}>To add reminders, edit your bill.</Text>
            </>
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
            Edit bill
          </Button>
          <DeleteBillButton bill={bill} />
        </Layout>
      </Layout>
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  main: {
    padding: 16,
    height: '100%',
    width: '100%',
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
  billDetailsContainer: {
    maxWidth: '100%',
    maxHeight: 125,
  },
  contentTitle: {
    marginBottom: 8,
    flexShrink: 1,
  },
  billContainer: {
    backgroundColor: Colors.lightGreen,
    borderColor: Colors.darkGreen,
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    height: '100%',
    width: '40%',
  },
  payeeContainer: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'color-warning-500',
    backgroundColor: '#ffecb8',
    height: '100%',
    width: '40%',
  },
  categoryContainer: {
    marginTop: 6,
    paddingVertical: 2,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#ffb459',
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
