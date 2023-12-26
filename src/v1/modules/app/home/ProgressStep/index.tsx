import React, {useContext} from 'react';
import {Image, TouchableOpacity} from 'react-native';
import {HStack, Box, VStack, Text} from 'native-base';

import {icons} from '../../../../assets/icons';
import { AuthContext } from "../../../../providers/AuthProvider";

type Props = {
  enabledStep: number;
  onStepPress: (step: number) => void;
};

const ProgressStep = ({enabledStep, onStepPress}: Props) => {
  let auth = useContext(AuthContext);

  return (
    <HStack px={4}>
      <Box flex={1}>
        <TouchableOpacity
          onPress={() => {
            if (enabledStep >= 1) {
              onStepPress(1);
            }
          }}>
          <VStack>
            <Image
              source={enabledStep >= 1 ? icons.task1 : icons.task1red}
              style={{
                resizeMode: 'contain',
                width: '100%',
                height: 100,
              }}
            />
            <Text noOfLines={2} fontSize={'sm'} textAlign={'center'}>
              {`Personal\nInformation`}
            </Text>
          </VStack>
        </TouchableOpacity>
      </Box>
      {auth?.CurrentUser?.show_payment_option != 0 && 
      <Box flex={1}>
        <TouchableOpacity
          onPress={() => {
            if (enabledStep >= 2) {
              onStepPress(2);
            }
          }}>
          <VStack>
            <Image
              source={enabledStep >= 2 ? icons.task3 : icons.task3red}
              style={{
                resizeMode: 'contain',
                width: '100%',
                height: 100,
              }}
            />
            <Text noOfLines={1} fontSize={'sm'} textAlign={'center'}>
              {'Payment'}
            </Text>
          </VStack>
        </TouchableOpacity>
      </Box>
      }

      <Box flex={1}>
        <TouchableOpacity
          onPress={() => {
            if (enabledStep >= 3) {
              onStepPress(3);
            }
          }}>
          <VStack>
            <Image
              source={enabledStep >= 3 ? icons.task2 : icons.task2red}
              style={{
                resizeMode: 'contain',
                width: '100%',
                height: 100,
              }}
            />
            <Text noOfLines={2} fontSize={'sm'} textAlign={'center'}>
              {'Upload\nDocument'}
            </Text>
          </VStack>
        </TouchableOpacity>
      </Box>

      

      <Box flex={1}>
        <TouchableOpacity
          onPress={() => {
            if (enabledStep >= 4) {
              onStepPress(4);
            }
          }}>
          <VStack>
            <Image
              source={enabledStep >= 4 ? icons.task4 : icons.task4red}
              style={{
                resizeMode: 'contain',
                width: '100%',
                height: 100,
              }}
            />
            <Text noOfLines={2} fontSize={'sm'} textAlign={'center'}>
              Submit
            </Text>
          </VStack>
        </TouchableOpacity>
      </Box>
    </HStack>
  );
};

export default ProgressStep;
