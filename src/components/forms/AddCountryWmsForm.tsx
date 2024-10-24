import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, Checkbox, FormControlLabel, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TCountry } from 'pages/WMS/types/country-wms.types';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import countryServiceInstance from 'service/GM/service.country_wms';
import * as yup from 'yup';

const AddCountryWmsForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TCountry;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();
  //------------------formik-----------------
  const formik = useFormik<TCountry>({
    initialValues: { country_name: '', country_code: '', country_gcc: 'N', company_code: user?.company_code },
    validationSchema: yup.object().shape({
      country_code: yup.string().required('This field is required'),
      country_name: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await countryServiceInstance.editCountry(values);
      } else {
        response = await countryServiceInstance.addCountry(values);
      }
      if (response) {
        onClose(true);
        setSubmitting(false);
      }
    }
  });
  //------------------Handlers------------
  const handleCountryGccChange = (event: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    formik.setFieldValue('country_gcc', checked ? 'Y' : 'N');
  };

  //------------------useEffect------------

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
        <InputLabel>
          <FormattedMessage id="Country Code" />*
        </InputLabel>
        <TextField
          size="small"
          value={formik.values.country_code}
          name="country_code"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'country_code') && getIn(formik.errors, 'country_code'))}
        />
        {getIn(formik.touched, 'country_code') && getIn(formik.errors, 'country_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'country_code')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>
          <FormattedMessage id="Country Name" />*
        </InputLabel>
        <TextField
          size="small"
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
        <InputLabel>
          <FormattedMessage id="Is gcc?" />
        </InputLabel>
        <FormControlLabel
          control={<Checkbox onChange={handleCountryGccChange} />}
          checked={formik.values.country_gcc === 'Y'}
          name="country_gcc"
          label={<FormattedMessage id="Yes/No" />}
          value={formik.values.country_gcc}
        />
      </Grid>
      <Grid item xs={12} className="flex justify-end">
        <Button
          type="submit"
          variant="contained"
          disabled={formik.isSubmitting}
          startIcon={formik.isSubmitting ? <LoadingOutlined /> : <SaveOutlined />}
        >
          <FormattedMessage id="Submit" />
        </Button>
      </Grid>
    </Grid>
  );
};
export default AddCountryWmsForm;
