import {useNavigation} from '@react-navigation/native';
import {Button, Divider, Icon, Layout, List, Text} from '@ui-kitten/components';
import dayjs from 'dayjs';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {BillCard, BillCardType} from '../components/BillCard/BillCard';
import {Bill} from '../models/Bill';
import {NavigationProps} from '../routes';
import BillService from '../services/BillService';
import Cache, {STORAGE_KEYS} from '../services/Cache';

const getUpcomingBills = (bills: Bill[]) => {
  const billsSortedByDeadline = bills
    .filter(a => dayjs(a.deadline).isAfter(dayjs()))
    .sort((a, b) => (dayjs(a.deadline).isAfter(b.deadline) ? 1 : -1));

  const completedBills = billsSortedByDeadline.filter(a => a.completedDate);
  const uncompletedBills = billsSortedByDeadline.filter(
    a => a.completedDate === null,
  );

  return [...uncompletedBills, ...completedBills];
};

const getMissedBills = (bills: Bill[]) => {
  return bills.filter(
    bill =>
      bill.completedDate === null && dayjs(bill.deadline).isBefore(dayjs()),
  );
};

const UpcomingBillsScreen: React.FC = () => {
  const navigator = useNavigation<NavigationProps>();
  const [bills, setBills] = useState<Bill[]>([]);
  const [missedBills, setmissedBills] = useState<Bill[]>([]);
  const [lastSyncDate, setLastSyncDate] = useState<string>('');
  const listRef = React.useRef<List>(null);

  useEffect(() => {
    const init = async () => {
      const retrievedBills = await BillService.getBills();
      const upcomingBills = getUpcomingBills(retrievedBills);
      const retrievedMissedBills = getMissedBills(retrievedBills);

      setBills(upcomingBills);
      setmissedBills(retrievedMissedBills);

      const lastSyncDateFromCache = Cache.getLastSyncDate();
      if (lastSyncDateFromCache) {
        setLastSyncDate(
          dayjs(JSON.parse(lastSyncDateFromCache)).format('DD MMM YYYY'),
        );
      }
    };
    const listener = Cache.getStorage().addOnValueChangedListener(
      changedKey => {
        if (Cache.getStorage().contains(changedKey)) {
          const newValue = Cache.getStorage().getString(changedKey);
          const parsedValue = JSON.parse(newValue!);
          switch (changedKey) {
            case STORAGE_KEYS.BILLS:
              setBills(getUpcomingBills([...parsedValue]));
              setmissedBills(getMissedBills([...parsedValue]));
              break;
            case STORAGE_KEYS.LAST_SYNC_DATE:
              setLastSyncDate(dayjs(parsedValue).format('DD MMM YYYY'));
              break;
          }
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
      <Layout style={styles.layoutContainer}>
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
            accessoryRight={<Icon name="plus-outline" />}
            onPress={() => navigator.navigate('BillForm')}
            style={styles.addBillButton}
          >
            Add Bill
          </Button>
        </View>
        <Divider />
        {missedBills.length > 0 && (
          <Button
            status={'warning'}
            accessoryLeft={
              <Icon name="alert-triangle" style={styles.alertIcon} />
            }
            style={styles.alertWrapper}
            onPress={() => {
              navigator.navigate('MissedBills', {bills: missedBills});
            }}
          >
            <Text>
              You have {missedBills.length} missed bills, review them here
            </Text>
          </Button>
        )}
        <List
          ref={listRef}
          data={bills}
          renderItem={({item}) => (
            <View key={item.id} style={styles.listItemWrapper}>
              <BillCard billCardType={BillCardType.UPCOMING_BILL} {...item} />
            </View>
          )}
          ListFooterComponent={
            bills.length > 5 ? (
              <Button
                size={'large'}
                appearance={'ghost'}
                accessoryLeft={<Icon name="corner-left-up-outline" />}
                status={'basic'}
                onPress={() => {
                  scrollToTop();
                }}
              >
                Scroll back to top
              </Button>
            ) : (
              <></>
            )
          }
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

export default UpcomingBillsScreen;
