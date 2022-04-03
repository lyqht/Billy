import {Button, Card, Icon, Text, useTheme} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Bill} from '../models/Bill';
import {Reminder} from '../models/Reminder';
import BillService from '../services/BillService';

type BillStatus = Pick<Bill, 'completedDate'> & Pick<Bill, 'id'>;
interface BillCardFooterProps extends BillStatus {
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
}

const BillCardFooter: React.FC<BillCardFooterProps> = ({
  id,
  completedDate,
  onMarkComplete,
  onMarkIncomplete,
}) => {
  return completedDate ? (
    <View>
      <Button
        style={styles.buttonContainer}
        appearance={'ghost'}
        status={'basic'}
        accessoryRight={<Icon name="checkmark-circle-2-outline" />}
        onPress={() => {
          BillService.setBillCompleteStatus(false, id);
          onMarkIncomplete();
        }}>
        <Text>Completed on {dayjs(completedDate).format('DD MMM YYYY')}</Text>
      </Button>
    </View>
  ) : (
    <Button
      style={styles.buttonContainer}
      appearance={'ghost'}
      status="primary"
      accessoryRight={<Icon name="checkmark-circle-2" />}
      onPress={() => {
        BillService.setBillCompleteStatus(true, id);
        onMarkComplete();
      }}>
      Mark as complete
    </Button>
  );
};

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

interface BillCardProps extends Bill {
  reminder: Reminder;
}

export const BillCard: React.FC<BillCardProps> = ({
  id,
  payee,
  amount,
  deadline,
  reminder,
  completedDate,
}) => {
  const theme = useTheme();
  const [cardStatus, setCardStatus] = React.useState(
    completedDate ? 'success' : 'basic',
  );

  return (
    <Card
      status={cardStatus}
      disabled={true}
      footer={
        <BillCardFooter
          id={id}
          completedDate={completedDate}
          onMarkComplete={() => setCardStatus('success')}
          onMarkIncomplete={() => setCardStatus('basic')}
        />
      }>
      <View style={styles.container}>
        <View style={styles.leftColumn}>
          <Text category={'s1'}>{payee}</Text>
          {!completedDate && <BillCardReminderText reminder={reminder} />}
        </View>
        <View style={styles.rightColumn}>
          <Text category={'h6'}>${amount}</Text>
          <View
            style={[
              styles.reminderText,
              {backgroundColor: theme['color-basic-default']},
            ]}>
            <Text category={'p1'}>
              Due: {dayjs(deadline).format('DD MMM YYYY')}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerContainer: {
    width: '100%',
    paddingLeft: 24,
  },
  leftColumn: {
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
  },
  rightColumn: {
    textAlign: 'right',
    alignItems: 'flex-end',
    justifyContent: 'space-evenly',
  },
  buttonContainer: {
    justifyContent: 'flex-end',
  },
  reminderTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reminderText: {
    borderRadius: 4,
    marginTop: 8,
    padding: 4,
  },
  reminderTextIcon: {
    width: 16,
    height: 16,
  },
});
