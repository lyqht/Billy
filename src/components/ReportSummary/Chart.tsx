import React, {FC} from 'react';
import {
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryStack,
  VictoryTheme,
} from 'victory-native';
import {BillStatus} from '../../types/BillStatus';

// const upcomingBills = [
//   {month: 1, amount: 100},
//   {month: 2, amount: 200},
//   {month: 3, amount: 300},
//   {month: 4, amount: 400},
// ];

// const missedBills = [
//   {month: 1, amount: 0},
//   {month: 2, amount: 0},
//   {month: 3, amount: 0},
//   {month: 4, amount: 100},
// ];

interface ChartDataObj {
  month: string;
  amount: number;
  status: BillStatus;
  category: string;
}

interface ChartProps {
  data: ChartDataObj[];
  selectedCategories?: string[];
  showUpcomingBills?: boolean;
}

const Chart: FC<ChartProps> = ({
  data,
  selectedCategories,
  showUpcomingBills = false,
}) => {
  const filteredData = selectedCategories
    ? data.filter(obj => selectedCategories.includes(obj.category))
    : data;

  const completedBills = filteredData.filter(
    obj => obj.status === BillStatus.COMPLETED,
  );
  const missedBills = filteredData.filter(
    obj => obj.status === BillStatus.MISSED,
  );
  const upcomingBills = filteredData.filter(
    obj => obj.status === BillStatus.UPCOMING,
  );

  return (
    <VictoryChart domainPadding={20} theme={VictoryTheme.material}>
      <VictoryAxis
        tickValues={[1, 2, 3, 4]}
        tickFormat={['month 1', 'month 2', 'month 3', 'month 4']}
      />
      <VictoryAxis dependentAxis tickFormat={x => `$${x}`} />
      <VictoryStack colorScale={['#D8F5A2', '#F97316', 'grey']}>
        <VictoryBar data={completedBills} x="month" y="amount" />
        <VictoryBar data={missedBills} x="month" y="amount" />
        <VictoryBar data={upcomingBills} x="month" y="amount" />
      </VictoryStack>
    </VictoryChart>
  );
};

export default Chart;
