export type TProjectmaster = {
  project_code?: string; // varchar(15): Unique identifier for the project (optional)
  project_name?: string; // varchar(200): Name of the project (optional)
  company_code?: string; // varchar(5): Company code (optional)
  updated_at?: Date; // datetime: Timestamp for the last update (optional)
  updated_by?: string; // varchar(50): User who last updated the record (optional)
  created_by?: string; // varchar(20): User who created the record (optional)
  created_at?: Date; // datetime: Timestamp for when the record was created (optional)
};