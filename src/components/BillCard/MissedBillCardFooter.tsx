import {Button, Icon} from '@ui-kitten/components';
import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';

interface MissedBillCardFooterProps {
  onMarkAcknowledged: () => void;
}

const MissedBillCardFooter: React.FC<MissedBillCardFooterProps> = ({
  onMarkAcknowledged,
}) => {
  const [loading, setLoading] = useState(false);
  return (
    <View>
      <Button
        style={styles.buttonContainer}
        appearance={'ghost'}
        status="danger"
        accessoryRight={<Icon name="archive" />}
        onPress={() => {
          setLoading(true);
          onMarkAcknowledged();
          setLoading(false);
        }}
      >
        {loading ? <ActivityIndicator color="#FFFFFF" /> : 'Archive this bill'}
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
