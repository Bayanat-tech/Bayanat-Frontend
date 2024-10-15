import { CardContent, Step, StepButton, Stepper } from '@mui/material';
import {
  TAccountPrincipalWms,
  TBasicPrincipalWms,
  TContactPrincipalWms,
  TPickRulesPrincipalWms,
  TSettingsPrincipalWms,
  TStorageDetailsPrincipalWms
} from 'pages/WMS/types/principal-wms.types';
import { useEffect, useState } from 'react';
import AccountPrincipalInfoWms from './AccountPrincipalInfoWms';
import AddContactInfoWmsForm from './AddContactInfoWmsForm';
import AddPickRulesInfoWms from './AddPickRulesInfoWms';
import AddSettingsPrincipalWmsForm from './AddSettingsPrincipalWmsForm';
import BasicPrincipalInfoWmsForm from './BasicPrincipalInfoWmsForm';
import AddStoragePrincipleForm from './AddStoragePrincipleForm';
import GmServiceInstance from 'service/wms/services.gm_wms';

const AddPrincipalWmsForm = ({ onClose }: { onClose: () => void }) => {
  //--------------------constants-------------------
  const steps = ['Basic Info', 'Account Info', 'Contact Info', 'Pick Rules', 'Settings', 'Storage Detail'];

  //--------------------States-------------------
  const [activeStep, setActiveStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState<TBasicPrincipalWms>({ prin_name: '', prin_dept_code: '' } as TBasicPrincipalWms);
  const [accountInfo, setAccountInfo] = useState<TAccountPrincipalWms>({ curr_code: '', prin_infze: 'N' } as TAccountPrincipalWms);
  const [contactInfo, setContactInfo] = useState<TContactPrincipalWms>({} as TContactPrincipalWms);
  const [pickRules, setPickRules] = useState<TPickRulesPrincipalWms>({} as TPickRulesPrincipalWms);
  const [settings, setSettings] = useState<TSettingsPrincipalWms>({} as TSettingsPrincipalWms);
  const [storage, setStorage] = useState<TStorageDetailsPrincipalWms>({} as TStorageDetailsPrincipalWms);

  //-----------------------------handlers----------------------

  const handlePrincipalFromSubmit = async () => {
    const response = await GmServiceInstance.addPrincipal({
      ...basicInfo,
      ...accountInfo,
      ...contactInfo,
      ...pickRules,
      ...settings,
      ...storage
    });
    if (response) {
      onClose();
    }
  };

  const handleNext = async () => {
    if (activeStep !== steps.length - 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1);
      return;
    }
    handlePrincipalFromSubmit();
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <BasicPrincipalInfoWmsForm basicInfo={basicInfo} setBasicInfo={setBasicInfo} handleNext={handleNext} handleBack={handleBack} />
        );
      case 1:
        return (
          <AccountPrincipalInfoWms
            accountInfo={accountInfo}
            setAccountInfo={setAccountInfo}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 2:
        return (
          <AddContactInfoWmsForm
            contactInfo={contactInfo}
            setContactInfo={setContactInfo}
            handleNext={handleNext}
            handleBack={handleBack}
          />
        );
      case 3:
        return <AddPickRulesInfoWms pickRules={pickRules} setPickRules={setPickRules} handleNext={handleNext} handleBack={handleBack} />;
      case 4:
        return (
          <AddSettingsPrincipalWmsForm settings={settings} setSettings={setSettings} handleNext={handleNext} handleBack={handleBack} />
        );
      case 5:
        return <AddStoragePrincipleForm storage={storage} setStorage={setStorage} handleNext={handleNext} handleBack={handleBack} />;
    }
  };
  useEffect(() => {
    // if (activeStep === 2) setIsLastStep(true);
    // else setIsLastStep(false);
    // document.getElementById('auto_appoinment')?.scrollIntoView({ behavior: 'auto' });
  }, [activeStep]);
  return (
    <CardContent>
      <Stepper activeStep={activeStep} onClick={(event) => console.log(event)}>
        {steps.map((label, index) => (
          <Step key={label} completed={activeStep > index}>
            <StepButton color="inherit">{label}</StepButton>
          </Step>
        ))}
      </Stepper>
      <div className="pt-10">{renderStepContent()}</div>
    </CardContent>
  );
};

export default AddPrincipalWmsForm;
