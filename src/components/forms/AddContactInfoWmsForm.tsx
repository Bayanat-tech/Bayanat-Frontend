import { Divider, Typography } from '@mui/material';
import { Grid, InputLabel, TextField } from '@mui/material';
import { FormikContextType, useFormikContext } from 'formik';
import { TPrincipalWms } from 'pages/WMS/types/principal-wms.types';

const AddContactInfoWmsForm = () => {
  const { values, handleChange }: FormikContextType<TPrincipalWms> = useFormikContext();

  return (
    <Grid container spacing={2}>
      <Grid item container xs={12} sm={6} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className="text-gray-500">
            Emails
          </Typography>
          <Divider orientation="horizontal" className="p-1" />
        </Grid>
        {/*----------------------Email 1-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Email 1</InputLabel>
          <TextField onChange={handleChange} id="prin_email1" name="prin_email1" placeholder="City" fullWidth value={values.prin_email1} />
        </Grid>
        {/*----------------------Email 2-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Email 2</InputLabel>
          <TextField onChange={handleChange} id="prin_email2" name="prin_email2" placeholder="City" fullWidth value={values.prin_email2} />
        </Grid>
        {/*----------------------Email 3-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Email 3</InputLabel>
          <TextField onChange={handleChange} id="prin_email3" name="prin_email3" placeholder="City" fullWidth value={values.prin_email3} />
        </Grid>
      </Grid>
      <Grid item container xs={12} sm={6} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className="text-gray-500">
            Telephones
          </Typography>
          <Divider orientation="horizontal" className="p-1" />
        </Grid>
        {/*----------------------Telephone 1-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Telephone 1</InputLabel>
          <TextField onChange={handleChange} id="prin_email1" name="prin_email1" placeholder="City" fullWidth value={values.prin_email1} />
        </Grid>
        {/*----------------------Telephone 2-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Telephone 2</InputLabel>
          <TextField onChange={handleChange} id="prin_email2" name="prin_email2" placeholder="City" fullWidth value={values.prin_email2} />
        </Grid>
        {/*----------------------Telephone 3-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Telephone 3</InputLabel>
          <TextField onChange={handleChange} id="prin_email3" name="prin_email3" placeholder="City" fullWidth value={values.prin_email3} />
        </Grid>
      </Grid>

      <Grid item container xs={12} sm={6} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="subtitle1" className="text-gray-500">
            Faxs
          </Typography>
          <Divider orientation="horizontal" className="p-1" />
        </Grid>
        {/*----------------------Fax 1-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Fax 1</InputLabel>
          <TextField onChange={handleChange} id="prin_email1" name="prin_email1" placeholder="City" fullWidth value={values.prin_email1} />
        </Grid>
        {/*----------------------Fax 2-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Fax 2</InputLabel>
          <TextField onChange={handleChange} id="prin_email2" name="prin_email2" placeholder="City" fullWidth value={values.prin_email2} />
        </Grid>
        {/*----------------------Fax 3-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Fax 3</InputLabel>
          <TextField onChange={handleChange} id="prin_email3" name="prin_email3" placeholder="City" fullWidth value={values.prin_email3} />
        </Grid>
        {/*----------------------Reference-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>Reference</InputLabel>
          <TextField onChange={handleChange} id="prin_email3" name="prin_email3" placeholder="City" fullWidth value={values.prin_email3} />
        </Grid>
      </Grid>
    </Grid>
  );
};

export default AddContactInfoWmsForm;
