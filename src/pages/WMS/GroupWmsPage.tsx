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
import WmsSerivceInstance from 'service/wms/service.wms';
import { useSelector } from 'store';
import { TUniversalDialogProps } from 'types/types.UniversalDialog';
import { getPathNameList } from 'utils/functions';
import { TGroup } from './types/group-wms.types';

import AddGroupWmsForm from 'components/forms/AddGroupWmsForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
//import GmServiceInstance from 'service/wms/services.gm_wms';
import prodgroupServiceInstance from 'service/GM/service.prodgroup_wms';

const GroupWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [groupFormPopup, setGroupFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Group',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TGroup>[]>(
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
        accessorFn: (row) => row.group_code,
        id: 'group_code',
        header: () => <span>Group Code</span>
      },
      {
        accessorFn: (row) => row.group_name,
        id: 'group_name',
        header: () => <span>Group Name</span>
      },
      {
        accessorFn: (row) => row.prin_code,
        id: 'prin_code',
        header: () => <span>Principal Code</span>
      },
      {
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <span>Company Code</span>
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
  const {
    data: groupData,
    isFetching: isGroupFetchLoading,
    refetch: refetchGroupData
  } = useQuery({
    queryKey: ['group_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditGroup = (existingData: TGroup) => {
    setGroupFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Group',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleGroupPopup = (refetchData?: boolean) => {
    if (groupFormPopup.action.open === true && refetchData) {
      refetchGroupData();
    }
    setGroupFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TGroup) => {
    actionType === 'edit' && handleEditGroup(rowOriginal);
  };
  const handleDeleteGroup = async () => {
    await prodgroupServiceInstance.deleteGroup(Object.keys(rowSelection));
    setRowSelection({});
    refetchGroupData();
  };
  //------------------useEffect----------------
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
            onClick={handleDeleteGroup}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleGroupPopup()}>
          Group
        </Button>
      </div>
      <CustomDataTable
        tableActions={['export', 'import']}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="group_code"
        data={groupData?.tableData || []}
        columns={columns}
        count={groupData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isGroupFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!groupFormPopup && groupFormPopup.action.open && (
        <UniversalDialog
          action={{ ...groupFormPopup.action }}
          onClose={toggleGroupPopup}
          title={groupFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddGroupWmsForm
            onClose={toggleGroupPopup}
            isEditMode={groupFormPopup?.data?.isEditMode}
            existingData={groupFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default GroupWmsPage;
