import {Layout, Text} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {PurgeDataButton} from '../components/ModalButtons/PurgeDataButton';

const SettingsDetailScreen: React.FC = () => {
  return (
    <SafeAreaView>
      <Layout style={styles.container}>
        <View>
          <Text category={'h4'}>Account Settings</Text>
        </View>
        <View style={styles.buttonsContainer}>
          <PurgeDataButton />
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
    marginVertical: 16,
  },
  modalContainer: {
    position: 'absolute',
    padding: 16,
  },
  backdrop: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default SettingsDetailScreen;
