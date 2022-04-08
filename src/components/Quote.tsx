import React from 'react';
import {View, StyleSheet} from 'react-native';

export const Quote: React.FC = ({children}) => (
  <View style={styles.quoteContainer}>
    <View style={styles.quoteLine} />
    {children}
  </View>
);

const styles = StyleSheet.create({
  quoteContainer: {
    flexDirection: 'row',
    paddingLeft: 12,
    paddingBottom: 12,
  },
  quoteLine: {
    borderColor: '#abcbca',
    borderWidth: 2,
    width: 0,
    height: '100%',
  },
});
