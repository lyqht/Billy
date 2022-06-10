import {CheckBox, IndexPath, Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';
import Chart from '../components/Analytics/Chart';
import {CustomDateRangePicker} from '../components/Input/CustomDateRangePicker';
import {
  categoriesForMultiSelect,
  CustomMultiSelect,
  getAllValuesFromIndexPaths,
} from '../components/Input/CustomMultiSelect';
import {useBilly} from '../contexts/useBillyContext';
import {
  getBillDateRange,
  getLastBillDate,
  mapBillsToChartDataPts,
} from '../helpers/AnalyticsFns';
import {getBillsInDateRange} from '../helpers/BillFilter';

const AnalyticsScreen: React.FC = () => {
  const {bills} = useBilly();
  const [loading, setLoading] = useState(true);
  const [selectedRange, setSelectedRange] = useState(getBillDateRange(bills));
  const [showMissedBills, setShowMissedBills] = useState(false);
  const [showUpcomingBills, setShowUpcomingBills] = useState(false);
  const [chartData, setChartData] = useState(mapBillsToChartDataPts(bills));

  const finishLoading = !loading;

  const [selectedCategoryIndexes, setSelectedCategoryIndexes] = React.useState<
    IndexPath[]
  >(
    categoriesForMultiSelect['Default Categories'].map(
      (_, index) => new IndexPath(index, 0),
    ),
  );
  const categoryDisplayValues = getAllValuesFromIndexPaths(
    selectedCategoryIndexes,
    categoriesForMultiSelect,
  );

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
          <Text category={'h4'}>Analytics</Text>
          {finishLoading && (
            <>
              {chartData.length > 0 ? (
                <Chart
                  showMissedBills={showMissedBills}
                  showUpcomingBills={showUpcomingBills}
                  selectedCategories={getAllValuesFromIndexPaths(
                    selectedCategoryIndexes,
                    categoriesForMultiSelect,
                  )}
                  selectedRange={selectedRange}
                  data={chartData}
                />
              ) : (
                <Layout style={styles.placeholderContainer}>
                  <Text category={'h6'}>No data matches the filters 😶‍🌫️</Text>
                  <Text>
                    The latest bill that can be found is on{' '}
                    <Text category={'s1'}>
                      {getLastBillDate(bills).format('DD MMM YYYY')}
                    </Text>
                    .
                  </Text>
                </Layout>
              )}
              <View testID="chart-filters-settings">
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
                <View style={styles.selectContainer}>
                  <CustomDateRangePicker
                    label={'Date Range'}
                    range={selectedRange}
                    onSelect={setSelectedRange}
                  />
                </View>
                <View style={styles.selectContainer}>
                  <CustomMultiSelect
                    label={'Show Categories'}
                    items={categoriesForMultiSelect}
                    selectedIndexes={selectedCategoryIndexes}
                    onSelect={
                      setSelectedCategoryIndexes as (
                        indexPath: IndexPath | IndexPath[],
                      ) => void
                    }
                    value={
                      categoriesForMultiSelect['Default Categories'].length ===
                      selectedCategoryIndexes.length
                        ? 'All Categories'
                        : `${categoryDisplayValues.length} categories selected`
                    }
                  />
                </View>
              </View>
            </>
          )}
          {!loading && bills.length === 0 && (
            <Layout style={styles.placeholderContainer}>
              <Text> No analytics available yet, add some bills first!</Text>
            </Layout>
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
  selectContainer: {
    marginVertical: 8,
  },
  placeholderContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 350,
  },
});

export default AnalyticsScreen;
