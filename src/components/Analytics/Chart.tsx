import {CalendarRange} from '@ui-kitten/components';
import React, {FC} from 'react';
import {VictoryAxisCommonProps} from 'victory-core';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryTheme,
} from 'victory-native';
import {
  dataPointsArePlaceholder as dataPointsHasAmount,
  getAxisProps,
  getBarChartData,
} from '../../helpers/AnalyticsFns';
import {ChartData, ChartDataFilter, ChartDataPt} from '../../types/Analytics';
import {BillStatus} from '../../types/BillStatus';
import NoChartDataPlaceholder from './NoChartDataPlaceholder';

interface ChartProps {
  data: ChartDataPt[];
  selectedCategories?: string[];
  selectedRange: CalendarRange<Date>;
  showMissedBills?: boolean;
  showUpcomingBills?: boolean;
  latestBillDate?: string;
}

interface ChartStackProps {
  firstBarData: ChartData[];
  secondBarData: ChartData[];
  thirdBarData: ChartData[];
  axisProps: VictoryAxisCommonProps;
}

/* Due to how Victory Native works, we cannot dynamically re-rerender
    only the children VictoryStack components.
    Hence we have this ChartStack component that will rerender every time
    any of its bar data changes due to the filters that user select.
*/

const barStyleProps = {
  animate: {
    onLoad: {duration: 1000},
    onExit: {duration: 1000},
  },
  barWidth: 50,
  cornerRadius: 8,
  labels: ({datum}: {datum: ChartDataPt}) =>
    `${datum.amount > 0 ? Math.round(datum.amount) : ''}`, // rounding is necessary here otherwise there will be a value flickering animation
};

const ChartStack: React.FC<ChartStackProps> = ({
  firstBarData,
  secondBarData,
  thirdBarData,
  axisProps,
}) => {
  // this logic is so that only the exterior bar gets the corner radius
  let firstBarStyleProps: Record<string, any> = {...barStyleProps};
  let secondBarStyleProps: Record<string, any> = {...barStyleProps};

  if (!dataPointsHasAmount(thirdBarData)) {
    delete secondBarStyleProps.cornerRadius;
    delete firstBarStyleProps.cornerRadius;
  }

  if (!dataPointsHasAmount(secondBarData)) {
    delete firstBarStyleProps.cornerRadius;
  }

  return (
    <VictoryChart domainPadding={24} theme={VictoryTheme.material}>
      <VictoryAxis {...axisProps} />
      <VictoryAxis dependentAxis tickFormat={x => `$${x}`} />
      <VictoryStack colorScale={['#D8F5A2', '#F97316', 'grey']}>
        <VictoryBar
          data={firstBarData}
          x="month"
          y="amount"
          {...firstBarStyleProps}
        />
        {secondBarData && (
          <VictoryBar
            data={secondBarData}
            x="month"
            y="amount"
            {...secondBarStyleProps}
          />
        )}
        {thirdBarData && (
          <VictoryBar
            data={thirdBarData}
            x="month"
            y="amount"
            {...barStyleProps}
          />
        )}
      </VictoryStack>
    </VictoryChart>
  );
};

const Chart: FC<ChartProps> = ({
  data,
  selectedCategories = [],
  selectedRange,
  showMissedBills = false,
  showUpcomingBills = false,
  latestBillDate,
}) => {
  const baseFilters: ChartDataFilter = {
    status: [BillStatus.COMPLETED],
    category: selectedCategories,
  };

  const completedBills = getBarChartData(data, baseFilters);
  const placeholderDataPoints = completedBills.map(b => ({
    month: b.month,
    amount: 0,
  }));

  const barData = {
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
  const chartStackProps = {
    axisProps: getAxisProps(data, selectedRange),
    ...barData,
  };

  const notDisplayingData =
    Object.values(barData).filter(b => dataPointsHasAmount(b)).length ===
    Object.values(barData).length;

  return notDisplayingData ? (
    <NoChartDataPlaceholder latestBillDate={latestBillDate} />
  ) : (
    <ChartStack {...chartStackProps} />
  );
};

export default Chart;
