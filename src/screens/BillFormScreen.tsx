import {useNavigation} from '@react-navigation/native';
import {Button, Layout, Text} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Toast, {ToastShowParams} from 'react-native-toast-message';
import {CustomAutoComplete} from '../components/BillForm/CustomAutocomplete';
import {CustomDatepicker} from '../components/BillForm/CustomDatePicker';
import {CustomInput} from '../components/BillForm/CustomInput';
import {
  defaultCategoryIcons,
  defaultPayees,
  getCategoryForPayee,
} from '../constants/PayeeOptions';
import {Bill} from '../models/Bill';
import {NavigationProps} from '../routes';
import BillService from '../services/BillService';
interface Props {
  bill?: Bill;
}
interface FormData {
  payee: string;
  amount: string;
  category: string;
  deadline: Date;
}

const showToast = (toastParams: ToastShowParams) => {
  Toast.show({...toastParams, position: 'bottom'});
};

const BillFormScreen: React.FC<Props> = () => {
  const navigator = useNavigation<NavigationProps>();
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
      payee: '',
      category: '',
      amount: '',
      deadline: dayjs().toDate(),
    },
  });

  const payee = watch('payee');

  useEffect(() => {
    // according to react-hook-form's video here: https://www.youtube.com/watch?v=3qLd69WMqKk
    // watch is not intended to be used like this, but it does work so i'm leaving it LOL
    if (defaultPayees.includes(payee)) {
      setValue('category', getCategoryForPayee(payee));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [payee]);

  const onSubmit = async () => {
    console.log('Submitting form');
    const bill: Partial<Bill> = {
      ...getValues(),
      deadline: getValues().deadline.toDateString(),
      amount: parseFloat(getValues().amount),
    };

    const toastParams = await BillService.addBill(bill);
    showToast(toastParams);
    navigator.goBack();
  };

  return (
    <SafeAreaView>
      <Layout style={styles.container}>
        <View>
          <Text category="h2">New Bill</Text>
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
              }}
              render={({field: {onChange, value}}) => (
                <CustomDatepicker
                  label="Deadline"
                  placeholder="Choose a date"
                  date={value}
                  onSelect={onChange}
                />
              )}
            />
          </View>
        </View>
        <Button size="medium" onPress={handleSubmit(onSubmit)}>
          Submit
        </Button>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: '100%',
    justifyContent: 'space-between',
  },
  formField: {
    paddingVertical: 16,
  },
});

export default BillFormScreen;
