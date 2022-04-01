import {Icon, Input} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React from 'react';
import {ImageProps} from 'react-native';

interface Props {
  label: string;
  placeholder: string;
  icon?: string;
  value: string;
  onChangeText: (x: string) => void;
}

export const CustomInput: React.FC<Props> = ({icon, ...props}) => {
  const AccessoryIcon: RenderProp<Partial<ImageProps>> = iconProps => (
    <Icon {...iconProps} name={icon} />
  );

  return <Input {...props} accessoryRight={AccessoryIcon} />;
};
