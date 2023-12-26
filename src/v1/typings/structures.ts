export type User = {
  id: number;
  email: string;
  password: string;
  accessToken: string;
};

export type Profile = {
  name: string;
  gender: 'Male' | 'Female';
  married: boolean;
  resident: boolean;
  nid: string;
};
