export type TFlowmaster = {
  flow_code: string;
  flow_description: string;
  company_code?: string;
  updated_at?: Date;
  updated_by?: string;
  created_by?: string;
  created_at?: Date;
};


export type Tsecrollmaster = {
  company_code?: string;
  role_id?: string;
  role_desc:string;
  remarks: string;
  updated_at?: Date;
  created_at?: Date;
  updated_by?: string;
  created_by?: string;
};

export interface  TSecmaster {
  id: string;
  username: string;
  contact_no: string;
  userpass: string;
  email_id?: string;
  company_code?: string;
  created_at?: Date;
  created_by?: string;
  updated_at?: Date;
  updated_by?: string;
}