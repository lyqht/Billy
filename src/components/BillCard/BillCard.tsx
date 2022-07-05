import {Card, CardProps, Text, useTheme} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React from 'react';
import {LayoutAnimation, StyleSheet, View} from 'react-native';
import {Bill} from '../../models/Bill';
import BillService from '../../services/BillService';
import BillCardReminderText from './BillCardReminderText';
import MissedBillCardFooter from './MissedBillCardFooter';
import UpcomingBillCardFooter from './UpcomingBillCardFooter';
import {useNavigation} from '@react-navigation/native';
import {NavigationProps} from '../../routes';

export enum BillCardType {
  UPCOMING_BILL = 'UpcomingBill',
  MISSED_BILL = 'MissedBill',
}
interface BillCardProps {
  bill: Bill;
  billCardType: BillCardType;
  numReminders?: number;
}

const getDisplayAmount = (x: number): string => {
  var parts = x.toString().split('.');
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return parts.join('.');
};

const CardContent: React.FC<BillCardProps> = ({
  bill,
  numReminders,
  billCardType,
}) => {
  const theme = useTheme();
  const {payee, completedDate, deadline, amount} = bill;
  return (
    <View style={styles.container}>
      <View style={styles.leftColumn}>
        <Text category={'s1'}>{payee}</Text>
        {billCardType === BillCardType.UPCOMING_BILL && !completedDate && (
          <BillCardReminderText numReminders={numReminders!} />
        )}
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
      <View style={styles.rightColumn}>
        <Text category={'h4'}>$</Text>
        <Text
          adjustsFontSizeToFit
          style={styles.billAmountText}
          category={'h4'}
        >
          {getDisplayAmount(amount!)}
        </Text>
      </View>
    </View>
  );
};

export const BillCard: React.FC<BillCardProps> = ({
  bill,
  billCardType,
  numReminders,
}) => {
  const {id, tempID, completedDate} = bill;
  const billID = id ?? tempID;
  const navigation = useNavigation<NavigationProps>();

  const cardProps: CardProps = {
    status: completedDate ? 'success' : 'basic',
    disabled: billCardType === BillCardType.MISSED_BILL,
    footer:
      billCardType === BillCardType.UPCOMING_BILL ? (
        <UpcomingBillCardFooter
          completedDate={completedDate}
          onMarkComplete={async () => {
            await BillService.setBillAsComplete(true, billID);
          }}
          onMarkIncomplete={async () => {
            await BillService.setBillAsComplete(false, billID);
          }}
        />
      ) : (
        <MissedBillCardFooter
          onMarkAcknowledged={async () => {
            await BillService.setBillAsArchived(bill);
            LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
          }}
        />
      ),
  };

  return (
    <Card
      {...cardProps}
      onPress={() => {
        navigation.navigate('BillDetails', {bill});
      }}
    >
      <CardContent
        bill={bill}
        billCardType={billCardType}
        numReminders={numReminders}
      />
    </Card>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  footerContainer: {
    width: '100%',
    paddingLeft: 24,
  },
  leftColumn: {
    flex: 6,
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    paddingRight: 8,
  },
  rightColumn: {
    flex: 4,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    paddingLeft: 8,
  },
  dueDateText: {
    borderRadius: 4,
    marginTop: 8,
    padding: 4,
  },
  billAmountText: {
    textAlign: 'right',
  },
});
