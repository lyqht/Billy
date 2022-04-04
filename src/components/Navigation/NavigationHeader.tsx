import {NativeStackHeaderProps} from '@react-navigation/native-stack';
import {
  Icon,
  StyleService,
  TopNavigation,
  TopNavigationAction,
} from '@ui-kitten/components';
import {RenderProp} from '@ui-kitten/components/devsupport';
import React from 'react';
import {ImageProps, TouchableOpacity} from 'react-native';

interface NavigationHeaderProps {
  navigation: NativeStackHeaderProps;
}

const NavigationHeader: React.FC<NavigationHeaderProps> = props => {
  const {back, navigation, options} = props.navigation;
  const SettingsIcon: RenderProp<Partial<ImageProps>> = iconProps => (
    <Icon {...iconProps} name="settings" />
  );
  const BackIcon: RenderProp<Partial<ImageProps>> = iconProps => (
    <TouchableOpacity onPress={() => navigation.goBack()}>
      <Icon {...iconProps} name="arrow-back" />
    </TouchableOpacity>
  );

  const accessoryLeft = <TopNavigationAction icon={BackIcon} />;
  const accessoryRight = <TopNavigationAction icon={SettingsIcon} />;

  const navigationRenderProps = {
    ...(navigation.canGoBack() && {accessoryLeft, title: back?.title}),
    ...(options.headerRight && {accessoryRight}),
  };

  return <TopNavigation {...navigationRenderProps} style={styles.header} />;
};

const styles = StyleService.create({
  header: {
    marginTop: 24,
  },
});

export default NavigationHeader;
