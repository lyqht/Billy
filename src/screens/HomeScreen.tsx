import {useNavigation} from '@react-navigation/native';
import {Button, Icon, Layout, List, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {ImageProps, SafeAreaView, StyleSheet, View} from 'react-native';
import {BillCard} from '../components/BillCard';
import {Bill} from '../models/Bill';
import {NavigationProps} from '../routes';
import SupbaseClient from '../services/supabase';

const PlusIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="plus-outline" />;

const HomeScreen: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const navigator = useNavigation<NavigationProps>();

  useEffect(() => {
    const init = async () => {
      const retrievedBills = await SupbaseClient.getBills();
      setBills(retrievedBills);
    };

    init();
  }, []);

  return (
    <SafeAreaView>
      <Layout>
        <View style={styles.header}>
          <Text category="h2">Upcoming Bills</Text>
          <Button
            size="small"
            accessoryRight={PlusIcon}
            onPress={() => navigator.navigate('BillForm')}
            style={styles.likeButton}>
            Add Bill
          </Button>
        </View>
        <List
          data={bills}
          renderItem={({item}) => (
            <View style={styles.listItemWrapper}>
              <BillCard {...item} />
            </View>
          )}
        />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  likeButton: {
    margin: 16,
    padding: 16,
  },
  listItemWrapper: {
    margin: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
});

export default HomeScreen;
