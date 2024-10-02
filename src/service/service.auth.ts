import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { IResponse, TResponseWithPermissions } from 'types/types.services';
import axiosServices from 'utils/axios';

class AuthService {
  getMe = async () => {
    try {
      const response = await axiosServices.get('/api/auth/me');

      return response.data;
    } catch (error: unknown) {
      const knownError = error as { message: string };
      dispatch(
        openSnackbar({
          open: true,
          message: knownError.message,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          severity: 'error',
          close: true
        })
      );
    }
  };

  logout = async () => {
    try {
      await axiosServices.post('/api/auth/logout');
    } catch (error: unknown) {
      const knownError = error as { message: string };
      dispatch(
        openSnackbar({
          open: true,
          message: knownError.message,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          severity: 'error',
          close: true
        })
      );
    }
  };

  getPermissions = async () => {
    try {
      const permissionsResponse = await axiosServices.get('/api/user/permissions');

      return permissionsResponse.data as TResponseWithPermissions;
    } catch (error: unknown) {
      const knownError = error as { message: string };
      dispatch(
        openSnackbar({
          open: true,
          message: knownError.message,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          severity: 'error',
          close: true
        })
      );
    }
  };

  companyRegister = async (data: any) => {
    try {
      const response: IResponse = await axiosServices.post('api/company/sign-up', data);
      if (response && response.data.success) {
        return response.data.data;
      }
    } catch (error: unknown) {
      const knownError = error as { message: string };
      dispatch(
        openSnackbar({
          open: true,
          message: knownError.message,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          severity: 'error',
          close: true
        })
      );
    }
  };

  forgotPassword = async (email: string) => {
    try {
      await axiosServices.post('/api/auth/forget-password-request', { email });
      return true;
    } catch (error) {
      const knownError = error as { success: boolean; message: string };
      dispatch(
        openSnackbar({
          open: true,
          message: `${knownError.message}`,
          variant: 'alert',
          alert: {
            color: 'error'
          },
          close: false
        })
      );
      return false;
    }
  };
}
const AuthServicesInstance = new AuthService();
export default AuthServicesInstance;
