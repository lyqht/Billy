import {Datepicker, Icon} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React from 'react';
import {ImageProps} from 'react-native';

interface Props {
  label: string;
  placeholder: string;
}

export const CustomDatepicker: React.FC<Props> = props => {
  const AccessoryIcon: RenderProp<Partial<ImageProps>> = iconProps => (
    <Icon {...iconProps} name={'calendar'} />
  );
  const [date, setDate] = React.useState('');

  return (
    <Datepicker
      {...props}
      date={date}
      onSelect={nextDate => setDate(nextDate)}
      accessoryRight={AccessoryIcon}
    />
  );
};
