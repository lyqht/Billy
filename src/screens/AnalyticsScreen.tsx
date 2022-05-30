import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet} from 'react-native';
import Chart from '../components/Analytics/Chart';
import {useBilly} from '../contexts/useBillyContext';
import {mapBillsToChartDataPts} from '../helpers/AnalyticsFns';

const AnalyticsScreen: React.FC = () => {
  const {bills} = useBilly();
  const chartData = mapBillsToChartDataPts(bills);

  return (
    <SafeAreaView>
      <Layout style={styles.layoutContainer}>
        <ScrollView>
          <Text category={'h4'}>Summary Report</Text>
          {chartData.length > 0 ? (
            <Chart showMissedBills={true} data={chartData} />
          ) : (
            <Text category={'p1'}>Loading...</Text>
          )}
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    padding: 16,
    height: '100%',
    flexDirection: 'column',
  },
});

export default AnalyticsScreen;
