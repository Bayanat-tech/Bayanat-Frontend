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
import PfSerivceInstance from 'service/service.purhaseflow';

import { useSelector } from 'store';
import { TUniversalDialogProps } from 'types/types.UniversalDialog';
import { getPathNameList } from 'utils/functions';

import AddCostmasterPfForm from 'components/forms/Purchaseflow/AddCostmasterPfForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import GmPfServiceInstance from 'service/Purchaseflow/services.purchaseflow';
import { TCostmaster } from './type/costmaster-pf-types';

const CostmasterPfPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [CostmasterFormPopup, setCostmasterFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Costmaster',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TCostmaster>[]>(
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
        accessorFn: (row) => row.cost_code,
        id: 'cost_code',
        header: () => <span>Cost Code</span>
      },
      {
        accessorFn: (row) => row.cost_name,
        id: 'cost_name',
        header: () => <span>Cost Name</span>
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
    data: CostmasterData,
    isFetching: isCostmasterFetchLoading,
    refetch: refetchCostmasterData
  } = useQuery({
    queryKey: ['Costmaster_data', searchData, paginationData],
    queryFn: () => PfSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditCostmaster = (existingData: TCostmaster) => {
    setCostmasterFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Costmaster',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleCostmasterPopup = (refetchData?: boolean) => {
    if (CostmasterFormPopup.action.open === true && refetchData) {
      refetchCostmasterData();
    }
    setCostmasterFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TCostmaster) => {
    actionType === 'edit' && handleEditCostmaster(rowOriginal);
  };
  const handleDeleteCostmaster = async () => {
    await GmPfServiceInstance.deleteCostmaster(Object.keys(rowSelection));
    setRowSelection({});
    refetchCostmasterData();
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
            onClick={handleDeleteCostmaster}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleCostmasterPopup()}>
          Costmaster
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="div_code"
        data={CostmasterData?.tableData || []}
        columns={columns}
        count={CostmasterData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isCostmasterFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!CostmasterFormPopup && CostmasterFormPopup.action.open && (
        <UniversalDialog
          action={{ ...CostmasterFormPopup.action }}
          onClose={toggleCostmasterPopup}
          title={CostmasterFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddCostmasterPfForm
            onClose={toggleCostmasterPopup}
            isEditMode={CostmasterFormPopup?.data?.isEditMode}
            existingData={CostmasterFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default CostmasterPfPage;
