import React, { useContext } from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import {ROOT_NAVIGATION} from '../typings/navigation';
import App from './app';
import Auth from './auth';
import Public from './public';
import { AuthContext } from "../providers/AuthProvider";
import {createDrawerNavigator} from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Button, View, Text } from 'react-native';

const Navigation = () => {
  const Stack = createStackNavigator();

  let auth = useContext(AuthContext);

  const Drawer = createDrawerNavigator();

  const Tab = createBottomTabNavigator();

  function HomeScreen({ navigation }) {
    return (
      <Tab.Navigator>
        <Tab.Screen name="Home 2" component={HomeScreen2} />
        <Tab.Screen name="Settings 2" component={SettingsScreen2} />
      </Tab.Navigator>
    );
  }
  
  function NotificationsScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => navigation.goBack()} title="Go back home" />
      </View>
    );
  }

  function HomeScreen2() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
  
  function SettingsScreen2() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }

  return (
    <Drawer.Navigator initialRouteName="Home">
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
  </Drawer.Navigator>
  );
};

export default Navigation;
