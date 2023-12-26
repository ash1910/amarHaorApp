import React, { useState, useContext, useEffect } from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {APP_NAVIGATION} from '../../typings/navigation';
import HomeScreen from './home';
import ProfileScreen from './profile';
import {Box, StatusBar} from 'native-base';
import Acknowledgement from './acknowledgement';
import UserFormSelectionScreen from './userFormSelection';
import ChatScreen from './chat';
import OrderStatus from './orderStatus';
import SignaturePage from './signature';
import Sign from './signature/signature';
import { AuthContext } from "../../providers/AuthProvider";

const Stack = createStackNavigator();

const App = () => {
  let auth = useContext(AuthContext);

  return (
    <Box flex={1}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'#02AB00'} />
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}>
          {auth?.CurrentUser?.user_from_selection == "" ? (
            <Stack.Screen name={APP_NAVIGATION.UserFormSelection} component={UserFormSelectionScreen} />
          ) : (
            <>
            <Stack.Screen name={APP_NAVIGATION.HOME} component={HomeScreen} />
            <Stack.Screen name={APP_NAVIGATION.PROFILE} component={ProfileScreen} />
            <Stack.Screen
              name={APP_NAVIGATION.ACKNOWLEDGEMENT}
              component={Acknowledgement}
            />
            <Stack.Screen
              name={APP_NAVIGATION.CHAT}
              component={ChatScreen}
              // options={{presentation: "modal"}}
            />
            <Stack.Screen
              name={APP_NAVIGATION.ORDERSTATUS}
              component={OrderStatus}
            />
            <Stack.Screen
              name={APP_NAVIGATION.SIGNATURE}
              component={Sign}
            />
            </>
          )}
      </Stack.Navigator>
    </Box>
  );
}

export default App;
