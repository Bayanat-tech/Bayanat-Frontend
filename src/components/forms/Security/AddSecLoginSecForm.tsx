import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TSecmaster } from 'pages/Security/type/flowmaster-sec-types';
import { useEffect } from 'react';
import GmSecServiceInstance from 'service/security/services.gm_security';
import * as yup from 'yup';

const  AddSecLoginSecForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TSecmaster;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();  
  //------------------formik-----------------
  const formik = useFormik<TSecmaster>({
        initialValues: { id:'' ,username: '', userpass :'' , contact_no :'',email_id:'',company_code: user?.company_code},
    validationSchema: yup.object().shape({
      // country_code: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log('mode',isEditMode);
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await GmSecServiceInstance.editsecemaster(values);
      } else {
        response = await GmSecServiceInstance.addsecemaster(values);
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
        <InputLabel>User Id*</InputLabel>
        <TextField
          value={formik.values.id}
          name="id"
          disabled={isEditMode===true}
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'id"') && getIn(formik.errors, 'id"'))}
        />
        {getIn(formik.touched, 'id') && getIn(formik.errors, 'id') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'id')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>username*</InputLabel>
        <TextField
          value={formik.values.username}
          name="username"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'username') && getIn(formik.errors, 'username'))}
        />
        {getIn(formik.touched, 'username') && getIn(formik.errors, 'username') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'username')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>Contact No</InputLabel>
        <TextField
          value={formik.values.contact_no}
          name="contact_no"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'contact_no') && getIn(formik.errors, 'contact_no'))}
        />
        {getIn(formik.touched, 'contact_no') && getIn(formik.errors, 'contact_no') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'contact_no')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>Password</InputLabel>
        <TextField
          value={formik.values.userpass}
          name="userpass"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'userpass') && getIn(formik.errors, 'userpass'))}
        />
        {getIn(formik.touched, 'userpass') && getIn(formik.errors, 'userpass') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'userpass')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>Email</InputLabel>
        <TextField
          value={formik.values.email_id}
          name="email_id"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'email_id') && getIn(formik.errors, 'email_id'))}
        />
        {getIn(formik.touched, 'email_id') && getIn(formik.errors, 'email_id') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'email_id')}
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
export default AddSecLoginSecForm;
