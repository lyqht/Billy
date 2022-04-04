import {Button, Icon} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {BillStatus} from '../../types/BillStatus';

interface MissedBillCardFooterProps extends BillStatus {
  onMarkAcknowledged: () => void;
}

const MissedBillCardFooter: React.FC<MissedBillCardFooterProps> = ({
  id,
  onMarkAcknowledged,
}) => {
  return (
    <View>
      <Button
        style={styles.buttonContainer}
        appearance={'ghost'}
        status="danger"
        accessoryRight={<Icon name="archive" />}>
        Archive this bill
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  buttonContainer: {
    justifyContent: 'flex-end',
  },
});

export default MissedBillCardFooter;
