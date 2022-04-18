import {
  Icon,
  IndexPath,
  Select,
  SelectItem,
  Text,
  useTheme,
} from '@ui-kitten/components';
import React from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {ReminderFormData, TimeUnit} from '../../models/Reminder';
import {CustomInput} from './CustomInput';

interface Props {
  onSubmit: ({timeUnit, value}: ReminderFormData) => void;
}

const timeUnitOptions: TimeUnit[] = Object.values(TimeUnit);

const ReminderForm: React.FC<Props> = ({onSubmit}) => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<ReminderFormData>({
    mode: 'onBlur',
    defaultValues: {
      value: '1',
      timeUnit: TimeUnit.WEEKS,
    },
  });

  return (
    <View
      style={[styles.container, {backgroundColor: theme['color-primary-400']}]}
    >
      <Text category={'label'} appearance={'alternative'}>
        Add a reminder (relative to the deadline)
      </Text>
      <View style={styles.row}>
        <View style={styles.formField}>
          <Controller
            name="value"
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, value}}) => (
              <CustomInput
                label=""
                placeholder="a number"
                keyboardType="number-pad"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
          {errors.value && (
            <Text category={'label'} status="warning">
              This field is required
            </Text>
          )}
        </View>
        <View style={styles.formField}>
          <Controller
            name="timeUnit"
            control={control}
            rules={{
              required: true,
            }}
            render={({field: {onChange, value}}) => (
              <Select
                accessibilityLabel="time unit"
                value={value}
                onSelect={index => {
                  const currentIndex = index as IndexPath;
                  onChange(timeUnitOptions[currentIndex.row]);
                }}
              >
                {timeUnitOptions.map(timeUnit => (
                  <SelectItem
                    key={`select-option-${timeUnit}`}
                    title={timeUnit}
                  />
                ))}
              </Select>
            )}
          />
        </View>
        <TouchableOpacity onPress={handleSubmit(onSubmit)}>
          <Icon
            style={styles.icon}
            fill={theme['color-basic-200']}
            name="plus-circle"
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 16,
    borderRadius: 8,
  },
  formField: {
    width: 125,
    marginEnd: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingVertical: 16,
  },
  icon: {
    width: 32,
    height: 32,
    marginEnd: 8,
  },
});

export default ReminderForm;
