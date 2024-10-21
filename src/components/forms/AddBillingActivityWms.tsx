import { Autocomplete, Grid, TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { getIn, useFormik } from 'formik';

import { useState } from 'react';

// const {
//   data: countryData,
//   isFetching: isCountryFetchLoading,
//   refetch: refetchCountryData
// } = useQuery({
//   queryKey: ['country_data', searchData, paginationData],
//   queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
//   enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
// });
const AddBillingActivityWmsForm = ({ prin_code, password }: { prin_code: number; password: string }) => {
  const activityData = [
    {
      activity_code: 'ACT01',
      activity: 'Activity One',
      wip_code: 'WIP001',
      income_code: 'INC001',
      cost: 100.5,
      bill: 150.0,
      company_code: 'COMP1',
      activity_group_code: 'AG1',
      activity_subgroup_code: 'AS1',
      start_point: 'SP1',
      end_point: 'EP1',
      vtype: 'Type1',
      freeze_flag: 'N',
      budget_cost: 120.75,
      apptn_house: 'Y',
      apptn_app_on: 'N',
      exp_sub_type: 'Expense1',
      exp_code: 'EXP001',
      tx_compnt_1_perc: 25.0,
      tx_compnt_2_perc: 30.0,
      tx_compnt_3_perc: 20.0,
      tx_compnt_4_perc: 25.0,
      tx_compnt_1_expmt: 'Y',
      tx_compnt_2_expmt: 'N',
      tx_compnt_3_expmt: 'Y',
      tx_compnt_4_expmt: 'N',
      updated_at: new Date('2024-01-01T10:00:00Z'),
      updated_by: 'user1',
      created_by: 'admin',
      created_at: new Date('2024-01-01T09:00:00Z')
    },
    {
      activity_code: 'ACT02',
      activity: 'Activity Two',
      wip_code: 'WIP002',
      income_code: 'INC002',
      cost: 200.75,
      bill: 250.0,
      company_code: 'COMP2',
      activity_group_code: 'AG2',
      activity_subgroup_code: 'AS2',
      start_point: 'SP2',
      end_point: 'EP2',
      vtype: 'Type2',
      freeze_flag: 'Y',
      budget_cost: 220.0,
      apptn_house: 'N',
      apptn_app_on: 'Y',
      exp_sub_type: 'Expense2',
      exp_code: 'EXP002',
      tx_compnt_1_perc: 30.0,
      tx_compnt_2_perc: 40.0,
      tx_compnt_3_perc: 15.0,
      tx_compnt_4_perc: 15.0,
      tx_compnt_1_expmt: 'N',
      tx_compnt_2_expmt: 'Y',
      tx_compnt_3_expmt: 'N',
      tx_compnt_4_expmt: 'Y',
      updated_at: new Date('2024-01-02T11:00:00Z'),
      updated_by: 'user2',
      created_by: 'admin',
      created_at: new Date('2024-01-02T09:00:00Z')
    },
    {
      activity_code: 'ACT03',
      activity: 'Activity Three',
      wip_code: 'WIP003',
      income_code: 'INC003',
      cost: 300.0,
      bill: 350.0,
      company_code: 'COMP3',
      activity_group_code: 'AG3',
      activity_subgroup_code: 'AS3',
      start_point: 'SP3',
      end_point: 'EP3',
      vtype: 'Type3',
      freeze_flag: 'N',
      budget_cost: 320.0,
      apptn_house: 'Y',
      apptn_app_on: 'N',
      exp_sub_type: 'Expense3',
      exp_code: 'EXP003',
      tx_compnt_1_perc: 20.0,
      tx_compnt_2_perc: 30.0,
      tx_compnt_3_perc: 25.0,
      tx_compnt_4_perc: 25.0,
      tx_compnt_1_expmt: 'Y',
      tx_compnt_2_expmt: 'N',
      tx_compnt_3_expmt: 'Y',
      tx_compnt_4_expmt: 'N',
      updated_at: new Date('2024-01-03T12:00:00Z'),
      updated_by: 'user3',
      created_by: 'admin',
      created_at: new Date('2024-01-03T09:00:00Z')
    },
    {
      activity_code: 'ACT04',
      activity: 'Activity Four',
      wip_code: 'WIP004',
      income_code: 'INC004',
      cost: 400.25,
      bill: 450.0,
      company_code: 'COMP4',
      activity_group_code: 'AG4',
      activity_subgroup_code: 'AS4',
      start_point: 'SP4',
      end_point: 'EP4',
      vtype: 'Type4',
      freeze_flag: 'Y',
      budget_cost: 420.0,
      apptn_house: 'N',
      apptn_app_on: 'Y',
      exp_sub_type: 'Expense4',
      exp_code: 'EXP004',
      tx_compnt_1_perc: 35.0,
      tx_compnt_2_perc: 20.0,
      tx_compnt_3_perc: 25.0,
      tx_compnt_4_perc: 20.0,
      tx_compnt_1_expmt: 'N',
      tx_compnt_2_expmt: 'Y',
      tx_compnt_3_expmt: 'N',
      tx_compnt_4_expmt: 'Y',
      updated_at: new Date('2024-01-04T13:00:00Z'),
      updated_by: 'user4',
      created_by: 'admin',
      created_at: new Date('2024-01-04T09:00:00Z')
    },
    {
      activity_code: 'ACT05',
      activity: 'Activity Five',
      wip_code: 'WIP005',
      income_code: 'INC005',
      cost: 500.0,
      bill: 550.0,
      company_code: 'COMP5',
      activity_group_code: 'AG5',
      activity_subgroup_code: 'AS5',
      start_point: 'SP5',
      end_point: 'EP5',
      vtype: 'Type5',
      freeze_flag: 'N',
      budget_cost: 520.0,
      apptn_house: 'Y',
      apptn_app_on: 'N',
      exp_sub_type: 'Expense5',
      exp_code: 'EXP005',
      tx_compnt_1_perc: 30.0,
      tx_compnt_2_perc: 25.0,
      tx_compnt_3_perc: 20.0,
      tx_compnt_4_perc: 25.0,
      tx_compnt_1_expmt: 'Y',
      tx_compnt_2_expmt: 'N',
      tx_compnt_3_expmt: 'Y',
      tx_compnt_4_expmt: 'N',
      updated_at: new Date('2024-01-05T14:00:00Z'),
      updated_by: 'user5',
      created_by: 'admin',
      created_at: new Date('2024-01-05T09:00:00Z')
    }
  ];
  const [actCode, setActCode] = useState('');
  const [group, setGroup] = useState('');
  const UMM = [
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
  ];
  //----------------------constants--------------
  const formik = useFormik({});
  return (
    <Grid container marginTop={2}>
      <Grid container spacing={2}>
        <Grid xs={6} item>
          <TextField label="Principal" id="outlined-basic" variant="outlined" value={prin_code} fullWidth />
        </Grid>
        <Grid xs={6} item>
          <Autocomplete
            onChange={(event, value) => {
              if (!value) {
                return;
              } else {
                setActCode(value.act_code);
                setGroup(value.group);
              }
            }}
            disablePortal
            options={activityData.map((item) => {
              return { label: item.activity, act_code: item.activity_code, group: item.activity_group_code };
            })}
            renderInput={(params) => {
              return <TextField {...params} label="Activity" />;
            }}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid container spacing={2} marginTop={0.5}>
        <Grid item xs={6}>
          <TextField label="ACT CODE" id="outlined-basic" variant="outlined" value={actCode} fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="Group" fullWidth id="outlined-basic" variant="outlined" value={group} />
        </Grid>
      </Grid>
      <Grid xs={6} marginTop={2}>
        <TextField label="Job Type" fullWidth id="outlined-basic" variant="outlined" />
      </Grid>
      <Grid container spacing={1} marginTop={1}>
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            options={UMM.map((item) => {
              return { label: item.company_code };
            })}
            renderInput={(params) => <TextField {...params} label="UOC" />}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            options={UMM.map((item) => {
              return { label: item.company_code };
            })}
            renderInput={(params) => <TextField {...params} label="MOC1" />}
            fullWidth
          />
        </Grid>
        <Grid item xs={4}>
          <Autocomplete
            disablePortal
            options={UMM.map((item) => {
              return { label: item.company_code };
            })}
            renderInput={(params) => <TextField {...params} label="MOC2" />}
            fullWidth
          />
        </Grid>
      </Grid>
      <Grid item container spacing={2} marginTop={1}>
        <Grid item xs={6}>
          <TextField label="BILL AMOUNT" id="outlined-basic" type="number" variant="outlined" fullWidth />
        </Grid>
        <Grid item xs={6}>
          <TextField label="COST" fullWidth id="outlined-basic" type="number" variant="outlined" />
        </Grid>
      </Grid>
      <Grid item xs={12} className="flex justify-end" marginTop={2}>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Grid>
    </Grid>
  );
};

export default AddBillingActivityWmsForm;
