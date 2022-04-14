import {Card, Text, useTheme} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React from 'react';
import {LayoutAnimation, StyleSheet, View} from 'react-native';
import {Bill} from '../../models/Bill';
import BillService from '../../services/BillService';
import BillCardReminderText from './BillCardReminderText';
import MissedBillCardFooter from './MissedBillCardFooter';
import UpcomingBillCardFooter from './UpcomingBillCardFooter';

export enum BillCardType {
  UPCOMING_BILL = 'UpcomingBill',
  MISSED_BILL = 'MissedBill',
}
interface BillCardProps {
  bill: Bill;
  billCardType: BillCardType;
  numReminders: number;
}

export const BillCard: React.FC<BillCardProps> = ({
  bill,
  billCardType,
  numReminders,
}) => {
  const theme = useTheme();
  const {id, payee, amount, deadline, completedDate} = bill;
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
            completedDate={completedDate}
            onMarkComplete={async () => {
              await BillService.setBillAsComplete(true, id);
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setCardStatus('success');
            }}
            onMarkIncomplete={async () => {
              await BillService.setBillAsComplete(false, id);
              LayoutAnimation.configureNext(
                LayoutAnimation.Presets.easeInEaseOut,
              );
              setCardStatus('basic');
            }}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.leftColumn}>
            <Text category={'s1'}>{payee}</Text>
            {!completedDate && (
              <BillCardReminderText numReminders={numReminders} />
            )}
          </View>
          <View style={styles.rightColumn}>
            <Text category={'h6'}>${`${amount}`}</Text>
            <View
              style={[
                styles.dueDateText,
                {backgroundColor: theme['color-basic-default']},
              ]}
            >
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
            onMarkAcknowledged={async () => {
              await BillService.setBillAsArchived(bill);
              LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
            }}
          />
        }
      >
        <View style={styles.container}>
          <View style={styles.leftColumn}>
            <Text category={'s1'}>{payee}</Text>
          </View>
          <View style={styles.rightColumn}>
            <Text category={'h6'}>${`${amount}`}</Text>
            <View
              style={[
                styles.dueDateText,
                {backgroundColor: theme['color-basic-default']},
              ]}
            >
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
