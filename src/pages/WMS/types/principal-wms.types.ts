// Combined Principal WMS Type
export type TPrincipalWms = TBasicPrincipalWms &
  TAccountPrincipalWms &
  TContactPrincipalWms &
  TPickRulesPrincipalWms &
  TStorageDetailsPrincipalWms &
  TSettingsPrincipalWms;

// Basic Information
export type TBasicPrincipalWms = {
  prin_code: string;
  prin_name: string;
  prin_addr1?: string;
  prin_addr2?: string;
  prin_addr3?: string;
  prin_addr4?: string;
  prin_city?: string;
  country_code: string;
  tax_country_code?: string;
  tax_country_sn?: string;
  territory_code: string;
  salesman_code?: string;
  sector_code?: string;
  prin_email1?: string;
  prin_email2?: string;
  prin_email3?: string;
  prin_telno1?: string;
  prin_telno2?: string;
  prin_telno3?: string;
  prin_faxno1?: string;
  prin_faxno2?: string;
  prin_faxno3?: string;
  prin_ref1?: string;
  prin_status?: string;
  acc_email?: string;
  prin_dept_code?: string;
  auto_job?: string;
  dir_shpmnt?: string;
  parent_prin_code?: string;
};

// Account Information
export type TAccountPrincipalWms = {
  prin_acref?: string;
  trn_no?: string;
  trn_exp_date?: Date;
  prin_invdate?: Date;
  curr_code?: string;
  prin_backdt?: number;
  prin_infze?: string;
  credit_limit?: number;
  creditdays?: number;
  creditdays_freight?: number;
  prin_lic_no?: string;
  prin_lic_type?: string;
  comm_reg_no?: Date;
  comm_exp_date?: Date;
  prin_imp_code?: string;
};

// Contact Information
export type TContactPrincipalWms = {
  prin_cont_email1?: string;
  prin_cont_email2?: string;
  prin_cont_email3?: string;
  prin_cont_telno1?: string;
  prin_cont_telno2?: string;
  prin_cont_telno3?: string;
  prin_cont_faxno1?: string;
  prin_cont_faxno2?: string;
  prin_cont_faxno3?: string;
  prin_cont_ref1?: string;
};

// Pick Rules
export type TPickRulesPrincipalWms = {
  pick_wave?: string;
  pick_wave_qty_sort?: string;
  pick_wave_ign_min_exp?: string;
};

// Storage Details
export type TStorageDetailsPrincipalWms = {
  pref_site?: string;
  pref_loc_from?: string;
  pref_loc_to?: string;
  pref_aisle_from?: string;
  pref_aisle_to?: string;
  pref_col_from?: number;
  pref_col_to?: number;
  pref_ht_from?: number;
  pref_ht_to?: number;
  prin_siteind?: string;
  service_date?: Date;
  storage_type?: string;
  default_foc?: string;
};

// Settings Tab
export type TSettingsPrincipalWms = {
  under_value?: string;
  auto_insert_billactivity?: string;
  prin_charge?: string;
  prin_pricechk?: string;
  prin_landedpr?: string;
  auto_job?: string;
  validate_lotno?: string;
  storage_productwise?: string;
  dir_shpmnt?: string;
  validate_expdate?: string;
  minperiod_exppick?: number;
  rcpt_exp_limit?: number;
  perpectual_confirm_allow?: string;
  automate_activity?: string;
};
