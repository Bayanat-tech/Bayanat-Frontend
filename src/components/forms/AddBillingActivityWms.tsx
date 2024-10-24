import { Button, Autocomplete, Grid, TextField, InputLabel } from '@mui/material';

import { useFormik } from 'formik';
import { TBillingActivity } from 'pages/WMS/types/billingActivity-wms.types';
import { TActivityWms } from 'pages/WMS/types/activity-wms.types';
import { TUocWms } from 'pages/WMS/types/TUoc-wms.types';
import WmsSerivceInstance from 'service/wms/service.wms';
import { useSelector } from 'store';
import { useQuery } from '@tanstack/react-query';
import ActivityServiceInstance from 'service/wms/services.activity_wms';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { TUniversalDialogProps } from 'types/types.UniversalDialog';
import PasswordForm from './common/PasswordForm';
import UniversalDialog from 'components/popup/UniversalDialog';

const AddBillingActivityWmsForm = ({
  onClose,
  isEditMode,
  existingData,
  prin_code
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: Boolean;
  existingData: TBillingActivity;
  prin_code: string;
}) => {
  const [isSubmit, setIsSubmit] = useState<boolean>(false);
  const [passwordActivityFormPopup, setPasswordActivityFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'xs'
    },
    title: 'Add ActivityBilling'
  });
  const [password, setPassword] = useState<string>('');

  const togglePasswordPopup = (isFormSubmitting?: boolean) => {
    setPasswordActivityFormPopup((prev) => {
      return { ...prev, action: { ...prev.action, open: !prev.action.open } };
    });
    if (isFormSubmitting) {
      onClose();
    }
  };
  const handlePasswordForm = () => {
    setPasswordActivityFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false }, action: { ...prev.action, open: !prev.action.open } };
    });
  };
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
    onSubmit: () => handlePasswordForm()
  });

  //----------- useQuery--------------
  const { data: activityData } = useQuery({
    queryKey: ['activity_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'activity');
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
      const response = await WmsSerivceInstance.getMasters(app, 'uoc');
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
      const response = await WmsSerivceInstance.getMasters(app, 'moc1');
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
      const response = await WmsSerivceInstance.getMasters(app, 'moc2');
      if (response) {
        return {
          tableData: response.tableData as TUocWms[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });
  //----------------Handlers-----------
  const handleSubmit = async () => {
    setIsSubmit(true);
    let response, values;
    values = { ...formik.values, activityPassword: password };
    if (isEditMode) {
      response = await ActivityServiceInstance.editActivity(values);
    } else {
      response = await ActivityServiceInstance.addBilling(values);
    }
    if (response) {
      onClose(true);
      setIsSubmit(false);
    }
    togglePasswordPopup(response === true);
    onClose(true);
  };

  //----------------useEffects-----------
  useEffect(() => {
    if (isEditMode) {
      const { updated_at, updated_by, created_at, created_by, ...activityData } = existingData;
      console.log(updated_at, updated_by, created_at, created_by);

      formik.setValues(activityData);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditMode]);

  return (
    <form onSubmit={formik.handleSubmit}>
      <Grid container spacing={2}>
        {/*----------------------Prin Code-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>
            <FormattedMessage id="Principal" />
          </InputLabel>
          <TextField id="outlined-basic" variant="outlined" value={formik.values.prin_code} disabled fullWidth />
        </Grid>
        {/*----------------------Activity-------------------------- */}
        <Grid item xs={12} sm={6}>
          <InputLabel>
            <FormattedMessage id="Activity" />
          </InputLabel>
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
          <InputLabel>
            <FormattedMessage id="ACT CODE" />
          </InputLabel>
          <TextField id="outlined-basic" name="act_code" variant="outlined" disabled value={formik.values.act_code} fullWidth />
        </Grid>
        {/*----------------------Job Type-------------------------- */}

        <Grid item xs={12} sm={6}>
          <InputLabel>
            <FormattedMessage id="Job Type" />
          </InputLabel>
          <TextField
            value={formik.values.jobtype}
            onChange={formik.handleChange}
            fullWidth
            id="outlined-basic"
            variant="outlined"
            name="jobtype"
          />
        </Grid>
        {/*----------------------Uoc-------------------------- */}

        <Grid item xs={4}>
          <InputLabel>
            <FormattedMessage id="UOC" />
          </InputLabel>
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
            isOptionEqualToValue={(option) => option.charge_code === formik.values.uoc}
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
        <Grid item xs={4}>
          <InputLabel>
            <FormattedMessage id="MOC1" />
          </InputLabel>
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
            isOptionEqualToValue={(option) => option.charge_code === formik.values.moc1}
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
        <Grid item xs={4}>
          <InputLabel>
            <FormattedMessage id="MOĆ2" />
          </InputLabel>
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
            isOptionEqualToValue={(option) => option.charge_code === formik.values.moc2}
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
        <Grid item xs={12} sm={6}>
          <InputLabel>
            <FormattedMessage id="BILL AMOUNT" />
          </InputLabel>
          <TextField
            name="bill_amount"
            id="outlined-basic"
            type="number"
            variant="outlined"
            value={formik.values.bill_amount}
            inputProps={{ min: 0 }}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const inputValue = event.target.value;
              if (inputValue.charAt(0) !== '-') {
                formik.handleChange(event);
              }
            }}
            fullWidth
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <InputLabel>
            <FormattedMessage id="COST" />
          </InputLabel>
          <TextField
            name="cost"
            value={formik.values.cost}
            inputProps={{ min: 0 }}
            onChange={(event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
              const inputValue = event.target.value;
              if (inputValue.charAt(0) !== '-') {
                formik.handleChange(event);
              }
            }}
            fullWidth
            id="outlined-basic"
            type="number"
            variant="outlined"
          />
        </Grid>
        <Grid item xs={12} className="flex justify-end">
          <Button type="submit" variant="contained" id="dsds">
            Submit
          </Button>
        </Grid>
      </Grid>
      {/* Add Password Dialogue Box */}
      {!!passwordActivityFormPopup && passwordActivityFormPopup.action.open && (
        <UniversalDialog
          action={{ ...passwordActivityFormPopup.action }}
          onClose={() => togglePasswordPopup()}
          title="Enter Password"
          primaryButonTitle="Submit"
          onSave={handleSubmit}
          disablePrimaryButton={password === '' || isSubmit === true}
        >
          <PasswordForm password={password} setPassword={setPassword} />
        </UniversalDialog>
      )}
    </form>
  );
};

export default AddBillingActivityWmsForm;
