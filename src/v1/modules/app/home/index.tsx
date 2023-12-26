import {StackNavigationProp} from '@react-navigation/stack';
import {Box, HStack, ScrollView, Text, View, VStack, Center, Spinner} from 'native-base';
import React, {useState, useContext, useEffect} from 'react';
import {Image, ActivityIndicator} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {APP_NAVIGATION, AppNavigationParams} from '../../../typings/navigation';
import {icons} from '../../../assets/icons';
import ProgressStep from './ProgressStep';
import PersonalInfo from './PersonalInfo';
//import {RootState} from '../../../state/reducer';
import UploadFiles from './UploadFiles';
import Payment from './Payment';
import Submit from './Submit';
import { AuthContext } from "../../../providers/AuthProvider";

type Props = {
  navigation: StackNavigationProp<AppNavigationParams, APP_NAVIGATION.HOME>;
};

const HomeScreen = ({navigation}: Props) => {
  let auth = useContext(AuthContext);

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [showProgressStep, setShowProgressStep] = useState(true);
  const [showHeader, setShowHeader] = useState(true);
  const [enabledStep, setEnabledStep] = useState(1);
  const [showChat, setShowChat] = useState(false);

  let isMounted = true;

  console.log('CurrentStep', currentStep);
  //const {profile} = useSelector((state: RootState) => state.profile);
  //const {files} = useSelector((state: RootState) => state.files);

  //let enabledStep = 1;
  // determine if profile done
  // if (profile) {
  //   enabledStep = 2;
  // }

  // determine if any file uploaded
  // Object.entries(files).map(([key, value]) => {
  //   if (value.length > 0) {
  //     enabledStep = 3;
  //   }
  // });
  //enabledStep = 3;

  const updateStep = step => {
    // if( !auth?.CurrentUser?.enabledStep || auth?.CurrentUser?.enabledStep < step){
    //   let user = auth?.CurrentUser;
    //   user = {...user, enabledStep : step};
    //   auth.setCurrentUser(user);
    // }
    if(enabledStep < step){
      setEnabledStep(step);
    }
    setCurrentStep(step);
  }

  useEffect(() => {
    isMounted = true;
    
    //console.log(auth?.CurrentUser, "CurrentUser")
    if(auth?.CurrentUser?.user_consent == 1){
      setEnabledStep(4);
    }
    else if(auth?.CurrentUser?.is_file_uploaded == 1){
      setEnabledStep(3);
    }
    else if(auth?.CurrentUser?.order_amount && parseFloat(auth?.CurrentUser?.order_amount) > 0){
      setEnabledStep(2);
    }

    return () => { isMounted = false };
  }, [navigation, auth?.CurrentUser]);

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
    <Box flex={1} backgroundColor={'primary.500'} safeAreaTop>
      {showHeader && 
      <HStack p={2} space={2}>
        {currentStep > 1 && !showChat &&
        <TouchableOpacity
          onPress={() => {
            if (currentStep == 3 && auth?.CurrentUser?.show_payment_option == 0) setCurrentStep(currentStep - 2);
            else if (currentStep > 1) setCurrentStep(currentStep - 1);
          }}>
          <Image source={icons.leftArrow} style={{tintColor: 'white'}} />
        </TouchableOpacity>
         }

        <Text flex={1} color={'white'} fontSize={'lg'} ml={2}>
          Tax Due Amount: {auth?.CurrentUser?.tax_amount || '0.00'} BDT
        </Text>
        <HStack space={4}>
        {!showChat ? (
          <>
            <TouchableOpacity  
              onPress={() => navigation.navigate(APP_NAVIGATION.CHAT)}>
              <Image source={icons.chat} style={{tintColor: 'white'}} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => navigation.navigate(APP_NAVIGATION.PROFILE)}>
              <Image source={icons.user} style={{tintColor: 'white'}} />
            </TouchableOpacity>
          </>
        ) : (
          <TouchableOpacity  
            onPress={() => setShowChat(false)}>
            <Image source={icons.remove} style={{tintColor: 'white', width: 26, height: 26}} />
          </TouchableOpacity>
        )}
        </HStack>
        
      </HStack>
      }
      <VStack flex={1} backgroundColor={'white'} borderTopRadius={'lg'} style={{display: showChat ? 'none' : 'flex'}}>
        {showProgressStep && 
        <ProgressStep
          key={enabledStep}
          enabledStep={enabledStep}
          //enabledStep={auth?.CurrentUser?.enabledStep || 1}
          //enabledStep={currentStep}
          onStepPress={step => {
            setCurrentStep(step);
            //console.log('StepPressed', step);
          }}
        />
        }

        <Box flex={1}>
          {currentStep === 1 && (
            <PersonalInfo 
              onComplete={step => updateStep(step || 2)}
              onLoading={(boolV) => setLoading(boolV)} 
              navigation={navigation} 
              key="PersonalInfo"
            />
          )}
          
          {currentStep === 2 && (
            <Payment 
              onComplete={step => updateStep(step || 3)} 
              onLoading={boolV => setLoading(boolV)} 
              onFullScreen={boolV => {
                  setShowProgressStep(boolV);
                  setShowHeader(boolV);
                }
              } 
              key="Payment"
            />
          )}

          {currentStep === 3 && (
            <UploadFiles onComplete={step => updateStep(step || 4)} onLoading={(boolV) => setLoading(boolV)} navigation={navigation} key="UploadFiles"/>
          )}

          {currentStep === 4 && <Submit onLoading={(boolV) => setLoading(boolV)} navigation={navigation} key="SubmitConsent" />}
        </Box>
      </VStack>

      {loading &&
      <Center position={'absolute'} top={0} left={0} bottom={0} right={0} backgroundColor={'black'} opacity={.5}>
        <Spinner color="emerald.500" />
      </Center>
      }
    </Box>
  );
};

export default HomeScreen;
