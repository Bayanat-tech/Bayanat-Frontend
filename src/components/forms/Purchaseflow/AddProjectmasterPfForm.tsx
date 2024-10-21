import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { Button, FormHelperText, Grid, InputLabel, MenuItem, Select } from '@mui/material';
import TextField from '@mui/material/TextField';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TProjectmaster } from 'pages/Purchasefolder/type/projectmaster-pf-types';
import { TDivisionmaster } from 'pages/Purchasefolder/type/hrdivion-pf-types';
import { useEffect } from 'react';
import GmPfServiceInstance from 'service/Purchaseflow/services.purchaseflow';
import * as yup from 'yup';
import axios from 'axios'; // or use fetch API if you prefer
import { useState } from 'react';

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
  const [divisions, setDivisions] = useState<TDivisionmaster[]>([]);
  const fetchDivisions = async () => {
    try {
      console.log('inside fetch');
      const response = await axios.get('api/pf/gm/divisionsdropdown');
      const divisionData = response.data.map((item: any) => ({
        div_code: item.DIV_CODE, // Map from API field to TDivisionmaster field
        div_name: item.DIV_NAME  // Map from API field to TDivisionmaster field
      }));
      setDivisions(divisionData); // Update state
    } catch (error) {
      console.error('Failed to fetch divisions', error);
    }
  };
  //------------------formik-----------------
  const formik = useFormik<TProjectmaster>({
    initialValues: { project_name: '', project_code: '', prno_pre_fix: '', flag_proj_department: '', div_code: '',  company_code: user?.company_code },
    validationSchema: yup.object().shape({
      project_code: yup.string().required('This field is required'),
      project_name: yup.string().required('This field is required'),
      prno_pre_fix: yup.string().required('This field is required'),
      flag_proj_department: yup.string().required('This field is required') ,// Add validation for the dropdown
      div_code: yup.string().required('This field is required') // Add validation for the dropdown
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
    } else {
      fetchDivisions();
    }
    fetchDivisions();
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
      <Grid item xs={12} sm={5}>
        <InputLabel>PR Prefix*</InputLabel>
        <TextField
          value={formik.values.prno_pre_fix}
          name="prno_pre_fix"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'prno_pre_fix') && getIn(formik.errors, 'prno_pre_fix'))}
        />
        {getIn(formik.touched, 'prno_pre_fix') && getIn(formik.errors, 'prno_pre_fix') && (
          <FormHelperText error id="helper-text-first_name">
            {getIn(formik.errors, 'prno_pre_fix')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>Flag Project/Department*</InputLabel>
        <Select
          value={formik.values.flag_proj_department}
          name="flag_proj_department"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'flag_proj_department') && getIn(formik.errors, 'flag_proj_department'))}
        >
          <MenuItem value="D">Department</MenuItem>
          <MenuItem value="P">Project</MenuItem>
        </Select>
        {getIn(formik.touched, 'flag_proj_department') && getIn(formik.errors, 'flag_proj_department') && (
          <FormHelperText error id="helper-text-flag_proj_department">
            {getIn(formik.errors, 'flag_proj_department')}
          </FormHelperText>
        )}
      </Grid>
      <Grid item xs={12} sm={5}>
        <InputLabel>Division Code*</InputLabel>
        <Select
          value={formik.values.div_code}
          name="div_code"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'div_code') && getIn(formik.errors, 'div_code'))}
        >
          {divisions.map((division) => (
            <MenuItem key={division.div_code} value={division.div_code}>
              {division.div_name}
            </MenuItem>
          ))}
        </Select>
        {getIn(formik.touched, 'div_code') && getIn(formik.errors, 'div_code') && (
          <FormHelperText error id="helper-text-div_code">
            {getIn(formik.errors, 'div_code')}
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