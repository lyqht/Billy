import {Layout} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView, StyleSheet} from 'react-native';
import BottomTabNavigator from '../components/Navigation/BottomTabNavigator';

const HomeScreen: React.FC = () => {
  return (
    <SafeAreaView style={styles.main}>
      <Layout style={styles.layoutContainer}>
        <BottomTabNavigator />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  layoutContainer: {
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  addBillButton: {
    margin: 16,
    padding: 16,
  },
  listItemWrapper: {
    margin: 12,
  },
  alertWrapper: {
    flexDirection: 'row',
    paddingHorizontal: 12,
    alignItems: 'center',
  },
  alertIcon: {
    width: 24,
    height: 24,
  },
});

export default HomeScreen;
