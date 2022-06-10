import {CalendarRange, RangeDatepicker} from '@ui-kitten/components';
import React from 'react';

interface Props {
  label?: string;
  min?: Date;
  max?: Date;
  placeholder?: string;
  range: CalendarRange<Date>;
  onSelect: (x: {}) => void;
}

export const CustomDateRangePicker: React.FC<Props> = props => {
  return <RangeDatepicker {...props} />;
};
