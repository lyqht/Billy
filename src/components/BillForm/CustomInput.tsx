import {Icon, Input} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React, {useState} from 'react';
import {ImageProps, TouchableWithoutFeedback} from 'react-native';

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (x: string) => void;
  icon?: string;
  inputSecure?: boolean;
}

export const CustomInput: React.FC<Props> = ({
  icon,
  inputSecure = false,
  ...props
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(inputSecure);
  const AccessoryIcon: RenderProp<Partial<ImageProps>> = iconProps =>
    inputSecure ? (
      <TouchableWithoutFeedback
        onPress={() => setSecureTextEntry(!secureTextEntry)}>
        <Icon {...iconProps} name={secureTextEntry ? 'eye-off' : 'eye'} />
      </TouchableWithoutFeedback>
    ) : (
      <Icon {...iconProps} name={icon} />
    );

  const inputProps = {...props, secureTextEntry};
  return <Input {...inputProps} accessoryRight={AccessoryIcon} />;
};
