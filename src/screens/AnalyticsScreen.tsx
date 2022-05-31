import {CheckBox, Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Chart from '../components/Analytics/Chart';
import {CustomDateRangePicker} from '../components/BillForm/CustomDateRangePicker';
import {useBilly} from '../contexts/useBillyContext';
import {
  getBillDateRange,
  mapBillsToChartDataPts,
} from '../helpers/AnalyticsFns';
import {getBillsInDateRange} from '../helpers/BillFilter';

const AnalyticsScreen: React.FC = () => {
  const {bills} = useBilly();
  const range = getBillDateRange(bills);
  const [selectedRange, setSelectedRange] = useState(range);
  const [showMissedBills, setShowMissedBills] = useState(false);
  const [showUpcomingBills, setShowUpcomingBills] = useState(false);
  const [chartData, setChartData] = useState(mapBillsToChartDataPts(bills));

  useEffect(() => {
    if (selectedRange.startDate && selectedRange.endDate) {
      const billsInNewDateRange = getBillsInDateRange(
        bills,
        selectedRange.startDate,
        selectedRange.endDate,
      );

      setChartData(mapBillsToChartDataPts(billsInNewDateRange));
    }
  }, [selectedRange, bills]);

  return (
    <SafeAreaView>
      <Layout style={styles.layoutContainer}>
        <ScrollView>
          <Text category={'h4'}>Summary Report</Text>
          <View style={styles.inputContainer}>
            <CustomDateRangePicker
              label={'Date Range'}
              range={selectedRange}
              onSelect={setSelectedRange}
            />
          </View>
          <View style={styles.inputContainer}>
            <CheckBox
              checked={showMissedBills}
              onChange={nextChecked => setShowMissedBills(nextChecked)}
            >
              Show Missed Bills
            </CheckBox>
            <CheckBox
              checked={showUpcomingBills}
              onChange={nextChecked => setShowUpcomingBills(nextChecked)}
            >
              Show Upcoming Bills
            </CheckBox>
          </View>
          {chartData.length > 0 ? (
            <Chart
              showMissedBills={showMissedBills}
              showUpcomingBills={showUpcomingBills}
              data={chartData}
            />
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
  inputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
});

export default AnalyticsScreen;
