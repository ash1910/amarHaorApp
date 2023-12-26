import React from 'react';

import {Image, View} from 'react-native';
import {Text, Box, HStack, ScrollView, VStack, IconButton, Center} from 'native-base';
import {TouchableOpacity} from 'react-native-gesture-handler';
//import Pdf from 'react-native-pdf';
import {icons} from '../../../../../assets/icons';

type Props = {
  fileKey: number;
  filePosition: number;
  showPdf: number;
  isSignature: number;
  signature: string;
  files: array;
  localFiles: array;
  onTakePicturePress: (fileKey: number, filePosition: number, showPdf: number, isSignature: number) => void;
  onDeletePicturePress: (fileKey: string, index: number) => void;
  onDownloadFilePress: (fileKey: string, file_type: string) => void;
  buttonText: string;
};

const FileImages = ({
  fileKey,
  filePosition,
  showPdf,
  isSignature,
  signature,
  files,
  localFiles,
  onTakePicturePress,
  onDeletePicturePress,
  onDownloadFilePress,
  buttonText,
}: Props) => {
  return (
    <Box p={2} key={`FIB${fileKey}`}>
      <ScrollView
        key={`FIS${fileKey}`}
        horizontal
        contentContainerStyle={{flexGrow: 1, justifyContent: 'center'}}>
        <HStack justifyContent={'center'} my={3} space={2} key={`FIHS1${fileKey}`}>
          <TouchableOpacity key={`FITO${fileKey}`} onPress={() => onTakePicturePress(fileKey, filePosition, showPdf, isSignature)}>
            <View
              key={`FIV1${fileKey}`}
              style={{
                height: 120,
                width: 120,
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <Image
                key={`FIIM1${fileKey}`}
                source={icons.camera}
                style={{
                  height: 80,
                  width: 80,
                  resizeMode: 'contain',
                }}
              />
            </View>
          </TouchableOpacity>

          { (isSignature == 1 && signature != "") &&
            <VStack key={`FIVS1S`} alignItems={'center'} space={0}>
                <Image
                    key={`FIIM2S`}
                    source={{uri: signature}}
                    style={{
                      height: 120,
                      width: 120,
                      resizeMode: 'contain',
                    }}
                />
            </VStack>
          }

          {files.map(file => {
            let previewUrl = localFiles[file.id] ? localFiles[file.id] : "";
            let file_type = '';
            if(previewUrl){
              if( previewUrl.endsWith('pdf') ){
                file_type = 'pdf';
              }
              else{
                file_type = 'image';
              }
            }
            else if(file.file_path){
              let filePath = file.file_path;
              if( filePath.endsWith('pdf') ){
                file_type = 'pdf';
              }
              else{
                file_type = 'image';
              }
            }
            if( previewUrl || file.file_path)
            return (
              <VStack key={`FIVS1${file.id}`} alignItems={'center'} space={0}>
                {file_type == 'pdf' ? (
                  <Center width={120} height={120} key={`FIC1${file.id}`}>
                    <Image
                      key={`FIIM1${file.id}`}
                      source={icons.pdf}
                      style={{
                        height: 80,
                        width: 80,
                        resizeMode: 'contain',
                      }}
                    />
                  </Center>
                ) : (
                  <>
                  {previewUrl ? (
                    <Image
                      key={`FIIM2${file.id}`}
                      source={{uri: previewUrl}}
                      style={{
                        height: 120,
                        width: 120,
                        resizeMode: 'contain',
                      }}
                    />
                  ) : (
                    <Center width={120} height={120} key={`FIC2${file.id}`}>
                      <Image
                        key={`FIIM3${file.id}`}
                        source={icons.image}
                        style={{
                          height: 80,
                          width: 80,
                          resizeMode: 'contain',
                        }}
                      />
                    </Center>
                  )
                }
                </>
                )}

                <IconButton
                  key={`FIIC1${file.id}`}
                  position={'absolute'}
                  onPress={() => onDeletePicturePress(file.id)}
                  width={10}
                  right={0}
                  size={'sm'}
                  variant="solid"
                  colorScheme={'danger'}
                  key={file.id}
                  icon={<Image source={icons.trash} style={{tintColor: 'white', width: 16, height: 16}} />}
                />
                <IconButton
                  key={`FIIC2${file.id}`}
                  position={'absolute'}
                  onPress={() => onDownloadFilePress(file.id, file_type)}
                  width={10}
                  left={0}
                  size={'sm'}
                  variant="solid"
                  colorScheme={'danger'}
                  key={file.id}
                  icon={<Image source={icons.download} style={{tintColor: 'white', width: 16, height: 16}} />}
                />
              </VStack>
            );
          })}
        </HStack>
      </ScrollView>

      <Text key={`FITX2${fileKey}`} textAlign={'center'} noOfLines={2}>{buttonText}</Text>
    </Box>
  );
};

export default FileImages;
