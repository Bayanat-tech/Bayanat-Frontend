import {
  Autocomplete,
  Divider,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { FormikContextType, getIn, useFormikContext } from 'formik';
import { TCountry } from 'pages/WMS/types/country-wms.types';
import { TDepartment } from 'pages/WMS/types/department-wms.types';
import { TPrincipalWms } from 'pages/WMS/types/principal-wms.types';
import { TTerritory } from 'pages/WMS/types/territory-wms.types';
import WmsSerivceInstance from 'service/service.wms';
import { useSelector } from 'store';
const BasicPrincipalInfoWmsForm = () => {
  const { values, handleChange, errors, setFieldValue, touched }: FormikContextType<TPrincipalWms> = useFormikContext();
  const { app } = useSelector((state) => state.menuSelectionSlice);
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

  return (
    <Grid container spacing={4} className="py-2">
      {/*----------------------Sales/Company Information-------------------------- */}
      <Grid item xs={12} sm={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" className="text-gray-500">
              Sales/Company Information
            </Typography>
            <Divider orientation="horizontal" />
          </Grid>
          <Grid item xs={12} sm={6}>
            {/*----------------------Name-------------------------- */}
            <InputLabel>Name*</InputLabel>

            <TextField
              onChange={handleChange}
              // id="prin_name"
              name="prin_name"
              placeholder="Amazon"
              fullWidth
              value={values.prin_name}
              error={getIn(touched, 'prin_name') && getIn(errors, 'prin_name')}
            />
            {getIn(touched, 'prin_name') && getIn(errors, 'prin_name') && (
              <FormHelperText error id="helper-text-first_name">
                {getIn(errors, 'prin_name')}
              </FormHelperText>
            )}
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/*----------------------Address1-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Address 1</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="prin_addr1"
                  name="prin_addr1"
                  placeholder="Address 1"
                  fullWidth
                  value={values.prin_addr1}
                />
              </Grid>
              {/*----------------------Address2-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Address 2</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="prin_addr2"
                  name="prin_addr2"
                  placeholder="Address 2"
                  fullWidth
                  value={values.prin_addr2}
                />
              </Grid>
              {/*----------------------Address3-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Address 3</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="prin_addr3"
                  name="prin_addr3"
                  placeholder="Address 3"
                  fullWidth
                  value={values.prin_addr3}
                />
              </Grid>
              {/*----------------------Address4-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Address 4</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="prin_addr4"
                  name="prin_addr4"
                  placeholder="Address 4"
                  fullWidth
                  value={values.prin_addr4}
                />
              </Grid>
              {/*----------------------City-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>City</InputLabel>
                <TextField onChange={handleChange} id="prin_city" name="prin_city" placeholder="City" fullWidth value={values.prin_city} />
              </Grid>
              {/*----------------------Sector-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Sector</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="sector_code"
                  name="sector_code"
                  placeholder="Sector"
                  fullWidth
                  value={values.sector_code}
                />
              </Grid>

              {/*----------------------Territory-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Territory</InputLabel>
                <Autocomplete
                  id="territory"
                  value={
                    !!values.territory_code
                      ? territoryList?.tableData.find((eachTerritory) => eachTerritory.territory_code === values.territory_code)
                      : ({ territory_name: '' } as TTerritory)
                  }
                  onChange={(event, value: TTerritory | null) => {
                    setFieldValue('territory_code', value?.territory_code);
                  }}
                  options={territoryList?.tableData ?? []}
                  fullWidth
                  autoHighlight
                  getOptionLabel={(option) => option?.territory_name}
                  isOptionEqualToValue={(option) => option.territory_code === values.territory_code}
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
              {/*----------------------Country-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Country</InputLabel>
                <Autocomplete
                  id="country_code"
                  value={
                    !!values.country_code
                      ? countryList?.tableData.find((eachCountry) => eachCountry.country_code === values.country_code)
                      : ({ country_name: '' } as TCountry)
                  }
                  onChange={(event, value: TCountry | null) => {
                    setFieldValue('country_code', value?.country_code);
                  }}
                  options={countryList?.tableData ?? []}
                  fullWidth
                  autoHighlight
                  getOptionLabel={(option) => option?.country_name}
                  isOptionEqualToValue={(option) => option.country_code === values.country_code}
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
              {/*----------------------Company Fax 1-------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Company Fax 1</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="prin_faxno1"
                  name="prin_faxno1"
                  placeholder="City"
                  fullWidth
                  value={values.prin_faxno1}
                />
              </Grid>
              {/*----------------------Company Fax 2-------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Company Fax 2</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="prin_faxno2"
                  name="prin_faxno2"
                  placeholder="City"
                  fullWidth
                  value={values.prin_faxno2}
                />
              </Grid>
              {/*----------------------Company Fax 3-------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Company Fax 3</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="prin_faxno3"
                  name="prin_faxno3"
                  placeholder="City"
                  fullWidth
                  value={values.prin_faxno3}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      {/*----------------------Account/Tax Information--------------------------*/}
      <Grid item xs={12} sm={6}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="subtitle1" className="text-gray-500">
              Account/Tax Information
            </Typography>
            <Divider orientation="horizontal" />
          </Grid>
          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/*----------------------Status-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel id="prin_status">Status</InputLabel>

                <FormControl fullWidth>
                  <Select labelId="prin_status" id="prin_status" value={values.prin_status} label="Status" onChange={handleChange}>
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
                    !!values.tax_country_code
                      ? countryList?.tableData.find((eachCountry) => eachCountry.country_code === values.tax_country_code)
                      : ({ country_name: '' } as TCountry)
                  }
                  onChange={(event, value: TCountry | null) => {
                    setFieldValue('tax_country_code', value?.country_code);
                    setFieldValue('tax_country_sn', value?.short_desc);
                  }}
                  options={countryList?.tableData ?? []}
                  fullWidth
                  autoHighlight
                  getOptionLabel={(option) => option?.country_name}
                  isOptionEqualToValue={(option) => option.country_code === values.tax_country_code}
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
              <Grid item container xs={12}>
                {/*----------------------Email Account-------------------------- */}
                <Grid item xs={12} sm={4}>
                  <InputLabel>Email Account</InputLabel>
                  <TextField
                    onChange={handleChange}
                    id="acc_email"
                    name="acc_email"
                    placeholder="Email"
                    fullWidth
                    value={values.acc_email}
                  />
                </Grid>
              </Grid>
              {/*----------------------Email 1-------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Email 1</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="prin_email1"
                  name="prin_email1"
                  placeholder="Email 1"
                  fullWidth
                  value={values.prin_email1}
                />
              </Grid>
              {/*----------------------Email 2-------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Email 2</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="prin_email2"
                  name="prin_email2"
                  placeholder="Email 2"
                  fullWidth
                  value={values.prin_email2}
                />
              </Grid>
              {/*----------------------Email 3-------------------------- */}
              <Grid item xs={12} sm={4}>
                <InputLabel>Email 3</InputLabel>
                <TextField
                  onChange={handleChange}
                  id="prin_email3"
                  name="prin_email3"
                  placeholder="Email 3"
                  fullWidth
                  value={values.prin_email3}
                />
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12}>
            <Grid container spacing={2}>
              {/*----------------------Additional Information-------------------------- */}
              <Grid item xs={12}>
                <Typography variant="subtitle1" className="text-gray-500">
                  Additional Information
                </Typography>
                <Divider orientation="horizontal" />
              </Grid>

              {/*----------------------Department-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Department</InputLabel>
                <Autocomplete
                  id="prin_dept_code"
                  value={
                    !!values.prin_dept_code
                      ? departmentList?.tableData.find((eachDepartment) => eachDepartment.dept_code === values.prin_dept_code)
                      : ({ dept_name: '', dept_code: '' } as TDepartment)
                  }
                  onChange={(event, value: TDepartment | null) => {
                    console.log(value);

                    setFieldValue('prin_dept_code', value?.dept_code);
                  }}
                  options={departmentList?.tableData ?? []}
                  fullWidth
                  autoHighlight
                  getOptionLabel={(option) => option?.dept_name}
                  isOptionEqualToValue={(option) => option.dept_code === values.prin_dept_code}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps
                      }}
                    />
                  )}
                />
                {getIn(touched, 'prin_dept_code') && getIn(errors, 'prin_dept_code') && (
                  <FormHelperText error id="helper-text-first_name">
                    {getIn(errors, 'prin_dept_code')}
                  </FormHelperText>
                )}
              </Grid>
              {/*----------------------Reference-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Reference</InputLabel>
                <TextField onChange={handleChange} id="prin_ref1" name="prin_ref1" placeholder="City" fullWidth value={values.prin_ref1} />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BasicPrincipalInfoWmsForm;
