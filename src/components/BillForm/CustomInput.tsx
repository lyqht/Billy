import {Icon, Input} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React, {useState} from 'react';
import {ImageProps} from 'react-native';

interface Props {
  label: string;
  placeholder: string;
  icon?: string;
}

export const CustomInput: React.FC<Props> = ({icon, ...props}) => {
  const [value, setValue] = useState('');
  const AccessoryIcon: RenderProp<Partial<ImageProps>> = iconProps => (
    <Icon {...iconProps} name={icon} />
  );

  return (
    <Input
      {...props}
      value={value}
      onChangeText={nextValue => setValue(nextValue)}
      accessoryRight={AccessoryIcon}
    />
  );
};
