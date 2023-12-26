import {Box, Button, Divider, HStack, VStack, Checkbox, Radio, Text, Center, Input} from 'native-base';
import React, {useRef, useState, useEffect, useContext} from 'react';
import {Alert, ScrollView, View, Image, Modal, StyleSheet, ActivityIndicator, Linking} from 'react-native';
import {width, height} from '../../../../utils/validator';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {icons} from '../../../../assets/icons';
import { updateCurrentUser } from "../../../../functions/auth";
import { getPackages, getReloadPaymentGateway, getTaxAmount, saveCouponCode, getPaymentMessage } from "../../../../requests/User";
import PaymentGateway from '../PaymentGateway';
import { AuthContext } from "../../../../providers/AuthProvider";
import {WebView} from "react-native-webview";

type Props = {
  onComplete: () => void;
  onLoading: () => void;
  onFullScreen: () => void;
};

const Payment = ({onComplete, onLoading : setLoading, onFullScreen}: Props) => {
  let auth = useContext(AuthContext);

  const [packages, setPackages] = useState([]);
  const [userCurrentPackage, setUserCurrentPackage] = useState("");
  const [userPaidAmount, setUserPaidAmount] = useState(0);
  const [dueAmount, setDueAmount] = useState(0);
  const [nextPlan, setNextPlan] = useState("");
  const [sSL, setSSL] = useState("");
  const [bKash, setBKash] = useState("");
  //const [packagesChecked, setPackagesChecked] = useState([]);
  const [gatewayLink, setGatewayLink] = useState("");
  const [gatewayName, setGatewayName] = useState("");
  const [termAgree, setTermAgree] = useState(false);
  const [userCurrentPackageMessage, setUserCurrentPackageMessage] = useState(undefined);
  const [modalVisible, setModalVisible] = useState(false);
  const [learnMoreModalVisible, setLearnMoreModalVisible] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showBasic, setShowBasic] = useState(true);
  const [textThankYou, setTextThankYou] = useState([]);
  const [textThankYouB, setTextThankYouB] = useState([]);
  const [textThankYouC, setTextThankYouC] = useState([]);
  const [bBtn1Title, setBBtn1Title] = useState(undefined);
  const [bBtn2Title, setBBtn2Title] = useState(undefined);
  const [bBtn2Link, setBBtn2Link] = useState(undefined);
  const [cBtn1Title, setCBtn1Title] = useState(undefined);
  const [illegibleForPayment, setIllegibleForPayment] = useState(undefined);
  const [couponCode, setCouponCode] = useState("");
  const [enableCouponCode, setEnableCouponCode] = useState(0);
  const [discountText, setDiscountText] = useState("");
  const [discountApplied, setDiscountApplied] = useState(0);
  const [learnMoreLink, setLearnMoreLink] = useState("https://www.bdtax.com.bd/learn_more.html");
  const [termLink, setTermLink] = useState("https://www.bdtax.com.bd/site/temrs");
  const [modalWebviewLink, setModalWebviewLink] = useState("term");
  const [learnMoreHeader, setLearnMoreHeader] = useState("");
  const [learnMorePara, setLearnMorePara] = useState([]);
  const [learnMoreList, setLearnMoreList] = useState([]);

  let isMounted = true;

  const scrollView = useRef<ScrollView>(null);

  const loadPackages = async () => {
    setLoading(true);
    let response = await getPackages();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        let next_plan_id = parseInt(response.data.data?.next_plan_id);
        console.log(next_plan_id, "next_plan_id")
        if( next_plan_id > 0 ){
          //await reloadPaymentGateway(next_plan_id);
          setSSL(response.data.data.sslgatewayLink?.url || "");
          setBKash(response.data.data.bkashURL || "");

          setUserPaidAmount(response.data.data?.userPaidAmount || 0);
          setDueAmount(response.data.data?.due_amount || 0);
        }
        else{
          setUserPaidAmount(response.data.data?.userPaidAmount || 0);
          setDueAmount(response.data.data?.due_amount || 0);
        }
        
        setNextPlan(response.data.data?.next_plan_id);
        setPackages(response.data.data?.packages);

        setTextThankYouB(response.data.data?.thankyoub);
        setTextThankYouC(response.data.data?.thankyouc);

        setBBtn1Title(response.data.data?.b_btn_1_title);
        setBBtn2Title(response.data.data?.b_btn_2_title);
        setBBtn2Link(response.data.data?.b_btn_2_link);
        setCBtn1Title(response.data.data?.c_btn_1_title);

        setUserCurrentPackageMessage(response.data.data?.user_current_package_message || "");
        setTermAgree(false);
        setIllegibleForPayment(response.data.data?.illegible_for_payment || undefined);

        setCouponCode(response.data.data?.coupon_code || "");
        setEnableCouponCode(response.data.data?.enable_coupon || 0);
        setDiscountText(response.data.data?.discount_text || "");
        setDiscountApplied(response.data.data?.discount_applied || 0);
        setLearnMoreLink(response.data.data?.learn_more_link || "");
        setLearnMoreHeader(response.data.data?.learn_more_header || "");
        setLearnMorePara(response.data.data?.learn_more_para || []);
        setLearnMoreList(response.data.data?.learn_more_list || []);

        // test thank you page
        // setShowBasic(false);
        // setShowThankYou(true);
        // setTextThankYou(textThankYouC);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const reloadPaymentGateway = async (next_plan_id) => {
    setLoading(true);
    let response = await getReloadPaymentGateway(next_plan_id);
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        setSSL(response.data.data.sslgatewayLink?.url || "");
        setBKash(response.data.data.bkashURL || "");

        setUserPaidAmount(response.data.data?.userPaidAmount || 0);
        console.log(response.data.data?.due_amount, "due_amount")
        setDueAmount(response.data.data?.due_amount || 0);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  useEffect(() => {
    isMounted = true;

    if(auth?.CurrentUser?.show_payment_option == 0 ){
      Alert.alert("","Payment Option is not enabled.");
      onComplete(1);
    }
    
    handleOnPageLoad();
    return () => { isMounted = false };
  }, []);

  const handleOnPageLoad = async() => {
    await loadPackages();
    await loadTaxAmount(1);
  };

  const handleSubmit = async() => {
    //console.log('File Obj', files);
    await loadTaxAmount(1);
    onComplete();
  };

  const handleSubmitCouponCode = async() => {
    if(!couponCode){
      Alert.alert("","Please enter coupon code.");
      return;
    } 
    console.log('coupon code', couponCode);
    setLoading(true);
    //console.log(values, "values")
    let response = await saveCouponCode(couponCode);
    //alert(JSON.stringify(response, null, 5))
    setLoading(false);
    if (response.ok && response.data && response.data?.success == true) {
      Alert.alert("",response.data?.message);

      await loadPackages();
    } else {
      Alert.alert("",response.data?.message);
    }

  }

  const goToPayment = (payment_gateway) => {
    console.log(nextPlan, "nextPlan");
    if( parseInt(nextPlan) <= 0){
      Alert.alert("","No payment plan for you");
      return;
    }
    if( !termAgree ){
      Alert.alert("","Please accept Terms and Conditions to proceed.");
      return;
    }
    if(payment_gateway === "bkash" && bKash){
      setGatewayName("bkash");
      setGatewayLink(bKash);

      onFullScreen(false);
    }
    else if(payment_gateway === "ssl" && sSL){
      setGatewayName("ssl");
      setGatewayLink(sSL);

      onFullScreen(false);
    }
    
  };

  const loadTaxAmount = async(get_latest_data = null) => {
    let currentOrderAmount = await auth?.CurrentUser?.order_amount;
    let response = await getTaxAmount();
    //alert(JSON.stringify(responsePM, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        let order_amount = parseInt(response.data.data?.order_amount);
        //console.log(order_amount, 'order_amount');
        //console.log(auth.OrderAmount, 'authOrderAmount');
        if( parseInt(currentOrderAmount) < order_amount){ 
          // Order Success
          if( get_latest_data == null ){
            //Alert.alert("","Your BDTax payment has been submitted successfully.");
            setShowThankYou(true);
            if( response.data.data?.response_for != "basic" ){
              setShowBasic(false);
              setTextThankYou(textThankYouC);
            }
            else{
              setShowBasic(true);
              setTextThankYou(textThankYouB); 
            }
            let responsePM = await getPaymentMessage(); // no need -- just for deleting message from server
          }

          await updateCurrentUser({order_amount: response.data.data?.order_amount, file_upload_option : response.data.data?.file_upload_option}, auth);
        }
        else{
          if( get_latest_data == null ){
            let responsePM = await getPaymentMessage();
            Alert.alert("",responsePM.data?.data?.payment_msg);
            //Alert.alert("","Your payment did not go through.");
          }
        }
        await updateCurrentUser({tax_amount: response.data.data?.tax_amount}, auth);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const handleReturn = async(order_type) => {
    console.log(order_type, 'handleReturn');
    if( order_type == "Back" ){
      setTermAgree(false);
      setGatewayName("");
      setGatewayLink("");
      onFullScreen(true);
      return;
    }
    setLoading(true);
    setGatewayName("");
    setGatewayLink("");
    setNextPlan("");
    setPackages([]);
    setUserPaidAmount(0);
    setDueAmount(0);
    onFullScreen(true);
    //console.log("Start");
    let setTimeoutSec = 3000; // 15000 for bKash
    if( order_type == "Cancel" || order_type == "Fail" ){
      setTimeoutSec= 1000;
    }
    else if( order_type == "SuccessSSL" ){
      setTimeoutSec= 6000;
    }
    console.log(setTimeoutSec, 'setTimeoutSec');
    setTimeout(async function () {
      console.log("Start Call");
      await loadTaxAmount();
      await loadPackages();
    }, setTimeoutSec);

  };

  let buttonEnabled = true;

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
    <>
    { gatewayLink == "" ? (
    <VStack space={2} flex={1}>
      <ScrollView ref={scrollView}>

      { showThankYou ? (
        <VStack space={3}>
          <VStack space={3} mt={5} p={5}>
              {textThankYou?.map(line => {
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
          <HStack m={4} space={4}>
          { showBasic ? (
            <>
              <Button flex={1} _text={{'textAlign' : 'center'}} onPress={() => setShowThankYou(false)} >{bBtn1Title}</Button>
              <Button flex={1} _text={{'textAlign' : 'center'}} onPress={() => Linking.openURL(`${bBtn2Link}`)} >{bBtn2Title}</Button>
            </>
            ) : (
              <Button flex={1} _text={{'textAlign' : 'center', 'fontWeight' : 'bold', 'fontSize': 'md'}} onPress={handleSubmit} >{cBtn1Title}</Button>
          )}
          </HStack>
        </VStack>
      ) : (
        <>
        {nextPlan !== "" && 
        <>
        {illegibleForPayment == 1 ? (
        <VStack space={3} mt={2}>
          <Text textAlign={'left'} pl={5} fontSize={14} bold={true}>{userCurrentPackageMessage}</Text>
          
          {/* <Radio.Group 
            flex={1}
            name="radionPackage"
            defaultValue={nextPlan} 
            accessibilityLabel="pick an item" 
            onChange={value => {
              //console.log(value,"valuesvalues");
              setNextPlan(value);
              reloadPaymentGateway(value);
            }}
          > */}
          {parseInt(nextPlan) > 0 && 
            <VStack space={3}>
              {packages?.map(x => {
                  return (
                    <Box pl={5}>
                      <HStack space={3}>
                        {/* <Radio
                          isDisabled={x.status == "0"} 
                          value={x.id}
                          my={1}
                        /> */}
                        <Text noOfLines={3} width={width * .7} bold={x.is_bold == 1}>{x.title} ({x.description})</Text>
                        <Text textAlign={'right'}>{x.price} BDT</Text>
                      </HStack>
                      <VStack space={1} mt={3} mb={1} ml={6} mr={2}>
                      {x.additional_desc?.map(y => {
                          return (
                            <Text textAlign={'left'} fontSize={12}><Image source={icons.nextButton} style={{width: 12, height: 12}} /> {y.ades}</Text>
                            );
                      })}
                      </VStack>
                    </Box>
                  );
              })}
            </VStack>
          }
            {/* </Radio.Group> */}
            {userPaidAmount > 0 && 
              <Box flex={1} >
                <Divider orientation={'horizontal'} />
                <HStack space={3} pl={5} mt={3}>
                  <Text width={width * .68} textAlign={'right'}>Already Paid :</Text>
                  <Text textAlign={'right'} key={userPaidAmount}>{userPaidAmount} BDT</Text>
                </HStack> 
              </Box>
            }
            {dueAmount > 0 &&               
              <Box flex={1}>
                <Divider orientation={'horizontal'} />
                <HStack space={3} pl={5} mt={3}>
                  <Text width={width * .68} textAlign={'right'}>Total Fee Due :</Text>
                  <Text textAlign={'right'} key={dueAmount}>{dueAmount} BDT</Text>
                </HStack>
              </Box>
            }
            {discountApplied == 1 &&               
              <Box flex={1}>
                <Divider orientation={'horizontal'} />
                <HStack space={3} pl={5} mt={3}>
                  <Text width={width * .68} textAlign={'right'}>Discount :</Text>
                  <Text textAlign={'right'} key={discountText}>{discountText}</Text>
                </HStack>
              </Box>
            }
            <Divider orientation={'horizontal'} />
            {enableCouponCode == 1 && 
            <VStack flex={1} mx={5} my={3} space={1}>
              <HStack>
                <Text color={"rgb(242,72,65)"} fontWeight={'bold'} fontSize={16}>Coupon Code</Text>
                <Text color={'success.500'} fontWeight={'bold'} fontSize={12} ml={8} mt={1} onPress={() => setLearnMoreModalVisible(true) }>Learn More</Text>
                <Modal visible={learnMoreModalVisible}>
                    <View style={styles.modal}>
                        <View style={styles.modalContainer}>
                            <Box bgColor={'rgb(10,101,12)'} p={4}>
                              <Text color={'white'} fontWeight={'bold'} fontSize={16}>{learnMoreHeader}</Text>
                            </Box>
                            <ScrollView ref={scrollView}>
                              <Box p={4}>
                              {learnMorePara?.map(line => {
                                return (
                                    <Text fontSize={17} pb={2}>{line.text}</Text>
                                )
                              })}
                              {learnMoreList?.map(line => {
                                return (
                                    <Text fontSize={15} pb={1}>&#8226; {line.text}</Text>
                                )
                              })}
                              </Box>
                            </ScrollView>
                            <Box bgColor={'rgb(10,101,12)'} borderRadius={5} p={4} m={4} position={'absolute'} bottom={0} right={0}>
                              <Text textAlign={'center'} color={'white'} fontWeight={'bold'} fontSize={16} onPress={() => setLearnMoreModalVisible(!learnMoreModalVisible)}>Close</Text>
                            </Box>
                        </View>
                    </View>
                </Modal>
              </HStack>
              <HStack>
                <Input 
                  width={width * .6} 
                  mr={3} 
                  placeholder={"Enter Coupon Code Here"} 
                  height={9}
                  value={couponCode}
                  onChangeText={val => setCouponCode(val)}></Input>
                <Button py={1} onPress={handleSubmitCouponCode}>Apply</Button>
              </HStack>
            </VStack>
            }

          {parseInt(nextPlan) > 0 && 
            <Box flex={1} pl={5} pr={5}>
              <Box my={3}>
                <HStack space={2}>
                  <Checkbox 
                    key="termAgree"
                    value={termAgree} 
                    onChange={val => setTermAgree(val)}
                  >
                  </Checkbox>
                  
                    <Text mt={-1} mr={2}><Text>By checking this box you agree to our </Text><Text color="success.500" onPress={() => {setModalWebviewLink("term"); setModalVisible(true)}}>Terms and Conditions.</Text></Text>
                  
                </HStack>
                <Text mt={3}>Please select your payment method by clicking on the payment icon below</Text>
                <Modal visible={modalVisible}>
                    <View style={styles.modal}>
                        <View style={styles.modalContainer}>
                            <WebView 
                                renderLoading={ActivityIndicatorLoadingView}
                                style={{ flex : 1 }} 
                                source={{uri: modalWebviewLink == 'learnmore' ? learnMoreLink : termLink}}
                            />
                            <Button onPress={() => setModalVisible(!modalVisible)}>Close</Button>
                        </View>
                    </View>
                </Modal>
              </Box>
              <HStack space={2}>
                <TouchableOpacity onPress={() => goToPayment('bkash')}>
                    <Image
                      source={icons.bkash}
                      style={{
                        height: width * .2,
                        width: width * .2,
                        resizeMode: 'contain',
                      }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => goToPayment('ssl')}>
                    <Image
                      source={icons.visa}
                      style={{
                        height: width * .2,
                        width: width * .2,
                        resizeMode: 'contain',
                      }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => goToPayment('ssl')}>
                    <Image
                      source={icons.master}
                      style={{
                        height: width * .2,
                        width: width * .2,
                        resizeMode: 'contain',
                      }}
                    />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => goToPayment('ssl')}>
                    <Image
                      source={icons.amex}
                      style={{
                        height: width * .2,
                        width: width * .2,
                        resizeMode: 'contain',
                      }}
                    />
                </TouchableOpacity>
              </HStack>
              <Text mt={3} mb={5}>Your payment will be processed by Bkash or SSL Commerz. Please do not close the browser during payment processing. It may take upto 1 minute to process your payment.</Text>
            </Box>
          } 
            <Button isDisabled={!userPaidAmount || userPaidAmount <= 0} key={userPaidAmount} onPress={handleSubmit} flex={1} mb={5} mx={5}>Upload Document</Button>
        </VStack>
        ) : (
          <VStack space={3} mt={5} p={5}>
              {textThankYouB?.map(line => {
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
        )
        }
        </>
        }
        </>
      )}
      </ScrollView>
    </VStack>
    ) : (
    <Box flex={1}>
      <PaymentGateway
        gatewayLink={gatewayLink}
        gatewayName={gatewayName}
        onReturn={handleReturn}
      />
    </Box>
    ) }
    </>
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

export default Payment;
