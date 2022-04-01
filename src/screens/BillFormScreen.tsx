import {Button, Layout, Text} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import 'react-native-get-random-values';
import {CustomAutoComplete} from '../components/BillForm/CustomAutocomplete';
import {CustomDatepicker} from '../components/BillForm/CustomDatePicker';
import {CustomInput} from '../components/BillForm/CustomInput';
import {Bill} from '../models/Bill';
import BillService from '../services/BillService';
import Toast from 'react-native-toast-message';
import {ToastShowParams} from 'react-native-toast-message';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../routes';
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
  } = useForm<FormData>({
    mode: 'onBlur',
    defaultValues: {
      payee: '',
      category: '',
      amount: '',
      deadline: dayjs().toDate(),
    },
  });

  const onSubmit = async () => {
    console.log('Submitting form');
    const bill: Bill = {
      ...getValues(),
      amount: parseInt(getValues().amount),
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
                  onChange={onChange}
                />
              )}
            />
            {errors.payee && (
              <Text category={'label'}>This field is required</Text>
            )}
          </View>
          <View style={styles.formField}>
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
            </View>
            {errors.amount && (
              <Text category={'label'}>This field is required</Text>
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
                  onChange={onChange}
                />
              )}
            />
          </View>

          <View style={styles.formField}>
            <Controller
              name="deadline"
              control={control}
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
          {errors.deadline && (
            <Text category={'label'}>This field is required</Text>
          )}
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
