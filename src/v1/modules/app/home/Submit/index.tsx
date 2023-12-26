import React, {useState, useEffect, useContext} from 'react';
import {Alert, Linking} from 'react-native';
import {Button, HStack, Text, VStack, Checkbox} from 'native-base';
//import CheckBox from '@react-native-community/checkbox';
import { getTaxAmount, saveConsent } from "../../../../requests/User";
import { updateCurrentUser } from "../../../../functions/auth";
import { AuthContext } from "../../../../providers/AuthProvider";

type Props = {
  onComplete: () => void;
  onLoading: () => void;
};

const Submit = ({onComplete, onLoading : setLoading, navigation}: Props) => {
  let auth = useContext(AuthContext);
  const [showUserConsent, setShowUserConsent] = useState(undefined);
  const [toggleCheckBox, setToggleCheckBox] = useState(undefined);
  const [textThankYouC, setTextThankYouC] = useState([]);

  let isMounted = true;

  const setConsent = async () => {
    setLoading(true);
    let response = await saveConsent(toggleCheckBox ? 1 : 0);
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      await updateCurrentUser({user_consent: 1}, auth);
      setToggleCheckBox(true);
      setShowUserConsent(false);
      //Alert.alert('Congratulation', response.data?.message);
    }
    else{
      Alert.alert("",response.data.message);
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const loadTaxAmount = async() => {
    setLoading(true);
    let response = await getTaxAmount();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        if( response.data.data?.user_consent == 0 ){
          setToggleCheckBox(false);
          setShowUserConsent(true);
        }
        else{
          setToggleCheckBox(true);
          setShowUserConsent(false);
        }
        setTextThankYouC(response.data.data?.thankyouc);
        await updateCurrentUser({tax_amount: response.data.data?.tax_amount}, auth);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  useEffect(() => {
    isMounted = true;

    loadTaxAmount();
    return () => { isMounted = false };
  }, [navigation]);

  return (
    <>
    { showUserConsent !== undefined &&
    <VStack>
    { !showUserConsent ? (
      <VStack space={3} mt={5} p={5}>
        {textThankYouC?.map(line => {
          return (
            <Text fontSize={line[0]["font_size"] ?? 16} >
            {line?.map(segment => {
            return (
              <>
              {segment.type == 'link' ? (
                <Text 
                  textAlign={'left'} 
                  bold={segment.is_bold == 1} 
                  italic={segment.is_italic == 1}
                  color="#0000ff"
                  onPress={() => Linking.openURL(`${segment.link_url}`)} 
                > {segment.text ?? ""}</Text>
              ) : (
                <Text 
                  textAlign={'left'} 
                  bold={segment.is_bold == 1} 
                  italic={segment.is_italic == 1} 
                >{segment.text ?? ""}</Text>
              )}
              </>
            );
          })}
          </Text>
          )
        })}
      </VStack>
    ) : (
      <VStack space={4} alignItems={'center'} p={8}>
          <HStack space={2}>
            <Checkbox
              key={toggleCheckBox}
              defaultIsChecked={toggleCheckBox}
              value={toggleCheckBox}
              onChange={newValue => setToggleCheckBox(newValue)}
            />
            <Text mt={-1}>I hereby agree and confirm that all my personal information and data provided here are accurate. I hereby consent and authorize bdtax.com.bd to process my tax return file using these information.</Text>
          </HStack>

          <Button
            onPress={setConsent}
            disabled={!toggleCheckBox}
            colorScheme={toggleCheckBox ? 'primary' : 'gray'}>
            Submit
          </Button>
      </VStack>
    )}
    </VStack>
    }
    </>
    
  );
};

export default Submit;
