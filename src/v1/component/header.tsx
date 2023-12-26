import {Text} from 'native-base';
import React from 'react';
import {Animated} from 'react-native';
import {HEADER_HEIGHT} from '../utils/validator';
type Props = {
  headerY: Animated.AnimatedInterpolation;
};
export const AnimatedHeader: React.FC<Props> = ({headerY}): JSX.Element => {
  return (
    <Animated.View
      style={{
        position: 'absolute',
        elevation: 1000,
        zIndex: 1000,
        top: 0,
        left: 0,
        right: 0,
        height: HEADER_HEIGHT,
        backgroundColor: 'white',
        justifyContent: 'center',
        transform: [{translateY: headerY}],
      }}
    >
      <Text color={'gray.700'} textAlign={'center'} bold fontSize={18}>
        Payment CatagoryList
      </Text>
    </Animated.View>
  );
};

export default AnimatedHeader;
