import {Card, Text} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Bill} from '../models/Bill';

export const BillCard: React.FC<Bill> = ({
  payee,
  amount,
  deadline,
  reminder,
}) => {
  return (
    <Card>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          <Text category={'s1'}>{payee}</Text>
          {reminder ? (
            <Text status={'info'}>
              {dayjs(reminder).format('DD MMM YYYY, h.mma')}
            </Text>
          ) : (
            <Text status={'warning'} category={'p1'}>
              No reminder set yet
            </Text>
          )}
        </View>
        <View style={styles.rightColumn}>
          <Text category={'h4'}>${amount}</Text>
          <Text>Due: {dayjs(deadline).format('DD MMM YYYY')}</Text>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftColumn: {},
  rightColumn: {
    textAlign: 'right',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
  },
});
