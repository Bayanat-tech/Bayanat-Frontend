import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs, { Dayjs } from 'dayjs';
import * as yup from 'yup';

import { FileOutlined, LoadingOutlined } from '@ant-design/icons';
import {
  Autocomplete,
  Button,
  Checkbox,
  FormControlLabel,
  FormHelperText,
  Grid,
  InputLabel,
  Stack,
  TextField,
  Typography
} from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { getIn, useFormik } from 'formik';
import { TCurrency } from 'pages/WMS/types/currency-wms.types';
import { TAccountPrincipalWms } from 'pages/WMS/types/principal-wms.types';
import { ChangeEvent, useState } from 'react';
import WmsSerivceInstance from 'service/service.wms';
import FileUploadServiceInstance from 'service/services.uploadFile';
import { useSelector } from 'store';

const AccountPrincipalInfoWms = ({
  handleNext,
  handleBack,
  accountInfo,
  setAccountInfo
}: {
  handleNext: () => void;
  handleBack: () => void;
  accountInfo: TAccountPrincipalWms;
  setAccountInfo: (value: TAccountPrincipalWms) => void;
}) => {
  //----------------constants-----------------

  const { app } = useSelector((state) => state.menuSelectionSlice);
  const [isFileUploading, setIsFileUploading] = useState<boolean>(false);
  //----------------formik-----------------
  const formik = useFormik<TAccountPrincipalWms>({
    initialValues: accountInfo,
    validationSchema: yup.object().shape({
      // curr_code: yup.string().required('This field is required')
    }),
    onSubmit: async (values) => {
      setAccountInfo(values);
      handleNext();
    }
  });
  //----------------useQuery-----------------

  const { data: currencyList } = useQuery({
    queryKey: ['currency_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'currency', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TCurrency[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });
  //---------------handlers-------------
  const handleFileUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (event.target.files?.length) {
      setIsFileUploading(true);

      const selectedFile = event.target.files[0];
      try {
        const response = await FileUploadServiceInstance.uploadFile(selectedFile);

        if (response && response.data) {
          formik.setFieldValue('', response.data);
        }
      } catch (error) {
        console.error('File upload failed:', error);
      } finally {
        setIsFileUploading(false);
      }
    }
  };

  return (
    <Grid container spacing={6} component={'form'} onSubmit={formik.handleSubmit}>
      {/*----------------------Tax and Registration Information-------------------------- */}
      <Grid item xs={12} sm={6}>
        <Grid container spacing={4}>
          <Grid item container xs={12} spacing={2}>
            <Grid item xs={12}>
              <Typography variant="h4" className="text-black py-2 font-semibold">
                Tax and Registration Information
              </Typography>
            </Grid>
            {/*----------------------Tax Registered No.-------------------------- */}
            <Grid item xs={12} sm={6}>
              <InputLabel>Tax Registered No.</InputLabel>
              <TextField onChange={formik.handleChange} id="trn_no" name="trn_no" fullWidth value={formik.values.trn_no} />
            </Grid>
            {/*----------------------Tax Registration Expiry Date-------------------------- */}
            <Grid item xs={12} sm={6}>
              <InputLabel>Tax Registration Expiry Date</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="w-full"
                  value={formik.values.trn_exp_date ? dayjs(formik.values.trn_exp_date) : null}
                  onChange={(newValue: Dayjs | null) => {
                    if (newValue?.isValid()) formik.setFieldValue('trn_exp_date', newValue.toISOString());
                  }}
                />
              </LocalizationProvider>
            </Grid>
            {/*----------------------Commercial Registered No.-------------------------- */}
            <Grid item xs={12} sm={6}>
              <InputLabel>Commercial Registered No.</InputLabel>
              <TextField onChange={formik.handleChange} id="comm_reg_no" name="comm_reg_no" fullWidth value={formik.values.comm_reg_no} />
            </Grid>
            {/*----------------------Commercial Registration No. Expiry Date-------------------------- */}
            <Grid item xs={12} sm={6}>
              <InputLabel>Commercial Registration No. Expiry Date</InputLabel>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DatePicker
                  className="w-full"
                  value={formik.values.comm_exp_date ? dayjs(formik.values.comm_exp_date) : null}
                  onChange={(newValue: Dayjs | null) => {
                    if (newValue?.isValid()) formik.setFieldValue('comm_exp_date', newValue.toISOString());
                  }}
                />
              </LocalizationProvider>
            </Grid>
            {/*----------------------License No.-------------------------- */}
            <Grid item xs={12} sm={6}>
              <InputLabel>License No.</InputLabel>
              <TextField onChange={formik.handleChange} id="prin_lic_no" name="prin_lic_no" fullWidth value={formik.values.prin_lic_no} />
            </Grid>
            {/*----------------------License Type-------------------------- */}
            <Grid item xs={12} sm={6}>
              <InputLabel>License Type</InputLabel>
              <TextField
                onChange={formik.handleChange}
                id="prin_lic_type"
                name="prin_lic_type"
                fullWidth
                value={formik.values.prin_lic_type}
              />
            </Grid>
          </Grid>

          {/*----------------------Currency and Upload Information-------------------------- */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div className="flex space-x-2 align-middle items-center">
                  <Typography variant="h4" className="text-black py-2 font-semibold">
                    Currency and Upload Information
                  </Typography>
                  <input style={{ display: 'none' }} id="upload-file" type="file" onChange={handleFileUpload} />
                  <label htmlFor="upload-file">
                    <Button
                      size="extraSmall"
                      variant="dashed"
                      color="primary"
                      component="span"
                      startIcon={isFileUploading ? <LoadingOutlined /> : <FileOutlined />}
                      disabled={isFileUploading}
                    >
                      Upload
                    </Button>
                  </label>
                </div>
              </Grid>
              {/*----------------------Default Currency-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Default Currency*</InputLabel>
                <Autocomplete
                  id="curr_code"
                  value={
                    !!formik.values.curr_code
                      ? currencyList?.tableData.find((eachCurrency) => eachCurrency.curr_code === formik.values.curr_code)
                      : ({ curr_name: '' } as TCurrency)
                  }
                  onChange={(event, value: TCurrency | null) => {
                    formik.setFieldValue('curr_code', value?.curr_code);
                  }}
                  options={currencyList?.tableData ?? []}
                  fullWidth
                  autoHighlight
                  getOptionLabel={(option) => option?.curr_name}
                  isOptionEqualToValue={(option) => option.curr_code === formik.values.curr_code}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      inputProps={{
                        ...params.inputProps
                      }}
                    />
                  )}
                />
                {getIn(formik.touched, 'curr_code') && getIn(formik.errors, 'curr_code') && (
                  <FormHelperText error id="helper-text-first_name">
                    {getIn(formik.errors, 'curr_code')}
                  </FormHelperText>
                )}
              </Grid>
              {/*----------------------In Designated Zone-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>In Designated Zone</InputLabel>
                <FormControlLabel
                  control={<Checkbox onChange={(event, checked) => formik.setFieldValue('prin_infze', checked ? 'Y' : 'N')} />}
                  checked={formik.values.prin_infze === 'Y'}
                  name="prin_infze"
                  label={'Yes/No'}
                  value={formik.values.prin_infze}
                />
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      {/*----------------------Account and Credit Information-------------------------- */}
      <Grid item xs={12} sm={6}>
        <Grid container spacing={4}>
          <Grid item container xs={12} spacing={2}>
            {/*----------------------Account and Credit Information: Heading-------------------------- */}
            <Grid item xs={12}>
              <Typography variant="h4" className="text-black py-2 font-semibold">
                Account and Credit Information
              </Typography>
            </Grid>
            {/*----------------------A/C Reference-------------------------- */}
            <Grid item container xs={12}>
              <Grid item xs={12} sm={6}>
                <InputLabel>A/C Reference</InputLabel>
                <TextField onChange={formik.handleChange} id="prin_acref" name="prin_acref" fullWidth value={formik.values.prin_acref} />
              </Grid>
            </Grid>

            {/*----------------------Credit Limit-------------------------- */}
            <Grid item xs={12} sm={4}>
              <InputLabel>Credit Limit</InputLabel>
              <TextField
                onChange={formik.handleChange}
                id="credit_limit"
                name="credit_limit"
                fullWidth
                value={formik.values.credit_limit}
              />
            </Grid>
            {/*----------------------Credit Period (WMS)-------------------------- */}
            <Grid item xs={12} sm={4}>
              <InputLabel>Credit Period (WMS)</InputLabel>
              <TextField onChange={formik.handleChange} id="creditdays" name="creditdays" fullWidth value={formik.values.creditdays} />
            </Grid>
            {/*----------------------Credit Frieght-------------------------- */}

            <Grid item xs={12} sm={4}>
              <InputLabel>(Frieght)</InputLabel>
              <TextField
                onChange={formik.handleChange}
                id="creditdays_freight"
                name="creditdays_freight"
                fullWidth
                value={formik.values.creditdays_freight}
              />
            </Grid>
          </Grid>

          {/*----------------------Invoice and Transaction History-------------------------- */}
          <Grid item xs={12}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Typography variant="h4" className="text-black py-2 font-semibold">
                  Invoice and Transaction History
                </Typography>
              </Grid>

              {/*----------------------Import Code-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Import Code</InputLabel>
                <TextField
                  onChange={formik.handleChange}
                  id="prin_imp_code"
                  name="prin_imp_code"
                  fullWidth
                  value={formik.values.prin_imp_code}
                />
              </Grid>
              {/*----------------------Parent Principal Code-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Parent Principal Code</InputLabel>
                <TextField
                  onChange={formik.handleChange}
                  id="parent_prin_code"
                  name="parent_prin_code"
                  fullWidth
                  value={formik.values.parent_prin_code}
                />
              </Grid>
              {/*----------------------Last Invoice Date-------------------------- */}
              <Grid item xs={12} sm={6}>
                <InputLabel>Last Invoice Date</InputLabel>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <DatePicker
                    className="w-full"
                    value={formik.values.prin_invdate ? dayjs(formik.values.prin_invdate) : null}
                    onChange={(newValue: Dayjs | null) => {
                      if (newValue?.isValid()) formik.setFieldValue('prin_invdate', newValue.toISOString());
                    }}
                  />
                </LocalizationProvider>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Grid>

      <Grid item xs={12}>
        <Stack direction="row" justifyContent="space-between">
          <Button onClick={handleBack} sx={{ my: 1, ml: 1 }}>
            Back
          </Button>
          <Button variant="contained" type="submit" sx={{ my: 1, ml: 1 }}>
            Next
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default AccountPrincipalInfoWms;
