import {Button, Icon} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';

interface MissedBillCardFooterProps {
  onMarkAcknowledged: () => void;
}

const MissedBillCardFooter: React.FC<MissedBillCardFooterProps> = ({
  onMarkAcknowledged,
}) => {
  return (
    <View>
      <Button
        style={styles.buttonContainer}
        appearance={'ghost'}
        status="danger"
        accessoryRight={<Icon name="archive" />}
        onPress={() => {
          onMarkAcknowledged();
        }}
      >
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
