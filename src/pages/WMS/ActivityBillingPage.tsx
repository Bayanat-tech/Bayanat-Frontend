import AddIcon from '@mui/icons-material/Add';
import { Checkbox } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import { ISearch } from 'components/filters/SearchFilter';
import AddBillingActivityWmsForm from 'components/forms/AddBillingActivityWms';
import PopulateBillingActivityForm from 'components/forms/PopulateBillingActivityForm';
import UniversalDialog from 'components/popup/UniversalDialog';
import CustomDataTable, { rowsPerPageOptions } from 'components/tables/CustomDataTables';
import useAuth from 'hooks/useAuth';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import WmsSerivceInstance from 'service/wms/service.wms';
import { useSelector } from 'store';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import { TUniversalDialogProps } from 'types/types.UniversalDialog';
import { getPathNameList } from 'utils/functions';
import { TBillingActivity } from './types/billingActivity-wms.types';
import { TPrincipalWms } from './types/principal-wms.types';
const ActivityBillingPage = () => {
  const location = useLocation();
  const [addActivityFormPopup, setActivityFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Billing Activity',
    data: { existingData: {}, isEditMode: false }
  });
  const toggleActivityPopup = (refetchData?: boolean) => {
    if (addActivityFormPopup.action.open === true && refetchData) {
      refetchActivityBillingData();
    }
    setActivityFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };
  const handleAddActivityForm = () => {
    setActivityFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const [populateFormPopup, setPopulateFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'xs'
    },
    title: 'Populate Activities',
    data: { existingData: {}, isEditMode: false }
  });
  const togglePopulatePopup = (refetchData?: boolean) => {
    if (populateFormPopup.action.open === true && refetchData) {
      refetchActivityBillingData();
    }
    setPopulateFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handlePopulateForm = () => {
    setPopulateFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };
  // For Activity Billing Table
  const { permissions, user_permission } = useAuth();

  const pathNameList = getPathNameList(location.pathname);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});
  const handleActions = (actionType: string, rowOriginal: TBillingActivity) => {
    actionType === 'edit' && handleEditActivityBilling(rowOriginal);
  };
  const [prinCode, setPrinCode] = useState<string>('');

  console.log('pathnamelist', pathNameList);
  const handleEditActivityBilling = (existingData: TBillingActivity) => {
    setActivityFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Billing Activity',
        data: { existingData, isEditMode: true }
      };
    });
  };
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  // Table Column
  const columns = useMemo<ColumnDef<TBillingActivity>[]>(
    () => [
      {
        id: 'select-col',
        header: ({ table }) => (
          <Checkbox
            checked={table.getIsAllRowsSelected()}
            indeterminate={table.getIsSomeRowsSelected()}
            onChange={table.getToggleAllRowsSelectedHandler()}
          />
        ),
        cell: ({ row }) => (
          <Checkbox checked={row.getIsSelected()} disabled={!row.getCanSelect()} onChange={row.getToggleSelectedHandler()} />
        )
      },
      {
        accessorFn: (row) => row.prin_name,
        id: 'prin_name',
        header: () => <span>Principal Name</span>
      },
      {
        accessorFn: (row) => row.act_code,
        id: 'act_code',
        header: () => <span>Activity Code</span>
      },
      {
        accessorFn: (row) => row.activity,
        id: 'activity',
        header: () => <span>Activity</span>
      },
      {
        accessorFn: (row) => row.jobtype,
        id: 'job_type',
        header: () => <span>Job Type</span>
      },
      {
        id: 'actions',
        header: () => <span>Actions</span>,
        cell: ({ row }) => {
          const actionButtons: TAvailableActionButtons[] = ['edit'];

          return <ActionButtonsGroup handleActions={(action) => handleActions(action, row.original)} buttons={actionButtons} />;
        }
      }
    ],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  //------------------useQuery----------------
  const {
    data: activityBillingData,
    isFetching: isActivityFetchLoading,
    refetch: refetchActivityBillingData
  } = useQuery({
    queryKey: ['activity_billing_data', searchData, paginationData, prinCode],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData, prinCode),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });

  const { data: principalList } = useQuery({
    queryKey: ['principal_data'],
    queryFn: async () => {
      const response = await WmsSerivceInstance.getMasters(app, 'principal');
      if (response) {
        return {
          tableData: response.tableData as TPrincipalWms[],
          count: response.count
        };
      }
      return { tableData: [], count: 0 };
    }
  });
  //------------------useEffect----------------
  useEffect(() => {
    setSearchData(null as any);
    setToggleFilter(null as any);
  }, []);
  useEffect(() => {
    console.log(prinCode);
  }, [prinCode]);
  return (
    <div className="w-full">
      {/*---------------Principal Dropdown-------------*/}
      <div className="w-full flex justify-between">
        <div>
          <Autocomplete
            value={
              !!prinCode
                ? principalList?.tableData.find((eachPrincipal) => eachPrincipal.prin_code === prinCode)
                : ({ prin_name: '' } as TPrincipalWms)
            }
            onChange={(event, value: TPrincipalWms | null) => {
              if (value) {
                setPrinCode(value?.prin_code as string);
              }
            }}
            disablePortal
            getOptionLabel={(option) => option.prin_name}
            options={principalList?.tableData ?? []}
            sx={{ width: 300 }}
            renderInput={(params: any) => <TextField {...params} label="Principal" />}
          />
        </div>
        {/* add new activity */}
        <div className="ba_add_activity_and_populate_div flex">
          <div className="ba_add_activity_div mx-2">
            <Button startIcon={<AddIcon />} variant="contained" onClick={handleAddActivityForm} disabled={prinCode === '' ? true : false}>
              add activity
            </Button>
          </div>
          <div className="ba_populate_activity mx-2">
            <Button variant="contained" color="warning" onClick={handlePopulateForm} disabled={prinCode === '' ? true : false}>
              populate activities
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="w-full mt-2">
        <CustomDataTable
          rowSelection={rowSelection}
          setRowSelection={setRowSelection}
          row_id="act_code"
          data={activityBillingData?.tableData || []}
          columns={columns}
          count={activityBillingData?.count}
          onPaginationChange={handleChangePagination}
          isDataLoading={isActivityFetchLoading}
          toggleFilter={toggleFilter}
          hasPagination={true}
        />
      </div>
      {/* Add Activity Dialogue Box */}
      {!!addActivityFormPopup && addActivityFormPopup.action.open && (
        <UniversalDialog
          action={{ ...addActivityFormPopup.action }}
          onClose={toggleActivityPopup}
          title={addActivityFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddBillingActivityWmsForm
            onClose={toggleActivityPopup}
            isEditMode={addActivityFormPopup?.data?.isEditMode}
            existingData={addActivityFormPopup.data.existingData}
            prin_code={prinCode}
          />
        </UniversalDialog>
      )}
      {/* Populate Activity Dialogue Box */}
      {!!populateFormPopup && populateFormPopup.action.open && (
        <UniversalDialog
          action={{ ...populateFormPopup.action }}
          onClose={togglePopulatePopup}
          title="Populate Activities"
          hasPrimaryButton={false}
        >
          <PopulateBillingActivityForm
            onClose={togglePopulatePopup}
            isEditMode={populateFormPopup?.data?.isEditMode}
            existingData={populateFormPopup.data.existingData}
            prin_code={prinCode}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default ActivityBillingPage;
