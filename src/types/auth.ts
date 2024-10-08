import { ReactElement } from 'react';
import { NavItemType } from './menu';

// ==============================|| AUTH TYPES  ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type UserProfile = {
  company_code: string;
  loginid: string;
  email_id: string;
  username: string;
  status: string;
  contact_name: string;
  contact_no: string;
  contact_email: string;
  updated_at: Date;
  updated_by: string;
  created_by: string;
  created_at: Date;
  id: number;
  no_of_days: number;
  active_flag: string;
};

export interface AuthProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null;
  token?: string | null;
  permissions: {
    [key: string]: { serial_number: number; app_code: string; children: { [key: string]: { serial_number: number; app_code: string } } };
  };
  user_permission: number[];
  permissionBasedMenuTree: NavItemType[];
}
export type TRequestWMe = { data: AuthProps; success: Boolean };

export interface AuthActionProps {
  type: string;
  payload?: AuthProps;
}

export interface InitialLoginContextProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
}

export interface JWTDataProps {
  userId: string;
}

export type JWTContextType = {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null | undefined;
  permissions: {
    [key: string]: { serial_number: number; app_code: string; children: { [key: string]: { serial_number: number; app_code: string } } };
  };
  user_permission: number[];
  permissionBasedMenuTree: NavItemType[];

  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};
