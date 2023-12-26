import React, { useState, useContext } from 'react';
import {Alert, TouchableOpacity, Image} from 'react-native';
import {Box, Button, Input, ScrollView, Text, VStack, Center, Spinner, Select, CheckIcon} from 'native-base';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {width, height} from '../../../utils/validator';
import {icons} from '../../../assets/icons';
import { getConfirmPassword } from "../../../requests/User";
import { AuthContext } from "../../../providers/AuthProvider";
import { getForgotPassword } from "../../../functions/auth";

import {
  AuthNavigationParams,
  AUTH_NAVIGATION,
} from '../../../typings/navigation';


const ConfirmPassword = (props) => {
  const navigation = useNavigation();
  let auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);

  const initialValues = {sixdigit_code: '', password: '', c_password: ''};

  const validationSchema = Yup.object().shape({
    //sixdigit_code: Yup.string().required('Six Digit Code is required').min(6, 'Must be 6 digits').max(6, 'Must be 6 digits'),
    //password: Yup.string().required('Password is required'),
    //c_password: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
  });

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: values => submitConfirmPassword(values),
  });

  const validationMessage = async(v_m_a) => {      
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
      //console.log(i_p)
      //console.log(v_m_i)
      formik.setFieldError(i_p, v_m_i);
      if(i_p == "password") formik.setFieldError(i_p, v_m_i);
      
      formik.setTouched({...formik.touched,[i_p]: true });
    });
    //formik.setFieldError("password", "required");
    return v_m; 
  }

  const submitConfirmPassword = async (values) =>  {
    setLoading(true);
    values.password_token = await getForgotPassword();
    let response = await getConfirmPassword(values);
    //alert(JSON.stringify(response, null, 5))
    setLoading(false);
    if (response.ok && response.data && response.data?.success == true) {
      Alert.alert("",response.data?.data?.msg || response.data?.message);
      navigation.navigate(AUTH_NAVIGATION.SIGN_IN);
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
            placeholder="Your six digit code"
            borderColor="gray.300"
            onChangeText={formik.handleChange('sixdigit_code')}
          />
          {formik.errors.sixdigit_code && formik.touched.sixdigit_code && (
            <Text color="red.400" ml={5}>
              {formik.errors.sixdigit_code}
            </Text>
          )}

          <Input
            type={'password'}
            variant={'underlined'}
            borderColor="gray.300"
            size="lg"
            mb={1}
            placeholder="Your password"
            onChangeText={formik.handleChange('password')}
          />
          {formik.errors.password && formik.touched.password && (
            <Text color="red.400" ml={5}>
              {formik.errors.password}
            </Text>
          )}

          <Input
            type={'password'}
            variant={'underlined'}
            borderColor="gray.300"
            size="lg"
            mb={1}
            placeholder="Please confirm password"
            onChangeText={formik.handleChange('c_password')}
          />
          {formik.errors.c_password && formik.touched.c_password && (
            <Text color="red.400" ml={5}>
              {formik.errors.c_password}
            </Text>
          )}
         
          <VStack space={4}>
            <Button onPress={formik.handleSubmit}>Submit</Button>
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

export default ConfirmPassword;
