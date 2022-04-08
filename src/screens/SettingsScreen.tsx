import {useNavigation} from '@react-navigation/native';
import {User} from '@supabase/supabase-js';
import {Button, Card, Icon, Layout, Text, Modal} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {FeedbackButton} from '../components/FeedbackButton';
import {Quote} from '../components/Quote';
import {TabNavigationProps} from '../routes';
import Cache, {STORAGE_KEYS} from '../services/Cache';
import UserService from '../services/UserService';
import {LoginMode} from '../types/LoginMode';

const SettingsScreen: React.FC = () => {
  const retrievedUser = UserService.getUser();
  const [user, setUser] = useState<User | null>(retrievedUser);
  const navigation = useNavigation<TabNavigationProps>();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    const listener = Cache.getStorage().addOnValueChangedListener(
      changedKey => {
        if (changedKey === STORAGE_KEYS.AUTH_TOKEN) {
          const updatedUser = UserService.getUser();
          setUser(updatedUser);
        }
      },
    );

    return () => listener.remove();
  }, []);

  const renderGreetingText = () => {
    if (user) {
      if (user.user_metadata.name) {
        return `Hello ${user.user_metadata.name}`;
      }
      return `Hello ${user.email}`;
    }
    return 'Hello there, you are not logged in yet.';
  };

  return (
    <SafeAreaView>
      <Layout style={styles.container}>
        <View>
          <Text category={'h2'}>Settings</Text>
          <Text category={'s1'}>{renderGreetingText()}</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <FeedbackButton />
          {user ? (
            <View>
              <Button
                style={styles.listItem}
                status={'warning'}
                accessoryLeft={<Icon name="corner-down-right" />}
                onPress={() => {
                  setLogoutModalVisible(true);
                }}
              >
                Log out
              </Button>
              <Modal
                backdropStyle={styles.backdrop}
                style={styles.modalContainer}
                visible={logoutModalVisible}
              >
                <Card disabled={true}>
                  <Text category={'h3'}>
                    Are you sure that you want to log out?
                  </Text>
                  <Text category={'p1'} style={styles.descriptionText}>
                    All your existing bills will still{' '}
                    <Text category={'s1'}>remain on your local device</Text>,
                    and you can still continue to add bills.
                  </Text>
                  <Quote>
                    <Text category={'p1'} style={styles.descriptionText}>
                      However, your data{' '}
                      <Text category={'s1'}>
                        will not be synced to the cloud
                      </Text>{' '}
                      until you log in again.
                    </Text>
                  </Quote>
                  <Button
                    style={styles.listItem}
                    status={'danger'}
                    onPress={async () => {
                      await UserService.logOutUser();
                      setLogoutModalVisible(false);
                      navigation.navigate('UpcomingBills');
                    }}
                  >
                    Log out
                  </Button>
                  <Button
                    style={styles.listItem}
                    onPress={() => setLogoutModalVisible(false)}
                  >
                    Cancel
                  </Button>
                </Card>
              </Modal>
            </View>
          ) : (
            <Button
              style={styles.listItem}
              accessoryLeft={<Icon name="corner-down-right" />}
              onPress={() =>
                navigation.getParent()?.navigate('Login', {
                  loginMode: LoginMode.SIGN_UP,
                })
              }
            >
              Sign up / Log in
            </Button>
          )}
        </View>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    height: '100%',
    flexDirection: 'column',
  },
  listItem: {
    marginVertical: 12,
    flexDirection: 'row',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    padding: 16,
  },
  descriptionText: {
    margin: 16,
  },
  modalContainer: {
    position: 'absolute',
    padding: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default SettingsScreen;
