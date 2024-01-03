import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {PUBLIC_NAVIGATION} from '../../typings/navigation';
import PublicLandingPage from './landing';
import PublicSearchPage from './search';
import PublicGalleryPage from './gallery';
import {Box, StatusBar} from 'native-base';
import Ionicons from 'react-native-vector-icons/Ionicons';

const Tab = createBottomTabNavigator();

const Auth = () => (
    <Tab.Navigator
        screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Home') {
                    iconName = focused ? 'ios-information-circle' : 'ios-information-circle-outline';
                } else if (route.name === 'Explore') {
                    iconName = focused ? 'ios-list' : 'ios-list-outline';
                } else if (route.name === 'Gallery') {
                    iconName = focused ? 'ios-list' : 'ios-list-outline';
                }

                // You can return any component that you like here!
                return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: '#35B769',
            tabBarInactiveTintColor: '#1C1B1F',
        })}
      >
      <Tab.Screen name={PUBLIC_NAVIGATION.PUBLIC_LANDING} component={PublicLandingPage} />
      <Tab.Screen name={PUBLIC_NAVIGATION.PUBLIC_SEARCH} component={PublicSearchPage} />
      <Tab.Screen name={PUBLIC_NAVIGATION.PUBLIC_GALLERY} component={PublicGalleryPage} />
    </Tab.Navigator>
);

export default Auth;
