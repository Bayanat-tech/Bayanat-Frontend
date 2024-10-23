import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TBrand } from 'pages/WMS/types/brand-wms.types';
import { useEffect } from 'react';
//import GmServiceInstance from 'service/wms/services.gm_wms';
import brandServiceInstance from 'service/GM/service.brand_wms';
import * as yup from 'yup';

const AddBrandWmsForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TBrand;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();
  //------------------formik-----------------
  const formik = useFormik<TBrand>({
    initialValues: {
      brand_code: '',
      prin_code: '101',
      group_code: '',
      brand_name: '',
      pref_site: '',
      pref_loc_from: '',
      pref_loc_to: '',
      pref_aisle_from: '',
      pref_aisle_to: '',
      pref_col_from: 0,
      pref_col_to: 0,
      pref_ht_from: 0,
      pref_ht_to: 0,
      company_code: user?.company_code
    },
    validationSchema: yup.object().shape({
      brand_code: yup.string().required('This field is required'),
      brand_name: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await brandServiceInstance.editBrand(values);
      } else {
        response = await brandServiceInstance.addBrand(values);
      }
      if (response) {
        onClose(true);
        setSubmitting(false);
      }
    }
  });
  //   useEffect(() => {
  //     console.log(formik.errors);
  //   }, [formik.errors]);
  //   //------------------Handlers------------
  //   const handleCountryGccChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
  //     formik.setFieldValue('country_gcc', checked ? 'Y' : 'N');
  //   };
  useEffect(() => {
    if (isEditMode) {
      const { updated_at, updated_by, created_at, created_by, ...brandData } = existingData;
      console.log(updated_at, updated_by, created_at, created_by);

      formik.setValues(brandData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <Grid container spacing={2} component={'form'} onSubmit={formik.handleSubmit}>
      <Grid item xs={12} sm={3}>
        <InputLabel>Brand Code*</InputLabel>
        <TextField
          value={formik.values.brand_code}
          name="brand_code"
          onChange={formik.handleChange}
          error={Boolean(getIn(formik.touched, 'brand_code') && getIn(formik.errors, 'brand_code'))}
        />
        {getIn(formik.touched, 'brand_code') && getIn(formik.errors, 'brand_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'brand_code')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={9}>
        <InputLabel>Brand Name*</InputLabel>
        <TextField
          value={formik.values.brand_name}
          name="brand_name"
          fullWidth
          onChange={formik.handleChange}
          error={Boolean(getIn(formik.touched, 'brand_name') && getIn(formik.errors, 'brand_name'))}
        />
        {getIn(formik.touched, 'brand_name') && getIn(formik.errors, 'brand_name') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'brand_name')}
          </FormHelperText>
        )}
      </Grid>
      {/* <Grid item xs={12} sm={6} md={3}>
        <InputLabel>Is gcc?</InputLabel>
        <FormControlLabel
          control={<Checkbox onChange={handleCountryGccChange} />}
          checked={formik.values.country_gcc === 'Y'}
          name="country_gcc"
          label={'Yes/No'}
          value={formik.values.country_gcc}
        />
      </Grid> */}

      <Grid item xs={12} sm={3}>
        <InputLabel>Group Code*</InputLabel>
        <TextField
          value={formik.values.group_code}
          name="group_code"
          onChange={formik.handleChange}
          error={Boolean(getIn(formik.touched, 'group_code') && getIn(formik.errors, 'group_code'))}
        />
        {getIn(formik.touched, 'group_code') && getIn(formik.errors, 'group_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'group_code')}
          </FormHelperText>
        )}
      </Grid>

      {/* <Grid item xs={12} sm={3}>
        <InputLabel>Job No Sequence*</InputLabel>
        <TextField
          value={formik.values.jobno_seq}
          name="jobno_seq"
          onChange={formik.handleChange}
          error={Boolean(getIn(formik.touched, 'jobno_seq') && getIn(formik.errors, 'jobno_seq'))}
        />
        {getIn(formik.touched, 'jobno_seq') && getIn(formik.errors, 'jobno_seq') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'jobno_seq')}
          </FormHelperText>
        )}
      </Grid> */}

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
export default AddBrandWmsForm;
