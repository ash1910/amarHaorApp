/* eslint-disable no-unused-vars */

/* eslint-disable no-shadow */

export enum ROOT_NAVIGATION {
  APP = 'APP',
  AUTH = 'AUTH',
}

export type RootNavigationParams = {
  [ROOT_NAVIGATION.APP]: undefined;
  [ROOT_NAVIGATION.AUTH]: undefined;
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
