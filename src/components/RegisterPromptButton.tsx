import {useNavigation} from '@react-navigation/native';
import {Button, Card, Icon, Modal, Text} from '@ui-kitten/components';
import React from 'react';
import {
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  TouchableOpacity,
} from 'react-native';
import {NavigationProps} from '../routes';
import {LoginMode} from '../types/LoginMode';

interface RegisterPromptButtonProps {
  description: string;
}

const InfoIcon = () => (
  <Icon style={styles.icon} fill={'#abcbca'} name="info-outline" />
);

export const RegisterPromptButton: React.FC<RegisterPromptButtonProps> = ({
  description,
}) => {
  let navigation = useNavigation<NavigationProps>();
  if (!navigation.getState().routeNames.includes('Login')) {
    navigation = navigation.getParent();
  }
  const [visible, setVisible] = React.useState(false);

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <InfoIcon />
      </TouchableOpacity>
      <Modal
        style={styles.container}
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Text category={'h2'}>Register an account</Text>
          <Text>{description}</Text>
          <Button
            style={styles.modalButton}
            onPress={() => {
              setVisible(false);
              navigation.navigate('Login', {loginMode: LoginMode.SIGN_UP});
            }}
          >
            Sign up
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
    minHeight: 192,
    position: 'absolute',
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
