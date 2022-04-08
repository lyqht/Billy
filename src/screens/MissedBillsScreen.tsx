import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Divider, Icon, Layout, List, Text} from '@ui-kitten/components';
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import {BillCard, BillCardType} from '../components/BillCard/BillCard';
import {Quote} from '../components/Quote';
import {RootStackParamList} from '../routes';

type MissedBillsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MissedBills'
>;

const MissedBillsScreen: React.FC<MissedBillsScreenProps> = ({route}) => {
  const {bills} = route.params;
  return (
    <SafeAreaView>
      <Layout style={styles.layoutContainer}>
        <View style={[styles.listItemWrapper]}>
          <Text category={'h6'} style={styles.item}>
            You didn't pay {bills.length} bills on time 😰
          </Text>
          <Quote>
            <Text category={'p1'}>
              Check below what you missed. If you don't want Billy to alert you
              of these bills anymore, you can archive them.
            </Text>
          </Quote>
        </View>

        <Divider />
        <List
          data={bills}
          renderItem={({item}) => (
            <View key={item.id} style={styles.listItemWrapper}>
              <BillCard billCardType={BillCardType.MISSED_BILL} {...item} />
            </View>
          )}
          ListFooterComponent={
            <Button
              style={styles.listItemWrapper}
              size={'large'}
              appearance={'filled'}
              accessoryLeft={<Icon name="archive" />}
              status={'danger'}
            >
              Archive all bills
            </Button>
          }
        />
      </Layout>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  layoutContainer: {
    height: '100%',
  },
  listItemWrapper: {
    margin: 12,
  },
  item: {
    marginVertical: 12,
  },
});

export default MissedBillsScreen;
