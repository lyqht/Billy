import {Layout, Text} from '@ui-kitten/components';
import React, {FC} from 'react';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryTheme,
} from 'victory-native';
import {getAxisProps, getBarChartData} from '../../helpers/AnalyticsFns';
import {ChartData, ChartDataFilter, ChartDataPt} from '../../types/Analytics';
import {BillStatus} from '../../types/BillStatus';
import {StyleSheet} from 'react-native';

interface ChartProps {
  data: ChartDataPt[];
  selectedCategories?: string[];
  showMissedBills?: boolean;
  showUpcomingBills?: boolean;
}

interface ChartStackProps {
  firstBarData?: ChartData[];
  secondBarData?: ChartData[];
  thirdBarData?: ChartData[];
}

const Chart: FC<ChartProps> = ({
  data,
  selectedCategories = [],
  showMissedBills = false,
  showUpcomingBills = false,
}) => {
  const baseFilters: ChartDataFilter = {
    status: [BillStatus.COMPLETED],
    category: selectedCategories,
  };

  const completedBills = getBarChartData(data, baseFilters);
  const placeholderDataPoints = completedBills.map(b => ({
    ...b,
    amount: 0,
  }));
  const axisProps = getAxisProps(data);

  // Due to how Victory Native works, we cannot dynamically re-rerender
  // only the children VictoryStack components.
  // Hence we have this ChartStackComponent that will rerender every time
  // any of its bar data changes due to the filters that user select.

  // If this ChartStackComponent is outside of Chart,
  // it will also cause SVG rendering issues. Hence leaving it here for now.
  // This issue can be looked into later.

  const ChartStackComponent: React.FC<ChartStackProps> = ({
    firstBarData,
    secondBarData,
    thirdBarData,
  }) => (
    <VictoryChart domainPadding={24} theme={VictoryTheme.material}>
      <VictoryAxis {...axisProps} />
      <VictoryAxis dependentAxis tickFormat={x => `$${x}`} />
      <VictoryStack colorScale={['#D8F5A2', '#F97316', 'grey']}>
        <VictoryBar data={firstBarData} x="month" y="amount" />
        {secondBarData && (
          <VictoryBar data={secondBarData} x="month" y="amount" />
        )}
        {thirdBarData && (
          <VictoryBar data={thirdBarData} x="month" y="amount" />
        )}
      </VictoryStack>
    </VictoryChart>
  );

  const chartStackProps = {
    firstBarData: completedBills,
    secondBarData: showMissedBills
      ? getBarChartData(data, {
          ...baseFilters,
          status: [BillStatus.MISSED],
        })
      : placeholderDataPoints,
    thirdBarData: showUpcomingBills
      ? getBarChartData(data, {
          ...baseFilters,
          status: [BillStatus.UPCOMING],
        })
      : placeholderDataPoints,
  };

  const notDisplayingData =
    Object.values(chartStackProps).filter(
      b => b.filter(item => item.amount === 0).length === b.length,
    ).length === Object.values(chartStackProps).length;

  return notDisplayingData ? (
    <Layout level={'3'} style={styles.placeholderContainer}>
      <Text>No data matches the filters</Text>
    </Layout>
  ) : (
    <ChartStackComponent {...chartStackProps} />
  );
};

const styles = StyleSheet.create({
  placeholderContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    height: 350,
  },
});

export default Chart;
