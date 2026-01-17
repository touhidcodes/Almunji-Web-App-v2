export interface TLoginFormData {
  identifier: string;
  password: string;
  remember: boolean;
}

export interface TRegisterFormData {
  name: string;
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
  agreeTerms: boolean;
}

export interface TUser {
  id: string;
  name: string;
  username: string;
  email: string;
  role?: string;
}

export type TAuthUser = {
  userId: string;
  email: string;
  role: string;
};
