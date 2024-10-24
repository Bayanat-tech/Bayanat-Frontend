export type TBillingActivity = {
  // activity_name: string;
  // activity_code: string;
  // principal_name: string;
  // job_type: string;
  from?: string;
  to?: string;
  activityPassword?: string;
  activity?: string;
  prin_name?: number;
  prin_code: string;
  act_code: string;
  wip_code?: string;
  cost: number;
  income_code?: string;
  bill_amount: number;
  jobtype: string;
  company_code?: string;
  freeze_flag?: string;
  mandatory_flag?: string;
  validate_flag?: string;
  uoc?: string;
  moc1?: string;
  moc2?: string;
  cust_code?: string;
  start_point?: string;
  end_point?: string;
  customer_type?: string;
  vtype_code?: string;
  serial_no?: number;
  serial_no2?: number;
  updated_at?: Date;
  updated_by?: string;
  created_by?: string;
  created_at?: Date;
  inb_show?: string;
  oub_show?: string;
  bill_dup?: number;
  cost_dup?: number;
  edit_user?: string;
};

export type TPopulate = {
  from: string;
  to: string;
  activityPassword: string;
};