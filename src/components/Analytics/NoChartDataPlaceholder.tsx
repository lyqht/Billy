import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet} from 'react-native';

const NoChartDataPlaceholder: React.FC<{
  latestBillDate?: string;
}> = ({latestBillDate}) => (
  <Layout style={styles.placeholderContainer}>
    <Text category={'h6'}>No data matches the filters 😶‍🌫️</Text>
    {latestBillDate ? (
      <Text>
        The latest bill that can be found is on{' '}
        <Text category={'s1'}>{latestBillDate}</Text>
      </Text>
    ) : (
      <Text>You have not added any bills yet with Billy!</Text>
    )}
  </Layout>
);

const styles = StyleSheet.create({
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 350,
  },
});

export default NoChartDataPlaceholder;
