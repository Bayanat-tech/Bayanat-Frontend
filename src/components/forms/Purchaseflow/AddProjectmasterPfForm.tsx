import { Autocomplete, Button, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getIn, useFormik } from 'formik';
import useAuth from 'hooks/useAuth';
import { TProjectmaster } from 'pages/Purchasefolder/type/projectmaster-pf-types';
import { TDivisionmaster } from 'pages/Purchasefolder/type/division-pf-types';
import { useEffect } from 'react';
import GmPfServiceInstance from 'service/Purchaseflow/services.purchaseflow';
import PfSerivceInstance from 'service/service.purhaseflow';
import * as yup from 'yup';
import { LoadingOutlined, SaveOutlined } from '@ant-design/icons';
import { useSelector } from 'store';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import dayjs, { Dayjs } from 'dayjs';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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
  const { app } = useSelector((state) => state.menuSelectionSlice);
  const { data: divisionList } = useQuery({
    queryKey: ['division_data'],
    queryFn: async () => {
      try {
        const response = await PfSerivceInstance.getMasters(app, 'division', undefined, undefined);
        if (response) {
          return {
            tableData: response.tableData as TDivisionmaster[],
            count: response.count
          };
        }
        // Return empty data if response is undefined
        return { tableData: [], count: 0 };
      } catch (error) {
        // Handle error case
        console.error('Failed to fetch division data', error);
        return { tableData: [], count: 0 }; // Fallback in case of error
      }
    }
  });

  //------------------formik-----------------
  const formik = useFormik<TProjectmaster>({
    initialValues: {
      project_name: '',
      project_code: '',
      company_code: user?.company_code,
      div_code: '',
      prno_pre_fix: '', // This is the prno_pre_fix field
      flag_proj_department: '',
      project_type: '',
      total_project_cost: 0,
      facility_mgr_name: '',
      facility_mgr_email: '',
      facility_mgr_phone: '',
      project_date_from: undefined,
      project_date_to: undefined
    },
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
        {/* Flag Project Department Field */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Flag Project Department</InputLabel>
          <Select
            value={formik.values.flag_proj_department}
            onChange={(e) => formik.setFieldValue('flag_proj_department', e.target.value)}
            fullWidth
          >
            <MenuItem value="P">Project</MenuItem>
            <MenuItem value="D">Department</MenuItem>
          </Select>
          {formik.touched.flag_proj_department && formik.errors.flag_proj_department && (
            <FormHelperText error>{formik.errors.flag_proj_department}</FormHelperText>
          )}
        </Grid>
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
      <Grid item xs={12} sm={6}>
        <InputLabel>Division</InputLabel>
        <Autocomplete
          id="div_code"
          value={
            !!formik.values.div_code
              ? divisionList?.tableData.find((eachDivision) => eachDivision.div_code === formik.values.div_code)
              : ({ div_name: '' } as TDivisionmaster)
          }
          onChange={(event, value: TDivisionmaster | null) => {
            formik.setFieldValue('div_code', value?.div_code);
          }}
          size="small"
          options={divisionList?.tableData ?? []}
          fullWidth
          autoHighlight
          getOptionLabel={(option) => (option as TDivisionmaster)?.div_name || ''}
          isOptionEqualToValue={(option) => option.div_code === formik.values.div_code}
          renderInput={(params) => (
            <TextField
              {...params}
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      {/* prno_pre_fix field */}
      <Grid item xs={12} sm={5}>
        <InputLabel>PR NO Prefix</InputLabel>
        <TextField
          value={formik.values.prno_pre_fix} // prno_pre_fix field
          name="prno_pre_fix"
          onChange={formik.handleChange}
          fullWidth
          error={Boolean(getIn(formik.touched, 'prno_pre_fix') && getIn(formik.errors, 'prno_pre_fix'))}
        />
        {getIn(formik.touched, 'prno_pre_fix') && getIn(formik.errors, 'prno_pre_fix') && (
          <FormHelperText error id="helper-text-prno_pre_fix">
            {getIn(formik.errors, 'prno_pre_fix')}
          </FormHelperText>
        )}
      </Grid>
      {/*----------------------Project From date --------------------- */}

      <Grid item xs={12} sm={6}>
        <InputLabel>Project From Date</InputLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{ textField: { size: 'small' } }}
            className="w-full"
            value={formik.values.project_date_from ? dayjs(formik.values.project_date_from) : null}
            onChange={(newValue: Dayjs | null) => {
              if (newValue?.isValid()) formik.setFieldValue('project_date_from', newValue.toISOString());
            }}
          />
        </LocalizationProvider>
      </Grid>
      {/*----------------------Project to date --------------------- */}

      <Grid item xs={12} sm={6}>
        <InputLabel>Project Date To </InputLabel>
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DatePicker
            slotProps={{ textField: { size: 'small' } }}
            className="w-full"
            value={formik.values.project_date_to ? dayjs(formik.values.project_date_to) : null}
            onChange={(newValue: Dayjs | null) => {
              if (newValue?.isValid()) formik.setFieldValue('project_date_to', newValue.toISOString());
            }}
          />
        </LocalizationProvider>
      </Grid>
      {/*----------------------Project Type--------------------- */}

      <Grid item xs={12} sm={6}>
        <InputLabel>Flag Project Type</InputLabel>
        <Select value={formik.values.project_type} onChange={(e) => formik.setFieldValue('project_type', e.target.value)} fullWidth>
          <MenuItem value="O">Original</MenuItem>
          <MenuItem value="C">Child</MenuItem>
        </Select>
        {formik.touched.project_type && formik.errors.project_type && <FormHelperText error>{formik.errors.project_type}</FormHelperText>}
      </Grid>
      {/*----------------------Total Project Cost --------------------- */}
      <Grid item xs={12} sm={4}>
        <InputLabel>Total Project Cost</InputLabel>
        <TextField
          fullWidth
          name="total_project_cost"
          type="number"
          value={formik.values.total_project_cost}
          onChange={(event) => formik.setFieldValue('total_project_cost', event.target.value)}
          inputProps={{
            step: '0.01', // Ensures 2 decimal places
            min: 0, // Prevents negative values
            max: 99999999.99 // Allows up to 10 digits, 8 before decimal, 2 after
          }}
          error={formik.touched.total_project_cost && Boolean(formik.errors.total_project_cost)}
          helperText={formik.touched.total_project_cost && formik.errors.total_project_cost}
        />
      </Grid>
      {/*----------------------Facility Manager Name  --------------------- */}
      <Grid item xs={12} sm={4}>
        <InputLabel>Facility Manager Name</InputLabel>
        <TextField
          fullWidth
          name="facility_mgr_name"
          value={formik.values.facility_mgr_name}
          onChange={formik.handleChange}
          inputProps={{
            maxLength: 100 // Limit input to 100 characters
          }}
          error={formik.touched.facility_mgr_name && Boolean(formik.errors.facility_mgr_name)}
          helperText={formik.touched.facility_mgr_name && formik.errors.facility_mgr_name}
        />
      </Grid>
      {/*----------------------Facility Manager Email  --------------------- */}
      <Grid item xs={12} sm={4}>
        <InputLabel>Facility Manager Email</InputLabel>
        <TextField
          fullWidth
          name="facility_mgr_email"
          type="email"
          value={formik.values.facility_mgr_email}
          onChange={formik.handleChange}
          error={formik.touched.facility_mgr_email && Boolean(formik.errors.facility_mgr_email)}
          helperText={formik.touched.facility_mgr_email && formik.errors.facility_mgr_email}
        />
      </Grid>
      <Grid item xs={12} sm={4}>
        <InputLabel>Facility Manager Phone</InputLabel>
        <TextField
          fullWidth
          name="facility_mgr_phone"
          type="tel"
          value={formik.values.facility_mgr_phone}
          onChange={formik.handleChange}
          error={formik.touched.facility_mgr_phone && Boolean(formik.errors.facility_mgr_phone)}
          helperText={formik.touched.facility_mgr_phone && formik.errors.facility_mgr_phone}
          inputProps={{ pattern: '[0-9]{10}' }} // Pattern for a 10-digit phone number
        />
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
