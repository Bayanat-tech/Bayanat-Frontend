export type TCountry = {
  country_code: string;
  country_name: string;
  country_gcc: 'Y' | 'N';
  company_code?: string;
  short_desc?: string;
  nationality?: string;
  updated_at?: Date;
  updated_by?: string;
  created_by?: string;
  created_at?: Date;
};
