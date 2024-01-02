/* eslint-disable no-unused-vars */

/* eslint-disable no-shadow */

export enum ROOT_NAVIGATION {
  APP = 'APP',
  AUTH = 'AUTH',
  PUBLIC = 'PUBLIC',
}

export type RootNavigationParams = {
  [ROOT_NAVIGATION.APP]: undefined;
  [ROOT_NAVIGATION.AUTH]: undefined;
  [ROOT_NAVIGATION.PUBLIC]: undefined;
};

export enum APP_NAVIGATION {
  HOME = 'HOME',
  PROFILE = 'PROFILE',
  ACKNOWLEDGEMENT = 'ACKNOWLEDGEMENT',
  UserFormSelection = 'UserFormSelection',
  CHAT = 'CHAT',
  ORDERSTATUS = 'ORDERSTATUS',
  SIGNATURE = 'SIGNATURE',
}

export type AppNavigationParams = {
  [APP_NAVIGATION.HOME]: undefined;
  [APP_NAVIGATION.PROFILE]: undefined;
  [APP_NAVIGATION.ACKNOWLEDGEMENT]: undefined;
  [APP_NAVIGATION.UserFormSelection]: undefined;
  [APP_NAVIGATION.CHAT]: undefined;
  [APP_NAVIGATION.ORDERSTATUS]: undefined;
  [APP_NAVIGATION.SIGNATURE]: undefined;
};

export enum AUTH_NAVIGATION {
  AUTH_LANDING = 'AUTH_LANDING',
  SIGN_IN = 'SIGN_IN',
  Register = 'Register',
  ForgotPassword = 'ForgotPassword',
  ConfirmPassword = 'ConfirmPassword'
}

export type AuthNavigationParams = {
  [AUTH_NAVIGATION.AUTH_LANDING]: undefined;
  [AUTH_NAVIGATION.SIGN_IN]: undefined;
  [AUTH_NAVIGATION.Register]: undefined;
  [AUTH_NAVIGATION.ForgotPassword]: undefined;
  [AUTH_NAVIGATION.ConfirmPassword]: undefined;
};

export enum PUBLIC_NAVIGATION {
  PUBLIC_LANDING = 'PUBLIC_LANDING',
  PUBLIC_SEARCH = 'PUBLIC_SEARCH',
  PUBLIC_GALLERY = 'PUBLIC_GALLERY'
}

export type PublicNavigationParams = {
  [PUBLIC_NAVIGATION.PUBLIC_LANDING]: undefined;
  [PUBLIC_NAVIGATION.PUBLIC_SEARCH]: undefined;
  [PUBLIC_NAVIGATION.PUBLIC_GALLERY]: undefined;
};
