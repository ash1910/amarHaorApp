import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import {PUBLIC_NAVIGATION} from '../../typings/navigation';
import PublicLandingPage from './landing';
import PublicSearchPage from './search';
import PublicGalleryPage from './gallery';
import {Box, StatusBar} from 'native-base';

const Stack = createStackNavigator();

const Auth = () => (
  <Box flex={1}>
    <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name={PUBLIC_NAVIGATION.PUBLIC_LANDING} component={PublicLandingPage} />
      <Stack.Screen name={PUBLIC_NAVIGATION.PUBLIC_SEARCH} component={PublicSearchPage} />
      <Stack.Screen name={PUBLIC_NAVIGATION.PUBLIC_GALLERY} component={PublicGalleryPage} />
    </Stack.Navigator>
  </Box>
);

export default Auth;
