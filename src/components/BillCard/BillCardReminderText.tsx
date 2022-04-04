import {Icon, Text} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Reminder} from '../../models/Reminder';

interface BillCardReminderTextProps {
  reminder: Reminder;
}

const BillCardReminderText: React.FC<BillCardReminderTextProps> = ({
  reminder,
}) => {
  return (
    <View style={styles.reminderTextContainer}>
      {reminder ? (
        <Text>{dayjs(reminder.date).format('DD MMM YYYY, h.mma')}</Text>
      ) : (
        <>
          <Icon name="clock" style={styles.reminderTextIcon} fill="#8F9BB3" />
          <Text category={'c1'}>No reminder set</Text>
        </>
      )}
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
