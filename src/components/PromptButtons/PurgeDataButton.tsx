import {useNavigation} from '@react-navigation/native';
import {Button, Card, Icon, Modal, Text} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, View} from 'react-native';
import {showToast} from '../../helpers/Toast';
import SyncService from '../../services/SyncService';

export const PurgeDataButton: React.FC = ({}) => {
  const [visible, setVisible] = React.useState(false);
  const navigation = useNavigation();

  return (
    <View>
      <Button
        status={'danger'}
        accessoryLeft={<Icon name="alert-triangle-outline" />}
        onPress={() => setVisible(true)}
      >
        Purge Data
      </Button>
      <Modal
        style={styles.container}
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Text category={'h4'} style={styles.descriptionText}>
            Purge data
          </Text>
          <Text category={'p1'} style={styles.descriptionText}>
            If you choose to proceed, all the data on this device will be
            deleted.
          </Text>
          <Text category={'p1'} style={styles.descriptionText}>
            This includes the bill expenses you have added, the upcoming
            notifications that you are supposed to receive for them, and you
            will be logged out instantly.
          </Text>
          <Text category={'s1'} status="danger" style={styles.descriptionText}>
            Are you sure you want to proceed? This action is irreversible!
          </Text>
          <Button
            style={styles.modalButton}
            onPress={async () => {
              await SyncService.clearAllData();
              setVisible(false);
              showToast({
                text1: 'Purge data',
                text2:
                  'All local data has been purged on this device. If you wish to purge your synced data (if you have any), please send an email to billyappuwu@gmail.com with the email you have registered with Billy',
                type: 'success',
              });

              navigation.goBack();
            }}
          >
            Yes, I am sure to remove all data on Billy.
          </Button>
          <Button
            status={'danger'}
            style={styles.modalButton}
            onPress={() => setVisible(false)}
          >
            Nah, I'm good.
          </Button>
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
    textAlign: 'left',
    margin: 16,
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
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
