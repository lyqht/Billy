import {Button, Icon, Text} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import BillService from '../../services/BillService';
import {BillStatus} from '../../types/BillStatus';

interface BillCardFooterProps extends BillStatus {
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
}

const UpcomingBillCardFooter: React.FC<BillCardFooterProps> = ({
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
          onMarkIncomplete();
        }}
      >
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
        onMarkComplete();
      }}
    >
      Mark as complete
    </Button>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'flex-end',
  },
});

export default UpcomingBillCardFooter;
