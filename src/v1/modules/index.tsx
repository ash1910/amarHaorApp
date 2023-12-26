import React, { useContext } from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ROOT_NAVIGATION} from '../typings/navigation';
import App from './app';
import Auth from './auth';
import { AuthContext } from "../providers/AuthProvider";

const Navigation = () => {
  const Stack = createStackNavigator();

  let auth = useContext(AuthContext);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      {auth.IsLoggedIn ? (
        <Stack.Screen name={ROOT_NAVIGATION.APP} component={App} />
      ) : (
        <Stack.Screen name={ROOT_NAVIGATION.AUTH} component={Auth} />
      )}
    </Stack.Navigator>
  );
};

export default Navigation;
