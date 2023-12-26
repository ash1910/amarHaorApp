import {Alert} from 'react-native';

  const useImagePicker =
  () =>
  (fromGallery: () => void, fromCamera: () => void, uploadPdf: () => void, showPdf : number) => {
    
    let options = [
      {
        text: 'From Gallery',
        onPress: fromGallery,
      },
      {
        text: 'From Camera',
        onPress: fromCamera,
      },
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel"
      },
    ];
    if( showPdf == 1 ){
      options.unshift({
        text: 'Upload PDF',
        onPress: uploadPdf,
      });
    }
    
    Alert.alert(
      'Choose image',
      'Select option from which you want to take image',
      options,
      {
        cancelable: true,
      },
    );
  };

export default useImagePicker;
