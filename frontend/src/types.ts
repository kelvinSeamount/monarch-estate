export interface User {
  _id: string;
  name: string;
  email: string;
  avatar?: string;
}

export type UserState = {
  currentUser: User | null;
  error: string | null;
  loading: boolean;
};

export interface SignUpFormPropsFormProps {
  username?: string;
  password?: string;
  email?: string;
}

export interface SignInFormProps {
  password?: string;
  email?: string;
}

export interface UserFormData {
  avatar?: string;
  username?: string;
  email?: string;
  password?: string;
}
