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
