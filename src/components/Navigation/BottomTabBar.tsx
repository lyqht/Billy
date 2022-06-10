import {BottomTabBarProps} from '@react-navigation/bottom-tabs';
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  IconProps,
} from '@ui-kitten/components';
import React from 'react';
import {StyleSheet} from 'react-native';

const SummaryReportIcon = (props: IconProps) => (
  <Icon {...props} name="book-open-outline" />
);
const SettingsIcon = (props: IconProps) => (
  <Icon {...props} name="settings-outline" />
);
const BellIcon = (props: IconProps) => <Icon {...props} name="bell-outline" />;

const BottomTabBar: React.FC<BottomTabBarProps> = ({navigation, state}) => {
  return (
    <React.Fragment>
      <BottomNavigation
        style={styles.bottomNavigation}
        selectedIndex={state.index}
        onSelect={index => navigation.navigate(state.routeNames[index])}
      >
        <BottomNavigationTab title="Upcoming Bills" icon={BellIcon} />
        <BottomNavigationTab title="Analytics" icon={SummaryReportIcon} />
        <BottomNavigationTab title="Settings" icon={SettingsIcon} />
      </BottomNavigation>
    </React.Fragment>
  );
};

const styles = StyleSheet.create({
  bottomNavigation: {
    marginVertical: 8,
  },
});

export default BottomTabBar;
