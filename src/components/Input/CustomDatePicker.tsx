import {Datepicker} from '@ui-kitten/components';
import React from 'react';

interface Props {
  label?: string;
  min?: Date;
  max?: Date;
  placeholder?: string;
  date: Date;
  onSelect: (x: any) => void;
}

export const CustomDatepicker: React.FC<Props> = props => {
  return <Datepicker {...props} />;
};
