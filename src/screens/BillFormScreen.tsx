import {Button, Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {CustomAutoComplete} from '../components/BillForm/CustomAutocomplete';
import {CustomDatepicker} from '../components/BillForm/CustomDatePicker';
import {CustomInput} from '../components/BillForm/CustomInput';
import {Bill} from '../models/Bill';

interface Props {
  bill?: Bill;
}

const BillFormScreen: React.FC<Props> = () => {
  return (
    <SafeAreaView>
      <Layout style={styles.container}>
        <View>
          <Text category="h2">New Bill</Text>
          <View style={styles.formField}>
            <CustomAutoComplete
              label="Payee"
              placeholder="Choose a payee"
              icon="person-outline"
            />
          </View>
          <View style={styles.formField}>
            <CustomInput
              label="Amount"
              placeholder="Enter an amount"
              icon="pricetags-outline"
            />
          </View>
          <View style={styles.formField}>
            <CustomAutoComplete
              label="Category"
              placeholder="Choose a category"
              icon="hash-outline"
            />
          </View>

          <View style={styles.formField}>
            <CustomDatepicker label="Deadline" placeholder="Choose a date" />
          </View>
        </View>
        <Button size="medium">Submit</Button>
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
