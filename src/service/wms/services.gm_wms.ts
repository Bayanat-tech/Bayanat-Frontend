import { TCountry } from 'pages/WMS/types/country-wms.types';
import { TCurrency } from 'pages/WMS/types/currency-wms.types';
import { TDepartment } from 'pages/WMS/types/department-wms.types';
import { TLocation } from 'pages/WMS/types/location-wms.types';
import { TPickWave } from 'pages/WMS/types/PickWave-wms.types';
import { TPrincipalWms } from 'pages/WMS/types/principal-wms.types';
import { Tsalesman } from 'pages/WMS/types/salesman-wms.types';
import { dispatch } from 'store';
import { openSnackbar } from 'store/reducers/snackbar';
import { IApiResponse } from 'types/types.services';
import axiosServices from 'utils/axios';
import { TUom } from 'pages/WMS/types/uom-wms.type';
import { TMoc } from 'pages/WMS/types/moc-wms.types';
import { THarmonize } from 'pages/WMS/types/harmonize-wms.types';
import { Tmoc2 } from 'pages/WMS/types/moc2-wms.types';
import { TUoc } from 'pages/WMS/types/uoc-wms.types';
import { TActivitysubgroup } from 'pages/WMS/types/activitysubgroup-wms';
//import { TSubgroup } from 'pages/WMS/types/activitysubgroup-wms';


class GM {
  //--------------Country--------------
  addCountry = async (values: TCountry) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/country', values);
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
  editCountry = async (values: TCountry) => {
    try {
      const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/country', values);
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
  deleteCountry = async (countryCodes: string[]) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/country/delete', countryCodes);
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
  //--------------Principal--------------
  getPrincipal = async (prin_code: string) => {
    try {
      const response: IApiResponse<TPrincipalWms> = await axiosServices.get(`api/wms/gm/principal/${prin_code}`);

      if (response.data.success === true && response.data.data) {
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

  addPrincipal = async (values: TPrincipalWms) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/principal', values);
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
  editPrincipal = async (values: TPrincipalWms, prin_code: string) => {
    try {
      const response: IApiResponse<null> = await axiosServices.put(`api/wms/gm/principal/${prin_code}`, values);
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
  //--------------Department--------------
  addDepartment = async (values: TDepartment) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/department', values);
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
  editDepartment = async (values: TDepartment) => {
    try {
      const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/department', values);
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
  deleteDepartment = async (departmentCodes: string[]) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/department/delete', departmentCodes);
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
  //--------------PickWave--------------
  addPickWave = async (values: TPickWave) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/PickWave', values);
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
  editPickWave = async (values: TPickWave) => {
    try {
      const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/PickWave', values);
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
  deletePickWave = async (PickWaveCodes: string[]) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/PickWave/delete', PickWaveCodes);
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
  //--------------Location--------------
  addLocation = async (values: TLocation) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/location', values);
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
  editLocation = async (values: TLocation) => {
    try {
      const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/location', values);
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
  deleteLocation = async (locationCodes: string[]) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/location/delete', locationCodes);
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

  //--------------Currency--------------
  addCurrency = async (values: TCurrency) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/currency', values);
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
  editCurrency = async (values: TCurrency) => {
    try {
      const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/currency', values);
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
  deleteCurrency = async (currencyCodes: string[]) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/currency/delete', currencyCodes);
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
  // //--------------------salesman----------------------
  addSalesman = async (values: Tsalesman) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/salesman', values);
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
  editsalesman = async (values: Tsalesman) => {
    try {
      const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/salesman', values);
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
  deletesalesman = async (saleman: string[]) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/salesman', saleman);
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
  //--------------Uom--------------
  addUom = async (values: TUom) => {

    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/uom', values);
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
  editUom = async (values: TUom) => {
    try {
      const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/uom', values);
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
  deleteUom = async (uomCodes: string[]) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/uom/delete', uomCodes);
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
   //--------------Moc--------------
   addMoc = async (values: TMoc) => {

    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/moc', values);
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
  editMoc = async (values: TMoc) => {
    try {
      const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/moc', values);
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
  deleteMoc = async (uomCodes: string[]) => {
    try {
      const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/moc/delete', uomCodes);
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
  };//--------------Moc2--------------
  addMoc2 = async (values: Tmoc2) => {

   try {
     const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/moc2', values);
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
 editMoc2 = async (values: Tmoc2) => {
   try {
     const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/moc2', values);
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
 deleteMoc2 = async (uomCodes: string[]) => {
   try {
     const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/moc2/delete', uomCodes);
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
 //--------------Uoc--------------
 addUoc = async (values: Tmoc2) => {

  try {
    const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/uoc', values);
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
editUoc = async (values: TUoc) => {
  try {
    const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/uoc', values);
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
deleteUoc = async (uomCodes: string[]) => {
  try {
    const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/uoc/delete', uomCodes);
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

//--------------Harmonize--------------
addHarmonize = async (values: THarmonize) => {

  try {
    const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/harmonize', values);
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
editHarmonize = async (values: THarmonize) => {
  try {
    const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/harmonize', values);
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
deleteHarmonize = async (harmonizeCodes: string[]) => {
  try {
    const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/harmonize/delete', harmonizeCodes);
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
//--------------ActivitySubgroup--------------
addActivitysubgroup = async (values: TActivitysubgroup) => {

  try {
    const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/activitysubgroup', values);
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
editActivitysubgroup = async (values: TActivitysubgroup) => {
  try {
    const response: IApiResponse<null> = await axiosServices.put('api/wms/gm/activitysubgroup', values);
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
deleteActivitysubgroup = async (activitysubgroupCodes: string[]) => {
  try {
    const response: IApiResponse<null> = await axiosServices.post('api/wms/gm/activitysubgroup/delete', activitysubgroupCodes);
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
const GmServiceInstance = new GM();

export default GmServiceInstance;
