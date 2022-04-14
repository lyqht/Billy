import {Datepicker, Icon} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React from 'react';
import {ImageProps} from 'react-native';
import dayjs from 'dayjs';

interface Props {
  label: string;
  placeholder: string;
  date: Date;
  onSelect: (x: any) => void;
}

export const CustomDatepicker: React.FC<Props> = props => {
  const AccessoryIcon: RenderProp<Partial<ImageProps>> = iconProps => (
    <Icon {...iconProps} name={'calendar'} />
  );

  return (
    <Datepicker
      {...props}
      min={dayjs().toDate()}
      accessoryRight={AccessoryIcon}
    />
  );
};
