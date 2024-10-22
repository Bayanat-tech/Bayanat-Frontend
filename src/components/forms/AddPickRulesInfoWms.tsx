import { Button, Stack } from '@mui/material';
import { Grid, InputLabel, TextField } from '@mui/material';
import { useFormik } from 'formik';
import { TPickRulesPrincipalWms } from 'pages/WMS/types/principal-wms.types';
import { useEffect } from 'react';

const AddPickRulesInfoWms = ({
  handleNext,
  handleBack,

  pickRules,
  setPickRules
}: {
  handleNext: () => void;
  handleBack: () => void;

  pickRules: TPickRulesPrincipalWms;
  setPickRules: (value: TPickRulesPrincipalWms) => void;
}) => {
  //----------------formik-----------------
  const formik = useFormik<TPickRulesPrincipalWms>({
    initialValues: pickRules,

    onSubmit: async (values) => {
      setPickRules(values);
      handleNext();
    }
  });
  //---------------------useEffects--------------------
  useEffect(() => {
    if (!!pickRules && !!Object.keys(pickRules).length) formik.setValues(pickRules);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickRules]);

  return (
    <Grid container spacing={2} component={'form'} onSubmit={formik.handleSubmit}>
      {/*----------------------Pick Wave-------------------------- */}
      <Grid item container className="px-14" xs={12}>
        <Grid item xs={12} sm={3}>
          <InputLabel>Pick Wave</InputLabel>
          <TextField
            size="small"
            onChange={formik.handleChange}
            id="pick_wave"
            name="pick_wave"
            fullWidth
            value={formik.values.pick_wave}
          />
        </Grid>
      </Grid>

      {/*----------------------Pick Wave (Minimum Exp)-------------------------- */}
      <Grid item container className="px-14" xs={12}>
        <Grid item xs={12} sm={3}>
          <InputLabel>Pick Wave (Minimum Exp)</InputLabel>
          <TextField
            size="small"
            type="number"
            inputProps={{ min: 0 }}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const inputValue = event.target.value;
              if (inputValue.charAt(0) !== '-') {
                formik.handleChange(event);
              }
            }}
            id="pick_wave_ign_min_exp"
            fullWidth
            value={formik.values.pick_wave_ign_min_exp}
          />
        </Grid>
      </Grid>

      {/*----------------------Pick Wave (Least Quantity)-------------------------- */}
      <Grid item container className="px-14" xs={12}>
        <Grid item xs={12} sm={3}>
          <InputLabel>Pick Wave (Least Quantity)</InputLabel>
          <TextField
            size="small"
            type="number"
            inputProps={{ min: 0 }}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const inputValue = event.target.value;
              if (inputValue.charAt(0) !== '-') {
                formik.handleChange(event);
              }
            }}
            id="pick_wave_qty_sort"
            name="pick_wave_qty_sort"
            fullWidth
            value={formik.values.pick_wave_qty_sort}
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

export default AddPickRulesInfoWms;
