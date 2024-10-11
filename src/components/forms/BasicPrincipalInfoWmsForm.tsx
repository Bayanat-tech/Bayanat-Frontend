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
import { FormikContextType, getIn, useFormikContext } from 'formik';
import { TPrincipalWms } from 'pages/WMS/types/principal-wms.types';
const BasicPrincipalInfoWmsForm = () => {
  const { values, handleChange, errors, touched }: FormikContextType<TPrincipalWms> = useFormikContext();

  return (
    <Grid container spacing={2} className="py-5">
      {/*----------------------Sales/Company Information-------------------------- */}
      <Grid item container xs={12} sm={6} spacing={2}>
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
            id="prin_name"
            name="prin_name"
            placeholder="Principal Name"
            fullWidth
            value={values.prin_name}
          />
          {getIn(touched, 'prin_name') && getIn(errors, 'prin_name') && (
            <FormHelperText error id="helper-text-first_name">
              {getIn(errors, 'prin_name')}
            </FormHelperText>
          )}
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
        {/*----------------------City-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>City</InputLabel>
          <TextField onChange={handleChange} id="prin_city" name="prin_city" placeholder="City" fullWidth value={values.prin_city} />
        </Grid>
        {/*----------------------Company Fax 1-------------------------- */}
        <Grid item xs={12} sm={4}>
          <InputLabel>Company Fax 1</InputLabel>
          <TextField onChange={handleChange} id="prin_faxno1" name="prin_faxno1" placeholder="City" fullWidth value={values.prin_faxno1} />
        </Grid>
        {/*----------------------Company Fax 2-------------------------- */}
        <Grid item xs={12} sm={4}>
          <InputLabel>Company Fax 2</InputLabel>
          <TextField onChange={handleChange} id="prin_faxno2" name="prin_faxno2" placeholder="City" fullWidth value={values.prin_faxno2} />
        </Grid>
        {/*----------------------Company Fax 3-------------------------- */}
        <Grid item xs={12} sm={4}>
          <InputLabel>Company Fax 3</InputLabel>
          <TextField onChange={handleChange} id="prin_faxno3" name="prin_faxno3" placeholder="City" fullWidth value={values.prin_faxno3} />
        </Grid>
        {/*----------------------Territory-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Territory</InputLabel>
          <Autocomplete
            id="assign"
            value={{} as any}
            onChange={(event, value) => {
              // formik.setFieldValue('assign', value?.id);
            }}
            options={[]}
            fullWidth
            autoHighlight
            getOptionLabel={(option) => option.name}
            //   isOptionEqualToValue={(option) => option.id === formik.values.assign}
            renderOption={(props, option) => (
              // <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              //   <img loading="lazy" width="20" src={avatarImage(`./${option.avatar}`)} alt="" />
              //   {option.name}
              // </Box>
              <></>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Choose a assignee"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password' // disable autocomplete and autofill
                }}
              />
            )}
          />
        </Grid>
        {/*----------------------Country-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Country</InputLabel>
          <Autocomplete
            id="assign"
            value={{} as any}
            onChange={(event, value) => {
              // formik.setFieldValue('assign', value?.id);
            }}
            options={[]}
            fullWidth
            autoHighlight
            getOptionLabel={(option) => option.name}
            //   isOptionEqualToValue={(option) => option.id === formik.values.assign}
            renderOption={(props, option) => (
              // <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              //   <img loading="lazy" width="20" src={avatarImage(`./${option.avatar}`)} alt="" />
              //   {option.name}
              // </Box>
              <></>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Choose a assignee"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password' // disable autocomplete and autofill
                }}
              />
            )}
          />
        </Grid>
      </Grid>

      {/*----------------------Account/Tax Information-------------------------- */}
      <Grid item container xs={12} sm={6} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className="text-gray-500">
            Sales/Company Information
          </Typography>
          <Divider orientation="horizontal" className="p-1" />
        </Grid>

        {/*----------------------Status-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel id="prin_stat">Status</InputLabel>

          <FormControl fullWidth>
            <Select labelId="prin_stat" id="prin_stat" value={values.prin_stat} label="Status" onChange={handleChange}>
              <MenuItem value={'Y'}>Active</MenuItem>
              <MenuItem value={'N'}>Inactive</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/*----------------------Tax Country-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Tax Country</InputLabel>
          <Autocomplete
            id="assign"
            value={{} as any}
            onChange={(event, value) => {
              // formik.setFieldValue('assign', value?.id);
            }}
            options={[]}
            fullWidth
            autoHighlight
            getOptionLabel={(option) => option.name}
            //   isOptionEqualToValue={(option) => option.id === formik.values.assign}
            renderOption={(props, option) => (
              // <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
              //   <img loading="lazy" width="20" src={avatarImage(`./${option.avatar}`)} alt="" />
              //   {option.name}
              // </Box>
              <></>
            )}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Choose a assignee"
                inputProps={{
                  ...params.inputProps,
                  autoComplete: 'new-password' // disable autocomplete and autofill
                }}
              />
            )}
          />
        </Grid>
        {/*----------------------Email 1-------------------------- */}
        <Grid item xs={12} sm={4}>
          <InputLabel>Email 1</InputLabel>
          <TextField onChange={handleChange} id="prin_email1" name="prin_email1" placeholder="City" fullWidth value={values.prin_email1} />
        </Grid>
        {/*----------------------Email 2-------------------------- */}
        <Grid item xs={12} sm={4}>
          <InputLabel>Email 2</InputLabel>
          <TextField onChange={handleChange} id="prin_email2" name="prin_email2" placeholder="City" fullWidth value={values.prin_email2} />
        </Grid>
        {/*----------------------Email 3-------------------------- */}
        <Grid item xs={12} sm={4}>
          <InputLabel>Email 3</InputLabel>
          <TextField onChange={handleChange} id="prin_email3" name="prin_email3" placeholder="City" fullWidth value={values.prin_email3} />
        </Grid>
        {/*----------------------Additional Information-------------------------- */}
        <Grid item xs={12}>
          <Typography variant="subtitle1" className="text-gray-500">
            Additional Information
          </Typography>
          <Divider orientation="horizontal" className="p-1" />
        </Grid>
        {/*----------------------Account Reference-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>A/C Reference</InputLabel>
          <TextField id="prin_acref" name="prin_acref" placeholder="A/C Reference" value={values.prin_acref} fullWidth />
        </Grid>
        {/*----------------------Department-------------------------- */}
        <Grid item xs={12} container spacing={2}>
          <Grid item xs={12} sm={6}>
            <InputLabel>Department</InputLabel>
            <Autocomplete
              id="assign"
              value={{} as any}
              onChange={(event, value) => {
                // formik.setFieldValue('assign', value?.id);
              }}
              options={[]}
              fullWidth
              autoHighlight
              getOptionLabel={(option) => option.name}
              //   isOptionEqualToValue={(option) => option.id === formik.values.assign}
              renderOption={(props, option) => (
                // <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 } }} {...props}>
                //   <img loading="lazy" width="20" src={avatarImage(`./${option.avatar}`)} alt="" />
                //   {option.name}
                // </Box>
                <></>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder="Choose a assignee"
                  inputProps={{
                    ...params.inputProps,
                    autoComplete: 'new-password' // disable autocomplete and autofill
                  }}
                />
              )}
            />
            {getIn(touched, 'dept_code') && getIn(errors, 'dept_code') && (
              <FormHelperText error id="helper-text-first_name">
                {getIn(errors, 'dept_code')}
              </FormHelperText>
            )}
          </Grid>
          {/*----------------------Reference-------------------------- */}
          <Grid item xs={12} sm={6}>
            <InputLabel>Reference</InputLabel>
            <TextField onChange={handleChange} id="prin_email3" name="prin_email3" placeholder="City" fullWidth value={values.prin_acref} />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

export default BasicPrincipalInfoWmsForm;
