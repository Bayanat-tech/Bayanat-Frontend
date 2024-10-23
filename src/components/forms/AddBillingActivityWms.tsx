import { Autocomplete, Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { TBillingActivity } from 'pages/WMS/types/billingActivity-wms.types';
import { TActivityWms } from 'pages/WMS/types/activity-wms.types';
import { TUocWms } from 'pages/WMS/types/TUoc-wms.types';
import WmsSerivceInstance from 'service/service.wms';
import { useSelector } from 'store';
import { useQuery } from '@tanstack/react-query';
// import ActivityServiceInstance from 'service/wms/services.activity_wms';

const AddBillingActivityWmsForm = ({ prin_code, password }: { prin_code: string; password: string }) => {
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  // //----------------------constants--------------
  const formik = useFormik<TBillingActivity>({
    initialValues: {
      prin_code: prin_code,
      act_code: '',
      jobtype: '',
      uoc: '',
      moc1: '',
      moc2: '',
      bill_amount: null as unknown as number,
      cost: null as unknown as number
    },
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      // let response = await ActivityServiceInstance.addBilling(values, prin_code);
      // console.log(response);
    }
  });

  //----------- useQuery--------------
  const { data: activityData } = useQuery({
    queryKey: ['activity_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'activity', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TActivityWms[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });

  const { data: UOCData } = useQuery({
    queryKey: ['uoc'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'uoc', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TUocWms[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });

  const { data: MOC1Data } = useQuery({
    queryKey: ['moc1'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'moc1', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TUocWms[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });

  const { data: MOC2Data } = useQuery({
    queryKey: ['moc2'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'moc2', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TUocWms[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });

  //----------------useEffects-----------

  return (
    <Grid container spacing={2} component={'form'} p={2.5}>
      {/*----------------------Prin Code-------------------------- */}
      <Grid item xs={12} sm={6}>
        <TextField label="Principal" id="outlined-basic" variant="outlined" value={formik.values.prin_code} disabled fullWidth />
      </Grid>
      {/*----------------------Activity-------------------------- */}
      <Grid item xs={12} sm={6}>
        <Autocomplete
          id="act_code"
          value={
            !!formik.values.act_code
              ? activityData?.tableData.find((eachActivity) => eachActivity.activity_code === formik.values.act_code)
              : ({ activity: '' } as TActivityWms)
          }
          onChange={(event, value: TActivityWms | null) => {
            formik.setFieldValue('act_code', value?.activity_code);
          }}
          size="small"
          options={activityData?.tableData ?? []}
          fullWidth
          autoHighlight
          getOptionLabel={(option) => option?.activity}
          isOptionEqualToValue={(option) => option.activity_code === formik.values.act_code}
          renderInput={(params) => (
            <TextField
              label="Activity"
              {...params}
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      {/*----------------------Act code-------------------------- */}

      <Grid item xs={12} sm={6}>
        <TextField label="ACT CODE" id="outlined-basic" name="act_code" variant="outlined" value={formik.values.act_code} fullWidth />
      </Grid>
      {/*----------------------Job Type-------------------------- */}

      <Grid item xs={12} sm={6}>
        <TextField
          value={formik.values.jobtype}
          onChange={formik.handleChange}
          label="Job Type"
          fullWidth
          id="outlined-basic"
          variant="outlined"
          name="jobtype"
        />
      </Grid>
      {/*----------------------Uoc-------------------------- */}

      <Grid item xs={4}>
        <Autocomplete
          id="uoc"
          value={
            !!formik.values.uoc
              ? UOCData?.tableData?.find((eachUoc) => eachUoc.charge_code === formik.values.uoc)
              : ({ description: '' } as TUocWms)
          }
          onChange={(event, value: TUocWms | null) => {
            formik.setFieldValue('uoc', value?.charge_code);
          }}
          size="small"
          options={UOCData?.tableData ?? []}
          fullWidth
          autoHighlight
          getOptionLabel={(option) => option?.description}
          isOptionEqualToValue={(option) => option.company_code === formik.values.uoc}
          renderInput={(params) => (
            <TextField
              label="UOC"
              {...params}
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          id="moc1"
          value={
            !!formik.values.moc1
              ? MOC1Data?.tableData.find((eachUoc) => eachUoc.charge_code === formik.values.moc1)
              : ({ description: '' } as TUocWms)
          }
          onChange={(event, value: TUocWms | null) => {
            formik.setFieldValue('moc1', value?.charge_code);
          }}
          size="small"
          options={MOC1Data?.tableData ?? []}
          fullWidth
          autoHighlight
          getOptionLabel={(option) => option?.description}
          isOptionEqualToValue={(option) => option.company_code === formik.values.moc1}
          renderInput={(params) => (
            <TextField
              label="MOC1"
              {...params}
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          id="moc2"
          value={
            !!formik.values.moc2
              ? MOC2Data?.tableData.find((eachUoc) => eachUoc.charge_code === formik.values.moc2)
              : ({ description: '' } as TUocWms)
          }
          onChange={(event, value: TUocWms | null) => {
            formik.setFieldValue('moc2', value?.charge_code);
          }}
          size="small"
          options={MOC2Data?.tableData ?? []}
          fullWidth
          autoHighlight
          getOptionLabel={(option) => option?.description}
          isOptionEqualToValue={(option) => option.company_code === formik.values.moc2}
          renderInput={(params) => (
            <TextField
              label="MOC2"
              {...params}
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          name="bill_amount"
          label="BILL AMOUNT"
          id="outlined-basic"
          type="number"
          variant="outlined"
          value={formik.values.bill_amount}
          onChange={formik.handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="COST"
          name="cost"
          value={formik.values.cost}
          onChange={formik.handleChange}
          fullWidth
          id="outlined-basic"
          type="number"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} className="flex justify-end">
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddBillingActivityWmsForm;
