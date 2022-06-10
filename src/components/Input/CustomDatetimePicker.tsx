import {Icon, Input} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {View} from 'react-native';
import {getSystemName} from 'react-native-device-info';
import DateTimePickerModal from 'react-native-modal-datetime-picker';

type IOSDisplay = 'default' | 'compact' | 'inline' | 'spinner';

interface Props {
  onChange: (date: any) => void;
  value: Date;
}

const CustomDatetimePicker: React.FC<Props> = ({value, onChange}) => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    onChange(date);
    hideDatePicker();
  };

  const displayProps: {display?: IOSDisplay} = {
    ...((getSystemName() === 'iOS' || getSystemName() === 'iPadOS') && {
      display: 'spinner',
    }),
  };

  return (
    <View>
      <Input
        label={'Deadline'}
        value={`${dayjs(value).format('DD MMM YYYY h:mm a')}`}
        accessoryRight={iconProps => (
          <Icon {...iconProps} name="clock-outline" />
        )}
        onPressIn={() => showDatePicker()}
      />
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        date={value}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        {...displayProps}
      />
    </View>
  );
};

export default CustomDatetimePicker;
