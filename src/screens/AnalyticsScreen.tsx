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
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(getBillDateRange(bills));
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [showMissedBills, setShowMissedBills] = useState(false);
  const [showUpcomingBills, setShowUpcomingBills] = useState(false);
  const [chartData, setChartData] = useState(mapBillsToChartDataPts(bills));
  const finishLoading = !loading;

  useEffect(() => {
    const {startDate, endDate} = selectedRange;
    if (startDate && endDate) {
      const billsInNewDateRange = getBillsInDateRange(
        bills,
        startDate,
        endDate,
      );
      if (billsInNewDateRange.length === 0) {
        setChartData([]);
      } else {
        setChartData(mapBillsToChartDataPts(billsInNewDateRange));
      }
    }
  }, [selectedRange, bills]);

  useEffect(() => {
    if (bills.length > 0) {
      setSelectedRange(getBillDateRange(bills));
      setLoading(false);
    }
  }, [bills]);

  return (
    <SafeAreaView>
      <Layout style={styles.layoutContainer}>
        <ScrollView>
          <Text category={'h4'}>Summary Report</Text>
          {finishLoading && (
            <>
              <View testID="chart-filters-settings">
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
              </View>
              {chartData.length > 0 ? (
                <Chart
                  showMissedBills={showMissedBills}
                  showUpcomingBills={showUpcomingBills}
                  selectedCategories={selectedCategories}
                  data={chartData}
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Text>No bills found in this period.</Text>
                </View>
              )}
            </>
          )}
          {!loading && bills.length === 0 && (
            <View style={styles.placeholderContainer}>
              <Text> No analytics available yet, add some bills first!</Text>
            </View>
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
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 24,
  },
});

export default AnalyticsScreen;
