import React, {useContext, useState} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {Box, HStack, Text} from 'native-base';
import {icons} from '../../../../assets/icons';
import {WebView} from "react-native-webview";
import { BACKEND_BASE } from "../../../../config";
import { AuthContext } from "../../../../providers/AuthProvider";

type Props = {
  gatewayLink: string;
  gatewayName: string;
  onReturn: (order_type: string) => void;
};

const PaymentGateway = ({
    gatewayLink,
    gatewayName,
    onReturn,
}: Props) => {
    let auth = useContext(AuthContext);
    const [gatewayStatus, setGatewayStatus] = useState("NoteSure");

    function _onNavigationStateChange(webViewState){
        console.log(webViewState);
        //Bkash LOG 1 {"canGoBack": false, "canGoForward": false, "loading": false, "navigationType": "other", "target": 5005, "title": "Payment only", "url": "https://api.bdtax.com.bd/public/api/validate-bkash?paymentID=TR0011x8T3jsu1700283761277&status=success&apiVersion=1.2.0-beta"}
        //Bkash LOG 2 {"canGoBack": false, "canGoForward": false, "loading": true, "navigationType": "other", "target": 5005, "title": "Payment only", "url": "https://api.bdtax.com.bd/public/api/end-bkash"}
        //Bkash LOG 3 {"canGoBack": true, "canGoForward": false, "loading": false, "target": 5005, "title": "", "url": "https://api.bdtax.com.bd/public/api/end-bkash"}
        
        let uri = webViewState.url;

        if(gatewayName == 'bkash'){
            // when cancel : return URL : https://devapi.bdtax.com.bd/public/api/validate-bkash?paymentID=TR0011JS1653995194169&status=cancel&apiVersion=1.2.0-beta
            // sometimes only return URL : https://api.bdtax.com.bd/public/api/end-bkash   (there are no status)
            if(uri.startsWith(BACKEND_BASE + "end-bkash")){ // return payment page only from here
                let capturedStatus = /status=([^&]+)/.exec(uri);
                let statusBk = capturedStatus ? capturedStatus[1] : ''; 
                if( statusBk == "cancel"){
                    setGatewayStatus('Cancel');
                    onReturn(gatewayStatus);
                }
                else{
                    onReturn(gatewayStatus);
                }
            }
            // when success : return URL : https://api.bdtax.com.bd/public/api/validate-bkash?paymentID=TR0011x8T3jsu1700283761277&status=success&apiVersion=1.2.0-beta
            else if(uri.startsWith(BACKEND_BASE + "validate-bkash")){
                let capturedStatus = /status=([^&]+)/.exec(uri);
                let statusBk = capturedStatus ? capturedStatus[1] : ''; 
                if( statusBk == "cancel"){
                    setGatewayStatus('Cancel');
                }
                else if( statusBk == "success"){
                    setGatewayStatus('Success');
                }
                else{
                    setGatewayStatus('NoteSure');
                }
            }
        }
        else{
            if(uri.startsWith(BACKEND_BASE + "success")){
                onReturn('SuccessSSL');
            }
            else if(uri.startsWith(BACKEND_BASE + "fail")){
                onReturn('Fail');
            }
            else if(uri.startsWith(BACKEND_BASE + "cancel")){
                onReturn('Cancel');
            }
            else if(uri.startsWith(BACKEND_BASE)){
                onReturn('NoteSure');
            }
        }
            
    };

  return (
    <Box flex={1} backgroundColor={'primary.500'} maxHeight={700}>
        <HStack p={2} space={2}>
            <TouchableOpacity  
                onPress={() => onReturn('Back')}>
                <Image source={icons.leftArrow} style={{tintColor: 'white'}} />
            </TouchableOpacity>
            <Text flex={1} color={'white'} fontSize={'lg'} ml={2}>
                Tax Owed: {auth?.CurrentUser?.tax_amount || '0.00'} BDT
            </Text>
        </HStack>
        <WebView 
            source={{ uri: gatewayLink }} 
            onNavigationStateChange={_onNavigationStateChange.bind(this)}
        />
    </Box>
  );
};

export default PaymentGateway;
