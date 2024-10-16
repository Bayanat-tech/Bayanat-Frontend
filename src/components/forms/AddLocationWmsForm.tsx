import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';

import { TLocation } from 'pages/WMS/types/location-wms.types';
import { useEffect } from 'react';
import GmServiceInstance from 'service/wms/services.gm_wms';
import * as yup from 'yup';

const AddLocationWmsForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TLocation;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();
  //------------------formik-----------------
  const formik = useFormik<TLocation>({
    initialValues: {
      site_code: '',
      location_code: '',
      company_code: user?.company_code,
      loc_desc: '',
      loc_type: '',
      loc_stat: '',
      aisle: '',
      column_no: 0,
      height: 0,
      job_no: '',
      prod_code: '',
      prin_code: '',
      stk_stat: '',
      pref_prin: '',
      pref_prod: '',
      pref_group: '',
      pref_brand: '',
      put_seqno: 0,
      pick_seqno: 0,
      push_level: '',
      max_qty: 0,
      uom: '',
      reorder_qty: 0,
      barcode: '',
      prod_type: 0,
      depth: 0,
      check_digit: '',
      assigned_prin_code: '',
      assigned_prodgroup: '',
      assigned_userid: '',
      location_code_002: '',
      volume_cbm: 0,
      height_cm: 0,
      breadth_cm: 0,
      length_cm: 0,
      blockcyc: 'N',
      trolley_no: '',
      bonded_area_code: '',
      location_reserved_for: ''
    },
    validationSchema: yup.object().shape({
      site_code: yup.string().required('This field is required'),
      location_code: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await GmServiceInstance.editLocation(values);
      } else {
        response = await GmServiceInstance.addLocation(values);
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
  //   const handleLocationGccChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
  //     formik.setFieldValue('location_gcc', checked ? 'Y' : 'N');
  //   };
  useEffect(() => {
    if (isEditMode) {
      const { updated_at, updated_by, created_at, created_by, ...locationData } = existingData;
      console.log(updated_at, updated_by, created_at, created_by);

      formik.setValues(locationData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <Grid container spacing={2} component={'form'} onSubmit={formik.handleSubmit}>
      <Grid item xs={12}>
        <InputLabel>Site Code*</InputLabel>
        <TextField
          value={formik.values.site_code}
          name="site_code"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'site_code') && getIn(formik.errors, 'site_code'))}
        />
        {getIn(formik.touched, 'site_code') && getIn(formik.errors, 'site_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'site_code')}
          </FormHelperText>
        )}
      </Grid>

      <Grid item xs={12}>
        <InputLabel>Location Code*</InputLabel>
        <TextField
          value={formik.values.site_code}
          name="location_code"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'location_code') && getIn(formik.errors, 'location_code'))}
        />
        {getIn(formik.touched, 'location_code') && getIn(formik.errors, 'location_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'location_code')}
          </FormHelperText>
        )}
      </Grid>

      {/* <Grid item xs={12} sm={5}>
        <InputLabel>Country Name*</InputLabel>
        <TextField
          value={formik.values.country_name}
          name="country_name"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'country_name') && getIn(formik.errors, 'country_name'))}
        />
        {getIn(formik.touched, 'country_name') && getIn(formik.errors, 'country_name') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'country_name')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={6} md={3}>
        <InputLabel>Is gcc?</InputLabel>
        <FormControlLabel
          control={<Checkbox onChange={handleCountryGccChange} />}
          checked={formik.values.country_gcc === 'Y'}
          name="country_gcc"
          label={'Yes/No'}
          value={formik.values.country_gcc}
        />
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
export default AddLocationWmsForm;
