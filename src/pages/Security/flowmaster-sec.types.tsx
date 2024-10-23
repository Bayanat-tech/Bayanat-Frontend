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

import AddFlowmasterSecForm from 'components/forms/Security/AddFlowmasteSecForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import GmSecServiceInstance from 'service/security/services.gm_security';
import { TFlowmaster } from './type/flowmaster-sec-types';

const FlowmasterSecPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [flowmasterFormPopup, setFlowmasterFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Flowmaster',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TFlowmaster>[]>(
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
        accessorFn: (row) => row.flow_code,
        id: 'flow_code',
        header: () => <span>Flow Code</span>
      },
      {
        accessorFn: (row) => row.flow_description,
        id: 'flow_description',
        header: () => <span>Flow description</span>
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
  console.log(
    'page',
    permissions,
    app.toUpperCase(),
    permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number
  );

  //----------- useQuery--------------
  const {
    data: flowmasterData,
    isFetching: isFlowmasterFetchLoading,
    refetch: refetchFlowmasterData
  } = useQuery({
    queryKey: ['flowmaster_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditFlowmaster = (existingData: TFlowmaster) => {
    setFlowmasterFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Flowmaster',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleFlowmasterPopup = (refetchData?: boolean) => {
    if (flowmasterFormPopup.action.open === true && refetchData) {
      refetchFlowmasterData();
    }
    setFlowmasterFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TFlowmaster) => {
    actionType === 'edit' && handleEditFlowmaster(rowOriginal);
  };
  const handleDeleteFlowmaster = async () => {
    await GmSecServiceInstance.deleteFlowmaster(Object.keys(rowSelection));
    setRowSelection({});
    refetchFlowmasterData();
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
            onClick={handleDeleteFlowmaster}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleFlowmasterPopup()}>
          Flowmaster
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="flow_code"
        data={flowmasterData?.tableData || []}
        columns={columns}
        count={flowmasterData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isFlowmasterFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!flowmasterFormPopup && flowmasterFormPopup.action.open && (
        <UniversalDialog
          action={{ ...flowmasterFormPopup.action }}
          onClose={toggleFlowmasterPopup}
          title={flowmasterFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddFlowmasterSecForm
            onClose={toggleFlowmasterPopup}
            isEditMode={flowmasterFormPopup?.data?.isEditMode}
            existingData={flowmasterFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default FlowmasterSecPage;
