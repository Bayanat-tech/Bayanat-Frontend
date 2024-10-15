import { Autocomplete, Button, Grid, InputLabel, OutlinedInput, Stack, TextField, Typography } from '@mui/material';
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';
import { useFormik } from 'formik';
import { TLocation } from 'pages/WMS/types/location-wms.types';
import { TStorageDetailsPrincipalWms } from 'pages/WMS/types/principal-wms.types';
import { TSite } from 'pages/WMS/types/site-wms.types';
import { TStorageWms } from 'pages/WMS/types/storage-wms.types';
import WmsSerivceInstance from 'service/service.wms';
import { useSelector } from 'store';

type TItem = { label: string; value: string };
const AddStoragePrincipleForm = ({
  handleNext,
  handleBack,
  storage,
  setStorage
}: {
  handleNext: () => void;
  handleBack: () => void;

  storage: TStorageDetailsPrincipalWms;
  setStorage: (value: TStorageDetailsPrincipalWms) => void;
}) => {
  //-------------constants-------------
  const { app } = useSelector((state) => state.menuSelectionSlice);
  const storageTypes = [
    { label: 'Stock Storage', value: 'stock_storage' },
    { label: 'Flat Area Storage', value: 'flat_area_storage' },
    { label: 'Both', value: 'both' },
    { label: 'Doc Entry Wise', value: 'doc_entry_wise' },
    { label: 'Straight Method', value: 'straight_method' },
    { label: 'Lumpsum', value: 'lumpsum' }
  ];
  //----------------useQuery-----------------

  const { data: siteList } = useQuery({
    queryKey: ['site_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'site', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TSite[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });
  const { data: locationList } = useQuery({
    queryKey: ['location_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'location', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TLocation[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });
  const { data: storageList } = useQuery({
    queryKey: ['location_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'storage', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TStorageWms[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });
  //----------------formik-----------------
  const formik = useFormik<TStorageDetailsPrincipalWms>({
    initialValues: storage,

    onSubmit: async (values) => {
      setStorage(values);
      handleNext();
    }
  });
  return (
    <Grid container spacing={6} component={'form'} onSubmit={formik.handleSubmit}>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={2}>
          <Grid item container xs={12}>
            <Typography variant="h4" className="text-black font-semibold">
              Location
            </Typography>
          </Grid>
          {/*----------------------Preferred Site-------------------------- */}
          <Grid item xs={12} sm={6}>
            <InputLabel>Preferred Site</InputLabel>
            <Autocomplete
              id="Preferred Site"
              value={
                !!formik.values.pref_site
                  ? siteList?.tableData.find((eachSite) => eachSite.site_code === formik.values.pref_site)
                  : ({ site_name: '' } as TSite)
              }
              onChange={(event, value: TSite | null) => {
                formik.setFieldValue('pref_site', value?.site_code);
              }}
              options={siteList?.tableData ?? []}
              fullWidth
              autoHighlight
              getOptionLabel={(option) => option?.site_name}
              isOptionEqualToValue={(option) => option.site_code === formik.values.pref_site}
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
          {/*----------------------Location-------------------------- */}
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12} sm={6}>
              <InputLabel>Location From</InputLabel>
              <Autocomplete
                id="loc_from"
                value={
                  !!formik.values.pref_loc_from
                    ? locationList?.tableData.find((eachSite) => eachSite.location_code === formik.values.pref_loc_from)
                    : ({ loc_desc: '' } as TLocation)
                }
                onChange={(event, value: TLocation | null) => {
                  formik.setFieldValue('pref_loc_from', value?.location_code);
                }}
                options={locationList?.tableData ?? []}
                fullWidth
                autoHighlight
                getOptionLabel={(option) => option?.loc_desc ?? ''}
                isOptionEqualToValue={(option) => option.location_code === formik.values.pref_loc_from}
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
              <InputLabel>Location To</InputLabel>
              <Autocomplete
                id="pref_loc_to"
                value={
                  !!formik.values.pref_loc_to
                    ? locationList?.tableData.find((eachSite) => eachSite.location_code === formik.values.pref_loc_to)
                    : ({ loc_desc: '' } as TLocation)
                }
                onChange={(event, value: TLocation | null) => formik.setFieldValue('pref_loc_to', value?.location_code)}
                options={locationList?.tableData ?? []}
                fullWidth
                autoHighlight
                getOptionLabel={(option) => option?.loc_desc ?? ''}
                isOptionEqualToValue={(option) => option.location_code === formik.values.pref_loc_to}
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
          </Grid>

          {/*----------------------Alise------------------------ */}
          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12}>
              <Typography className="text-gray-600 font-medium">Alise</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <OutlinedInput
                endAdornment={'From'}
                onChange={formik.handleChange}
                id="pref_aisle_from"
                name="pref_aisle_from"
                fullWidth
                value={formik.values.pref_aisle_from}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <OutlinedInput
                endAdornment={'To'}
                onChange={formik.handleChange}
                id="pref_aisle_to"
                name="pref_aisle_to"
                fullWidth
                value={formik.values.pref_aisle_to}
              />
            </Grid>
          </Grid>
          {/*----------------------Column------------------------ */}

          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12}>
              <Typography className="text-gray-600 font-medium">Column</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <OutlinedInput
                endAdornment={'From'}
                onChange={formik.handleChange}
                id="pref_col_from"
                name="pref_col_from"
                fullWidth
                value={formik.values.pref_col_from}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <OutlinedInput
                endAdornment={'To'}
                onChange={formik.handleChange}
                id="pref_col_from"
                name="pref_col_from"
                fullWidth
                value={formik.values.pref_col_from}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid item xs={12} sm={6}>
        <Grid container spacing={2}>
          <Grid item container xs={12}>
            <Typography variant="h4" className="text-black font-semibold">
              Site, Service, and Storage Details
            </Typography>
          </Grid>
          {/*----------------------Height------------------------ */}

          <Grid item xs={12} container spacing={2}>
            <Grid item xs={12}>
              <Typography className="text-gray-600 font-medium">Height</Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <OutlinedInput
                endAdornment={'From'}
                onChange={formik.handleChange}
                id="pref_ht_from"
                name="pref_ht_from"
                fullWidth
                value={formik.values.pref_ht_from}
              />
            </Grid>

            <Grid item xs={12} sm={6}>
              <OutlinedInput
                endAdornment={'To'}
                onChange={formik.handleChange}
                id="pref_ht_to"
                name="pref_ht_to"
                fullWidth
                value={formik.values.pref_ht_to}
              />
            </Grid>
          </Grid>
          {/*----------------------Default Site Ind-------------------------- */}
          <Grid item xs={12} sm={6}>
            <InputLabel>Default Site Ind</InputLabel>
            <Autocomplete
              id="Default Site Ind"
              value={
                !!formik.values.prin_siteind
                  ? siteList?.tableData.find((eachSite) => eachSite.site_code === formik.values.prin_siteind)
                  : ({ site_name: '' } as TSite)
              }
              onChange={(event, value: TSite | null) => {
                formik.setFieldValue('prin_siteind', value?.site_code);
              }}
              options={siteList?.tableData ?? []}
              fullWidth
              autoHighlight
              getOptionLabel={(option) => option?.site_name}
              isOptionEqualToValue={(option) => option.site_code === formik.values.prin_siteind}
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
          {/*----------------------Last Invoice Date-------------------------- */}
          <Grid item xs={12} sm={6}>
            <InputLabel>Last Invoice Date</InputLabel>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                className="w-full"
                value={formik.values.service_date ? dayjs(formik.values.service_date) : null}
                onChange={(newValue: Dayjs | null) => {
                  if (newValue?.isValid()) formik.setFieldValue('ser.service_date', newValue.toISOString());
                }}
              />
            </LocalizationProvider>
          </Grid>
          {/*----------------------Storage Type-------------------------- */}
          <Grid item xs={12} sm={6}>
            <InputLabel>Storage Type</InputLabel>
            <Autocomplete
              id="Storage Type"
              value={
                !!formik.values.storage_type
                  ? storageTypes.find((eachStorage) => eachStorage.value === formik.values.storage_type)
                  : ({ value: '', label: '' } as TItem)
              }
              onChange={(event, value: TItem | null) => {
                formik.setFieldValue('storage_type', value?.value);
              }}
              options={storageTypes ?? []}
              fullWidth
              autoHighlight
              getOptionLabel={(option) => option?.label}
              isOptionEqualToValue={(option) => option.value === formik.values.storage_type}
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
          {/*----------------------Default Foc-------------------------- */}
          <Grid item xs={12} sm={6}>
            <InputLabel>Default Foc</InputLabel>
            <Autocomplete
              id="Default Foc"
              value={
                !!formik.values.default_foc
                  ? storageList?.tableData.find((eachStorage) => eachStorage.foc === formik.values.default_foc)
                  : ({ foc: '' } as TStorageWms)
              }
              onChange={(event, value: TStorageWms | null) => {
                formik.setFieldValue('default_foc', value?.foc);
              }}
              options={storageList?.tableData ?? []}
              fullWidth
              autoHighlight
              getOptionLabel={(option) => option?.foc}
              isOptionEqualToValue={(option) => option.foc === formik.values.default_foc}
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
        </Grid>
      </Grid>
      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Button onClick={handleBack} sx={{ my: 1, ml: 1 }}>
            Back
          </Button>
          <Button variant="contained" type="submit" sx={{ my: 1, ml: 1 }}>
            Submit
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AddStoragePrincipleForm;
