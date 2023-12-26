import { R3ClientWithoutAuth, R3Client, R3ClientFileDownload } from "../clients/R3Client";
import { getData } from "../functions/AsyncStorageFunctions";

const login_endpoint = "login";
const getUser = (email, password) => {
  return R3ClientWithoutAuth.post(login_endpoint, 
    { 
      email: email, // "shahnaz@nochallenge.net",
      password: password, //"Soniya123!",
    }
  );
};

const getRegister = (values) => {
  return R3ClientWithoutAuth.post("register", 
    { 
      first_name: values.first_name,
      last_name: values.last_name,
      mobile: values.mobile,
      email: values.email,
      password: values.password,
      c_password: values.c_password,
      hearaboutus: values.hearaboutus,
      source : Platform.OS === 'ios' ? "ios" : 'android',
    }
  );
};

const getValidateEmail = (email) => {
  return R3ClientWithoutAuth.post("validate-email", 
    { 
      email: email,
    }
  );
};

const getForgotPassword = (email) => {
  return R3ClientWithoutAuth.post("forgot-password", 
    { 
      email: email,
    }
  );
};

const getConfirmPassword = (values) => {
  //alert(JSON.stringify(values, null, 5))
  return R3ClientWithoutAuth.post("submit-password", 
    { 
      sixdigit_code: values.sixdigit_code,
      password: values.password,
      c_password: values.c_password,
      password_token: values.password_token,
    }
  );
};

const getDivisions = () => {
  return R3Client.get("get-divisions");
};

const getProfile = () => {
  return R3Client.get("get-profile-details");
};

const getAreas = () => {
  return R3Client.get("getareas");
};

const saveProfile = (values) => {
  //const [day, month, year] = values.DOB.split('-');
  //const resultDOB = [year, month, day].join('-');
  //let DOB = new Date(resultDOB);
  //DOB = DOB.getFullYear() +"-"+ (parseInt(DOB.getMonth()) + 1).toString().padStart(2,"0") + "-" + DOB.getDate().toString().padStart(2,"0");
  return R3Client.post("save-profile", 
    { 
      Name: values.Name,
      Contact: values.Contact,
      Email: values.Email,
      ETIN: values.ETIN,
      NationalId: values.NationalId,
      Gender: values.Gender,
      DOB: values.DOB,
      GovernmentEmployee: values.GovernmentEmployee,
      FreedomFighter: values.FreedomFighter,
      Disability: values.Disability,
      TaxesCircle: values.TaxesCircle,
      TaxesZone: values.TaxesZone,
      DivisionId: values.DivisionId,
      DistrictId: values.DistrictId,
      PresentAddress: values.PresentAddress,
      PermanentAddress: values.PermanentAddress,
      AddressSame: values.AddressSame,
      AreaOfResidence: values.AreaOfResidence
    }
  );
};

const getFileTypes = () => {
  return R3Client.get("get-file-types");
};

const saveFile = async(file_type, file_obj) => {
  
  const formData = new FormData();
  formData.append('file_type', file_type);
  formData.append('img', {
    name: file_obj.name,
    type: file_obj.mimeType,
    uri: file_obj.uri,
  });

  const upRes =  R3Client.post("upload-file", formData);

  // const upRes =  R3ClientFileUpload.post("upload-file", formData, {
  //   headers: {
  //     'Content-Type': 'multipart/form-data; charset=utf-8; boundary=------random-boundary',
  //     'enctype': "multipart/form-data"
  //   },
  //   transformRequest: (data, headers) => {
  //     return formData; // this is doing the trick
  //   },
  // });
  //console.log(JSON.stringify(upRes, null, 5), 'upRes');

  return upRes;
};

const deleteFile = async(file_id) => {
  return await R3Client.delete(`delete-file/${file_id}`);
};

const getPackages = () => {
  return R3Client.get(`get-user-package?source=${Platform.OS === 'ios' ? "ios" : 'android'}`);
};

const getReloadPaymentGateway = async(package_id) => {
  return await R3Client.get(`reload-payment-gateway/${package_id}`);
};

const getTaxAmount = () => {
  return R3Client.get("get-tax-amount");
};

const getAckFile = () => {
  return R3Client.get("get-ackfile-id");
};

const getDownloadFile = async(file_id) => {
  return await R3ClientFileDownload.get(`download-file/${file_id}`);
};

const saveConsent = (consent_value) => {
  return R3Client.post("save-consent", 
    { 
      consent_value,
    }
  );
};

const getDownloadUserFile = async(file_id) => {
  return await R3ClientFileDownload.get(`download-user-file/${file_id}`);
};

const sendUserFormSelectionQA = (values) => {
  const {q1, q2, q3, q4, q5} = values;
  return R3Client.post("save-from-selection", 
    { 
      q1,
      q2, 
      q3, 
      q4,
      q5
    }
  );
};

const sendUserFormSelectionType = (type) => {
  return R3Client.post("save-from-selection", 
    { 
      type
    }
  );
};

const getTaxZoneCircles = () => {
  return R3Client.get("get-zone-cricle-by-city");
};

const getOrderStatus = () => {
  return R3Client.get("get-order-status");
};

const saveSignature = async(signature) => {
  const formData = new FormData();
  formData.append('signature', signature);

  return R3Client.post("save-user-signature", formData);
};

const getSignature = () => {
  return R3Client.get("get-user-signature");
};

const saveCouponCode = (code) => {
  return R3Client.post("save-coupon", 
    { 
      code,
    }
  );
};

const getPaymentMessage = () => {
  return R3Client.get("get-payment-message");
};

const userUnsubscribe = () => {
  return R3Client.post("user/unsubscribe");
};

export { getUser, getRegister, getForgotPassword, getConfirmPassword, getDivisions, getProfile, getAreas, saveProfile, getFileTypes, saveFile, deleteFile, getPackages, getReloadPaymentGateway, getTaxAmount, getAckFile, getDownloadFile, saveConsent, getDownloadUserFile, getValidateEmail, sendUserFormSelectionQA, sendUserFormSelectionType, getTaxZoneCircles, getOrderStatus, saveSignature, getSignature, saveCouponCode, getPaymentMessage, userUnsubscribe };
