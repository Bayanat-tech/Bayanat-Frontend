import { Autocomplete, Divider, FormHelperText, Grid, InputLabel, TextField, Typography } from '@mui/material';
import { FormikContextType, getIn, useFormikContext } from 'formik';
import { TPrincipalWms } from 'pages/WMS/types/principal-wms.types';

const AccountPrincipalInfoWms = () => {
  const { values, handleChange, errors, touched }: FormikContextType<TPrincipalWms> = useFormikContext();

  return (
    <Grid container spacing={3}>
      {/*----------------------Sales/Company Information-------------------------- */}

      <Grid spacing={2} item container xs={12} sm={6}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className="text-gray-500">
            Sales/Company Information
          </Typography>
          <Divider orientation="horizontal" className="p-1" />
        </Grid>
        <Grid item xs={12} sm={6}>
          {/*----------------------A/C Reference-------------------------- */}
          <InputLabel>A/C Reference</InputLabel>
          <TextField
            onChange={handleChange}
            id="prin_acref"
            name="prin_acref"
            placeholder="A/C Reference"
            fullWidth
            value={values.prin_acref}
          />
          {getIn(touched, 'prin_acref') && getIn(errors, 'prin_acref') && (
            <FormHelperText error id="helper-text-first_name">
              {getIn(errors, 'prin_acref')}
            </FormHelperText>
          )}
        </Grid>
        {/*----------------------Credit Limit-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Credit Limit</InputLabel>
          <TextField
            onChange={handleChange}
            id="credit_limit"
            name="credit_limit"
            placeholder="0000"
            fullWidth
            value={values.credit_limit}
          />
        </Grid>
        {/*----------------------Credit Period (WMS)-------------------------- */}
        <Grid item container xs={12} sm={6} spacing={2}>
          <Grid item xs={12} sm={6}>
            <InputLabel>Credit Period (WMS)</InputLabel>
            <TextField
              onChange={handleChange}
              id="creditdays"
              name="creditdays"
              placeholder="Credit Period (WMS)"
              fullWidth
              value={values.creditdays}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>(Frieght)</InputLabel>

            <TextField
              onChange={handleChange}
              id="creditdays_freight"
              name="creditdays_freight"
              placeholder="7"
              fullWidth
              value={values.creditdays_freight}
            />
          </Grid>
        </Grid>

        {/*----------------------Default Currency-------------------------- */}

        <Grid item xs={12} sm={6}>
          <InputLabel>Default Currency</InputLabel>
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
      {/*----------------------Tax and Registration Information-------------------------- */}
      <Grid spacing={2} item container xs={12} sm={6}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className="text-gray-500">
            Tax and Registration Information
          </Typography>
          <Divider orientation="horizontal" className="p-1" />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>Tax Registered No.</InputLabel>
          <TextField onChange={handleChange} id="prin_lic_no" name="prin_lic_no" placeholder="" fullWidth value={values.prin_lic_no} />
        </Grid>{' '}
        {/*----------------------Tax Registration Expiry Date-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Tax Registration Expiry Date</InputLabel>
          <TextField
            onChange={handleChange}
            id="prin_lic_type"
            name="prin_lic_type"
            placeholder="City"
            fullWidth
            value={values.prin_lic_type}
          />
        </Grid>
        {/*----------------------Commercial Registered No.-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Commercial Registered No.</InputLabel>
          <TextField onChange={handleChange} id="prin_email3" name="prin_email3" placeholder="City" fullWidth value={values.prin_email3} />
        </Grid>
        {/*----------------------Commercial Registration No. Expiry Date-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Commercial Registration No. Expiry Date</InputLabel>
          <TextField onChange={handleChange} id="prin_email3" name="prin_email3" placeholder="City" fullWidth value={values.prin_email3} />
        </Grid>
        {/*----------------------In Designated Zone-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>In Designated Zone</InputLabel>
          <TextField onChange={handleChange} id="prin_email3" name="prin_email3" placeholder="City" fullWidth value={values.prin_email3} />
        </Grid>
        {/*----------------------Import Code-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Import Code</InputLabel>
          <TextField onChange={handleChange} id="prin_email3" name="prin_email3" placeholder="City" fullWidth value={values.prin_email3} />
        </Grid>
      </Grid>
      {/*----------------------Invoice and Transaction History-------------------------- */}
      <Grid spacing={2} item container xs={12} sm={6}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className="text-gray-500">
            Invoice and Transaction History
          </Typography>
          <Divider orientation="horizontal" className="p-1" />
        </Grid>

        {/*----------------------Account Reference-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Last Invoice Date</InputLabel>
          <TextField
            id="prin_acref"
            name="prin_acref"
            placeholder="Last Invoice Date
"
            value={values.prin_acref}
            fullWidth
          />
        </Grid>
      </Grid>
      {/*----------------------Invoice and Transaction History-------------------------- */}
      <Grid spacing={2} item container xs={12} sm={6}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className="text-gray-500">
            Invoice and Transaction History
          </Typography>
          <Divider orientation="horizontal" className="p-1" />
        </Grid>

        {/*----------------------Document Upload-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Upload Documents</InputLabel>
          <TextField
            id="prin_acref"
            name="prin_acref"
            placeholder="Upload Documents
"
            value={values.prin_acref}
            fullWidth
          />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AccountPrincipalInfoWms;
