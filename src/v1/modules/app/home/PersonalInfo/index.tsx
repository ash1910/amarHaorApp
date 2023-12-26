import React, {useState, useEffect, useContext} from 'react';
import {Image, Alert, Linking} from 'react-native';
import {useFormik} from 'formik';
import * as Yup from 'yup';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Application from 'expo-application';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {
  Button,
  IconButton,
  Divider,
  HStack,
  Input,
  Radio,
  ScrollView,
  Text,
  VStack,
  Select,
  CheckIcon,
  Center
} from 'native-base';
import { getDivisions, getProfile, getAreas, saveProfile, getTaxAmount, getTaxZoneCircles } from "../../../../requests/User";
import { AuthContext } from "../../../../providers/AuthProvider";
import { updateCurrentUser } from "../../../../functions/auth";
import {icons} from '../../../../assets/icons';

type Props = {
  onComplete: () => void;
  onLoading: () => void;
};

const PersonalInfo = ({onComplete, onLoading : setLoading, navigation}: Props) => {
  let auth = useContext(AuthContext);
  //const dispatch = useDispatch();
  const [profile, setProfile] = useState({});
  const [divisions, setDivisions] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [areas, setAreas] = useState([]);
  const [circles, setCircles] = useState({});
  const [zones, setZones] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showEmail, setShowEmail] = useState(true);
  const [showETIN, setShowETIN] = useState(true);
  const [showMobile, setShowMobile] = useState(true);
  const [gShowUpdateWarning, setGShowUpdateWarning] = useState(0);
  const [gUpdateWarning, setGUpdateWarning] = useState("");
  const [gCurrentAppVersion, setGCurrentAppVersion] = useState("");
  const [gUpdateLink, setGUpdateLink] = useState("");

  let isMounted = true;
  const loadDivisions = async () => { 
    setLoading(true);
    let area_ = await loadAreas();
    let profile_ = await loadProfile();
    let response = await getDivisions();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        let divisionList = response.data.data;
        let divList = [];
        let disList = [];
        divisionList.forEach(div => {
          divList.push({id: div.id, title: div.title})
          let divdis = div.dis || [];
          divdis.forEach(dis => {
            disList.push({id: dis.id, title: dis.name, div_id: div.id})
          });
        });
        await setDivisions(divList);
        await setDistricts(disList);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };
  const loadProfile = async () => {
    //console.log(Application.nativeApplicationVersion)
    setLoading(true);
    let response = await getProfile();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        if(response.data.data?.etin_status == 0) setShowETIN(false);
        if(response.data.data?.mobile_status == 0) setShowMobile(false);
        if(response.data.data?.email_status == 0) setShowEmail(false);
        
        await setProfile(response.data.data);

        checkAppVersion(response.data.data);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const loadAreas = async () => {
    setLoading(true);
    let response = await getAreas();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        setAreas(response.data.data);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const loadTaxZoneCircles = async() => {
    let response = await getTaxZoneCircles();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        await setCircles(response.data.data?.circles || {});
        await setZones(response.data.data?.zones || {});
      }
    }
  };

  const loadTaxAmount = async() => {
    let response = await getTaxAmount();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
          await updateCurrentUser({tax_amount: response.data.data?.tax_amount}, auth);
      }
    }
  };

  const checkAppVersion = (profileData) => {
      let g_update_warning = profileData?.upgrade_status?.g_update_warning ?? ""
      let g_update_link = profileData?.upgrade_status?.g_update_link ?? ""
      let g_show_update_warning = profileData?.upgrade_status?.g_show_update_warning ?? 0
      let g_current_app_version = profileData?.upgrade_status?.g_current_app_version ? profileData?.upgrade_status?.g_current_app_version.split('.').join("") : ""
      let nativeApplicationVersion = Application.nativeApplicationVersion ? Application.nativeApplicationVersion.split('.').join("") : ""
      console.log("nativeApplicationVersion", nativeApplicationVersion)
      console.log("g_current_app_version", g_current_app_version)
      if( parseInt(nativeApplicationVersion) < parseInt(g_current_app_version) && (g_show_update_warning == 1)  ){
        Alert.alert(
          'App Update',
          g_update_warning,
          [
            {
              text: 'Cancel',
              onPress: () => {
                console.log('We are doing nothing');
              },
            },
            {
              text: 'Update',
              onPress: () => {
                Linking.openURL(g_update_link);
              },
            },
          ],
          {
            cancelable: true,
          },
        );
      }
    };

  useEffect(() => {
    isMounted = true;

    loadDivisions();
    loadTaxZoneCircles();
    loadTaxAmount();

    return () => { isMounted = false };
  }, [navigation]);

  const submitProfile = async (values) =>  {
    setLoading(true);
    //console.log(values, "values")
    let response = await saveProfile(values);
    //alert(JSON.stringify(response, null, 5))
    setLoading(false);
    if (response.ok && response.data && response.data?.success == true) {
      Alert.alert("",response.data?.message);

      if(auth?.CurrentUser?.redirect_to == 1 ){
        onComplete(2);
      }
      else if(auth?.CurrentUser?.redirect_to == 2 ){
        onComplete(3);
      }
      else{
        onComplete(2);
      }
      
    } else {
      let message = response.data?.message;
      if (response.data && response.data?.data) {
        let v_m = validationMessage(response.data?.data);
        //if(v_m) message = "\n" + message + "\n" +  v_m;
      }
      Alert.alert("",message);
    }
  }

  const getDOBDDMMYYYY = (date) => {
    console.log(date, "datedate")
    let DOB = new Date(date ?? '');
    DOB = DOB.getDate().toString().padStart(2,"0") +"-"+ (parseInt(DOB.getMonth()) + 1).toString().padStart(2,"0") + "-" +  DOB.getFullYear();
    return DOB;
  }



  const initialValues = {
    Name: profile?.Name ?? '',
    Contact: profile?.Contact ?? '',
    Email: profile?.Email ?? '',
    ETIN: profile?.ETIN ?? '',
    NationalId: profile?.NationalId ?? '',
    Gender: profile?.Gender ?? 'Male',
    DOB: profile?.DOB ?? '',
    GovernmentEmployee: profile?.GovernmentEmployee ?? 'N',
    FreedomFighter: profile?.FreedomFighter ?? 'N',
    Disability: profile?.Disability ?? 'NO',
    TaxesCircle: profile?.TaxesCircle ?? '',
    TaxesZone: profile?.TaxesZone ?? '',
    DivisionId: profile?.DivisionId ?? '',
    DistrictId: profile?.DistrictId ?? '',
    PresentAddress: profile?.PresentAddress ?? '',
    PermanentAddress: profile?.PermanentAddress ?? '',
    AddressSame: profile?.AddressSame+"" ?? '1',
    AreaOfResidence: parseInt(profile?.AreaOfResidence) ?? '',
  };

  const validationSchema = Yup.object().shape({
    Name: Yup.string().required('Full name is required'),
    Contact: Yup.number().required('Contact is required'),
    Email: Yup.string().email('Invalid email').required('Email is required'),
    ETIN: Yup.number().min(13, 'Must be 13 digits').nullable(true),
    NationalId: Yup.string().required('National Id is required'),
    Gender: Yup.string().required('Gender is required'),
    DOB: Yup.string().required('Date of Birth is required'),
    GovernmentEmployee: Yup.string().required('Government Employee is required'),
    FreedomFighter: Yup.string().required('Freedom Fighter is required'),
    Disability: Yup.string().required('Disability is required'),
    TaxesCircle: Yup.string(),
    TaxesZone: Yup.string(),
    DivisionId: Yup.string().required('Division is required'),
    DistrictId: Yup.string().required('District is required'),
    PresentAddress: Yup.string().required('Present Address is required'),
    PermanentAddress: Yup.string().when('AddressSame',
      (AddressSame,schema)=>{
          if(AddressSame === "1"){
            return schema;
          }else{
            return schema.required('Permanent Address is required');
          }
      }),
    AddressSame: Yup.string(),
    AreaOfResidence: Yup.number().required('Area Of Residence is required')
  });

  const validationMessage = v_m_a => {      
    let v_m = "";
    Object.keys(v_m_a).forEach(i_p => {
      v_m = v_m + "\n" + i_p.charAt(0).toUpperCase() + i_p.slice(1) + " : ";
      let v_m_i = "";
      v_m_a[i_p].forEach(v_c => {
        v_m_i = v_m_a[i_p].length > 1 ? v_m_i + v_c + ", " : v_m_i + v_c;
      });
      v_m = v_m + v_m_i;
      formik.setFieldError(i_p, v_m_i);
    });
    return v_m; 
  }

  const formik = useFormik({
    validateOnChange: false,
    validateOnBlur: false,
    validateOnMount: false,
    enableReinitialize: true,
    initialValues,
    //validationSchema,
    onSubmit: values => {
      //alert(JSON.stringify(values, null, 5))
      //console.log(values);
      submitProfile(values);
    },
  });

  return (
    <ScrollView>
      <VStack
        space={4}
        p={4}
        pb={20}
        divider={<Divider orientation={'horizontal'} />}>

        <VStack space={2}>
          <Text>Please enter your ETIN</Text>
          <Input
            size="md"
            value={formik.values.ETIN}
            onChangeText={formik.handleChange('ETIN')}
            onBlur={formik.handleBlur('ETIN')}
            placeholder="Your ETIN number"
            borderColor="gray.300"
            keyboardType={'number-pad'}
            maxLength={13}
            isDisabled={!showETIN}
          />
          {formik.errors.ETIN && formik.touched.ETIN && (
            <Text color="danger.500">{formik.errors.ETIN}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>Please enter your national ID</Text>
          <Input
            size="md"
            value={formik.values.NationalId}
            onChangeText={formik.handleChange('NationalId')}
            onBlur={formik.handleBlur('NationalId')}
            placeholder="Your National Id"
            borderColor="gray.300"
            keyboardType={'number-pad'}
            maxLength={17}
          />
          {formik.errors.NationalId && formik.touched.NationalId && (
            <Text color="danger.500">{formik.errors.NationalId}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>Please enter your full name *</Text>
          <Input
            size="md"
            value={formik.values.Name}
            onChangeText={formik.handleChange('Name')}
            onBlur={formik.handleBlur('Name')}
            placeholder="Your full name"
            borderColor="gray.300"
          />
          {formik.errors.Name && formik.touched.Name && (
            <Text color="danger.500">{formik.errors.Name}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>Please enter your date of birth*</Text>
          <HStack space={2}>
            <Center>{formik.values.DOB ? getDOBDDMMYYYY(formik.values.DOB) : "DD-MM-YYYY"}</Center>
            <TouchableOpacity  
              onPress={() => setShowDatePicker(Platform.OS !== 'ios' ? true : showDatePicker === true ? false : true)}>
              <Image source={icons.calendar}  style={{width: 16, height: 16}} />
            </TouchableOpacity>
          </HStack>
          {showDatePicker && (<DateTimePicker
            value={new Date(formik.values.DOB || '2000-01-01')} 
            display={Platform.OS === 'ios' ? "spinner" : 'default'}
            mode="date"
            onChange={ (event, DOB) => {
              setShowDatePicker(Platform.OS === 'ios');
              console.log(DOB, "DOB Date")
              let DOBDate = new Date(DOB || "");
              DOBDate = DOB.getFullYear() +"-"+ (parseInt(DOB.getMonth()) + 1).toString().padStart(2,"0") + "-" + DOB.getDate().toString().padStart(2,"0");
              formik.setFieldValue('DOB', DOBDate)
              //console.log(formik.values.DOB, "DOB")
            }}
           /> 
           )}
          {formik.errors.DOB && formik.touched.DOB && (
            <Text color="danger.500">{formik.errors.DOB}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>Please select your gender*</Text>
          <Radio.Group
            name="Gender"
            value={formik.values.Gender}
            onChange={nextValue => {
              if (nextValue === 'Male' || 'Female') {
                formik.setFieldValue('Gender', nextValue);
              }
            }}>
            <HStack space={4}>
              <Radio value="Male" my={1}>
                Male
              </Radio>
              <Radio value="Female" my={1}>
                Female
              </Radio>
            </HStack>
          </Radio.Group>
        </VStack>

        <VStack space={2}>
          <Text>Do you have any kind of disability?*</Text>
          <Radio.Group
            name="Disability"
            value={formik.values.Disability}
            onChange={nextValue => {
              if (nextValue === 'YES' || 'NO') {
                formik.setFieldValue('Disability', nextValue);
              }
            }}>
            <HStack space={4}>
              <Radio value="YES" my={1}>
                Yes
              </Radio>
              <Radio value="NO" my={1}>
                No
              </Radio>
            </HStack>
          </Radio.Group>
        </VStack>

        <VStack space={2}>
          <Text>Are you a gazetted war wounded freedom fighter?*</Text>
          <Radio.Group
            name="Freedom Fighter"
            value={formik.values.FreedomFighter}
            onChange={nextValue => {
              if (nextValue === 'Y' || 'N') {
                formik.setFieldValue('FreedomFighter', nextValue);
              }
            }}>
            <HStack space={4}>
              <Radio value="Y" my={1}>
                Yes
              </Radio>
              <Radio value="N" my={1}>
                No
              </Radio>
            </HStack>
          </Radio.Group>
        </VStack>

        <VStack space={2}>
          <Text>Are you a government employee?*</Text>
          <Radio.Group
            name="Government Employee"
            value={formik.values.GovernmentEmployee}
            onChange={nextValue => {
              if (nextValue === 'Y' || 'N') {
                formik.setFieldValue('GovernmentEmployee', nextValue);
              }
            }}>
            <HStack space={4}>
              <Radio value="Y" my={1}>
                Yes
              </Radio>
              <Radio value="N" my={1}>
                No
              </Radio>
            </HStack>
          </Radio.Group>
        </VStack>
          
        <VStack space={2}>
          <Text>Area of residence *</Text>
          <Select 
          size="md"
          selectedValue={formik.values.AreaOfResidence} 
          minWidth="200" 
          accessibilityLabel="Choose Area Of Residence" 
          placeholder="Choose Area Of Residence" 
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} 
          borderColor="gray.300"
          onValueChange={itemValue => {
            formik.setFieldValue('AreaOfResidence', itemValue)
          }}
          >
            {areas?.map(x => {
              return (
                <Select.Item
                  label={x.name}
                  value={x.id}
                  key={x.id}
                />
              );
            })}
        </Select>
          {formik.errors.AreaOfResidence && formik.touched.AreaOfResidence && (
            <Text color="danger.500">{formik.errors.AreaOfResidence}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>Taxes Circle</Text>
          <Select 
          size="md"
          selectedValue={formik.values.TaxesCircle} 
          minWidth="200" 
          accessibilityLabel="Choose Taxes Circle" 
          placeholder="Choose Taxes Circle" 
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} 
          borderColor="gray.300"
          onValueChange={itemValue => formik.setFieldValue('TaxesCircle', itemValue)}
          >
            {circles[formik.values.AreaOfResidence]?.map(x => {
              return (
                <Select.Item
                  label={String(x)}
                  value={String(x)}
                  key={String(x)}
                />
              );
            })}
        </Select>
          {formik.errors.TaxesCircle && formik.touched.TaxesCircle && (
            <Text color="danger.500">{formik.errors.TaxesCircle}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>Taxes Zone</Text>
          <Select 
          size="md"
          selectedValue={formik.values.TaxesZone} 
          minWidth="200" 
          accessibilityLabel="Choose Taxes Zone" 
          placeholder="Choose Taxes Zone" 
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} 
          borderColor="gray.300"
          onValueChange={itemValue => formik.setFieldValue('TaxesZone', itemValue)}
          >
            {zones[formik.values.AreaOfResidence]?.map(x => {
              return (
                <Select.Item
                  label={String(x)}
                  value={String(x)}
                  key={String(x)}
                />
              );
            })}
        </Select>
          {formik.errors.TaxesZone && formik.touched.TaxesZone && (
            <Text color="danger.500">{formik.errors.TaxesZone}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>Please enter your present address*</Text>
          <Input
            size="md"
            value={formik.values.PresentAddress}
            onChangeText={formik.handleChange('PresentAddress')}
            onBlur={formik.handleBlur('PresentAddress')}
            placeholder="Present Address"
            borderColor="gray.300"
          />
          {formik.errors.PresentAddress && formik.touched.PresentAddress && (
            <Text color="danger.500">{formik.errors.PresentAddress}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>Division</Text>
          <Select 
          size="md"
          selectedValue={formik.values.DivisionId} 
          minWidth="200" 
          accessibilityLabel="Choose Division" 
          placeholder="Choose Division" 
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} 
          borderColor="gray.300"
          onValueChange={itemValue => {
            formik.setFieldValue('DistrictId', '')
            //let disList = divisions.find(x => x.id === itemValue)?.dis;
            //alert(disList)
            //setDistricts(disList);
            formik.setFieldValue('DivisionId', itemValue)
          }}
          >
            {divisions?.map(x => {
              return (
                <Select.Item
                  label={x.title}
                  value={x.id}
                  key={x.id}
                />
              );
            })}
        </Select>
          {formik.errors.DivisionId && formik.touched.DivisionId && (
            <Text color="danger.500">{formik.errors.DivisionId}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>District</Text>
          <Select 
          size="md"
          selectedValue={formik.values.DistrictId} 
          minWidth="200" 
          accessibilityLabel="Choose District" 
          placeholder="Choose District" 
          _selectedItem={{
            bg: "teal.600",
            endIcon: <CheckIcon size="5" />
          }} 
          borderColor="gray.300"
          onValueChange={itemValue => formik.setFieldValue('DistrictId', itemValue)}
          >
            {districts?.filter(dx => dx.div_id === formik.values.DivisionId).map(x => {
              return (
                <Select.Item
                  label={x.title}
                  value={x.id}
                  key={x.id}
                />
              );
            })}
        </Select>
          {formik.errors.DistrictId && formik.touched.DistrictId && (
            <Text color="danger.500">{formik.errors.DistrictId}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>Is your present address same as permanent address?</Text>
          <Radio.Group
            name="Address Same"
            value={formik.values.AddressSame}
            onChange={nextValue => {
              if (nextValue === '1' || '0') {
                formik.setFieldValue('AddressSame', nextValue);
              }
            }}>
            <HStack space={4}>
              <Radio value="1" my={1}>
                Yes
              </Radio>
              <Radio value="0" my={1}>
                No
              </Radio>
            </HStack>
          </Radio.Group>
        </VStack>

        {formik.values.AddressSame !== "1" &&
        <VStack space={2}>
          <Text>Please enter your permanent address</Text>
          <Input
            size="md"
            value={formik.values.PermanentAddress}
            onChangeText={formik.handleChange('PermanentAddress')}
            onBlur={formik.handleBlur('PermanentAddress')}
            placeholder="Permanent Address"
            borderColor="gray.300"
          />
          {formik.errors.PermanentAddress && formik.touched.PermanentAddress && (
            <Text color="danger.500">{formik.errors.PermanentAddress}</Text>
          )}
        </VStack>
        }

        <VStack space={2}>
          <Text>Contact Details</Text>
          <Input
            size="md"
            value={formik.values.Contact}
            onChangeText={formik.handleChange('Contact')}
            onBlur={formik.handleBlur('Contact')}
            placeholder="Your Mobile Number"
            borderColor="gray.300"
            isDisabled={!showMobile}
          />
          {formik.errors.Contact && formik.touched.Contact && (
            <Text color="danger.500">{formik.errors.Contact}</Text>
          )}
        </VStack>

        <VStack space={2}>
          <Text>Email</Text>
          <Input
            size="md"
            value={formik.values.Email}
            onChangeText={formik.handleChange('Email')}
            onBlur={formik.handleBlur('Email')}
            placeholder="Your Email Address"
            borderColor="gray.300"
            keyboardType={'email-address'}
            isDisabled={!showEmail}
          />
          {formik.errors.Email && formik.touched.Email && (
            <Text color="danger.500">{formik.errors.Email}</Text>
          )}
        </VStack>

        <Button onPress={formik.handleSubmit}>SAVE</Button>
      </VStack>

    </ScrollView>
  );
};

export default PersonalInfo;
