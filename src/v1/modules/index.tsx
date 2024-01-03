import React, { useContext } from 'react';
import Public from './public';
import {createDrawerNavigator} from '@react-navigation/drawer';
import { Button, View, Text } from 'react-native';
// Import Custom Sidebar
import CustomSidebarMenu from '../component/CustomSidebarMenu';

const Navigation = () => {

  const Drawer = createDrawerNavigator();
  
  function NotificationsScreen({ navigation }) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Button onPress={() => navigation.goBack()} title="Go back home" />
      </View>
    );
  }

  return (
    <Drawer.Navigator initialRouteName="Home"
        drawerContent={props => <CustomSidebarMenu {...props} />}
    >
      <Drawer.Screen name="Home" component={Public} />
      <Drawer.Screen name="Notifications" component={NotificationsScreen} />
  </Drawer.Navigator>
  );
};

export default Navigation;
