import {useNavigation} from '@react-navigation/native';
import {User} from '@supabase/supabase-js';
import {Button, Icon, Layout, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {TabNavigationProps} from '../routes';
import UserService from '../services/UserService';
import {LoginMode} from '../types/LoginMode';

const SettingsScreen: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation<TabNavigationProps>();

  useEffect(() => {
    const init = async () => {
      const retrievedUser = await UserService.getUser();
      if (retrievedUser) {
        setUser(retrievedUser);
      }
    };

    init();
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
          <Button
            status={'danger'}
            style={styles.listItem}
            accessoryLeft={<Icon name="heart" />}>
            Like the app?
          </Button>
          {user ? (
            <Button
              style={styles.listItem}
              status={'warning'}
              accessoryLeft={<Icon name="corner-down-right" />}
              onPress={() => {
                UserService.logOutUser();
                navigation.navigate('UpcomingBills');
              }}>
              Log out
            </Button>
          ) : (
            <Button
              style={styles.listItem}
              accessoryLeft={<Icon name="corner-down-right" />}
              onPress={() =>
                navigation.getParent()?.navigate('Login', {
                  loginMode: LoginMode.SIGN_UP,
                })
              }>
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
    margin: 12,
    flexDirection: 'row',
  },
  buttonsContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
});

export default SettingsScreen;
