import React, {useEffect, useState} from 'react';
import {ScrollView, VStack, Box, Center, Spinner, HStack, Text} from 'native-base';
import {Alert, Image, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';

import {icons} from '../../../assets/icons';
import {width, height} from '../../../utils/validator';
import { getOrderStatus } from "../../../requests/User";


const OrderStatus = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [orderStatusList, setOrderStatusList] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);

  let isMounted = true;

  const loadOrderStatus = async () => {
    setLoading(true);
    let response = await getOrderStatus();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        let orderStList = [];
        response.data?.data?.forEach(x => {
            let item = {
                status : x.status,
                title : x.title,
                timeAMPM : x.date != "" ? getTime(x.date, true) : "",
                date : x.date != "" ? getTime(x.date, false) : ""
            }
            orderStList.push(item);

            if( x.title == "Completed" && x.status == 1 ){
                setIsCompleted(true);
            }
        });
        setOrderStatusList(orderStList);
      }
    }
    else{
      Alert.alert("",response.data.message?.error);
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const getTime = (vdatetime, isTime) => {
    const [vdate, vtime] = vdatetime.split(' ');
    const [vyear, vmonth, vday] = vdate.split('-');
    const [vhour, vmin] = vtime.split(':');
    const months = ['Jan', 'Feb', 'March', 'April', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
    const monthday =  months[parseInt(vmonth)-1] + " " + vday;
    const timeampm = (parseInt(vhour) > 12 ? (parseInt(vhour) - 12).toString().padStart(2,"0") : vhour) + ":" + vmin + " " + (parseInt(vhour) > 12 ? "pm" : "am");
    return isTime ? timeampm : monthday;
  }

  useEffect(() => {
    isMounted = true;
    loadOrderStatus();
    return () => { isMounted = false };
  }, [navigation]);

  return (
    <Box flex={1}>
        <ScrollView flex={1}>
            <Box>
                <Image
                    source={icons.page3_bg_top}
                    style={{width: width, height: 160, resizeMode: 'cover'}}
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
            <Text px={5} mt={3} mb={6} color={'rgb(60,60,60)'} textAlign={'left'} fontSize={20} fontWeight={'bold'}>Your Order Status</Text>
            {orderStatusList && 
                <Box mx={10}>

                    <Box ml={7} width={'100%'} height={18} borderLeftWidth={2} borderLeftColor={'#808080'}></Box>
                    
                    {orderStatusList?.map((x, index) => {
                        return (
                            <>
                                <HStack space={6}>
                                    <Center height={60} width={60} bgColor={x.status == 1 ? 'green.500' : 'red.500'} color={'white'} borderRadius={50}
                                    _text={{
                                        color: 'white'
                                    }}>{x.date}</Center>

                                    <VStack justifyContent={'center'}>
                                        {x.date != "" && 
                                        <Text color={'gray.500'} fontSize={12}>{x.timeAMPM}</Text>
                                        }
                                        <Text color={'#339bf0'} fontWeight={'bold'} fontSize={18}>{x.title}</Text>
                                    </VStack>
                                </HStack>
                                { index < (orderStatusList.length - 1) &&
                                    <Box ml={7} width={'100%'} height={35} borderLeftWidth={2} borderLeftColor={'#808080'}></Box>
                                }
                                
                                
                            </>
                        );
                    })}
                    <Box ml={7} mb={8} width={'100%'} height={18} borderLeftWidth={2} borderLeftColor={'#808080'}></Box>

                { isCompleted && 
                    <>
                        <Text pt={0} pb={0} color={'rgb(231,37,100)'}  fontSize={20} fontWeight={'bold'} textAlign={'center'}>Congratulations!</Text>
                        <Text pb={10} color={'rgb(60,60,60)'}  fontSize={16} fontWeight={'bold'} textAlign={'center'}>Thank you for choosing BDTax</Text>
                    </>
                }
                </Box>
            }
        </ScrollView>
        {loading &&
        <Center position={'absolute'} top={0} left={0} bottom={0} right={0} backgroundColor={'black'} opacity={.5}>
            <Spinner color="emerald.500" />
        </Center>
        }
    </Box>
  );
};

export default OrderStatus;
