import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Button, Checkbox } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import { ColumnDef, RowSelectionState } from '@tanstack/react-table';
import { ISearch } from 'components/filters/SearchFilter';
import UniversalDialog from 'components/popup/UniversalDialog';
import CustomDataTable, { rowsPerPageOptions } from 'components/tables/CustomDataTables';
import useAuth from 'hooks/useAuth';
import { useEffect, useMemo, useState } from 'react';
import { useLocation } from 'react-router';
import WmsSerivceInstance from 'service/service.wms';
import { useSelector } from 'store';
import { TUniversalDialogProps } from 'types/types.UniversalDialog';
import { getPathNameList } from 'utils/functions';

import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import GmServiceInstance from 'service/wms/services.gm_wms';

// before this we need to have TActivity Group Type
import { TActivityGroup } from './types/ActivityGroup-wms.types';

// import Activity Group Form
import AddActivityGroupWmsForm from 'components/forms/AddActivityGroupWmsForm';

const ActivityGroupWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  // first create const Popup From for Activity Group
  const [ActivityGroupFormPopup, setActivityGroupFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Activity Group',
    data: { existingData: {}, isEditMode: false }
  });

  // in order to crate Table we need "Custom Table "
  const columns = useMemo<ColumnDef<TActivityGroup>[]>(
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
        accessorFn: (row) => row.activity_group_code,
        id: 'activity_group_code',
        header: () => <span>Activity Group Code</span>
      },
      {
        accessorFn: (row) => row.act_group_name,
        id: 'act_group_name',
        header: () => <span>Activity Group Name</span>
      },
      {
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <span>Company Code</span>
      },
      {
        accessorFn: (row) => row.mandatory_flag,
        id: 'mandatory_flag',
        header: () => <span>Mandatory Flag</span>
      },

      {
        accessorFn: (row) => row.validate_flag,
        id: 'validate_flag',
        header: () => <span>Validate Flag</span>
      },

      {
        accessorFn: (row) => row.account_code,
        id: 'account_code',
        header: () => <span>Account Code </span>
      },

      {
        accessorFn: (row) => row.act_group_type,
        id: 'act_group_type',
        header: () => <span>Activity Group Type </span>
      },

      {
        accessorFn: (row) => row.alternate_accode,
        id: 'alternate_accode',
        header: () => <span>Alternate Ac code</span>
      },

      {
        accessorFn: (row) => row.exp_account_code,
        id: 'exp_account_code',
        header: () => <span>Exp Account Code</span>
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

  //----------- useQuery--------------
  // need this const query to fitch the Activity Group Data
  const {
    data: activitygroupData,
    isFetching: isActivityGroupFetchLoading,
    refetch: refetchActivityGroupData
  } = useQuery({
    queryKey: ['ActivityGroup_Data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });

  //-------------handlers---------------
  //After add Const Popup we need to add handlers

  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditActivityGroup = (existingData: TActivityGroup) => {
    setActivityGroupFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Activity Group',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleActivityGroup = (refetchData?: boolean) => {
    if (ActivityGroupFormPopup.action.open === true && refetchData) {
      refetchActivityGroupData();
    }
    setActivityGroupFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TActivityGroup) => {
    actionType === 'edit' && handleEditActivityGroup(rowOriginal);
  };

  // to use delete Activity Const we need to have Services in Gm_wms
  const handleDeleteActivityGroup = async () => {
    await GmServiceInstance.deleteActivityGroup(Object.keys(rowSelection));
    setRowSelection({});
    refetchActivityGroupData();
  };

  //------------------useEffect----------------

  // in order to use the form we need to create form Compent then we add it here
  useEffect(() => {
    setSearchData(null as any);
    setToggleFilter(null as any);
  }, []);
  return (
    <div className="flex flex-col space-y-2">
      <div className="flex justify-end space-x-2">
        {
          <Button
            variant="outlined"
            onClick={handleDeleteActivityGroup}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleActivityGroup()}>
          Activity Group
        </Button>
      </div>

      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="activity_group_code"
        data={activitygroupData?.tableData || []}
        columns={columns}
        count={activitygroupData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isActivityGroupFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />

      {!!ActivityGroupFormPopup && ActivityGroupFormPopup.action.open && (
        <UniversalDialog
          action={{ ...ActivityGroupFormPopup.action }}
          onClose={toggleActivityGroup}
          title={ActivityGroupFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddActivityGroupWmsForm
            onClose={toggleActivityGroup}
            isEditMode={ActivityGroupFormPopup?.data?.isEditMode}
            existingData={ActivityGroupFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default ActivityGroupWmsPage;
