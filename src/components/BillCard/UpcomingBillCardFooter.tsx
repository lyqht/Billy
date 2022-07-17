import {Button, Icon, Text} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {UpcomingBill} from '../../types/BillStatus';

interface BillCardFooterProps extends UpcomingBill {
  onMarkComplete: () => void;
  onMarkIncomplete: () => void;
}

const UpcomingBillCardFooter: React.FC<BillCardFooterProps> = ({
  completedDate,
  onMarkComplete,
  onMarkIncomplete,
}) => {
  const [loading, setLoading] = useState(false);
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
        setLoading(true);
        onMarkComplete();
        setLoading(false);
      }}
    >
      {loading ? <ActivityIndicator color="#FFFFFF" /> : 'Mark as complete'}
    </Button>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'flex-end',
  },
});

export default UpcomingBillCardFooter;
