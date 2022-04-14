import {Icon, Text} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';

interface BillCardReminderTextProps {
  numReminders: number;
}

const BillCardReminderText: React.FC<BillCardReminderTextProps> = ({
  numReminders,
}) => {
  return (
    <View style={styles.reminderTextContainer}>
      <Icon name="clock" style={styles.reminderTextIcon} fill="#8F9BB3" />
      <Text category={'c1'}>
        {numReminders === 0 ? 'No' : `${numReminders}`} reminder(s) set
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  reminderTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderTextIcon: {
    width: 16,
    height: 16,
  },
});

export default BillCardReminderText;
