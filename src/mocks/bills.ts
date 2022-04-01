import dayjs from 'dayjs';
import {Bill} from '../models/Bill';

export const singleBill: Bill[] = [
  {
    payee: 'hehe',
    amount: 121.22,
    deadline: dayjs().toDate(),
    reminder: dayjs().add(1, 'day').toDate(),
    id: '1',
  },
];
export const testAutocompleteItems = [
  {title: 'Star Wars'},
  {title: 'Back to the Future'},
  {title: 'The Matrix'},
  {title: 'Inception'},
  {title: 'Interstellar'},
];
