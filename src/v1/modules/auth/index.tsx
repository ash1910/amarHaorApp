import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {AUTH_NAVIGATION} from '../../typings/navigation';
import SignIn from './signin';
import Register from './register';
import ForgotPassword from './forgotPassword';
import ConfirmPassword from './confirmPassword';
import AuthLandingPage from './landing';
import {Box, StatusBar} from 'native-base';

const Stack = createStackNavigator();

const Auth = () => (
  <Box flex={1}>
    <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen
        name={AUTH_NAVIGATION.AUTH_LANDING}
        component={AuthLandingPage}
      />
      <Stack.Screen name={AUTH_NAVIGATION.SIGN_IN} component={SignIn} />
      <Stack.Screen name={AUTH_NAVIGATION.Register} component={Register} />
      <Stack.Screen name={AUTH_NAVIGATION.ForgotPassword} component={ForgotPassword} />
      <Stack.Screen name={AUTH_NAVIGATION.ConfirmPassword} component={ConfirmPassword} />
    </Stack.Navigator>
  </Box>
);

export default Auth;
