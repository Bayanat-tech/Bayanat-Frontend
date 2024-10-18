import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { Tsecrollmaster } from 'pages/WMS/types/rollmaster-wms.types';
import { useEffect } from 'react';
import GmServiceInstance from 'service/wms/services.gm_wms';
import * as yup from 'yup';

const  AddSalesmanWmsForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: Tsecrollmaster;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();  
  //------------------formik-----------------
  const formik = useFormik<Tsecrollmaster>({
        initialValues: {company_code: user?.company_code, role_id : '', role_desc: '', remarks :'' },
    validationSchema: yup.object().shape({
      // country_code: yup.string().required('This field is required'),
      salesman_name: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await GmServiceInstance.editsecrolemaster(values);
      } else {
        response = await GmServiceInstance.addsecrolemaster(values);
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
  // const handleCountryGccChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
  //   formik.setFieldValue('country_gcc', checked ? 'Y' : 'N');
  // };
  useEffect(() => {
    if (isEditMode) {
      const { updated_at, updated_by, created_at, created_by, ...countryData } = existingData;
      console.log(updated_at, updated_by, created_at, created_by);

      formik.setValues(countryData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <Grid container spacing={2} component={'form'} onSubmit={formik.handleSubmit}>
      <Grid item xs={12}>
        <InputLabel>Role ID</InputLabel>
        <TextField
          value={formik.values.role_id}
          name="role_id"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'salesman_code"') && getIn(formik.errors, 'salesman_code"'))}
        />
        {getIn(formik.touched, 'role_id') && getIn(formik.errors, 'role_id') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'role_id')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>Role Description*</InputLabel>
        <TextField
          value={formik.values.role_desc}
          name="role_desc"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'role_desc') && getIn(formik.errors, 'role_desc'))}
        />
        {getIn(formik.touched, 'role_desc') && getIn(formik.errors, 'role_desc') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'role_desc')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>Remarks</InputLabel>
        <TextField
          value={formik.values.role_desc}
          name="remarks"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'salesman_name') && getIn(formik.errors, 'salesman_name'))}
        />
        {getIn(formik.touched, 'remarks') && getIn(formik.errors, 'remarks') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'remarks')}
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
export default AddSalesmanWmsForm;
