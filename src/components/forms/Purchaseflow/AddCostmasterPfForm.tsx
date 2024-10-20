import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TCostmaster } from 'pages/Purchasefolder/type/costmaster-pf-types';
import { useEffect } from 'react';
import GmPfServiceInstance from 'service/Purchaseflow/services.purchaseflow';
import * as yup from 'yup';

const AddCostmasterPfForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TCostmaster;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();
  //------------------formik-----------------
  const formik = useFormik<TCostmaster>({
    initialValues: { cost_name: '', cost_code: '', company_code: user?.company_code },
    validationSchema: yup.object().shape({
      cost_code: yup.string().required('This field is required'),
      cost_name: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await GmPfServiceInstance.editCostmaster(values);
      } else {
        response = await GmPfServiceInstance.addCostmaster(values);
      }
      if (response) {
        onClose(true);
        setSubmitting(false);
      }
    }
  });
  useEffect(() => {
    if (isEditMode) {
      const { updated_at, updated_by, created_at, created_by, ...costmasterData } = existingData;
      console.log(updated_at, updated_by, created_at, created_by);

      formik.setValues(costmasterData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <Grid container spacing={2} component={'form'} onSubmit={formik.handleSubmit}>
      <Grid item xs={12}>
        <InputLabel>Cost Code*</InputLabel>
        <TextField
          value={formik.values.cost_code}
          name="cost_code"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'cost_code') && getIn(formik.errors, 'cost_code'))}
        />
        {getIn(formik.touched, 'cost_code') && getIn(formik.errors, 'cost_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'cost_code')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>Cost Name*</InputLabel>
        <TextField
          value={formik.values.cost_name}
          name="cost_name"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'cost_name') && getIn(formik.errors, 'cost_name'))}
        />
        {getIn(formik.touched, 'cost_name') && getIn(formik.errors, 'cost_name') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'cost_name')}
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

export default AddCostmasterPfForm;
