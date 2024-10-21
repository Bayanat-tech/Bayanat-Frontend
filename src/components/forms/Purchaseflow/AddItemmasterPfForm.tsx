import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TItemmaster } from 'pages/Purchasefolder/type/itemmaster-pf-types';
import { useEffect } from 'react';
import GmPfServiceInstance from 'service/Purchaseflow/services.purchaseflow';
import * as yup from 'yup';

const AddItemmasterPfForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TItemmaster;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();
  //------------------formik-----------------
  const formik = useFormik<TItemmaster>({
    initialValues: { item_code: '', item_desp: '', company_code: user?.company_code },
    validationSchema: yup.object().shape({
      item_code: yup.string().required('This field is required'),
      item_desp: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await GmPfServiceInstance.edititemmaster(values);
      } else {
        response = await GmPfServiceInstance.additemmaster(values);
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
      

      formik.setValues(costmasterData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <Grid container spacing={2} component={'form'} onSubmit={formik.handleSubmit}>
      <Grid item xs={12}>
        <InputLabel>Item Code*</InputLabel>
        <TextField
          value={formik.values.item_code}
          name="item_code"
          disabled={isEditMode===true}
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'item_code') && getIn(formik.errors, 'item_code'))}
        />
        {getIn(formik.touched, 'item_code') && getIn(formik.errors, 'item_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'item_code')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel> Item Description*</InputLabel>
        <TextField
          value={formik.values.item_desp}
          name="item_desp"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'item_desp') && getIn(formik.errors, 'item_desp'))}
        />
        {getIn(formik.touched, 'item_desp') && getIn(formik.errors, 'item_desp') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'item_desp')}
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

export default AddItemmasterPfForm;
