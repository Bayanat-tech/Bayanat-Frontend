import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TManufacture } from 'pages/WMS/types/manufacture-wms.types';
import { useEffect } from 'react';
import GmServiceInstance from 'service/wms/services.gm_wms';
import * as yup from 'yup';

const AddManufactureWmsForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TManufacture;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();
  //------------------formik-----------------
  const formik = useFormik<TManufacture>({
    initialValues: { manu_name: '', manu_code: '', prin_code: '', company_code: user?.company_code },
    validationSchema: yup.object().shape({
      manu_code: yup.string().required('This field is required'),
      manu_name: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await GmServiceInstance.editManufacture(values);
      } else {
        response = await GmServiceInstance.addManufacture(values);
      }
      if (response) {
        onClose(true);
        setSubmitting(false);
      }
    }
  });
  useEffect(() => {
    console.log(formik.errors);
  }, [formik.errors]);
  //------------------Handlers------------

  useEffect(() => {
    if (isEditMode) {
      const { updated_at, updated_by, created_at, created_by, ...ManufactureData } = existingData;
      console.log(updated_at, updated_by, created_at, created_by);

      formik.setValues(ManufactureData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <Grid container spacing={2} component={'form'} onSubmit={formik.handleSubmit}>
      <Grid item xs={12} sm={3}>
        <InputLabel>Prin Code*</InputLabel>
        <TextField
          value={formik.values.prin_code}
          name="prin_code"
          onChange={formik.handleChange}
          error={Boolean(getIn(formik.touched, 'prin_code') && getIn(formik.errors, 'prin_code'))}
        />
        {getIn(formik.touched, 'prin_code') && getIn(formik.errors, 'prin_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'prin_code')}
          </FormHelperText>
        )}
      </Grid>

      <Grid item xs={12} sm={6}>
        <InputLabel>Manufacture Code*</InputLabel>
        <TextField
          value={formik.values.manu_code}
          name="manu_code"
          onChange={formik.handleChange}
          error={Boolean(getIn(formik.touched, 'manu_code') && getIn(formik.errors, 'manu_code'))}
        />
        {getIn(formik.touched, 'manu_code') && getIn(formik.errors, 'manu_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'manu_code')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={7}>
        <InputLabel>Manufacture Name*</InputLabel>
        <TextField
          value={formik.values.manu_name}
          name="manu_name"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'manu_name') && getIn(formik.errors, 'manu_name'))}
        />
        {getIn(formik.touched, 'manu_name') && getIn(formik.errors, 'manu_name') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'manu_name')}
          </FormHelperText>
        )}
      </Grid>

      <Grid item xs={12} className="flex justify-end">
        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
          startIcon={formik.isSubmitting ? <LoadingOutlined /> : <SaveOutlined />}
        >
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};
export default AddManufactureWmsForm;
