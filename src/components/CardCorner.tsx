import {Icon} from '@ui-kitten/components';
import React from 'react';
import Svg, {Circle} from 'react-native-svg';
import {StyleSheet} from 'react-native';

type Props = {
  cornerColor: string;
  iconColor: string;
  iconName: string;
};

const CardCorner: React.FC<Props> = ({cornerColor, iconColor, iconName}) => (
  <Svg style={styles.categoryCorner} width={48} height={48}>
    <Circle fill={cornerColor} cx={36} cy={12} r={24} />
    <Icon
      name={iconName}
      style={[styles.icon, styles.categoryIcon]}
      fill={iconColor}
    />
  </Svg>
);

const styles = StyleSheet.create({
  categoryCorner: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  categoryIcon: {
    position: 'absolute',
    top: 4,
    right: -6,
  },
  icon: {
    marginHorizontal: 12,
    width: 24,
    height: 24,
  },
});

export default CardCorner;
