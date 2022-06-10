import {
  CalendarRange,
  RangeDatepicker,
  StyleType,
  Text,
} from '@ui-kitten/components';
import {CalendarDateInfo} from '@ui-kitten/components/ui/calendar/type';
import React from 'react';
import {StyleSheet, View} from 'react-native';

// currently unused because the additional data below the date might confuse the user instead
export const DayCell = (info, style) => {
  console.log(info);
  return (
    <View style={[styles.dayContainer, style.container]}>
      <Text style={style.text}>{`${info.date.getDate()}`}</Text>
      <Text style={[style.text]}>
        {/* replace this area with the bill amount */}
        {`${100 * info.date.getDate() + Math.pow(info.date.getDate(), 2)}$`}
      </Text>
    </View>
  );
};

interface Props {
  label?: string;
  min?: Date;
  max?: Date;
  placeholder?: string;
  range: CalendarRange<Date>;
  onSelect: (x: {}) => void;
  renderDay?: (
    info: CalendarDateInfo<Date>,
    style: StyleType,
  ) => React.ReactElement;
}

export const CustomDateRangePicker: React.FC<Props> = props => {
  return <RangeDatepicker status={'primary'} {...props} />;
};

const styles = StyleSheet.create({
  dayContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    aspectRatio: 1,
  },
});
