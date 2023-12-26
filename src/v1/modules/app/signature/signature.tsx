import React, { useRef, useState, useEffect, useContext } from "react";
import { StyleSheet, View, Alert, TouchableOpacity, Modal, ActivityIndicator, Image as ImageReactNative } from "react-native";
import { Center, Spinner, Text, Button, Checkbox, HStack, Box, VStack, Image } from 'native-base';
import {icons} from '../../../assets/icons';
import {useNavigation} from '@react-navigation/native';
import SignatureScreen from "react-native-signature-canvas";
import * as FileSystem from "expo-file-system";

import { AuthContext } from "../../../providers/AuthProvider";
import { saveSignature, getSignature } from "../../../requests/User";
import {width, height} from '../../../utils/validator';
import {WebView} from "react-native-webview";

const Sign = () => {
  const ref = useRef();
  let auth = useContext(AuthContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [signature, setSignature] = useState(undefined);
  const [termAgree, setTermAgree] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  let isMounted = true;

  const submitSignature = async (sign) =>  {
    if( !termAgree ){
        Alert.alert("","Please accept Terms and Conditions to proceed.");
        return;
    }
    setLoading(true);
    //setSignature(sign);
    let response = await saveSignature(sign);
    //alert(JSON.stringify(response, null, 5))
    setLoading(false);
    if (response.ok && response.data && response.data?.success == true) {
      Alert.alert("",response.data?.message);
      if (isMounted){
        setSignature(response.data?.data?.signatture);
        //alert(response.data?.data?.signatture.length);
        ref.current.clearSignature();
      }
    } else {
      Alert.alert("",response.data.message?.error);
    }
  }

  const loadSignature = async () => {
    setLoading(true);
    let response = await getSignature();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        setSignature(response.data?.data?.signatture);
        //alert(response.data?.data?.signatture.length);
      }
    }
    else{
      Alert.alert("",response.data.message?.error);
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const handleOK = (signature) => {
    submitSignature(signature);
  };

  // const handleOK = (signature) => {
  //   setSignature(undefined)
  //   const path = FileSystem.cacheDirectory + "sign.png";
  //   FileSystem.writeAsStringAsync(
  //     path,
  //     signature.replace("data:image/png;base64,", ""),
  //     { encoding: FileSystem.EncodingType.Base64 }
  //   )
  //     .then(() => FileSystem.getInfoAsync(path))
  //     .then(console.log)
  //     .then(() => setSignature(path))
  //     .then(() => submitSignature(signature) )
  //     .then(() => alert(signature.length) )
  //     .catch(console.error);
  // };

  const handleClear = () => {
    //console.log("clear");
    ref.current.clearSignature();
  };

  const handleConfirm = () => {
    //console.log("end");
    ref.current.readSignature();
  };

  //const style = `.m-signature-pad--footer {display: none; margin: 0px;}`;
  const style = `.m-signature-pad {box-shadow: none; border: none; } 
              .m-signature-pad--body {border: none;}
              .m-signature-pad--footer {display: none; margin: 0px;}
              body,html {
              }`;

  useEffect(() => {
    isMounted = true;
    loadSignature();
    return () => { isMounted = false };
  }, [navigation]);

  const ActivityIndicatorLoadingView = () => {
    return (
      <ActivityIndicator
         color="#00ff00"
         size="large"
         style={styles.ActivityIndicatorStyle}
      /> 
    );
  }

  return (
    <VStack flex={1}>
        <Box backgroundColor={'primary.500'}>
            <HStack p={2} space={2} safeAreaTop>
                <Text flex={1} color={'white'} fontSize={'lg'} ml={2}>
                Tax Owed: {auth?.CurrentUser?.tax_amount || '0.00'} BDT
                </Text>
                <TouchableOpacity  
                  onPress={() => navigation.goBack()}>
                  <ImageReactNative source={icons.remove} style={{tintColor: 'white', width: 26, height: 26}} />
                </TouchableOpacity>
            </HStack>
        </Box>

        <VStack flex={1} pt={3} px={5}>
            <VStack flex={1.4}>
                <Text pt={2} pb={2} color={'rgb(60,60,60)'} textAlign={'left'} fontSize={20} fontWeight={'bold'} lineHeight={22}>We need to collect your signature to submit your return.</Text>
                <Text pb={2} color={'rgb(60,60,60)'} textAlign={'left'} fontSize={16} lineHeight={18}>Please add your signature in the signature panel below.</Text>
                
                {signature ? (
                <Center>
                    <Text pt={2} pb={1} color={'rgb(60,60,60)'} textAlign={'center'} fontSize={18} fontWeight={'bold'} lineHeight={18}>Current Signature</Text>
                    <Image
                        resizeMode={"contain"}
                        style={{ width: width, height: 80 }}
                        source={{ uri: signature }}
                    />
                </Center>
                ) : null}
            </VStack>
            
            <VStack flex={1.8} borderWidth={1} mb={4}> 
                <Box backgroundColor={'#cccccc'} py={1} px={3}>
                    <Text>Signature Panel</Text>
                </Box>
                <SignatureScreen ref={ref} onOK={handleOK} webStyle={style} />
            </VStack>

            <VStack alignItems={'center'} flex={1}>
                <HStack space={5}>
                    <Button onPress={handleClear} borderRadius={6} borderWidth={1} backgroundColor={'rgb(34,170,241)'} py={1} px={5}>Reset</Button>
                    <Button onPress={handleConfirm} borderRadius={6} borderWidth={1} backgroundColor={'rgb(242,69,61)'} py={1} px={5}>Save</Button>
                </HStack>
                <HStack space={2} mt={2}>
                    <Checkbox 
                        key="termAgree"
                        value={termAgree} 
                        onChange={val => setTermAgree(val)}
                    ></Checkbox>      
                    <Text mt={0} mr={2} color="rgb(54,181,241)" fontWeight={'bold'} onPress={() => setModalVisible(true)}>You must accept the Terms & Conditions.</Text>
                </HStack>
                <Button onPress={() => navigation.goBack()} borderRadius={10} mt={5} mb={3}>Go back to Upload Document</Button>
            </VStack>
        </VStack> 

        <Modal visible={modalVisible}>
            <View style={styles.modal}>
                <View style={styles.modalContainer}>
                    <WebView 
                        renderLoading={ActivityIndicatorLoadingView}
                        style={{ flex : 1 }} 
                        source={{uri: 'https://www.bdtax.com.bd/site/temrs'}}
                    />
                    <Button onPress={() => setModalVisible(!modalVisible)}>Close</Button>
                </View>
            </View>
        </Modal>

        {loading &&
        <Center position={'absolute'} top={0} left={0} bottom={0} right={0} backgroundColor={'black'} opacity={.5}>
            <Spinner color="emerald.500" />
        </Center>
        }
    </VStack>
  );
};

const styles = StyleSheet.create({
  modal : {
    flex : 1,
    justifyContent : 'center',
    alignItems : 'center',
    backgroundColor: 'rgba(0,0,0,0.5)'
  },
  modalContainer : {
      backgroundColor : 'white',
      width : '90%',
      height : '90%',
  },
  ActivityIndicatorStyle: {
      flex: 1,
      justifyContent: 'center',
  }
});

export default Sign;