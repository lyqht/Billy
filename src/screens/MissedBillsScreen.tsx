import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {Button, Divider, Icon, Layout, List, Text} from '@ui-kitten/components';
import React, {useEffect, useState} from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import Animated, {FadeInLeft, FadeOutRight} from 'react-native-reanimated';
import {BillCard, BillCardType} from '../components/BillCard/BillCard';
import {Quote} from '../components/Quote';
import {getMissedBills} from '../helpers/BillFilter';
import {Bill} from '../models/Bill';
import {RootStackParamList} from '../routes';
import BillService from '../services/BillService';
import Cache, {STORAGE_KEYS} from '../services/Cache';
import {useBilly} from '../contexts/useBillyContext';

type MissedBillsScreenProps = NativeStackScreenProps<
  RootStackParamList,
  'MissedBills'
>;

const MissedBillsScreen: React.FC<MissedBillsScreenProps> = () => {
  const {missedBills} = useBilly();

  const headerText =
    missedBills.length > 0
      ? `You didn't pay ${missedBills.length} bill(s) on time 😰`
      : 'You have no missed bills 🥳';

  if (missedBills.length === 0) {
    return (
      <SafeAreaView>
        <Layout style={styles.layoutContainer}>
          <View style={[styles.listItemWrapper]}>
            <Text category={'h6'} style={styles.item}>
              {headerText}
            </Text>
            <Text category={'p1'}>
              Good job! Let's continue to stay on track!
            </Text>
          </View>
        </Layout>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView>
      <Layout style={styles.layoutContainer}>
        <View style={[styles.listItemWrapper]}>
          <Text category={'h6'} style={styles.item}>
            {headerText}
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
          data={missedBills}
          renderItem={({item}) => (
            <Animated.View
              entering={FadeInLeft}
              exiting={FadeOutRight}
              key={item.id || item.tempID}
              style={styles.listItemWrapper}
            >
              <BillCard billCardType={BillCardType.MISSED_BILL} bill={item} />
            </Animated.View>
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
