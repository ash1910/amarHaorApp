import {Box, Button, Divider, VStack} from 'native-base';
import React, {useRef, useState, useEffect, useContext} from 'react';
import {Alert, Platform, ScrollView, Linking} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
//import useCamera from '../../../../hooks/useCamera';
import useImagePicker from '../../../../hooks/useImagePicker';
import FileImages from './FileImages';
import * as DocumentPicker from 'expo-document-picker';
import { getFiles, setFiles, removeFile, updateCurrentUser } from "../../../../functions/auth";
import { getFileTypes, saveFile, deleteFile, getDownloadUserFile, getTaxAmount, getSignature } from "../../../../requests/User";
import { AuthContext } from "../../../../providers/AuthProvider";

import * as ImagePicker from 'expo-image-picker';
import { ImageEditor } from "expo-image-editor";
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as MediaLibrary from 'expo-media-library';
import { APP_NAVIGATION } from '../../../../typings/navigation';


type Props = {
  onComplete: () => void;
  onLoading: () => void;
};

const UploadFiles = ({onComplete, onLoading : setLoading, navigation}: Props) => {
  let auth = useContext(AuthContext);
  const [fileTypes, setFileTypes] = useState([]);
  const [localFiles, setLocalFiles] = useState([]);
  const [imageUri, setImageUri] = useState(undefined);
  const [editorVisible, setEditorVisible] = useState(false);
  const [uploadKey, setUploadKey] = useState(undefined);
  const [uploadPosition, setUploadPosition] = useState(undefined);
  const [isMinOneFileUploaded, setIsMinOneFileUploaded] = useState(false);
  const [signature, setSignature] = useState(undefined);

  let isMounted = true;

  const scrollView = useRef<ScrollView>(null);

  //const camera = useCamera();
  const imagePicker = useImagePicker();

  //const {files} = useSelector((state: RootState) => state.files);
  //console.log('files', files);

  const setFileTypesFn = async(FileTypesList) => {
    await setFileTypes(FileTypesList);
  }

  const loadFileTypes = async () => {
    setLoading(true);
    setIsMinOneFileUploaded(false);
    let response = await getFileTypes();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        let FileTypesList = [];
        let responseFileTypesList = response.data.data || [];
        responseFileTypesList.forEach(item => {
          FileTypesList.push(item);

          item.childs?.forEach(item_child => {
            if( item_child.user_file?.length > 0 ){
              setIsMinOneFileUploaded(true);
              return;
            }
          });
          
        });
        await setFileTypesFn(FileTypesList);
        let files_local = await getFiles();
        setLocalFiles(files_local);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const loadSignature = async () => {
    setLoading(true);
    let response = await getSignature();
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data && response.data?.success == true) {
      if (isMounted){
        setSignature(response.data?.data?.signatture);
      }
    }
    else{
      Alert.alert("",response.data.message?.error);
    }
    if (isMounted){
      setLoading(false);
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

  useEffect(() => {
    isMounted = true;
    console.log(auth?.CurrentUser?.file_upload_option, "file_upload_option")
    if(auth?.CurrentUser?.file_upload_option == 0 ){
      Alert.alert("",auth?.CurrentUser?.file_upload_fail_message);
      onComplete(2);
    }

    loadFileTypes();
    loadTaxAmount();
    return () => { isMounted = false };
  }, [navigation]);

  useFocusEffect(
    React.useCallback(() => {
      isMounted = true;

      loadSignature();

      return () => { isMounted = false };
    }, [])
  );

  const submitFile = async (file_type, file_obj, position) =>  {
    setLoading(true);
    let response = await saveFile(file_type, file_obj);
    //alert(JSON.stringify(response, null, 5))
    setLoading(false);
    if (response.ok && response.data && response.data?.success == true) {
      saveImage(response.data?.data?.file_id, file_obj.uri, position);

      await updateCurrentUser({is_file_uploaded: 1}, auth);
      Alert.alert("",response.data?.message);
      //onComplete();
    } else {
      Alert.alert("",response.data?.message);
    }
  }

  const deleteFileFn = async (file_id) =>  {
    setLoading(true);
    let response = await deleteFile(file_id);
    //alert(JSON.stringify(response, null, 5))
    setLoading(false);
    if (response.ok && response.data && response.data?.success == true) {
      removeFile(file_id);
      Alert.alert("",response.data?.message);
      loadFileTypes();
      //onComplete();
    } else {
      Alert.alert("",response.data?.data);
    }
  }

  const selectPhoto = async (option: 'gallery' | 'camera') => {
    try {
        let responsePermission = undefined;
        let pickerResult = undefined;
        
        if (option === 'gallery') {
          responsePermission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        }
        else{
          responsePermission = await ImagePicker.requestCameraPermissionsAsync();
        }

        if (responsePermission.granted) {
          setLoading(true); 
          if (option === 'gallery') {
            pickerResult = await ImagePicker.launchImageLibraryAsync();
          }
          else{
            pickerResult = await ImagePicker.launchCameraAsync();
          }

          if(pickerResult){
            setLoading(false); 
          }
          if (!pickerResult.cancelled) {
            launchEditor(pickerResult.uri);
          }
        } else {
          if (option === 'gallery') {
            Alert.alert("","You've refused to allow this appp to access your photos!");
          }
          else{
            Alert.alert("","You've refused to allow this appp to access your camera!");
          }
        }
    } catch (error) {
      console.log(error);
    }
  };

  const launchEditor = (uri: string) => {
    setImageUri(uri);
    setEditorVisible(true);
    //setLoading(false);
  };

  const resizeImage = async(imageResult) => {
    let divider = 1;
    let width = imageResult.width;
    let height = imageResult.height;
    if (imageResult.width > 2000) {
      divider =  2000 / imageResult.width;
      width = 2000;
      height = height * divider;
    }

    const manipResult = await manipulateAsync(
        imageResult.uri,
        [{ resize: { width: width, height: height } }],
        { compress: 0.7, format: SaveFormat.JPEG }
    );
    getImageData(manipResult);
  };

  const getImageData = async(image) => {
    if (!image) {
      Alert.alert('Error', 'Image selection failed');
      return;
    }
    //console.log('Image', image);
    if (image.uri) {
      let img_uri = image.uri;
      let fileType = img_uri.substring(img_uri.lastIndexOf(".") + 1);
      let fileName = img_uri.substring(img_uri.lastIndexOf("/") + 1);
      let file_obj = {
        name: fileName,
        mimeType: `image/${fileType}`,
        uri: img_uri, //Platform.OS === 'android' ? img_uri : img_uri.replace('file://', ''),
      };
      await submitFile(uploadKey, file_obj, uploadPosition);
    }
  };

  const takePicture = async (key: number, position: number, showPdf: number, isSignature: number) => {
    //console.log(position, 'position');
    if( isSignature == 1 ){
      navigation.navigate(APP_NAVIGATION.SIGNATURE);
      return;
    }
    setUploadKey(key);
    setUploadPosition(position);

    imagePicker(
      async () => {
        //const image = await camera('gallery'); 
        await selectPhoto("gallery");
      },
      async () => {
        //const image = await camera('camera');
        await selectPhoto("camera");
      },
      async () => {
        //console.log('PDF');
        try {
          const pickerResult =
            await DocumentPicker.getDocumentAsync({
              //copyToCacheDirectory: false,
              type: 'application/pdf',
            });
          //console.log(pickerResult,'pickerResult')
          if (pickerResult.type == 'success') {
            //console.log(pickerResult, 'pickerResult2')
            submitFile(key, pickerResult, position);
            //saveImage(key, pickerResult.uri, position);
          }
        } catch (e) {
          console.log('Error', e);
        }
      },
      showPdf,
    );
  };

  const saveImage = async(file_id: number, imageUrl: string, position: number) => {
    //dispatch(actions.files.addFile(key, imageUrl));
    //console.log(position, 'positionposition')
    setFiles(file_id, imageUrl);
    await loadFileTypes();
    scrollView?.current?.scrollTo?.({y: position * 190, animated: true});
  };

  const handleDeletePicture = async(file_id: number) => {
    //console.log(`File key ${fileKey} index ${index}`);

    Alert.alert(
      'Delete file',
      'Are you sure to delete the file?',
      [
        {
          text: 'Yes',
          onPress: () => {
            //dispatch(actions.files.deleteFile(fileKey, index));
            deleteFileFn(file_id);
          },
        },
        {
          text: 'No',
          onPress: () => {
            console.log('We are doing nothing');
          },
        },
      ],
      {
        cancelable: true,
      },
    );
  };

  const handleDownloadFile = async (file_id: number, file_type: string) => {
    setLoading(true);
    var filename = Math.floor((Math.random() * 1000) + 1);
    if( file_type == "pdf" ){
      filename = filename + ".pdf";
    }
    else{
      filename = filename + ".jpg";
    }
    
    let response = await getDownloadUserFile(file_id);
    //alert(JSON.stringify(response, null, 5))
    if (response.ok && response.data) {
      if (isMounted){
          const fr = new FileReader();
          fr.onload = async () => {
            let fileUri = `${FileSystem.documentDirectory}${filename}`;
            let content_disposition = response.headers['content-disposition'];
            filename = content_disposition?.split('filename=')[1]? content_disposition?.split('filename=')[1] : "";
            if(filename != ""){
              fileUri = `${FileSystem.documentDirectory}${filename}`;
            }

            await FileSystem.writeAsStringAsync(fileUri, fr.result.split(',')[1], { encoding: FileSystem.EncodingType.Base64 });
            
            if( Platform.OS === 'ios'){
              Sharing.shareAsync(fileUri);
            }
            else{
              if( file_type == "pdf" ){
                await downloadFileToLocal(fileUri);
              }
              else{
                await downloadImageToLocal(fileUri);
              }
            }
            //console.log(fileUri, 'fileUri');
          };
          fr.readAsDataURL(response.data);
      }
    }
    if (isMounted){
      setLoading(false);
    }
  };

  const downloadFileToLocal = async(file_uri) => {
    try {
      const res = await MediaLibrary.requestPermissionsAsync();
      if (res.granted) {
        const asset = await MediaLibrary.createAssetAsync(file_uri).then(()=>{
          Alert.alert("","File has been downloaded successfully.");
        }).catch(error => {
          //Alert.alert("Failed to Direct Download. You can share file",error.message);
          Sharing.shareAsync(file_uri);
        });
        //console.log(asset)
        return true;
      }
      return false;
    } catch (error) {
      console.log('ERR: saveFileAsync', error);
      throw error;
    }
  };

  const downloadImageToLocal = async(file_uri) => {
    try {
      const res = await MediaLibrary.requestPermissionsAsync();
      if (res.granted) {
        await MediaLibrary.saveToLibraryAsync(file_uri).then(()=>{
          Alert.alert("","File has been downloaded successfully.");
        }).catch(error => {
          Alert.alert("","Failed");
        });
        return true;
      }
      return false;
    } catch (error) {
      console.log('ERR: saveFileAsync', error);
      throw error;
    }
  };

  const handleSubmit = () => {
    //console.log('File Obj', files);
    onComplete();
  };

  // let buttonEnabled = false;
  // if(localFiles.length > 0){
  //   buttonEnabled = true;
  // }

  let filePosition = 0;

  return (
    <VStack space={2} flex={1}>
      <ScrollView ref={scrollView}>
        <VStack divider={<Divider orientation={'horizontal'} />}>
            
            {fileTypes?.map(x => {
              return x?.childs?.map(y => {
                //alert(y.title)
                if( y.status === 1 ){
                  filePosition = filePosition + 1;
                  //console.log(filePosition, 'filePosition')
                  return (
                    <Box style={{height: 200}} key={`Box${y.id}`}>
                      <FileImages
                        key={`FileImages${y.id}`}
                        fileKey={y.id}
                        filePosition={filePosition}
                        showPdf={y.show_pdf}
                        isSignature={y.is_signature}
                        signature={signature}
                        localFiles={localFiles}
                        files={y.user_file || []}
                        onTakePicturePress={(key, filePosition, showPdf, isSignature) => takePicture(key, filePosition, showPdf, isSignature)}
                        buttonText={y.title}
                        onDeletePicturePress={handleDeletePicture}
                        onDownloadFilePress={handleDownloadFile}
                      />
                    </Box>
                  );
                }
                
              })
            })}
        </VStack>
      </ScrollView>
      <Button key={isMinOneFileUploaded} isDisabled={!isMinOneFileUploaded} m={2} onPress={handleSubmit}>
        Next
      </Button>
      <ImageEditor
        visible={editorVisible}
        onCloseEditor={() => setEditorVisible(false)}
        imageUri={imageUri}
        fixedCropAspectRatio={9 / 16}
        allowedTransformOperations={['crop']}
        allowedAdjustmentOperations={false}
        minimumCropDimensions={{
          width: 100,
          height: 100,
        }}
        onEditingComplete={(result) => {
          resizeImage(result);
          //setImageData(manipResult);
          //alert(JSON.stringify(manipResult, null, 5));
        }}
        mode="full"
      />
    </VStack>
  );
};

export default UploadFiles;
