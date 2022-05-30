import React, {FC} from 'react';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryTheme,
} from 'victory-native';
import {getAxisProps, getBarChartData} from '../../helpers/AnalyticsFns';
import {ChartDataFilter, ChartDataPt} from '../../types/Analytics';
import {BillStatus} from '../../types/BillStatus';

interface ChartProps {
  data: ChartDataPt[];
  selectedCategories?: string[];
  showMissedBills?: boolean;
}

const Chart: FC<ChartProps> = ({
  data,
  selectedCategories = [],
  showMissedBills = false,
}) => {
  const baseFilters: ChartDataFilter = {
    status: [BillStatus.COMPLETED],
    ...(selectedCategories.length > 0 && {category: selectedCategories}),
  };

  const completedBills = getBarChartData(data, baseFilters);
  const axisProps = getAxisProps(data);

  return (
    <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
      <VictoryAxis {...axisProps} />
      <VictoryAxis dependentAxis tickFormat={x => `$${x}`} />
      <VictoryStack colorScale={['#D8F5A2', '#F97316', 'grey']}>
        <VictoryBar data={completedBills} x="month" y="amount" />
        {showMissedBills && (
          <VictoryBar
            data={getBarChartData(data, {
              ...baseFilters,
              status: [BillStatus.MISSED],
            })}
            x="month"
            y="amount"
          />
        )}
      </VictoryStack>
    </VictoryChart>
  );
};

export default Chart;
