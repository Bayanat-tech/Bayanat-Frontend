import { Grid, InputLabel, TextField } from '@mui/material';
import { FormikContextType, useFormikContext } from 'formik';
import { TPrincipalWms } from 'pages/WMS/types/principal-wms.types';

const AddPickRulesInfoWms = () => {
  const { values, handleChange }: FormikContextType<TPrincipalWms> = useFormikContext();

  return (
    <Grid container spacing={2}>
      {/*----------------------Pick Wave-------------------------- */}
      <Grid item xs={12} sm={4}>
        <InputLabel>Pick Wave</InputLabel>
        <TextField onChange={handleChange} id="sector_code" name="sector_code" placeholder="Sector" fullWidth value={values.sector_code} />
      </Grid>{' '}
      {/*----------------------Pick Wave (Minimum Exp)-------------------------- */}
      <Grid item xs={12} sm={4}>
        <InputLabel>Pick Wave (Minimum Exp)</InputLabel>
        <TextField onChange={handleChange} id="sector_code" name="sector_code" placeholder="Sector" fullWidth value={values.sector_code} />
      </Grid>
      {/*----------------------Pick Wave (Least Quantity)-------------------------- */}
      <Grid item xs={12} sm={4}>
        <InputLabel>Pick Wave (Least Quantity)</InputLabel>
        <TextField onChange={handleChange} id="sector_code" name="sector_code" placeholder="Sector" fullWidth value={values.sector_code} />
      </Grid>
    </Grid>
  );
};

export default AddPickRulesInfoWms;
