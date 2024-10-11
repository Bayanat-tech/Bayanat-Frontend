import { LoadingOutlined } from '@ant-design/icons';
import { Box, Button, CardContent, Step, StepButton, Stepper } from '@mui/material';
import { Formik, FormikContextType, FormikState } from 'formik';
import { TPrincipalWms } from 'pages/WMS/types/principal-wms.types';
import { useEffect, useState } from 'react';
import * as Yup from 'yup';
import AccountPrincipalInfoWms from './AccountPrincipalInfoWms';
import BasicPrincipalInfoWmsForm from './BasicPrincipalInfoWmsForm';
import AddContactInfoWmsForm from './AddContactInfoWmsForm';
import AddPickRulesInfoWms from './AddPickRulesInfoWms';
import AddSettingsPrincipalWmsForm from './AddSettingsPrincipalWmsForm';

const AddPrincipalWmsForm = ({ onClose }: { onClose: () => void }) => {
  //--------------------constants-------------------
  const steps = ['Basic Info', 'Account Info', 'Contact Info', 'Pick Rules', 'Settings'];

  //--------------------States-------------------
  const [activeStep, setActiveStep] = useState(0);
  const [IsLastStep, setIsLastStep] = useState(false);

  //--------------------useQuery-------------------
  //   const { data: appointmentConfigData, isFetched: isAppointmentWidgetDataFetched } = useQuery({
  //     queryKey: ['appointment_config'],
  //     queryFn: () => {
  //       if (companyId && serviceId) return AutoAppointmentServiceInstance.getAppointmentWidgetData(companyId, serviceId);
  //     }
  //   });

  //-----------------------------handlers----------------------

  //   const handleScheduleAppointmentFormSubmit = async (
  //     values: any,
  //     {
  //       resetForm,
  //       setFieldValue
  //     }: {
  //       resetForm: (nextState?: Partial<FormikState<any>> | undefined) => void;
  //       setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
  //     }
  //   ) => {};

  const handleNext = async (
    values: TPrincipalWms,
    {
      setSubmitting,
      resetForm,
      setFieldValue
    }: {
      setSubmitting: (isSubmitting: boolean) => void;
      resetForm: (nextState?: Partial<FormikState<TPrincipalWms>> | undefined) => void;
      setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void;
    }
  ) => {
    if (activeStep === 4) {
      setSubmitting(true);

      setSubmitting(false);
      return;
    }
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = (formikProps: FormikContextType<any>) => {
    switch (activeStep) {
      case 0:
        return <BasicPrincipalInfoWmsForm />;
      case 1:
        return <AccountPrincipalInfoWms />;
      case 2:
        return <AddContactInfoWmsForm />;
      case 3:
        return <AddPickRulesInfoWms />;
      case 4:
        return <AddSettingsPrincipalWmsForm />;
    }
  };
  useEffect(() => {
    if (activeStep === 2) setIsLastStep(true);
    else setIsLastStep(false);
    document.getElementById('auto_appoinment')?.scrollIntoView({ behavior: 'auto' });
  }, [activeStep]);
  return (
    <CardContent
    //  className="md:px-[20vw] lg:px-[30vw] space-y-4" id="auto_appoinment"
    >
      <Stepper nonLinear activeStep={activeStep} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label} completed={activeStep > index}>
            <StepButton color="inherit">{label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <Formik
        initialValues={{}}
        validationSchema={Yup.object().shape({})}
        onSubmit={async (values, { setSubmitting, resetForm, setFieldValue }) =>
          handleNext(values, { setSubmitting, resetForm, setFieldValue })
        }
      >
        {(formikProps: FormikContextType<any>) => (
          <Box component={'form'} onSubmit={formikProps.handleSubmit}>
            {renderStepContent(formikProps)}
            <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>
              <Button color="inherit" disabled={activeStep === 0} onClick={handleBack} sx={{ mr: 1 }}>
                Back
              </Button>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button
                variant="contained"
                sx={{ mr: 1 }}
                type="submit"
                disabled={formikProps.isSubmitting}
                startIcon={formikProps.isSubmitting && <LoadingOutlined />}
              >
                {activeStep < 4 ? 'Next' : 'Submit'}
              </Button>
            </Box>
          </Box>
        )}
      </Formik>
    </CardContent>
  );
};

export default AddPrincipalWmsForm;
