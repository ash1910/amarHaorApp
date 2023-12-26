import React, { useState, useContext } from 'react';
import {Alert, TouchableOpacity, Image} from 'react-native';
import {Box, Button, Input, ScrollView, Text, VStack, Center, Spinner} from 'native-base';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {width, height} from '../../../utils/validator';
import {icons} from '../../../assets/icons';
import { getForgotPassword } from "../../../requests/User";
import { doForgotPassword } from "../../../functions/auth";
import { AuthContext } from "../../../providers/AuthProvider";
import {
  AuthNavigationParams,
  AUTH_NAVIGATION,
} from '../../../typings/navigation';


const ForgotPassword = (props) => {
  const navigation = useNavigation();
  let auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const initialValues = {email: ''};

  const validationSchema = Yup.object().shape({
    //email: Yup.string().email('Invalid email').required('email is required')
  });

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: values => submitForgotPassword(values),
  });

  const validationMessage = v_m_a => {      
    let v_m = "";
    Object.keys(v_m_a).forEach(i_p => {
      v_m = v_m + "\n" + i_p.charAt(0).toUpperCase() + i_p.slice(1) + " : ";
      let v_m_i = "";
      if(Array.isArray(v_m_a[i_p])){
        v_m_a[i_p].forEach(v_c => {
          v_m_i = v_m_a[i_p].length > 1 ? v_c + ", " : v_c;
        });
      } 
      v_m = v_m + v_m_i;
      formik.setFieldError(i_p, v_m_i);
    });
    return v_m; 
  }

  const submitForgotPassword = async (values) =>  {
    setLoading(true);
    let response = await getForgotPassword(values.email);
    //alert(JSON.stringify(response, null, 5))
    setLoading(false);
    if (response.ok && response.data && response.data?.data?.email_found !== 0) {
      Alert.alert("",response.data?.data?.msg);
      doForgotPassword(response.data?.data?.token);
      navigation.navigate(AUTH_NAVIGATION.ConfirmPassword)
    } else {
      let message = response.data?.message;
      if (response.data && response.data?.data) {
        let v_m = validationMessage(response.data?.data);
        //if(v_m) message = "\n" + message + "\n" +  v_m;
      }
      Alert.alert("",message);
      //console.log(user);
    }
  }

  return (
    <Box flex="1">
      <ScrollView>
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
        <VStack p={6} space={4} px={6}>
          <Input
            size="lg"
            variant={'underlined'}
            placeholder="Your email address"
            borderColor="gray.300"
            keyboardType={'email-address'}
            onChangeText={formik.handleChange('email')}
            InputLeftElement={
              <Box ml={4} mr={2}>
                <Image source={icons.email} style={{height: 20, width: 20}} />
              </Box>
            }
          />
          {formik.errors.email && formik.touched.email && (
            <Text color="red.400" ml={5}>
              {formik.errors.email}
            </Text>
          )}

          <VStack space={4}>
            <Button onPress={formik.handleSubmit}>Restore</Button>
          </VStack>
        </VStack>
      </ScrollView>

      {loading &&
      <Center position={'absolute'} top={0} left={0} bottom={0} right={0} backgroundColor={'black'} opacity={.5}>
        <Spinner color="emerald.500" />
      </Center>
      }
    </Box>
  );
};

export default ForgotPassword;
