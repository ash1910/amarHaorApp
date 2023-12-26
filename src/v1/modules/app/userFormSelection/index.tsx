import React, {useContext, useState, useRef} from 'react';
import {Radio, VStack, Box, Center, Spinner, HStack, Button} from 'native-base';
import {Alert, Image, ScrollView, Text} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {icons} from '../../../assets/icons';
import {width, height} from '../../../utils/validator';
import { sendUserFormSelectionQA, sendUserFormSelectionType } from "../../../requests/User";
import { updateCurrentUser } from "../../../functions/auth";
import { AuthContext } from "../../../providers/AuthProvider";

const UserFormSelectionScreen = () => {
  let auth = useContext(AuthContext);
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [Q1, setQ1] = useState("Y");
  const [Q2, setQ2] = useState("Y");
  const [Q3, setQ3] = useState("Y");
  const [Q4, setQ4] = useState("Y");
  const [Q5, setQ5] = useState("Y");
  const scrollView = useRef<ScrollView>(null);

  let isMounted = true;

  const saveUserFormSelection = async () => {
    setLoading(true);
    let response = await sendUserFormSelectionQA({q1: Q1, q2: Q2, q3: Q3, q4: Q4, q5: Q5});
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        await updateCurrentUser({user_from_selection: response.data.data?.user_from_selection}, auth);
        // Alert.alert(
        //     "Form Selection Confirmation",
        //     response.data.data?.message,
        //     [
        //         {
        //           text: 'Close',
        //           onPress: () => {
        //             console.log('We are doing nothing');
        //           },
        //         },
        //         {
        //           text: 'Ok',
        //           onPress: () => {
        //             saveUserFormSelectionType(response.data.data?.type);
        //           },
        //         },
        //     ],
        // );
      }
    }
    else{
      Alert.alert("",response.data.message);
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const saveUserFormSelectionType = async (type) => {
    setLoading(true);
    let response = await sendUserFormSelectionType(type);
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        //await loadDownloadFile(response.data.data?.id);
        await updateCurrentUser({user_from_selection: response.data.data?.user_from_selection}, auth);
      }
    }
    else{
      Alert.alert("",response.data.message);
    }
    if (isMounted){
      setLoading(false);
    }
  };

  return (
    <>
    <ScrollView ref={scrollView} safeAreaTop>
      <VStack space={1} alignItems={'center'} px={4}  flex={1}>
        <Box flex={1}>
            <Image
            source={icons.login}
            style={{width: width, height: 150, resizeMode: 'cover'}}
            />
        </Box>
      <VStack mt={5} flex={1} width={'100%'} space={3}>
        <Center _text={{color: 'green.500', fontSize: 'md'}}>Please answer the following questions to determine which NBR form (IT-11 GA 2016 or IT-GHA 2020) you qualify for.</Center>
        <VStack space={3} mt={4}>
            <HStack space={3} alignItems="center">
                <Box width={'60%'} _text={{fontWeight: 'bold'}}>1. Do you have total taxable income less than 4 lac BDT?</Box>
                <Radio.Group alignItems={'flex-end'} name="Q1" value={Q1} onChange={nextValue => setQ1(nextValue)}>
                    <HStack space={3}>
                        <Radio value="Y">Yes</Radio>
                        <Radio value="N">No</Radio>
                    </HStack>
                </Radio.Group>
            </HStack>
            <HStack space={3} alignItems="center">
                <Box width={'60%'} _text={{fontWeight: 'bold'}}>2. Do you have gross wealth less than 40 lac BDT? </Box>
                <Radio.Group alignItems={'flex-end'} name="Q2" value={Q2} onChange={nextValue => setQ2(nextValue)}>
                    <HStack space={3}>
                        <Radio value="Y">Yes</Radio>
                        <Radio value="N">No</Radio>
                    </HStack>
                </Radio.Group>
            </HStack>
            <HStack space={3} alignItems="center">
                <Box width={'60%'} _text={{fontWeight: 'bold'}}>3. Do you have any motor car (jeep or microbus) in your name?</Box>
                <Radio.Group alignItems={'flex-end'} name="Q3" value={Q3} onChange={nextValue => setQ3(nextValue)}>
                    <HStack space={3}>
                        <Radio value="Y">Yes</Radio>
                        <Radio value="N">No</Radio>
                    </HStack>
                </Radio.Group>
            </HStack>
            <HStack space={3} alignItems="center">
                <Box width={'60%'} _text={{fontWeight: 'bold'}}>4. Do you own/invest any house property or apartment in any city corporation area?</Box>
                <Radio.Group alignItems={'flex-end'} name="Q4" value={Q4} onChange={nextValue => setQ4(nextValue)}>
                    <HStack space={3}>
                        <Radio value="Y">Yes</Radio>
                        <Radio value="N">No</Radio>
                    </HStack>
                </Radio.Group>
            </HStack>
            <HStack space={3} alignItems="center">
                <Box width={'60%'} _text={{fontWeight: 'bold'}}>5. Do you have any Foreign income?</Box>
                <Radio.Group alignItems={'flex-end'} name="Q5" value={Q5} onChange={nextValue => setQ5(nextValue)}>
                    <HStack space={3}>
                        <Radio value="Y">Yes</Radio>
                        <Radio value="N">No</Radio>
                    </HStack>
                </Radio.Group>
            </HStack>
            <Button
                my={5}
                onPress={saveUserFormSelection}>
                Next
            </Button>
        </VStack>
      </VStack>
    </VStack>
    </ScrollView>
      {loading &&
      <Center position={'absolute'} top={0} left={0} bottom={0} right={0} backgroundColor={'black'} opacity={.5}>
        <Spinner color="emerald.500" />
      </Center>
      }
    </>
  );
};

export default UserFormSelectionScreen;
