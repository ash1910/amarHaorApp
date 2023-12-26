import React, {useEffect, useState} from 'react';
import {Button, VStack, Box, Center, Spinner} from 'native-base';
import {Alert, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

//import acknowledgementSlip from '../../../assets/acknowledgement_slip.png';
import {icons} from '../../../assets/icons';
import {width, height} from '../../../utils/validator';
import { getAckFile, getDownloadFile } from "../../../requests/User";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';

const Acknowledgment = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [fileLink, setFileLink] = useState(null);
  //const [fileStreamLink, setFileStreamLink] = useState("");

  let isMounted = true;

  const loadAckFile = async () => {
    setLoading(true);
    let response = await getAckFile();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        await loadDownloadFile(response.data.data?.id);
      }
    }
    else{
      Alert.alert("",response.data.message?.error);
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const loadDownloadFile = async (file_id) => {
    setLoading(true);

    let response = await getDownloadFile(file_id);
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data) {
      if (isMounted){
          const fr = new FileReader();
          fr.onload = async () => {
            let fileUri = `${FileSystem.documentDirectory}ack.jpg`;
            let content_disposition = response.headers['content-disposition'];
            let filename = content_disposition?.split('filename=')[1] ?? "";
            if(filename != ""){
              fileUri = `${FileSystem.documentDirectory}${filename}`;
            }
            
            //console.log(response.headers['content-disposition'].split('filename=')[1], "filename")
            await FileSystem.writeAsStringAsync(fileUri, fr.result.split(',')[1], { encoding: FileSystem.EncodingType.Base64 });

            if( Platform.OS === 'ios'){
              Sharing.shareAsync(fileUri);
            }
            else{
              await downloadFileToLocal(fileUri);
            }
            setFileLink(fileUri);
            //console.log(fileUri, 'fileUri');
          };
          fr.readAsDataURL(response.data);
      }
    }
    else{
      Alert.alert("","Error");
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const downloadFileToLocal = async(file_uri) => {
    try {
      const res = await MediaLibrary.requestPermissionsAsync();
      if (res.granted) {
        await MediaLibrary.saveToLibraryAsync(file_uri).then(()=>{
          Alert.alert("","Ack. slip has been downloaded successfully.");
        }).catch(error => {
          Alert.alert("","Failed");
        });
        return true;
      }
      return false;
    } catch (error) {
      console.log('ERR: saveFileAsync', error);
      throw error;
    }
  };

  useEffect(() => {
    isMounted = true;
    //loadAckFile();
    return () => { isMounted = false };
  }, [navigation]);

  return (
    <VStack space={1} flex={1} alignItems={'center'}>
        <Box>
          <Image
            source={icons.page3_bg_top}
            style={{width: width, height: 230, resizeMode: 'cover'}}
          />
          <Image
            source={icons.bdtax_logo}
            style={{width: '80%', height: 100, resizeMode: 'contain'}}
            position={'absolute'}
            bottom={20}
            left={'10%'}
          />
          <Box position={'absolute'} top={5} left={5} safeAreaTop>
            <TouchableOpacity onPress={() => navigation.goBack()}>
              <Image source={icons.leftArrow} />
            </TouchableOpacity>
          </Box>
        </Box>
      <Box mt={3} p={4}>
        {fileLink ? (
        <Image
          source={{uri: fileLink}}
          style={{
            height: 240,
            width: 240,
            resizeMode: 'contain',
          }}
        />
        ) : (
          <Center width={240} height={240}>
            <Image
              source={icons.image}
              style={{
                height: 120,
                width: 120,
                resizeMode: 'contain',
              }}
            />
          </Center>
          )
          }
      </Box>

      <Button
        maxWidth={150}
        onPress={() => { 
          loadAckFile();
          }}>
        Download
      </Button>
      {loading &&
      <Center position={'absolute'} top={0} left={0} bottom={0} right={0} backgroundColor={'black'} opacity={.5}>
        <Spinner color="emerald.500" />
      </Center>
      }
    </VStack>
  );
};

export default Acknowledgment;
