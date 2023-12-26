import React, { useState, useContext } from 'react';
import {Alert, TouchableOpacity, Image, Modal, View, Pressable, StyleSheet, ActivityIndicator} from 'react-native';
import {Box, Button, Input, ScrollView, Text, VStack, Center, Spinner, Select, CheckIcon} from 'native-base';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import {useNavigation} from '@react-navigation/native';
import {width, height} from '../../../utils/validator';
import {icons} from '../../../assets/icons';
import { doLogin } from "../../../functions/auth";
import { getRegister, getValidateEmail } from "../../../requests/User";
import { AuthContext } from "../../../providers/AuthProvider";
import {
  AuthNavigationParams,
  AUTH_NAVIGATION,
} from '../../../typings/navigation';
import {WebView} from "react-native-webview";


const Register = (props) => {
  const navigation = useNavigation();
  let auth = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

  const initialValues = {first_name: '', last_name: '', mobile: '', email: '', password: '', c_password: '', hearaboutus: ''};

  const validationSchema = Yup.object().shape({
    // first_name: Yup.string().required('First name is required'),
    // last_name: Yup.string().required('Last name is required'),
    // mobile: Yup.number().required('Mobile is required'),
    // email: Yup.string().email('Invalid email').required('email is required'),
    // password: Yup.string().required('Password is required'),
    // c_password: Yup.string().required('Confirm Password is required').oneOf([Yup.ref('password'), null], 'Passwords must match'),
    // hearaboutus: Yup.string().required('Hear About Us is required'),
  });

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    enableReinitialize: true,
    initialValues,
    validationSchema,
    onSubmit: values => submitRegister(values),
  });

  const validationMessage = v_m_a => {      
    let v_m = "";
    Object.keys(v_m_a).forEach(i_p => {
      v_m = v_m + "\n" + i_p.charAt(0).toUpperCase() + i_p.slice(1) + " : ";
      let v_m_i = "";
      v_m_a[i_p].forEach(v_c => {
        v_m_i = v_m_a[i_p].length > 1 ? v_c + ", " : v_c;
      });
      v_m = v_m + v_m_i;
      formik.setFieldError(i_p, v_m_i);
    });
    return v_m;
}

  const submitRegister = async (values) =>  {
    setLoading(true);
    let response = await getRegister(values);
    //alert(JSON.stringify(response, null, 5))
    setLoading(false);
    if (response.ok && response.data && response.data?.success == true) {
      //Alert.alert("",response.data?.message);
      //navigation.navigate(AUTH_NAVIGATION.SIGN_IN)

      // Auto Login
      let ret = await doLogin(response.data?.data, auth, props);
      if(ret) Alert.alert("", response.data?.message,
        [
          {
            text: "Let’s Get Started",
            onPress: () => {
              console.log('We are doing nothing');
            },
          },
        ]
      );

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

  const submitValidateEmail = async () =>  {
    //setLoading(true);
    //alert(formik.values.email);
    let response = await getValidateEmail(formik.values.email);
    //alert(JSON.stringify(response, null, 5));
    //setLoading(false);
    if (response.ok && response.data && response.data?.success == true) {
      //Alert.alert("",response.data?.message);
    } else {
      let message = response.data?.message;
      if (response.data && response.data?.data) {
        //let v_m = validationMessage(response.data?.data);
        //if(v_m) message = "\n" + message + "\n" +  v_m;
        //console.log(response.data?.data?.email[0],"email")
        formik.setFieldError('email', response.data?.data?.email[0]);
        formik.setTouched({...formik.touched,['email']: true });
      }

      //Alert.alert("",message);
      //console.log(user);
    }
  }

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
            placeholder="First Name"
            borderColor="gray.300"
            onChangeText={formik.handleChange('first_name')}
          />
          {formik.errors.first_name && formik.touched.first_name && (
            <Text color="red.400" ml={0}>
              {formik.errors.first_name}
            </Text>
          )}

          <Input
            size="lg"
            variant={'underlined'}
            placeholder="Last Name"
            borderColor="gray.300"
            onChangeText={formik.handleChange('last_name')}
          />
          {formik.errors.last_name && formik.touched.last_name && (
            <Text color="red.400" ml={0}>
              {formik.errors.last_name}
            </Text>
          )}

          <Input
            size="lg"
            variant={'underlined'}
            placeholder="Mobile phone"
            borderColor="gray.300"
            onChangeText={formik.handleChange('mobile')}
          />
          {formik.errors.mobile && formik.touched.mobile && (
            <Text color="red.400" ml={0}>
              {formik.errors.mobile}
            </Text>
          )}

          <Input
            size="lg"
            variant={'underlined'}
            placeholder="Email Address"
            borderColor="gray.300"
            keyboardType={'email-address'}
            onChangeText={formik.handleChange('email')}
            onBlur={submitValidateEmail}
          />
          {formik.errors.email && formik.touched.email && (
            <Text color="red.400" ml={0}>
              {formik.errors.email}
            </Text>
          )}

          <Input
            type={'password'}
            variant={'underlined'}
            borderColor="gray.300"
            size="lg"
            mb={1}
            placeholder="Password"
            onChangeText={formik.handleChange('password')}
          />
          {formik.errors.password && formik.touched.password && (
            <Text color="red.400" ml={0}>
              {formik.errors.password}
            </Text>
          )}

          <Input
            type={'password'}
            variant={'underlined'}
            borderColor="gray.300"
            size="lg"
            mb={1}
            placeholder="Confirm password"
            onChangeText={formik.handleChange('c_password')}
          />
          {formik.errors.c_password && formik.touched.c_password && (
            <Text color="red.400" ml={0}>
              {formik.errors.c_password}
            </Text>
          )}

          <Select 
          variant={'underlined'}
          borderColor="gray.300"
          size="lg"
          mb={1}
          accessibilityLabel="Where do you know about us" 
          placeholder="How did you hear about us?" 
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} 
          onValueChange={itemValue => formik.setFieldValue('hearaboutus', itemValue)}
          >
            <Select.Item label="Facebook" value="Facebook" />
            <Select.Item label="Google" value="Google" />
            <Select.Item label="Youtube" value="Youtube" />
            <Select.Item label="Twitter" value="Twitter" />
            <Select.Item label="LinkedIn" value="LinkedIn" />
            <Select.Item label="Blog" value="Blog" />
            <Select.Item label="Newspaper" value="Newspaper" />
            <Select.Item label="Other" value="Other" />
        </Select>
          {formik.errors.hearaboutus && formik.touched.hearaboutus && (
            <Text color="danger.500" ml={0}>{formik.errors.hearaboutus}</Text>
          )}

          <VStack space={4} mb={250}> 
            <Button onPress={formik.handleSubmit}>Register</Button>
            
              <Text><Text>By clicking on the Register button, you agree to our </Text><Text color="success.500" onPress={() => setModalVisible(true)}>Terms and Conditions.</Text></Text>
            
          </VStack>
        </VStack>
      </ScrollView>

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
    </Box>
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

export default Register;
