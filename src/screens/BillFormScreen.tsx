import {useNavigation} from '@react-navigation/native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {
  Button,
  Icon,
  Layout,
  StyleService,
  Text,
  Tooltip,
  useStyleSheet,
  useTheme,
} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {
  ActivityIndicator,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  View,
} from 'react-native';
import ReminderForm from '../components/BillForm/ReminderForm';
import {CustomAutoComplete} from '../components/Input/CustomAutocomplete';
import CustomDatetimePicker from '../components/Input/CustomDatetimePicker';
import {CustomInput} from '../components/Input/CustomInput';
import {
  defaultCategoryIcons,
  defaultPayees,
  getCategoryForPayee,
} from '../constants/PayeeOptions';
import {getReminderDate} from '../helpers/DateFns';
import {showToast} from '../helpers/Toast';
import {Bill} from '../models/Bill';
import {ReminderFormData} from '../models/Reminder';
import {NavigationProps, RootStackParamList} from '../routes';
import BillService from '../services/BillService';
import NotificationService from '../services/NotificationService';

type Props = NativeStackScreenProps<RootStackParamList, 'BillForm'> & {
  bill?: Bill;
};
interface FormData {
  id?: number;
  tempID?: string;
  payee: string;
  amount: string;
  category: string;
  deadline: Date;
  reminderDates: Date[];
}

interface ReminderWarningTooltipProps {
  index: number;
}

const defaultBill: FormData = {
  payee: '',
  category: '',
  amount: '',
  deadline: dayjs().hour(22).minute(0).toDate(),
  reminderDates: [],
};

const BillFormScreen: React.FC<Props> = ({route}) => {
  const theme = useTheme();
  const styles = useStyleSheet(themedStyles);
  const navigator = useNavigation<NavigationProps>();
  let bill = defaultBill;
  let editMode: boolean = false;
  let reminderDates: ReminderFormData[] = [];

  if (route.params && route.params.bill !== undefined) {
    editMode = true;
    const {payee, category, amount, deadline, id, tempID} = route.params.bill;
    bill = {
      ...bill,
      id,
      tempID,
      payee,
      category: category ?? '',
      deadline: dayjs(deadline).local().toDate(),
      amount: `${amount}`,
    };

    reminderDates = route.params.bill.relativeReminderDates;
  }

  const [showReminderForm, setShowReminderForm] = useState(false);
  const [relativeReminderDates, setRelativeReminderDates] =
    useState(reminderDates);
  const [showWarningTooltips, setShowWarningTooltips] = useState<boolean[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: {errors},
    getValues,
    setValue,
    watch,
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      payee: bill.payee,
      category: bill.category,
      amount: bill.amount,
      deadline: bill.deadline,
    },
  });

  const currentPayee = watch('payee');
  const currentDeadline = watch('deadline');

  useEffect(() => {
    // according to react-hook-form's video here: https://www.youtube.com/watch?v=3qLd69WMqKk
    // watch is not intended to be used like this, but it does work so i'm leaving it LOL
    if (defaultPayees.includes(currentPayee) && !editMode) {
      setValue('category', getCategoryForPayee(currentPayee));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPayee]);

  useEffect(() => {
    const hasWarnings = Array(relativeReminderDates.length).fill(false);
    setShowWarningTooltips(hasWarnings);
  }, [currentDeadline, relativeReminderDates]);

  const onSubmit = async () => {
    setLoading(true);
    const {amount, deadline, payee} = getValues();
    const billToSubmit: Partial<Bill> = {
      tempID: bill.tempID,
      id: bill.id,
      deadline: deadline.toISOString(),
      amount: parseFloat(amount),
      category: getValues().category,
      payee: getValues().payee,
    };

    const {id, ...toastParams} = editMode
      ? await BillService.editBill(billToSubmit)
      : await BillService.addBill(billToSubmit);
    const billID = `${id}`;

    if (toastParams.type !== 'error') {
      const notifPromises: Promise<void>[] = [];
      if (editMode) {
        await NotificationService.deleteNotificationsForBill(billID);
      }

      relativeReminderDates.forEach(({value, timeUnit}) => {
        const reminderDate = getReminderDate(deadline, value, timeUnit);

        if (dayjs(reminderDate).isAfter(dayjs())) {
          notifPromises.push(
            NotificationService.createPendingBillNotification({
              billID,
              payee,
              deadline: deadline.toISOString(),
              value,
              timeUnit,
              reminderDate: reminderDate.toISOString(),
            }),
          );
        }
      });

      try {
        await Promise.all(notifPromises);
        showToast(toastParams);
        navigator.goBack();
      } catch (err) {
        console.error(err);
        showToast({
          type: 'error',
          text1: 'Failed to create notifications 😥',
          text2: 'Check if any of the notification dates are in the past.',
        });
      } finally {
        setLoading(false);
      }
    }
  };

  const onReminderFormSubmit = ({value, timeUnit}: ReminderFormData) => {
    const updatedDates = [...relativeReminderDates, {value, timeUnit}];
    setRelativeReminderDates(updatedDates);

    setShowReminderForm(false);
  };

  const ReminderWarningTooltip: React.FC<ReminderWarningTooltipProps> = ({
    index,
  }) => (
    <Tooltip
      placement={'top'}
      visible={showWarningTooltips[index]}
      onBackdropPress={() => {
        const newWarnings = [...showWarningTooltips];
        newWarnings.splice(index, 0, false);
        setShowWarningTooltips(newWarnings);
      }}
      anchor={() => (
        <TouchableOpacity
          onPress={() => {
            const newWarnings = [...showWarningTooltips];
            newWarnings.splice(index, 0, true);
            setShowWarningTooltips(newWarnings);
          }}
        >
          <Icon
            name="alert-triangle"
            fill={theme['color-danger-600']}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}
    >
      This reminder date will not be created as it is in the past.
    </Tooltip>
  );

  return (
    <SafeAreaView>
      <Layout style={styles.container}>
        <ScrollView>
          <Text category="h2">
            {bill.id || bill.tempID ? 'Edit Bill' : 'New Bill'}
          </Text>
          <View style={styles.formField}>
            <Controller
              name="payee"
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <CustomAutoComplete
                  label="Payee"
                  placeholder="Choose a payee"
                  icon="person-outline"
                  value={value}
                  options={defaultPayees}
                  onChange={onChange}
                />
              )}
            />
            {errors.payee && (
              <Text category={'label'} status="warning">
                This field is required
              </Text>
            )}
          </View>
          <View style={styles.formField}>
            <Controller
              name="category"
              control={control}
              render={({field: {onChange, value}}) => (
                <CustomAutoComplete
                  label="Category"
                  placeholder="Choose a category"
                  icon="hash-outline"
                  value={value}
                  options={Object.keys(defaultCategoryIcons)}
                  onChange={onChange}
                />
              )}
            />
          </View>
          <View style={styles.formField}>
            <Controller
              name="amount"
              control={control}
              rules={{
                required: true,
              }}
              render={({field: {onChange, value}}) => (
                <CustomInput
                  label="Amount"
                  placeholder="Enter an amount"
                  icon="pricetags-outline"
                  onChangeText={onChange}
                  value={value}
                  keyboardType="number-pad"
                />
              )}
            />
            {errors.amount && (
              <Text category={'label'} status="warning">
                This field is required
              </Text>
            )}
          </View>
          <View style={styles.formField}>
            <Controller
              name="deadline"
              control={control}
              rules={{
                required: true,
                validate: value => dayjs(value).isValid(),
              }}
              render={({field: {onChange, value}}) => (
                <CustomDatetimePicker value={value} onChange={onChange} />
              )}
            />
          </View>
          <View style={styles.reminderSection}>
            <View>
              <Text
                category={'label'}
                style={[
                  styles.reminderHeader,
                  {color: theme['color-basic-600']},
                ]}
              >
                Reminders ({relativeReminderDates.length})
              </Text>
              {relativeReminderDates.map(({value, timeUnit}, index) => (
                <View
                  key={`reminder-date-section-${index}`}
                  style={styles.reminderDateContainer}
                >
                  <View style={styles.row}>
                    {!dayjs(
                      getReminderDate(currentDeadline, value, timeUnit),
                    ).isAfter(dayjs()) && (
                      <ReminderWarningTooltip index={index} />
                    )}
                    <Text category={'p1'}>
                      {value}{' '}
                      {parseInt(value, 10) === 1
                        ? timeUnit.replace('s', '')
                        : timeUnit}{' '}
                      before deadline
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      const newReminders = [...relativeReminderDates];
                      newReminders.splice(index, 1);
                      setRelativeReminderDates(newReminders);
                    }}
                  >
                    <Icon
                      name="close-outline"
                      fill={theme['color-basic-600']}
                      style={styles.cancelIcon}
                    />
                  </TouchableOpacity>
                </View>
              ))}
            </View>
            {showReminderForm ? (
              <ReminderForm
                currentDeadline={currentDeadline}
                onSubmit={onReminderFormSubmit}
              />
            ) : (
              <Button
                size={'small'}
                appearance={'outline'}
                onPress={() => setShowReminderForm(true)}
                accessoryLeft={props => <Icon {...props} name="bell-outline" />}
              >
                Add a reminder
              </Button>
            )}
          </View>

          <Button
            style={styles.reminderSection}
            size="medium"
            disabled={loading}
            onPress={handleSubmit(onSubmit)}
          >
            {loading ? <ActivityIndicator color={'#5C940D'} /> : 'Submit'}
          </Button>
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

const themedStyles = StyleService.create({
  container: {
    padding: 16,
    height: '100%',
    justifyContent: 'space-between',
  },
  formField: {
    paddingVertical: 16,
  },
  reminderSection: {
    marginVertical: 16,
  },
  reminderHeader: {
    marginBottom: 8,
  },
  icon: {
    width: 16,
    height: 16,
    marginEnd: 4,
  },
  cancelIcon: {
    width: 28,
    height: 28,
  },
  row: {
    flexDirection: 'row',
  },
  reminderDateContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 4,
    padding: 8,
    paddingHorizontal: 16,
    borderColor: 'color-basic-400',
  },
});

export default BillFormScreen;
