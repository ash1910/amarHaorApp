import {Text, VStack, HStack, Box} from 'native-base';
import {ActivityIndicator, TouchableOpacity, Image} from 'react-native';
import React, {useContext} from 'react';
import {icons} from '../../../assets/icons';
import {useNavigation} from '@react-navigation/native';
import {WebView} from "react-native-webview";
import { AuthContext } from "../../../providers/AuthProvider";

const ChatScreen = (props) => {
  let auth = useContext(AuthContext);
  const navigation = useNavigation();

  const ActivityIndicatorLoadingView = () => {
    return (
      <ActivityIndicator
         color="#00ff00"
         size="large"
         style={{flex: 1, justifyContent: 'center'}}
      /> 
    );
  }

  return (
    <Box flex={1} backgroundColor={'primary.500'}>
      <HStack p={2} space={2} safeAreaTop>
        <Text flex={1} color={'white'} fontSize={'lg'} ml={2}>
          Tax Owed: {auth?.CurrentUser?.tax_amount || '0.00'} BDT
        </Text>
        <TouchableOpacity  
          onPress={() => navigation.goBack()}>
          <Image source={icons.remove} style={{tintColor: 'white', width: 26, height: 26}} />
        </TouchableOpacity>
      </HStack>
      <WebView 
          renderLoading={ActivityIndicatorLoadingView}
          style={{ flex : 1 }} 
          source={{uri: 'https://www.bdtax.com.bd/site/livechat'}}
      />
    </Box>
    
  );
};

export default ChatScreen;
