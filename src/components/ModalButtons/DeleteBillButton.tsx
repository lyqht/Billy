import {useNavigation} from '@react-navigation/native';
import {Button, Card, Icon, Modal, Text} from '@ui-kitten/components';
import React, {useState} from 'react';
import {ActivityIndicator, StyleSheet, View} from 'react-native';
import {Bill} from '../../models/Bill';
import {NavigationProps} from '../../routes';
import BillService from '../../services/BillService';

type Props = {
  bill: Bill;
};

export const DeleteBillButton: React.FC<Props> = ({bill}) => {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation<NavigationProps>();

  return (
    <View>
      <Button
        status={'danger'}
        accessoryLeft={<Icon name="trash-2-outline" />}
        onPress={() => {
          setVisible(true);
        }}
      >
        Delete bill
      </Button>
      <Modal
        style={styles.container}
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Text category={'h4'} style={styles.descriptionText}>
            Are you sure you want to delete this bill?
          </Text>
          <Text category={'s1'} style={styles.descriptionText}>
            This action is irreversible!
          </Text>
          <View style={styles.row}>
            <Button
              status={'danger'}
              style={styles.modalButton}
              onPress={() => setVisible(false)}
            >
              Cancel
            </Button>
            <Button
              status={'basic'}
              style={styles.modalButton}
              onPress={() => {
                BillService.setBillAsDeleted(bill);
                setLoading(false);
                setVisible(false);
                navigation.navigate('Home');
              }}
            >
              {loading ? <ActivityIndicator color="#FFFFFF" /> : 'Confirm'}
            </Button>
          </View>
        </Card>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    padding: 16,
  },
  descriptionText: {
    textAlign: 'center',
    margin: 16,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 24,
  },
  icon: {
    width: 18,
    height: 18,
    margin: 4,
  },
  modalButton: {
    margin: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
  },
});
