import {
  Button,
  IndexPath,
  Select,
  SelectItem,
  Text,
  useTheme,
} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React, {useEffect} from 'react';
import {Controller, useForm} from 'react-hook-form';
import {StyleSheet, View} from 'react-native';
import {getReminderDate} from '../../helpers/DateFns';
import {ReminderFormData, TimeUnit} from '../../models/Reminder';
import {CustomInput} from '../Input/CustomInput';

interface Props {
  currentDeadline: Date;
  onSubmit: ({timeUnit, value}: ReminderFormData) => void;
}

const timeUnitOptions: TimeUnit[] = Object.values(TimeUnit);

const ReminderForm: React.FC<Props> = ({onSubmit, currentDeadline}) => {
  const theme = useTheme();

  const {
    control,
    handleSubmit,
    getValues,
    watch,
    trigger,
    formState: {errors},
  } = useForm<ReminderFormData>({
    mode: 'onChange',
    defaultValues: {
      value: '1',
      timeUnit: TimeUnit.WEEKS,
    },
  });

  useEffect(() => {
    const revalidate = async () => trigger('timeUnit');
    revalidate();
  }, [currentDeadline]);

  const currentValue = watch('value');
  const currentTimeUnit = watch('timeUnit');
  const validateInputs = () => {
    const {value, timeUnit} = getValues();
    return (
      dayjs(getReminderDate(currentDeadline, value, timeUnit)).isAfter(
        dayjs(),
      ) ||
      'The calculated reminder date is in the past. You can only create reminders in the future.'
    );
  };

  const getErrorMessage = (): string | undefined => {
    if (errors.value) {
      return errors.value.message;
    }
    if (errors.timeUnit) {
      return errors.timeUnit.message;
    }
  };

  return (
    <View
      style={[styles.container, {backgroundColor: theme['color-primary-400']}]}
    >
      <Text
        style={styles.sectionContainer}
        category={'label'}
        appearance={'alternative'}
      >
        Add a reminder (relative to the deadline)
      </Text>
      <View style={[styles.row, styles.sectionContainer]}>
        <View style={[styles.numberInput, styles.fieldWithPaddingEnd]}>
          <Controller
            name="value"
            control={control}
            rules={{
              required: {
                value: true,
                message: 'A value is required',
              },
              validate: validateInputs,
            }}
            render={({field: {onChange, value}}) => (
              <CustomInput
                label=""
                placeholder="1"
                keyboardType="number-pad"
                onChangeText={onChange}
                value={value}
              />
            )}
          />
        </View>
        <View style={styles.dropdownInput}>
          <Controller
            name="timeUnit"
            control={control}
            rules={{
              required: true,
              validate: validateInputs,
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
      </View>
      <View
        style={[styles.row, styles.sectionContainer, styles.confirmSection]}
      >
        <View style={[styles.row, styles.reminderButtonContainer]}>
          <View>
            <Text category={'s2'} appearance={'alternative'}>
              Calculated reminder date
            </Text>
            <Text category={'s1'} appearance={'alternative'}>
              {dayjs(
                getReminderDate(currentDeadline, currentValue, currentTimeUnit),
              ).format('DD MMM YYYY, ddd, h:mm a')}
            </Text>
          </View>
        </View>
      </View>
      {Object.keys(errors).length > 0 ? (
        <View style={styles.sectionContainer}>
          <Text category={'label'} appearance={'alternative'}>
            {`* ${getErrorMessage()}`}
          </Text>
        </View>
      ) : (
        <Button status={'control'} onPress={handleSubmit(onSubmit)}>
          <Text>Add reminder</Text>
        </Button>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    marginVertical: 16,
    borderRadius: 8,
  },
  dropdownInput: {
    width: '60%',
  },
  numberInput: {
    width: '40%',
  },
  fieldWithPaddingEnd: {
    paddingEnd: 8,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  sectionContainer: {
    marginBottom: 16,
  },
  confirmSection: {
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: 'white',
    width: '100%',
  },
  reminderButtonContainer: {
    flex: 1,
  },
  icon: {
    width: 32,
    height: 32,
    marginEnd: 8,
  },
  confirmIcon: {
    width: 40,
    height: 40,
  },
});

export default ReminderForm;
