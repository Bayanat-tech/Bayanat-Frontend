import { ReactElement } from 'react';

// ==============================|| AUTH TYPES  ||============================== //

export type GuardProps = {
  children: ReactElement | null;
};

export type UserProfile = {
  id?: string;
  email?: string;
  avatar?: string;
  image?: string;
  name?: string;
  role?: string;
  tier?: string;
};

export interface AuthProps {
  isLoggedIn: boolean;
  isInitialized?: boolean;
  user?: UserProfile | null;
  token?: string | null;
  permissions: string[];
  permissionBasedMenuTree: {
    value: string; //with this we can navigate user to a page & we can also show the page label with this & we can store serial number with it's route in a separate table use existing serial number table and use serial_name
    label: string;
    serial_number: number; //to check the permission to access a page
    icon: JSX.Element;
    childern: AuthProps['permissionBasedMenuTree'];
    level: number; //we will maintain a local storage when a user expland this level we can just update level_1:serial_number,same with other and when user refersh a page we can just fetch data of level and put it in array and whern user move away from these level we will remove the data
  }[];
}

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
  logout: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: VoidFunction;
};
