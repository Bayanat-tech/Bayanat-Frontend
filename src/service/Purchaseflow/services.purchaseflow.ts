import { TCostmaster } from 'pages/Purchasefolder/type/costmaster-pf-types';
import { TProjectmaster } from 'pages/Purchasefolder/type/projectmaster-pf-types';
import { TItemmaster } from 'pages/Purchasefolder/type/itemmaster-pf-types';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { IApiResponse } from 'types/types.services';
import axiosServices from 'utils/axios';

class GMpf {
  //-------------- Costmaster--------------
  addCostmaster = async (values: TCostmaster) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/pf/gm/costmaster', values);
      if (response.data.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        return response.data.success;
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

  editCostmaster = async (values: TCostmaster) => {
    try {
      console.log(values);
      const response: IApiResponse<null> = await axiosServices.put('api/pf/gm/costmaster', values);
      if (response.data.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        return response.data.success;
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
  deleteCostmaster = async (costCodes: string[]) => {
    try {
      console.log(`inside deleteCostmaster: ${costCodes}`);
      const response: IApiResponse<null> = await axiosServices.post('api/pf/gm/costmaster', costCodes);
      if (response.data.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        return response.data.success;
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
  //-------------- Projectmaster--------------
  addProjectmaster = async (values: TProjectmaster) => {
    try {
      console.log('inside addProjectmaster');
      const response: IApiResponse<null> = await axiosServices.post('api/pf/gm/projectmaster', values);
      if (response.data.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        return response.data.success;
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

  editProjectmaster = async (values: TProjectmaster) => {
    try {
      console.log(values);
      const response: IApiResponse<null> = await axiosServices.put('api/pf/gm/projectmaster', values);
      if (response.data.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        return response.data.success;
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
  deleteProjectmaster = async (projectCodes: string[]) => {
    try {
      console.log(`inside deleteProjectmaster: ${projectCodes}`);
      const response: IApiResponse<null> = await axiosServices.post('api/pf/gm/projectmaster', projectCodes);
      if (response.data.success) {
        dispatch(
          openSnackbar({
            open: true,
            message: response.data.message,
            variant: 'alert',
            alert: {
              color: 'success'
            },
            close: true
          })
        );
        return response.data.success;
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

//----------Item Master
additemmaster = async (values: TItemmaster) => {
  try {
    const response: IApiResponse<null> = await axiosServices.post('api/pf/gm/itemmaster', values);
    if (response.data.success) {
      dispatch(
        openSnackbar({
          open: true,
          message: response.data.message,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      return response.data.success;
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

edititemmaster = async (values: TItemmaster) => {
  try {
    const response: IApiResponse<null> = await axiosServices.put('api/pf/gm/itemmaster', values);
    if (response.data.success) {
      dispatch(
        openSnackbar({
          open: true,
          message: response.data.message,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      return response.data.success;
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
deleteitemmaster = async (item_code: string[]) => {
  try {
    const response: IApiResponse<null> = await axiosServices.post('api/pf/gm/itemmaster', item_code);
    if (response.data.success) {
      dispatch(
        openSnackbar({
          open: true,
          message: response.data.message,
          variant: 'alert',
          alert: {
            color: 'success'
          },
          close: true
        })
      );
      return response.data.success;
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
}

const GmPfServiceInstance = new GMpf();
export default GmPfServiceInstance;
