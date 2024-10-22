import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TProjectmaster } from 'pages/Purchasefolder/type/projectmaster-pf-types';
import { useEffect } from 'react';
import GmPfServiceInstance from 'service/Purchaseflow/services.purchaseflow';
import * as yup from 'yup';

const AddProjectmasterPfForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TProjectmaster;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();
  //------------------formik-----------------
  const formik = useFormik<TProjectmaster>({
    initialValues: { project_name: '', project_code: '', company_code: user?.company_code },
    validationSchema: yup.object().shape({
      project_code: yup.string().required('This field is required'),
      project_name: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await GmPfServiceInstance.editProjectmaster(values);
      } else {
        response = await GmPfServiceInstance.addProjectmaster(values);
      }
      if (response) {
        onClose(true);
        setSubmitting(false);
      }
    }
  });
  useEffect(() => {
    if (isEditMode) {
      const { updated_at, updated_by, created_at, created_by, ...projectmasterData } = existingData;
      console.log(updated_at, updated_by, created_at, created_by);

      formik.setValues(projectmasterData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <Grid container spacing={2} component={'form'} onSubmit={formik.handleSubmit}>
      <Grid item xs={12}>
        <InputLabel>Project Code*</InputLabel>
        <TextField
          value={formik.values.project_code}
          name="project_code"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'project_code') && getIn(formik.errors, 'project_code'))}
        />
        {getIn(formik.touched, 'project_code') && getIn(formik.errors, 'project_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'project_code')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>Project Name*</InputLabel>
        <TextField
          value={formik.values.project_name}
          name="project_name"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'project_name') && getIn(formik.errors, 'project_name'))}
        />
        {getIn(formik.touched, 'project_name') && getIn(formik.errors, 'project_name') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'project_name')}
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

export default AddProjectmasterPfForm;
