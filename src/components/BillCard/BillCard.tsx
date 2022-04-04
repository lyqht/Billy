import {Card, Text, useTheme} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Bill} from '../../models/Bill';
import {Reminder} from '../../models/Reminder';
import BillCardReminderText from './BillCardReminderText';
import MissedBillCardFooter from './MissedBillCardFooter';
import UpcomingBillCardFooter from './UpcomingBillCardFooter';

export enum BillCardType {
  UPCOMING_BILL = 'UpcomingBill',
  MISSED_BILL = 'MissedBill',
}
interface BillCardProps extends Bill {
  reminder?: Reminder;
  billCardType: BillCardType;
}

export const BillCard: React.FC<BillCardProps> = ({
  id,
  payee,
  amount,
  deadline,
  reminder,
  completedDate,
  billCardType,
}) => {
  const theme = useTheme();
  const [cardStatus, setCardStatus] = React.useState(
    completedDate ? 'success' : 'basic',
  );

  if (billCardType === BillCardType.UPCOMING_BILL) {
    return (
      <Card
        status={cardStatus}
        disabled={true}
        footer={
          <UpcomingBillCardFooter
            id={id}
            completedDate={completedDate}
            onMarkComplete={() => setCardStatus('success')}
            onMarkIncomplete={() => setCardStatus('basic')}
          />
        }>
        <View style={styles.container}>
          <View style={styles.leftColumn}>
            <Text category={'s1'}>{payee}</Text>
            {!completedDate && <BillCardReminderText reminder={reminder!} />}
          </View>
          <View style={styles.rightColumn}>
            <Text category={'h6'}>${amount}</Text>
            <View
              style={[
                styles.dueDateText,
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
  } else {
    return (
      <Card
        status={cardStatus}
        disabled={true}
        footer={
          <MissedBillCardFooter
            id={id}
            onMarkAcknowledged={() => {
              console.log(`Bill ${id} has been archived`);
            }}
          />
        }>
        <View style={styles.container}>
          <View style={styles.leftColumn}>
            <Text category={'s1'}>{payee}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text category={'h6'}>${amount}</Text>
            <View
              style={[
                styles.dueDateText,
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
  }
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
  dueDateText: {
    borderRadius: 4,
    marginTop: 8,
    padding: 4,
  },
});
