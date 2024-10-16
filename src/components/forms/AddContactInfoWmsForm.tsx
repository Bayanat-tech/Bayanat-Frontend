import { Button, Grid, InputLabel, Stack, TextField, Typography } from '@mui/material';
import { useFormik } from 'formik';
import { TContactPrincipalWms } from 'pages/WMS/types/principal-wms.types';

const AddContactInfoWmsForm = ({
  handleNext,
  handleBack,

  contactInfo,
  setContactInfo
}: {
  handleNext: () => void;
  handleBack: () => void;

  contactInfo: TContactPrincipalWms;
  setContactInfo: (value: TContactPrincipalWms) => void;
}) => {
  //----------------formik-----------------
  const formik = useFormik<TContactPrincipalWms>({
    initialValues: contactInfo,
    onSubmit: async (values) => {
      setContactInfo(values);
      handleNext();
    }
  });
  console.log('contact', formik.values);

  return (
    <Grid container spacing={2} component={'form'} onSubmit={formik.handleSubmit}>
      {/*----------------------Contact-------------------------- */}

      <Grid item container xs={12} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" className="text-black  font-semibold">
            Contacts
          </Typography>
        </Grid>
        {/*----------------------Contact 1-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Contact 1</InputLabel>
          <TextField onChange={formik.handleChange} id="prin_cont1" name="prin_cont1" fullWidth value={formik.values.prin_cont1} />
        </Grid>
        {/*----------------------Contact 2-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Contact 2</InputLabel>
          <TextField
            type="email"
            onChange={formik.handleChange}
            id="prin_cont_email2"
            name="prin_cont_email2"
            fullWidth
            value={formik.values.prin_cont_email2}
          />
        </Grid>
        {/*----------------------Contact 3-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Contact 3</InputLabel>
          <TextField
            type="email"
            onChange={formik.handleChange}
            id="prin_cont_email3"
            name="prin_cont_email3"
            fullWidth
            value={formik.values.prin_cont_email3}
          />
        </Grid>
      </Grid>
      {/*-----------------------Emails------------------- */}
      <Grid item container xs={12} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" className="text-black  font-semibold">
            Emails
          </Typography>
        </Grid>
        {/*----------------------Email 1-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Email 1</InputLabel>
          <TextField
            type="email"
            onChange={formik.handleChange}
            id="prin_cont1"
            name="prin_cont1"
            fullWidth
            value={formik.values.prin_cont1}
          />
        </Grid>
        {/*----------------------Email 2-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Email 2</InputLabel>
          <TextField
            type="email"
            onChange={formik.handleChange}
            id="prin_cont_email2"
            name="prin_cont_email2"
            fullWidth
            value={formik.values.prin_cont_email2}
          />
        </Grid>
        {/*----------------------Email 3-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Email 3</InputLabel>
          <TextField
            type="email"
            onChange={formik.handleChange}
            id="prin_cont_email3"
            name="prin_cont_email3"
            fullWidth
            value={formik.values.prin_cont_email3}
          />
        </Grid>
      </Grid>
      <Grid item container xs={12} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" className="text-black  font-semibold">
            Telephones
          </Typography>
        </Grid>
        {/*----------------------Telephone 1-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Telephone 1</InputLabel>
          <TextField
            onChange={formik.handleChange}
            id="prin_cont_telno1"
            name="prin_cont_telno1"
            fullWidth
            value={formik.values.prin_cont_telno1}
          />
        </Grid>
        {/*----------------------Telephone 2-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Telephone 2</InputLabel>
          <TextField
            onChange={formik.handleChange}
            id="prin_cont_telno2"
            name="prin_cont_telno2"
            fullWidth
            value={formik.values.prin_cont_telno2}
          />
        </Grid>
        {/*----------------------Telephone 3-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Telephone 3</InputLabel>
          <TextField
            onChange={formik.handleChange}
            id="prin_cont_telno3"
            name="prin_cont_telno3"
            fullWidth
            value={formik.values.prin_cont_telno3}
          />
        </Grid>
      </Grid>

      <Grid item container xs={12} spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" className="text-black  font-semibold">
            Faxs & Reference
          </Typography>
        </Grid>
        {/*----------------------Fax 1-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Fax 1</InputLabel>
          <TextField
            onChange={formik.handleChange}
            id="prin_cont_faxno1"
            name="prin_cont_faxno1"
            fullWidth
            value={formik.values.prin_cont_faxno1}
          />
        </Grid>
        {/*----------------------Fax 2-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Fax 2</InputLabel>
          <TextField
            onChange={formik.handleChange}
            id="prin_cont_faxno2"
            name="prin_cont_faxno2"
            fullWidth
            value={formik.values.prin_cont_faxno2}
          />
        </Grid>
        {/*----------------------Fax 3-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Fax 3</InputLabel>
          <TextField
            onChange={formik.handleChange}
            id="prin_cont_faxno3"
            name="prin_cont_faxno3"
            fullWidth
            value={formik.values.prin_cont_faxno3}
          />
        </Grid>
        {/*----------------------Reference-------------------------- */}
        <Grid item xs={12} sm={6} md={3}>
          <InputLabel>Reference</InputLabel>
          <TextField
            onChange={formik.handleChange}
            id="prin_cont_ref1"
            name="prin_cont_ref1"
            fullWidth
            value={formik.values.prin_cont_ref1}
          />
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Button onClick={handleBack} sx={{ my: 1, ml: 1 }}>
            Back
          </Button>
          <Button variant="contained" type="submit" sx={{ my: 1, ml: 1 }}>
            Next
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AddContactInfoWmsForm;
