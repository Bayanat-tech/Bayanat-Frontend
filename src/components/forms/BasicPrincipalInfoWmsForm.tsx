import {
  Autocomplete,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getIn, useFormik } from 'formik';
import { TCountry } from 'pages/WMS/types/country-wms.types';
import { TDepartment } from 'pages/WMS/types/department-wms.types';
import { TBasicPrincipalWms } from 'pages/WMS/types/principal-wms.types';
import { TTerritory } from 'pages/WMS/types/territory-wms.types';
import { useEffect } from 'react';
import WmsSerivceInstance from 'service/wms/service.wms';
import { useSelector } from 'store';
import * as yup from 'yup';

const BasicPrincipalInfoWmsForm = ({
  handleNext,
  isEditMode,
  basicInfo,
  setBasicInfo
}: {
  handleNext: () => void;
  isEditMode: boolean;
  basicInfo: TBasicPrincipalWms;
  setBasicInfo: (value: TBasicPrincipalWms) => void;
}) => {
  const { app } = useSelector((state) => state.menuSelectionSlice);
  //----------------formik-----------------
  const formik = useFormik<TBasicPrincipalWms>({
    initialValues: basicInfo,
    validationSchema: yup.object().shape({
      prin_name: yup.string().required('This field is required'),
      prin_dept_code: yup.string().required('This field is required')
    }),
    onSubmit: async (values) => {
      setBasicInfo(values);
      handleNext();
    }
  });

  //----------------useQuery-----------------

  const { data: departmentList } = useQuery({
    queryKey: ['department_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'department', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TDepartment[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });
  const { data: countryList } = useQuery({
    queryKey: ['country_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'country', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TCountry[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });
  const { data: territoryList } = useQuery({
    queryKey: ['territory_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'territory', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TTerritory[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });
  useEffect(() => {
    if (!!basicInfo && !!Object.keys(basicInfo).length) {
      formik.setValues(basicInfo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [basicInfo]);

  return (
    <Grid container spacing={6} component={'form'} onSubmit={formik.handleSubmit}>
      {/*----------------------Sales/Company Information-------------------------- */}
      <Grid item xs={12} sm={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" className="text-black py-2 font-semibold">
              Sales/Company Information
            </Typography>
          </Grid>
          {/*----------------------Prin Code-------------------------- */}
          <Grid item xs={12} sm={6} hidden={!isEditMode}>
            <InputLabel>Code</InputLabel>
            <TextField
              size="small"
              name="prin_code"
              fullWidth
              disabled
              value={formik.values.prin_code}
              error={getIn(formik.touched, 'prin_code') && getIn(formik.errors, 'prin_code')}
            />
            {getIn(formik.touched, 'prin_code') && getIn(formik.errors, 'prin_code') && (
              <FormHelperText error id="helper-text-first_name">
                {getIn(formik.errors, 'prin_code')}
              </FormHelperText>
            )}
          </Grid>
          {/*----------------------Name-------------------------- */}
          <Grid item xs={12} sm={6}>
            <InputLabel>Name*</InputLabel>
            <TextField
              size="small"
              onChange={formik.handleChange}
              name="prin_name"
              fullWidth
              value={formik.values.prin_name}
              error={getIn(formik.touched, 'prin_name') && getIn(formik.errors, 'prin_name')}
            />
            {getIn(formik.touched, 'prin_name') && getIn(formik.errors, 'prin_name') && (
              <FormHelperText error id="helper-text-first_name">
                {getIn(formik.errors, 'prin_name')}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/*----------------------Address1-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Address 1</InputLabel>
                <TextField
                  size="small"
                  onChange={formik.handleChange}
                  id="prin_addr1"
                  name="prin_addr1"
                  fullWidth
                  value={formik.values.prin_addr1}
                />
              </Grid>
              {/*----------------------Address2-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Address 2</InputLabel>
                <TextField
                  size="small"
                  onChange={formik.handleChange}
                  id="prin_addr2"
                  name="prin_addr2"
                  fullWidth
                  value={formik.values.prin_addr2}
                />
              </Grid>
              {/*----------------------Address3-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Address 3</InputLabel>
                <TextField
                  size="small"
                  onChange={formik.handleChange}
                  id="prin_addr3"
                  name="prin_addr3"
                  fullWidth
                  value={formik.values.prin_addr3}
                />
              </Grid>
              {/*----------------------Address4-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Address 4</InputLabel>
                <TextField
                  size="small"
                  onChange={formik.handleChange}
                  id="prin_addr4"
                  name="prin_addr4"
                  fullWidth
                  value={formik.values.prin_addr4}
                />
              </Grid>
              {/*----------------------City-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>City</InputLabel>
                <TextField
                  size="small"
                  onChange={formik.handleChange}
                  id="prin_city"
                  name="prin_city"
                  fullWidth
                  value={formik.values.prin_city}
                />
              </Grid>
              {/*----------------------Country-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Country</InputLabel>
                <Autocomplete
                  id="country_code"
                  value={
                    !!formik.values.country_code
                      ? countryList?.tableData.find((eachCountry) => eachCountry.country_code === formik.values.country_code)
                      : ({ country_name: '' } as TCountry)
                  }
                  onChange={(event, value: TCountry | null) => {
                    formik.setFieldValue('country_code', value?.country_code);
                  }}
                  size="small"
                  options={countryList?.tableData ?? []}
                  fullWidth
                  autoHighlight
                  getOptionLabel={(option) => option?.country_name}
                  isOptionEqualToValue={(option) => option.country_code === formik.values.country_code}
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
              {/*----------------------Territory-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Territory</InputLabel>
                <Autocomplete
                  id="territory"
                  value={
                    !!formik.values.territory_code
                      ? territoryList?.tableData.find((eachTerritory) => eachTerritory.territory_code === formik.values.territory_code)
                      : ({ territory_name: '' } as TTerritory)
                  }
                  onChange={(event, value: TTerritory | null) => {
                    formik.setFieldValue('territory_code', value?.territory_code);
                  }}
                  options={territoryList?.tableData ?? []}
                  fullWidth
                  autoHighlight
                  getOptionLabel={(option) => option?.territory_name}
                  size="small"
                  isOptionEqualToValue={(option) => option.territory_code === formik.values.territory_code}
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
              {/*----------------------Sector-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Sector</InputLabel>
                <TextField
                  size="small"
                  onChange={formik.handleChange}
                  id="sector_code"
                  name="sector_code"
                  fullWidth
                  value={formik.values.sector_code}
                />
              </Grid>

              {/*----------------------Company Fax 1-------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Company Fax 1</InputLabel>
                <TextField
                  size="small"
                  onChange={formik.handleChange}
                  id="prin_faxno1"
                  name="prin_faxno1"
                  fullWidth
                  value={formik.values.prin_faxno1}
                />
              </Grid>
              {/*----------------------Company Fax 2-------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Company Fax 2</InputLabel>
                <TextField
                  size="small"
                  onChange={formik.handleChange}
                  id="prin_faxno2"
                  name="prin_faxno2"
                  fullWidth
                  value={formik.values.prin_faxno2}
                />
              </Grid>
              {/*----------------------Company Fax 3-------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Company Fax 3</InputLabel>
                <TextField
                  size="small"
                  onChange={formik.handleChange}
                  id="prin_faxno3"
                  name="prin_faxno3"
                  fullWidth
                  value={formik.values.prin_faxno3}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/*----------------------Account/Tax Information--------------------------*/}
      <Grid item xs={12} sm={6}>
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" className="text-black py-2 font-semibold">
                  Account/Tax Information
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <Grid container spacing={2}>
                  {/*----------------------Status-------------------------- */}
                  <Grid item xs={12} sm={6}>
                    <InputLabel id="prin_status">Status</InputLabel>

                    <FormControl fullWidth>
                      <Select
                        labelId="prin_status"
                        id="prin_status"
                        value={formik.values.prin_status}
                        label="Status"
                        onChange={formik.handleChange}
                      >
                        <MenuItem value={'Y'}>Active</MenuItem>
                        <MenuItem value={'N'}>Inactive</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>
                  {/*----------------------Tax Country-------------------------- */}
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Tax Country</InputLabel>
                    <Autocomplete
                      id="tax_country_code"
                      value={
                        !!formik.values.tax_country_code
                          ? countryList?.tableData.find((eachCountry) => eachCountry.country_code === formik.values.tax_country_code)
                          : ({ country_name: '' } as TCountry)
                      }
                      onChange={(event, value: TCountry | null) => {
                        formik.setFieldValue('tax_country_code', value?.country_code);
                        formik.setFieldValue('tax_country_sn', value?.short_desc);
                      }}
                      options={countryList?.tableData ?? []}
                      fullWidth
                      autoHighlight
                      getOptionLabel={(option) => option?.country_name}
                      size="small"
                      isOptionEqualToValue={(option) => option.country_code === formik.values.tax_country_code}
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
                  {/*----------------------Email Account-------------------------- */}
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Email Account</InputLabel>
                    <TextField
                      size="small"
                      onChange={formik.handleChange}
                      id="acc_email"
                      name="acc_email"
                      fullWidth
                      value={formik.values.acc_email}
                      type="email"
                    />
                  </Grid>
                  {/*----------------------Email 1-------------------------- */}
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Email 1</InputLabel>
                    <TextField
                      size="small"
                      onChange={formik.handleChange}
                      id="prin_email1"
                      name="prin_email1"
                      fullWidth
                      value={formik.values.prin_email1}
                      type="email"
                    />
                  </Grid>
                  {/*----------------------Email 2-------------------------- */}
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Email 2</InputLabel>
                    <TextField
                      size="small"
                      onChange={formik.handleChange}
                      id="prin_email2"
                      name="prin_email2"
                      fullWidth
                      value={formik.values.prin_email2}
                      type="email"
                    />
                  </Grid>
                  {/*----------------------Email 3-------------------------- */}
                  <Grid item xs={12} sm={6}>
                    <InputLabel>Email 3</InputLabel>
                    <TextField
                      size="small"
                      onChange={formik.handleChange}
                      id="prin_email3"
                      name="prin_email3"
                      fullWidth
                      value={formik.values.prin_email3}
                      type="email"
                    />
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/*----------------------Additional Information-------------------------- */}
              <Grid item xs={12}>
                <Typography variant="h4" className="text-black py-2 font-semibold">
                  Additional Information
                </Typography>
              </Grid>

              {/*----------------------Department-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Department*</InputLabel>
                <Autocomplete
                  id="prin_dept_code"
                  value={
                    !!formik.values.prin_dept_code
                      ? departmentList?.tableData.find((eachDepartment) => eachDepartment.dept_code === formik.values.prin_dept_code)
                      : ({ dept_name: '', dept_code: '' } as TDepartment)
                  }
                  onChange={(event, value: TDepartment | null) => {
                    formik.setFieldValue('prin_dept_code', value?.dept_code);
                  }}
                  options={departmentList?.tableData ?? []}
                  fullWidth
                  autoHighlight
                  size="small"
                  getOptionLabel={(option) => option?.dept_name}
                  isOptionEqualToValue={(option) => option.dept_code === formik.values.prin_dept_code}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps
                      }}
                    />
                  )}
                />
                {getIn(formik.touched, 'prin_dept_code') && getIn(formik.errors, 'prin_dept_code') && (
                  <FormHelperText error id="helper-text-first_name">
                    {getIn(formik.errors, 'prin_dept_code')}
                  </FormHelperText>
                )}
              </Grid>
              {/*----------------------Reference-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Reference</InputLabel>
                <TextField
                  size="small"
                  onChange={formik.handleChange}
                  id="prin_ref1"
                  name="prin_ref1"
                  fullWidth
                  value={formik.values.prin_ref1}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="end">
          <Button variant="contained" type="submit" sx={{ my: 1, ml: 1 }}>
            Next
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default BasicPrincipalInfoWmsForm;
