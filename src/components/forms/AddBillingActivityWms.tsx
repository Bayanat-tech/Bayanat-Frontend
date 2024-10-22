import { Autocomplete, Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { useFormik } from 'formik';
import { TBillingActivity } from 'pages/WMS/types/billingActivity-wms.types';
import { TActivityWms } from 'pages/WMS/types/activity-wms.types';
import { TUocWms } from 'pages/WMS/types/TUoc-wms.types';
import WmsSerivceInstance from 'service/service.wms';
import { useSelector } from 'store';
import { useQuery } from '@tanstack/react-query';
// eslint-disable-next-line react-hooks/rules-of-hooks
// eslint-disable-next-line react-hooks/rules-of-hooks
const { app } = useSelector((state: any) => state.menuSelectionSlice);
// const {
//   data: countryData,
//   isFetching: isCountryFetchLoading,
//   refetch: refetchCountryData
// } = useQuery({
//   queryKey: ['country_data', searchData, paginationData],
//   queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
//   enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
// });
const AddBillingActivityWmsForm = ({ prin_code, password }: { prin_code: string; password: string }) => {
  const UMM: { tableData: TUocWms[] } = {
    tableData: [
      {
        company_code: 'COMP1',
        charge_type: 'TypeA',
        charge_code: 'CHARGE001',
        description: 'Charge for service A',
        activity_group_code: 'AG1',
        updated_at: new Date('2024-01-01T10:00:00Z'),
        updated_by: 'user1',
        created_by: 'admin',
        created_at: new Date('2024-01-01T09:00:00Z')
      },
      {
        company_code: 'COMP2',
        charge_type: 'TypeB',
        charge_code: 'CHARGE002',
        description: 'Charge for service B',
        activity_group_code: 'AG2',
        updated_at: new Date('2024-01-02T11:00:00Z'),
        updated_by: 'user2',
        created_by: 'admin',
        created_at: new Date('2024-01-02T09:00:00Z')
      },
      {
        company_code: 'COMP3',
        charge_type: 'TypeC',
        charge_code: 'CHARGE003',
        description: 'Charge for service C',
        activity_group_code: 'AG3',
        updated_at: new Date('2024-01-03T12:00:00Z'),
        updated_by: 'user3',
        created_by: 'admin',
        created_at: new Date('2024-01-03T09:00:00Z')
      },
      {
        company_code: 'COMP4',
        charge_type: 'TypeD',
        charge_code: 'CHARGE004',
        description: 'Charge for service D',
        activity_group_code: 'AG4',
        updated_at: new Date('2024-01-04T13:00:00Z'),
        updated_by: 'user4',
        created_by: 'admin',
        created_at: new Date('2024-01-04T09:00:00Z')
      },
      {
        company_code: 'COMP5',
        charge_type: 'TypeE',
        charge_code: 'CHARGE005',
        description: 'Charge for service E',
        activity_group_code: 'AG5',
        updated_at: new Date('2024-01-05T14:00:00Z'),
        updated_by: 'user5',
        created_by: 'admin',
        created_at: new Date('2024-01-05T09:00:00Z')
      },
      {
        company_code: 'COMP6',
        charge_type: 'TypeF',
        charge_code: 'CHARGE006',
        description: 'Charge for service F',
        activity_group_code: 'AG6',
        updated_at: new Date('2024-01-06T15:00:00Z'),
        updated_by: 'user6',
        created_by: 'admin',
        created_at: new Date('2024-01-06T09:00:00Z')
      },
      {
        company_code: 'COMP7',
        charge_type: 'TypeG',
        charge_code: 'CHARGE007',
        description: 'Charge for service G',
        activity_group_code: 'AG7',
        updated_at: new Date('2024-01-07T16:00:00Z'),
        updated_by: 'user7',
        created_by: 'admin',
        created_at: new Date('2024-01-07T09:00:00Z')
      },
      {
        company_code: 'COMP8',
        charge_type: 'TypeH',
        charge_code: 'CHARGE008',
        description: 'Charge for service H',
        activity_group_code: 'AG8',
        updated_at: new Date('2024-01-08T17:00:00Z'),
        updated_by: 'user8',
        created_by: 'admin',
        created_at: new Date('2024-01-08T09:00:00Z')
      },
      {
        company_code: 'COMP9',
        charge_type: 'TypeI',
        charge_code: 'CHARGE009',
        description: 'Charge for service I',
        activity_group_code: 'AG9',
        updated_at: new Date('2024-01-09T18:00:00Z'),
        updated_by: 'user9',
        created_by: 'admin',
        created_at: new Date('2024-01-09T09:00:00Z')
      },
      {
        company_code: 'COMP10',
        charge_type: 'TypeJ',
        charge_code: 'CHARGE010',
        description: 'Charge for service J',
        activity_group_code: 'AG10',
        updated_at: new Date('2024-01-10T19:00:00Z'),
        updated_by: 'user10',
        created_by: 'admin',
        created_at: new Date('2024-01-10T09:00:00Z')
      }
    ]
  };
  //----------------------constants--------------
  const formik = useFormik<TBillingActivity>({
    initialValues: {
      prin_code: '',
      act_code: '',
      jobtype: '',
      uoc: '',
      moc1: '',
      moc2: '',
      bill_amount: null as unknown as number,
      cost: null as unknown as number
    },
    onSubmit: () => {}
  });

  //----------- useQuery--------------
  const { data: activityData } = useQuery({
    queryKey: ['activity_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'activity', undefined, undefined);
      if (response) {
        return {
          tableData: response.tableData as TActivityWms[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 }; // Handle undefined case
    }
  });

  //----------------useEffects-----------
  return (
    <Grid container spacing={2} component={'form'} p={2.5}>
      {/*----------------------Prin Code-------------------------- */}
      <Grid item xs={12} sm={6}>
        <TextField label="Principal" id="outlined-basic" variant="outlined" value={formik.values.prin_code} disabled fullWidth />
      </Grid>
      {/*----------------------Activity-------------------------- */}
      <Grid item xs={12} sm={6}>
        <Autocomplete
          id="act_code"
          value={
            !!formik.values.act_code
              ? activityData?.tableData.find((eachActivity) => eachActivity.activity_code === formik.values.act_code)
              : ({ activity: '' } as TActivityWms)
          }
          onChange={(event, value: TActivityWms | null) => {
            formik.setFieldValue('act_code', value?.activity_code);
          }}
          size="small"
          options={activityData?.tableData ?? []}
          fullWidth
          autoHighlight
          getOptionLabel={(option) => option?.activity}
          isOptionEqualToValue={(option) => option.activity_code === formik.values.act_code}
          renderInput={(params) => (
            <TextField
              label="Activity"
              {...params}
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      {/*----------------------Act code-------------------------- */}

      <Grid item xs={12} sm={6}>
        <TextField label="ACT CODE" id="outlined-basic" name="act_code" variant="outlined" value={formik.values.act_code} fullWidth />
      </Grid>
      {/*----------------------Job Type-------------------------- */}

      <Grid item xs={12} sm={6}>
        <TextField
          value={formik.values.jobtype}
          onChange={formik.handleChange}
          label="Job Type"
          fullWidth
          id="outlined-basic"
          variant="outlined"
          name="jobtype"
        />
      </Grid>
      {/*----------------------Uoc-------------------------- */}

      <Grid item xs={4}>
        <Autocomplete
          id="uoc"
          value={
            !!formik.values.uoc
              ? UMM?.tableData.find((eachUoc) => eachUoc.charge_code === formik.values.uoc)
              : ({ description: '' } as TUocWms)
          }
          onChange={(event, value: TUocWms | null) => {
            formik.setFieldValue('uoc', value?.charge_code);
          }}
          size="small"
          options={UMM?.tableData ?? []}
          fullWidth
          autoHighlight
          getOptionLabel={(option) => option?.description}
          isOptionEqualToValue={(option) => option.company_code === formik.values.uoc}
          renderInput={(params) => (
            <TextField
              label="UOC"
              {...params}
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          id="moc1"
          value={
            !!formik.values.moc1
              ? UMM?.tableData.find((eachUoc) => eachUoc.charge_code === formik.values.moc1)
              : ({ description: '' } as TUocWms)
          }
          onChange={(event, value: TUocWms | null) => {
            formik.setFieldValue('moc1', value?.charge_code);
          }}
          size="small"
          options={UMM?.tableData ?? []}
          fullWidth
          autoHighlight
          getOptionLabel={(option) => option?.description}
          isOptionEqualToValue={(option) => option.company_code === formik.values.moc1}
          renderInput={(params) => (
            <TextField
              label="MOC1"
              {...params}
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={4}>
        <Autocomplete
          id="moc2"
          value={
            !!formik.values.moc2
              ? UMM?.tableData.find((eachUoc) => eachUoc.charge_code === formik.values.moc2)
              : ({ description: '' } as TUocWms)
          }
          onChange={(event, value: TUocWms | null) => {
            formik.setFieldValue('moc2', value?.charge_code);
          }}
          size="small"
          options={UMM?.tableData ?? []}
          fullWidth
          autoHighlight
          getOptionLabel={(option) => option?.description}
          isOptionEqualToValue={(option) => option.company_code === formik.values.moc2}
          renderInput={(params) => (
            <TextField
              label="MOC2"
              {...params}
              inputProps={{
                ...params.inputProps
              }}
            />
          )}
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          name="bill_amount"
          label="BILL AMOUNT"
          id="outlined-basic"
          type="number"
          variant="outlined"
          value={formik.values.bill_amount}
          onChange={formik.handleChange}
          fullWidth
        />
      </Grid>
      <Grid item xs={12} sm={6}>
        <TextField
          label="COST"
          name="cost"
          value={formik.values.cost}
          onChange={formik.handleChange}
          fullWidth
          id="outlined-basic"
          type="number"
          variant="outlined"
        />
      </Grid>
      <Grid item xs={12} className="flex justify-end">
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddBillingActivityWmsForm;

