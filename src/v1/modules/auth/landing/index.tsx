import React from 'react';
import {Image} from 'react-native';
import {Box, Button, VStack} from 'native-base';
import {StackNavigationProp} from '@react-navigation/stack';

import {
  AuthNavigationParams,
  AUTH_NAVIGATION,
} from '../../../typings/navigation';
import {icons} from '../../../assets/icons';
import {height, width} from '../../../utils/validator';

type Props = {
  navigation: StackNavigationProp<
    AuthNavigationParams,
    AUTH_NAVIGATION.AUTH_LANDING
  >;
};

const AuthLandingPage = ({navigation}: Props) => {
  return (
    <Box flex={1} bgColor={'primary.300'}>
        <Box>
          <Image
            source={icons.pag2_bg_with_shadow}
            style={{width: width, height: height * 0.45, resizeMode: 'stretch'}}
          />
          <Image
            safeAreaTop
            source={icons.bdtax_logo}
            style={{width: '80%', height: 100, resizeMode: 'contain'}}
            position={'absolute'}
            bottom={80}
            left={'10%'}
          />
        </Box>
      {/* <Box>
        <Image
          source={icons.authenticate}
          style={{
            width: width,
            height: height * 0.45,
            resizeMode: 'stretch',
          }}
        />
      </Box> */}
      <VStack
        space={4}
        p={4}
        pb={8}
        flex={1}
        justifyContent={'flex-end'}>
        <Button onPress={() => navigation.navigate(AUTH_NAVIGATION.SIGN_IN)}>
          Login
        </Button>
        <Button variant={'outline'} onPress={() => navigation.navigate(AUTH_NAVIGATION.Register)}>
          Register
        </Button>
      </VStack>
    </Box>
  );
};

export default AuthLandingPage;
