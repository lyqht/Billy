import {Icon, Input, InputProps} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React, {useState} from 'react';
import {
  ImageProps,
  KeyboardTypeOptions,
  StyleProp,
  TouchableWithoutFeedback,
  ViewStyle,
} from 'react-native';

interface Props {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (x: string) => void;
  icon?: string;
  keyboardType?: KeyboardTypeOptions;
  inputSecure?: boolean;
  style?: StyleProp<ViewStyle>;
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

  const inputProps: InputProps = {
    ...props,
    secureTextEntry,
    keyboardType,
    ...(icon && {accessoryRight: AccessoryIcon}),
    ...(inputSecure && {accessoryRight: AccessoryIcon}),
  };

  return <Input {...inputProps} />;
};
