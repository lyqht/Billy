import React from 'react';
import Svg, {Circle, Text} from 'react-native-svg';

type Props = {
  name: string;
  color: string;
};

const Avatar: React.FC<Props> = ({name, color}) => (
  <Svg width={48} height={48}>
    <Circle fill={color} cx={24} cy={24} r={24} />
    <Text
      stroke="none"
      fill={'#FFFFFF'}
      fontSize="24"
      x={24}
      y={32}
      textAnchor="middle"
    >
      {name.charAt(0) + name.charAt(1)}
    </Text>
  </Svg>
);

export default Avatar;
