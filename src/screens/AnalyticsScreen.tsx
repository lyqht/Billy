import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView, ScrollView, StyleSheet, View} from 'react-native';

const AnalyticsScreen: React.FC = () => {
  return (
    <SafeAreaView>
      <Layout style={styles.layoutContainer}>
        <ScrollView>
          <Text category={'h4'}>Summary Report</Text>
          <View />
        </ScrollView>
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    padding: 16,
    height: '100%',
    flexDirection: 'column',
  },
});

export default AnalyticsScreen;
