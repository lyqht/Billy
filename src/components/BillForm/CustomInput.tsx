import {Icon, Input} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React, {useState} from 'react';
import {
  ImageProps,
  KeyboardTypeOptions,
  TouchableWithoutFeedback,
} from 'react-native';

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (x: string) => void;
  icon?: string;
  keyboardType?: KeyboardTypeOptions;
  inputSecure?: boolean;
}

export const CustomInput: React.FC<Props> = ({
  icon,
  inputSecure = false,
  keyboardType = 'default',
  ...props
}) => {
  const [secureTextEntry, setSecureTextEntry] = useState(inputSecure);
  const secureTextEntryIconName = secureTextEntry ? 'eye-off' : 'eye';
  const AccessoryIcon: RenderProp<Partial<ImageProps>> = iconProps =>
    inputSecure ? (
      <TouchableWithoutFeedback
        onPress={() => setSecureTextEntry(!secureTextEntry)}
      >
        <Icon {...iconProps} name={secureTextEntryIconName} />
      </TouchableWithoutFeedback>
    ) : (
      <Icon {...iconProps} name={icon} />
    );

  const inputProps = {
    ...props,
    secureTextEntry,
    keyboardType,
    ...(icon && {accessoryRight: AccessoryIcon}),
  };
  return <Input {...inputProps} />;
};