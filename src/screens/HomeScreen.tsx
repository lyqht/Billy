import {useNavigation} from '@react-navigation/native';
import {Button, Divider, Icon, Layout, List, Text} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {ImageProps, SafeAreaView, StyleSheet, View} from 'react-native';
import {BillCard} from '../components/BillCard';
import {Bill} from '../models/Bill';
import {NavigationProps} from '../routes';
import BillService from '../services/BillService';
import Cache, {STORAGE_KEYS} from '../services/Cache';

const PlusIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="plus-outline" />;

const HomeScreen: React.FC = () => {
  const navigator = useNavigation<NavigationProps>();
  const listRef = React.useRef<List>(null);
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
    const listener = Cache.getStorage().addOnValueChangedListener(
      changedKey => {
        const newValue = Cache.getStorage().getString(changedKey);
        const parsedValue = JSON.parse(newValue!);
        switch (changedKey) {
          case STORAGE_KEYS.BILLS:
            setBills([...parsedValue]);
            break;
          case STORAGE_KEYS.LAST_SYNC_DATE:
            setLastSyncDate(dayjs(parsedValue).format('DD MMM YYYY'));
            break;
        }
      },
    );

    init();

    return () => {
      listener.remove();
    };
  }, []);

  const scrollToTop = () => {
    listRef.current?.scrollToOffset({animated: true, offset: 0});
  };

  return (
    <SafeAreaView style={styles.main}>
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
        <Divider />
        <List
          ref={listRef}
          data={bills}
          renderItem={({item}) => (
            <View style={styles.listItemWrapper}>
              <BillCard {...item} />
            </View>
          )}
          ListFooterComponent={
            <Button
              size={'large'}
              appearance={'ghost'}
              accessoryLeft={<Icon name="corner-left-up-outline" />}
              status={'basic'}
              onPress={() => {
                scrollToTop();
              }}>
              Scroll back to top
            </Button>
          }
          contentContainerStyle={styles.listWrapper}
        />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  main: {
    flex: 1,
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  likeButton: {
    margin: 16,
    padding: 16,
  },
  listWrapper: {
    paddingBottom: 60,
  },
  listItemWrapper: {
    padding: 12,
  },
});

export default HomeScreen;
