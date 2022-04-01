import {useNavigation} from '@react-navigation/native';
import {Button, Icon, Layout, List, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {ImageProps, SafeAreaView, StyleSheet, View} from 'react-native';
import {BillCard} from '../components/BillCard';
import {Bill} from '../models/Bill';
import {NavigationProps} from '../routes';
import BillService from '../services/BillService';
import dayjs from 'dayjs';
import Cache, {STORAGE_KEYS} from '../services/Cache';

const PlusIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="plus-outline" />;

const HomeScreen: React.FC = () => {
  const navigator = useNavigation<NavigationProps>();
  const [bills, setBills] = useState<Bill[]>([]);
  const [lastSyncDate, setLastSyncDate] = useState<string>('');

  useEffect(() => {
    const init = async () => {
      const retrievedBills = await BillService.getBills();
      setBills(retrievedBills);

      const lastSyncDateFromCache = Cache.getLastSyncDate();
      if (lastSyncDateFromCache) {
        setLastSyncDate(
          dayjs(JSON.parse(lastSyncDateFromCache)).format('DD MMM YYYY'),
        );
      }
    };

    init();
  }, []);

  return (
    <SafeAreaView>
      <Layout>
        <View style={styles.header}>
          <View>
            <Text category="h2">Upcoming Bills</Text>
            {lastSyncDate ? (
              <Text category="p1">Last Sync Date: {lastSyncDate}</Text>
            ) : (
              <Text category="p1">
                Not synced yet
                <Icon name="alert-circle-outline" />
              </Text>
            )}
          </View>
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
