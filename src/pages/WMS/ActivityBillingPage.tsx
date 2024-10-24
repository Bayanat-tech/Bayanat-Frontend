import { useMemo, useState, useEffect } from 'react';
import { TUniversalDialogProps } from 'types/types.UniversalDialog';
import UniversalDialog from 'components/popup/UniversalDialog';
import { Button, Checkbox } from '@mui/material';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import CustomDataTable, { rowsPerPageOptions } from 'components/tables/CustomDataTables';
import { TBillingActivity } from './types/billingActivity-wms.types';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import { useQuery } from '@tanstack/react-query';
import { ISearch } from 'components/filters/SearchFilter';
import WmsSerivceInstance from 'service/wms/service.wms';
import { useSelector } from 'store';
import { getPathNameList } from 'utils/functions';
import { useLocation } from 'react-router';
import useAuth from 'hooks/useAuth';
import AddBillingActivityWmsForm from 'components/forms/AddBillingActivityWms';
import AddIcon from '@mui/icons-material/Add';

const ActivityBillingPage = () => {
  const location = useLocation();
  const [addActivityFormPopup, setActivityFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add ActivityBilling',
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
  console.log('pathnamelist', pathNameList);
  const handleEditActivityBilling = (existingData: TBillingActivity) => {
    setActivityFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Activity',
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
    queryKey: ['activity_billing_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });

  //------------------useEffect----------------
  useEffect(() => {
    setSearchData(null as any);
    setToggleFilter(null as any);
  }, []);
  return (
    <div className="w-full">
      {/* Principal Dropdown */}
      <div className="w-full flex justify-between">
        <div className="ba_principal_search_div">
          <Autocomplete
            disablePortal
            options={['The Godfather', 'Pulp Fiction']}
            sx={{ width: 300 }}
            renderInput={(params: any) => <TextField {...params} label="Principal" />}
          />
        </div>
        {/* add new activity */}
        <div className="ba_add_activity_and_populate_div flex">
          <div className="ba_add_activity_div mx-2">
            <Button variant="contained" onClick={handleAddActivityForm}>
              <AddIcon /> new activity
            </Button>
          </div>
          <div className="ba_populate_activity mx-2">
            <Button variant="contained" color="warning">
              {' '}
              populate activities
            </Button>
          </div>
        </div>
      </div>
      {/* Table */}
      <div className="w-full">
        <CustomDataTable
          tableActions={['export', 'import']}
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
          title="Billing Activity Form"
          hasPrimaryButton={false}
        >
          <AddBillingActivityWmsForm prin_code={'123'} password={'abc@123'} />
        </UniversalDialog>
      )}
    </div>
  );
};

export default ActivityBillingPage;
