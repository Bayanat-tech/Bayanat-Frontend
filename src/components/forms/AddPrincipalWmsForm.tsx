import { CardContent, Step, StepButton, Stepper } from '@mui/material';
import {
  TAccountPrincipalWms,
  TBasicPrincipalWms,
  TContactPrincipalWms,
  TPickRulesPrincipalWms,
  TPrincipalWms,
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
import useAuth from 'hooks/useAuth';
import { useQuery } from '@tanstack/react-query';

const AddPrincipalWmsForm = ({
  onClose,
  isEditMode,
  prin_code
}: {
  onClose: (refetchData?: boolean) => void;
  isEditMode: boolean;
  prin_code: string;
}) => {
  //--------------------constants-------------------
  const { user } = useAuth();
  const steps = ['Basic Info', 'Account Info', 'Contact Info', 'Pick Rules', 'Settings', 'Storage Detail'];

  //--------------------States-------------------
  const [activeStep, setActiveStep] = useState(0);
  const [basicInfo, setBasicInfo] = useState<TBasicPrincipalWms>({
    prin_code: '',
    prin_name: '',
    prin_addr1: '',
    prin_addr2: '',
    prin_addr3: '',
    prin_addr4: '',
    prin_city: '',
    country_code: '',
    tax_country_code: '',
    tax_country_sn: '',
    territory_code: '',
    sector_code: '',
    acc_email: '',
    prin_email1: '',
    prin_email2: '',
    prin_email3: '',
    prin_faxno1: '',
    prin_faxno2: '',
    prin_faxno3: '',
    prin_status: 'N',
    prin_dept_code: '',
    prin_ref1: ''
  } as TBasicPrincipalWms);

  const [accountInfo, setAccountInfo] = useState<TAccountPrincipalWms>({
    trn_no: null as unknown as number,
    trn_exp_date: null as unknown as Date,
    comm_reg_no: null as unknown as Date,
    comm_exp_date: null as unknown as Date,
    prin_lic_no: null as unknown as number,
    prin_lic_type: '',
    curr_code: '',
    prin_infze: 'N',
    prin_acref: '',
    credit_limit: null as unknown as number,
    creditdays: null as unknown as number,
    creditdays_freight: null as unknown as number,
    prin_imp_code: '',
    parent_prin_code: '',
    prin_invdate: null as unknown as Date
  } as TAccountPrincipalWms);

  const [contactInfo, setContactInfo] = useState<TContactPrincipalWms>({
    prin_cont1: '',
    prin_cont2: '',
    prin_cont3: '',
    prin_cont_email1: '',
    prin_cont_email2: '',
    prin_cont_email3: '',
    prin_cont_telno1: '',
    prin_cont_telno2: '',
    prin_cont_telno3: '',
    prin_cont_faxno1: '',
    prin_cont_faxno2: '',
    prin_cont_faxno3: '',
    prin_cont_ref1: ''
  } as TContactPrincipalWms);

  const [pickRules, setPickRules] = useState<TPickRulesPrincipalWms>({
    pick_wave: '',
    pick_wave_qty_sort: null as unknown as number,
    pick_wave_ign_min_exp: null as unknown as number
  } as TPickRulesPrincipalWms);

  const [settings, setSettings] = useState<TSettingsPrincipalWms>({
    under_value: 'N',
    auto_insert_billactivity: 'N',
    prin_charge: 'N',
    prin_pricechk: 'N',
    prin_landedpr: 'N',
    auto_job: 'N',
    validate_lotno: 'N',
    storage_productwise: 'N',
    dir_shpmnt: 'N',
    validate_expdate: null as unknown as Date,
    minperiod_exppick: null as unknown as number,
    rcpt_exp_limit: null as unknown as number,
    perpectual_confirm_allow: 'N',
    automate_activity: 'N'
  } as TSettingsPrincipalWms);

  const [storage, setStorage] = useState<TStorageDetailsPrincipalWms>({
    pref_site: '',
    pref_loc_from: '',
    pref_loc_to: '',
    pref_aisle_from: null as unknown as number,
    pref_aisle_to: null as unknown as number,
    pref_col_from: null as unknown as number,
    pref_col_to: null as unknown as number,
    pref_ht_from: null as unknown as number,
    pref_ht_to: null as unknown as number,
    prin_siteind: '',
    service_date: null as unknown as Date,
    storage_type: '',
    default_foc: ''
  } as TStorageDetailsPrincipalWms);
  //----------------useQuery-----------------

  const { data: principalData } = useQuery<TPrincipalWms | undefined>({
    queryKey: ['currency_data'],
    queryFn: () => GmServiceInstance.getPrincipal(prin_code),
    enabled: isEditMode === true
  });
  //-----------------------------handlers----------------------

  const handlePrincipalFromSubmit = async () => {
    const finalPayload = {
      ...basicInfo,
      ...accountInfo,
      ...contactInfo,
      ...pickRules,
      ...settings,
      ...storage,
      company_code: user?.company_code as string
    };
    let response;
    if (isEditMode) {
      response = await GmServiceInstance.editPrincipal(finalPayload, finalPayload?.prin_code ?? '');
    } else {
      response = await GmServiceInstance.addPrincipal(finalPayload);
    }
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
          <BasicPrincipalInfoWmsForm basicInfo={basicInfo} setBasicInfo={setBasicInfo} handleNext={handleNext} isEditMode={isEditMode} />
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
  //-----------------------------useEffect----------------------

  useEffect(() => {
    if (isEditMode && !!principalData && Object.keys(principalData).length > 0) {
      const {
        prin_code,
        prin_name,
        prin_addr1,
        prin_addr2,
        prin_addr3,
        prin_addr4,
        prin_city,
        country_code,
        tax_country_code,
        tax_country_sn,
        territory_code,
        sector_code,
        prin_email1,
        prin_email2,
        prin_email3,
        prin_faxno1,
        prin_faxno2,
        prin_faxno3,
        prin_ref1,
        prin_status,
        acc_email,
        prin_dept_code,
        prin_acref,
        trn_no,
        trn_exp_date,
        prin_invdate,
        curr_code,
        prin_infze,
        credit_limit,
        creditdays,
        creditdays_freight,
        prin_lic_no,
        prin_lic_type,
        comm_reg_no,
        comm_exp_date,
        prin_imp_code,
        parent_prin_code,
        prin_cont_email1,
        prin_cont_email2,
        prin_cont_email3,
        prin_cont_telno1,
        prin_cont_telno2,
        prin_cont_telno3,
        prin_cont_faxno1,
        prin_cont_faxno2,
        prin_cont_faxno3,
        prin_cont_ref1,
        pick_wave,
        pick_wave_qty_sort,
        pick_wave_ign_min_exp,
        under_value,
        auto_insert_billactivity,
        prin_charge,
        prin_pricechk,
        prin_landedpr,
        auto_job,
        validate_lotno,
        storage_productwise,
        dir_shpmnt,
        validate_expdate,
        minperiod_exppick,
        rcpt_exp_limit,
        perpectual_confirm_allow,
        automate_activity,
        pref_site,
        pref_loc_from,
        pref_loc_to,
        pref_aisle_from,
        pref_aisle_to,
        pref_col_from,
        pref_col_to,
        pref_ht_from,
        pref_ht_to,
        prin_siteind,
        service_date,
        storage_type,
        default_foc
      } = principalData;
      setBasicInfo({
        prin_code,
        prin_name,
        prin_addr1,
        prin_addr2,
        prin_addr3,
        prin_addr4,
        prin_city,
        country_code,
        tax_country_code,
        tax_country_sn,
        territory_code,
        sector_code,
        prin_email1,
        prin_email2,
        prin_email3,
        prin_faxno1,
        prin_faxno2,
        prin_faxno3,
        prin_ref1,
        prin_status,
        acc_email,
        prin_dept_code
      });
      setAccountInfo({
        prin_acref,
        trn_no,
        trn_exp_date,
        prin_invdate,
        curr_code,
        prin_infze,
        credit_limit,
        creditdays,
        creditdays_freight,
        prin_lic_no,
        prin_lic_type,
        comm_reg_no,
        comm_exp_date,
        prin_imp_code,
        parent_prin_code
      });
      setContactInfo({
        prin_cont_email1,
        prin_cont_email2,
        prin_cont_email3,
        prin_cont_telno1,
        prin_cont_telno2,
        prin_cont_telno3,
        prin_cont_faxno1,
        prin_cont_faxno2,
        prin_cont_faxno3,
        prin_cont_ref1
      });
      setPickRules({ pick_wave, pick_wave_qty_sort, pick_wave_ign_min_exp });
      setSettings({
        under_value,
        auto_insert_billactivity,
        prin_charge,
        prin_pricechk,
        prin_landedpr,
        auto_job,
        validate_lotno,
        storage_productwise,
        dir_shpmnt,
        validate_expdate,
        minperiod_exppick,
        rcpt_exp_limit,
        perpectual_confirm_allow,
        automate_activity
      });
      setStorage({
        pref_site,
        pref_loc_from,
        pref_loc_to,
        pref_aisle_from,
        pref_aisle_to,
        pref_col_from,
        pref_col_to,
        pref_ht_from,
        pref_ht_to,
        prin_siteind,
        service_date,
        storage_type,
        default_foc
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [principalData]);
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
