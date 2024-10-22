import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TSecmodulemaster } from 'pages/Security/type/flowmaster-sec-types';
import { useEffect } from 'react';
import GmSecServiceInstance from 'service/security/services.gm_security';
import * as yup from 'yup';

const AddSecModuleSecForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TSecmodulemaster;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();
  //------------------formik-----------------
  const formik = useFormik<TSecmodulemaster>({
    initialValues: {
      company_code: user?.company_code,
      app_code: '',
      serial_no: '',
      level1: '',
      level2: '',
      level3: '',
      position: '',
      url_path: ''
    },
    validationSchema: yup.object().shape({
      // country_code: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      console.log('mode', isEditMode);
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await GmSecServiceInstance.editsecmodulemaster(values);
      } else {
        response = await GmSecServiceInstance.addsecmoduleemaster(values);
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
        <InputLabel>App Code*</InputLabel>
        <TextField
          value={formik.values.app_code}
          name="app_code"
          disabled={isEditMode === true}
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'app_code"') && getIn(formik.errors, 'app_code"'))}
        />
        {getIn(formik.touched, 'app_code') && getIn(formik.errors, 'app_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'app_code')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12}>
        <InputLabel>Serial No*</InputLabel>
        <TextField
          value={formik.values.serial_no}
          name="serial_no"
          disabled={isEditMode === true}
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'serial_no"') && getIn(formik.errors, 'serial_no"'))}
        />
        {getIn(formik.touched, 'serial_no') && getIn(formik.errors, 'serial_no') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'serial_no')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12}>
        <InputLabel>Level1</InputLabel>
        <TextField
          value={formik.values.level1}
          name="level1"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'level1"') && getIn(formik.errors, 'level1"'))}
        />
        {getIn(formik.touched, 'level1') && getIn(formik.errors, 'level1') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'level1')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12}>
        <InputLabel>Level2</InputLabel>
        <TextField
          value={formik.values.level2}
          name="level2"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'level2"') && getIn(formik.errors, 'level2"'))}
        />
        {getIn(formik.touched, 'level2') && getIn(formik.errors, 'level2') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'level2')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12}>
        <InputLabel>Level3</InputLabel>
        <TextField
          value={formik.values.level3}
          name="level3"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'level3"') && getIn(formik.errors, 'level3"'))}
        />
        {getIn(formik.touched, 'level3') && getIn(formik.errors, 'level3') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'level3')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12}>
        <InputLabel>Position</InputLabel>
        <TextField
          value={formik.values.position}
          name="position"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'position"') && getIn(formik.errors, 'position"'))}
        />
        {getIn(formik.touched, 'position') && getIn(formik.errors, 'position') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'position')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>Url Path*</InputLabel>
        <TextField
          value={formik.values.url_path}
          name="url_path"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'url_path') && getIn(formik.errors, 'url_path'))}
        />
        {getIn(formik.touched, 'url_path') && getIn(formik.errors, 'url_path') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'uri_path')}
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
export default AddSecModuleSecForm;
