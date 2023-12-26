//import ImagePicker from 'react-native-image-crop-picker';
// import ImageResizer from 'react-native-image-resizer';
import * as ImagePicker from 'expo-image-picker';
//import { ImageManipulator } from 'expo';
import { Alert } from 'react-native';


const useCamera = () => async (option: 'gallery' | 'camera') => {
  try {
    if (option === 'gallery') {
      return await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        //base64: true,
        quality: 0.7,
      }).then(imageResult => {
        console.log(imageResult);
        if (!imageResult.cancelled) {

          // let divider = 1;
          // let width = imageResult.width;
          // let height = imageResult.height;
          // if (imageResult.width > 2000) {
          //   divider =  2000 / imageResult.width;
          //   width = 2000;
          //   height = height * divider;
          // }

            // return ImageManipulator.manipulate(
            //   imageResult.uri,
            //     [{ resize: { width: width, height: height } }],
            //     { format: 'jpg' }
            // );

          return imageResult;
        }
        return {};
        
        // return ImageResizer.createResizedImage(
        //   imageResult.path,
        //   imageResult.width / divider,
        //   imageResult.height / divider,
        //   'JPEG',
        //   100,
        //   0,
        // ).then(resp => resp);
      });
    } else {

      let permissionResult = await ImagePicker.requestCameraPermissionsAsync();

        if (permissionResult.granted === false) {
            Alert.alert("For this to work app needs camera roll permissions...");
            return {};
        }

      // const {
      //   status
      // } = await Permissions.getAsync(Permissions.CAMERA);
  
      // const {
      //   status: cameraRollPerm
      // } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      //console.log(status);
      if(permissionResult.granted) {

      return await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        //base64: true,
        quality: 0.7,
      }).then(imageResult => {
        console.log(imageResult);
        
        if (!imageResult.cancelled) {

          return imageResult;
        }
        return {};
      });
    }


      // return await ImagePicker.openCamera({
      //   cropping: true,
      //   compressImageQuality: 0.7,
      // }).then(imageResult => {
      //   console.log(imageResult);
      //   let divider = 1;
      //   if (imageResult.size > 200000) {
      //     divider = imageResult.size / 200000;
      //   }
      //   return ImageResizer.createResizedImage(
      //     imageResult.path,
      //     imageResult.width / divider,
      //     imageResult.height / divider,
      //     'JPEG',
      //     100,
      //     0,
      //   ).then(resp => resp);
      // });
    }
  } catch (error) {
    console.log(error);
    return null;
  }
};

export default useCamera;
