import {Bill} from '../models/Bill';
import dayjs from 'dayjs';

export const getUnsyncBills = (bills: Bill[]): Bill[] => {
  return bills.filter(
    bill =>
      (bill.tempID !== undefined || bill.tempID !== null) &&
      (bill.id === undefined || bill.id === null),
  );
};

export const getUpcomingBills = (
  bills: Bill[],
  sortByCompleted = true,
): Bill[] => {
  const billsSortedByDeadline = bills
    .filter(a => dayjs(a.deadline).isSameOrAfter(dayjs(), 'day'))
    .sort((a, b) => (dayjs(a.deadline).isAfter(b.deadline) ? 1 : -1));

  if (sortByCompleted) {
    const completedBills = billsSortedByDeadline.filter(a => a.completedDate);
    const uncompletedBills = billsSortedByDeadline.filter(
      a => a.completedDate === undefined || a.completedDate === null,
    );

    return [...uncompletedBills, ...completedBills];
  }

  return billsSortedByDeadline;
};

export const getMissedBills = (bills: Bill[]) => {
  return bills
    .filter(
      bill =>
        (bill.completedDate === null || bill.completedDate === undefined) &&
        (bill.archivedDate === null || bill.archivedDate === undefined) &&
        dayjs(bill.deadline).isBefore(dayjs(), 'day'),
    )
    .sort((a, b) => (dayjs(a.deadline).isAfter(b.deadline) ? 1 : -1));
};

export const getBillsInDateRange = (
  bills: Bill[],
  startDate: Date,
  endDate: Date,
) =>
  bills.filter(
    bill =>
      dayjs(bill.deadline).isSameOrAfter(startDate) &&
      dayjs(bill.deadline).isSameOrBefore(endDate),
  );
