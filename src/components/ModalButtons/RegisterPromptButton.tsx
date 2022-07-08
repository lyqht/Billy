import {useNavigation, useTheme} from '@react-navigation/native';
import {Button, Card, Icon, Modal, Text} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet, TouchableOpacity, View} from 'react-native';
import {NavigationProps} from '../../routes';
import {LoginMode} from '../../types/LoginMode';
interface RegisterPromptButtonProps {
  description: string;
}

export const RegisterPromptButton: React.FC<RegisterPromptButtonProps> = ({
  description,
}) => {
  let navigation = useNavigation<NavigationProps>();
  if (!navigation.getState().routeNames.includes('Login')) {
    navigation = navigation.getParent();
  }
  const [visible, setVisible] = React.useState(false);
  const theme = useTheme();

  return (
    <View>
      <TouchableOpacity onPress={() => setVisible(true)}>
        <Icon
          style={styles.icon}
          fill={theme.colors.primary}
          name="info-outline"
        />
      </TouchableOpacity>
      <Modal
        style={styles.container}
        visible={visible}
        backdropStyle={styles.backdrop}
        onBackdropPress={() => setVisible(false)}
      >
        <Card disabled={true}>
          <Text category={'h4'}>Register an account</Text>
          <Text style={styles.descriptionText}>{description}</Text>
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
    position: 'absolute',
    padding: 16,
  },
  descriptionText: {
    marginVertical: 16,
  },
  icon: {
    width: 18,
    height: 18,
    margin: 4,
  },
  modalButton: {
    marginVertical: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});
