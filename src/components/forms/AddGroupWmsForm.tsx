import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TGroup } from 'pages/WMS/types/group-wms.types';
import { useEffect } from 'react';
//import GmServiceInstance from 'service/wms/services.gm_wms';
import prodgroupServiceInstance from 'service/GM/service.prodgroup_wms';
import * as yup from 'yup';

const AddGroupWmsForm = ({
  onClose,
  isEditMode,
  existingData
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TGroup;
}) => {
  //-------------------constants-------------------
  const { user } = useAuth();
  //------------------formik-----------------
  const formik = useFormik<TGroup>({
    initialValues: { group_name: '', group_code: '', prin_code: '', company_code: user?.company_code },
    validationSchema: yup.object().shape({
      group_code: yup.string().required('This field is required'),
      group_name: yup.string().required('This field is required')
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      let response;
      if (isEditMode) {
        response = await prodgroupServiceInstance.editGroup(values);
      } else {
        response = await prodgroupServiceInstance.addGroup(values);
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
      const { updated_at, updated_by, created_at, created_by, ...groupData } = existingData;
      console.log(updated_at, updated_by, created_at, created_by);

      formik.setValues(groupData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <Grid container spacing={2} component={'form'} onSubmit={formik.handleSubmit}>
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
      <Grid item xs={12} sm={9}>
        <InputLabel>Group Name*</InputLabel>
        <TextField
          value={formik.values.group_name}
          name="group_name"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'group_name') && getIn(formik.errors, 'group_name'))}
        />
        {getIn(formik.touched, 'group_name') && getIn(formik.errors, 'group_name') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'group_name')}
          </FormHelperText>
        )}
      </Grid>

      <Grid item xs={12} sm={3}>
        <InputLabel>Principal Code*</InputLabel>
        <TextField
          value={formik.values.prin_code}
          name="prin_code"
          onChange={formik.handleChange}
          className="w-28"
          error={Boolean(getIn(formik.touched, 'prin_code') && getIn(formik.errors, 'prin_code'))}
        />
        {getIn(formik.touched, 'prin_code') && getIn(formik.errors, 'prin_code') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'prin_code')}
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
export default AddGroupWmsForm;
