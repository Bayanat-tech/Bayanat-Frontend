export type IResponse = {
  data: {
    data?: any;
    success: boolean;
  };
};
export type TResponseWithPermissions = {
  data: { users_permissions: any; permissions: any };
  success: boolean;
  error?: any;
};
export type IApiResponse<T> = {
  data: {
    success: boolean;
    data: T;
  };
};
