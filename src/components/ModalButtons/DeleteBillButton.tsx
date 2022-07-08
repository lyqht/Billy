import {useNavigation} from '@react-navigation/native';
import {Button, Card, Icon, Modal, Text} from '@ui-kitten/components';
import React from 'react';
import {Linking, StyleSheet, View} from 'react-native';
import {NavigationProps} from '../../routes';

export const FeedbackButton: React.FC = ({}) => {
  let navigation = useNavigation<NavigationProps>();
  if (!navigation.getState().routeNames.includes('Login')) {
    navigation = navigation.getParent();
  }
  const [visible, setVisible] = React.useState(false);

  return (
    <View>
      <Button
        status={'danger'}
        accessoryLeft={<Icon name="heart" />}
        onPress={() => setVisible(true)}
      >
        Like the app?
      </Button>
      <Modal
        style={styles.container}
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Text category={'h4'} style={styles.descriptionText}>
            Thank you! ✨
          </Text>
          <Text category={'s1'} style={styles.descriptionText}>
            If you want to support my work, visit my GitHub project to leave a
            ⭐️ or buy me a cup of tea 🍵
          </Text>
          <Text category={'p1'} style={styles.descriptionText}>
            Please note that this is an open-source project that is still a
            work-in-progress, and features may not be stable until the MVP
            checklist is completed.
          </Text>

          <Text category={'c1'} style={styles.descriptionText}>
            © Estee Tey, 2022
          </Text>
          <Button
            style={styles.modalButton}
            onPress={() => {
              setVisible(false);
              Linking.openURL('https://github.com/lyqht/Billy');
            }}
          >
            Visit the project on GitHub ➡️
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
