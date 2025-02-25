export type UserState = {
  currentUser: string | null;
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
