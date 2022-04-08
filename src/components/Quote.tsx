import React from 'react';
import {View, StyleSheet} from 'react-native';

export const Quote: React.FC = ({children}) => (
  <View style={styles.quoteContainer}>
    <View style={styles.quoteLine} />
    <View style={styles.content}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  quoteContainer: {
    flexDirection: 'row',
    paddingBottom: 12,
  },
  quoteLine: {
    borderColor: '#abcbca',
    borderWidth: 2,
    width: 0,
    height: '100%',
  },
  content: {
    paddingLeft: 12,
    marginVertical: 16,
  },
});
