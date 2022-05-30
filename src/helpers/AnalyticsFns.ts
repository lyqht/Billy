import {CalendarRange} from '@ui-kitten/components';
import dayjs from 'dayjs';
import {groupBy, sumBy, minBy, uniq, maxBy} from 'lodash';
import {VictoryAxisCommonProps} from 'victory-core';
import {Bill} from '../models/Bill';
import {
  ChartDataPt,
  ChartData,
  ChartDataFilter,
  ChartDataDateRange,
} from '../types/Analytics';
import {BillStatus} from '../types/BillStatus';

export const getFirstBillDate = (bills: Bill[]): dayjs.Dayjs =>
  dayjs(minBy(bills, (bill: Bill) => dayjs(bill.deadline).unix())?.deadline);

export const getLastBillDate = (bills: Bill[]): dayjs.Dayjs =>
  dayjs(maxBy(bills, (bill: Bill) => dayjs(bill.deadline).unix())?.deadline);

export const getPeriodIndexOfBill = (
  billDate: dayjs.Dayjs,
  firstBillDate: dayjs.Dayjs,
  cadendece: dayjs.UnitType = 'months',
) => dayjs(billDate).diff(firstBillDate.startOf('month'), cadendece) + 1;

export const mapBillsToChartDataPts = (bills: Bill[]): ChartDataPt[] =>
  bills.map(bill => ({
    month: getPeriodIndexOfBill(dayjs(bill.deadline), getFirstBillDate(bills)),
    amount: bill.amount!,
    category: bill.category,
    status: bill.completedDate
      ? BillStatus.COMPLETED
      : bill.archivedDate
      ? BillStatus.MISSED
      : BillStatus.UPCOMING,
  }));

export const getBillDateRange = (bills: Bill[]): CalendarRange<Date> => ({
  startDate: getFirstBillDate(bills).startOf('month').toDate(),
  endDate: getLastBillDate(bills).endOf('month').toDate(),
});

const filterDataPoints = (points: ChartDataPt[], filters?: ChartDataFilter) =>
  points.filter(bill => {
    if (filters) {
      let toReturnDataPt = true;
      Object.entries(filters).forEach(([billProperty, acceptedProperties]) => {
        const filterProperty = billProperty as keyof ChartDataFilter;
        const currentBillPropertyValue = bill[filterProperty] as string;
        if (!acceptedProperties.includes(currentBillPropertyValue)) {
          toReturnDataPt = false;
        }
      });

      return toReturnDataPt;
    }
    return true;
  });

export const getBarChartData = (
  points: ChartDataPt[],
  filters?: ChartDataFilter,
): ChartData[] => {
  const billsByMonth: Record<number, ChartDataPt[]> = groupBy(points, 'month');
  const monthsWithBills: number[] = Object.keys(billsByMonth).map(k =>
    parseInt(k, 10),
  );

  const result: ChartData[] = monthsWithBills.map(monthIndex => {
    const dataPoints = billsByMonth[monthIndex];
    const filteredBills = filterDataPoints(dataPoints, filters);

    return {
      month: monthIndex,
      amount: sumBy(filteredBills, 'amount'),
    };
  });

  const highestMonthIndex = Math.max(...monthsWithBills);
  for (let i = 1; i < highestMonthIndex; i++) {
    if (!monthsWithBills.includes(i)) {
      result.push({
        month: i,
        amount: 0,
      });
    }
  }

  return result;
};

export const getAxisProps = (data: ChartDataPt[]): VictoryAxisCommonProps => {
  const tickValues: number[] = uniq(data.map(pt => pt.month));
  const tickFormat: string[] = tickValues.map(value => `month ${value}`);

  return {
    tickValues,
    tickFormat,
  };
};
