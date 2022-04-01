import * as eva from '@eva-design/eva';
import {
  ApplicationProvider,
  Button,
  Icon,
  IconRegistry,
  Layout,
  List,
  Text,
} from '@ui-kitten/components';
import {EvaIconsPack} from '@ui-kitten/eva-icons';
import React, {useEffect, useState} from 'react';
import {ImageProps, StyleSheet, View} from 'react-native';
import {SafeAreaProvider, SafeAreaView} from 'react-native-safe-area-context';
import {BillCard} from './components/BillCard';
import {Bill} from './models/Bill';
import SupbaseClient from './services/supabase';

const PlusIcon = (
  props?: Partial<ImageProps>,
): React.ReactElement<ImageProps> => <Icon {...props} name="plus-outline" />;

const App: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);

  useEffect(() => {
    const init = async () => {
      const retrievedBills = await SupbaseClient.getBills();
      setBills(retrievedBills);
    };

    init();
  }, []);

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={eva.light}>
        <SafeAreaProvider>
          <SafeAreaView>
            <Layout>
              <View style={styles.header}>
                <Text category="h2">Upcoming Bills</Text>
                <Button
                  size="small"
                  accessoryLeft={PlusIcon}
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
        </SafeAreaProvider>
      </ApplicationProvider>
    </>
  );
};

export default App;

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
