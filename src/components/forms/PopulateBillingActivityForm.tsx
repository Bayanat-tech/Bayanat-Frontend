import { Autocomplete, Button, Grid, InputLabel, TextField } from '@mui/material';
import { TBillingActivity, TPopulate } from 'pages/WMS/types/billingActivity-wms.types';
import { TPrincipalWms } from 'pages/WMS/types/principal-wms.types';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import WmsSerivceInstance from 'service/wms/service.wms';
import { useSelector } from 'store';
import { useQuery } from '@tanstack/react-query';
import UniversalDialog from 'components/popup/UniversalDialog';
import PasswordForm from './common/PasswordForm';
import { TUniversalDialogProps } from 'types/types.UniversalDialog';
import ActivityServiceInstance from 'service/wms/services.activity_wms';
const PopulateBillingActivityForm = ({
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
  const [prinCode, setPrinCode] = useState<string>('');
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
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  //------------useQuery-------------
  const { data: principalList } = useQuery({
    queryKey: ['principal_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'principal', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TPrincipalWms[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });

  const handleSubmit = async () => {
    //------logic here-------------
    setIsSubmit(true);
    let response;
    const values: TPopulate = {
      from: prin_code,
      to: prinCode,
      activityPassword: password
    };
    response = await ActivityServiceInstance.copyBilling(values);
    if (response) {
      onClose(true);
      setIsSubmit(false);
    }
    togglePasswordPopup(response === true);
    onClose(true);
  };

  return (
    <Grid container spacing={2}>
      {/*----------------------Princpal-------------------------- */}
      <Grid item xs={12} sm={12}>
        <InputLabel>
          <FormattedMessage id="Principal" />
        </InputLabel>
        <TextField id="outlined-basic" variant="outlined" value={prin_code} disabled fullWidth />
      </Grid>
      {/*----------------------To Principal-------------------------- */}
      <Grid item xs={12} className="pb-40">
        <InputLabel>
          <FormattedMessage id="To" />
        </InputLabel>
        <Autocomplete
          value={
            !!prinCode
              ? principalList?.tableData.find((eachPrincipal) => eachPrincipal.prin_code === prinCode)
              : ({ prin_name: '' } as TPrincipalWms)
          }
          onChange={(event, value: TPrincipalWms | null) => {
            if (value) setPrinCode(value?.prin_code as string);
          }}
          disablePortal
          // getOptionLabel={()}
          getOptionLabel={(option) => option.prin_name}
          getOptionDisabled={(option) => option.prin_code === prin_code}
          options={principalList?.tableData ?? []}
          renderInput={(params: any) => <TextField {...params} />}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} className="flex justify-end">
        <Button onClick={handlePasswordForm} variant="contained">
          Submit
        </Button>
      </Grid>
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
    </Grid>
  );
};

export default PopulateBillingActivityForm;
