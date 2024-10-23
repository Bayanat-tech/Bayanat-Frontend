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
import { TManufacture } from './types/manufacture-wms.types';

import AddManufactureWmsForm from 'components/forms/AddManufactureWmsForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
//import GmServiceInstance from 'service/wms/services.gm_wms';
import manufactureServiceInstance from 'service/GM/service.manufacture_wms';

const ManufactureWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [manufactureFormPopup, setManufactureFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Manufacture',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TManufacture>[]>(
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
        accessorFn: (row) => row.manu_code,
        id: 'manu_code',
        header: () => <span>manufacture Code</span>
      },
      {
        accessorFn: (row) => row.manu_name,
        id: 'manu_name',
        header: () => <span>Manufacture Name</span>
      },

      {
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <span>Company Code</span>
      },
      {
        accessorFn: (row) => row.prin_code,
        id: 'prin_code',
        header: () => <span>Prin code</span>
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
    data: manufactureData,
    isFetching: isManufactureFetchLoading,
    refetch: refetchManufactureData
  } = useQuery({
    queryKey: ['manufacture_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditManufacture = (existingData: TManufacture) => {
    setManufactureFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Manufacture',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleManufacturePopup = (refetchData?: boolean) => {
    if (manufactureFormPopup.action.open === true && refetchData) {
      refetchManufactureData();
    }
    setManufactureFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TManufacture) => {
    actionType === 'edit' && handleEditManufacture(rowOriginal);
  };
  const handleDeleteManufacture = async () => {
    await manufactureServiceInstance.deleteManufacture(Object.keys(rowSelection));
    setRowSelection({});
    refetchManufactureData();
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
            onClick={handleDeleteManufacture}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleManufacturePopup()}>
          Manufacture
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="manu_code"
        data={manufactureData?.tableData || []}
        columns={columns}
        count={manufactureData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isManufactureFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!manufactureFormPopup && manufactureFormPopup.action.open && (
        <UniversalDialog
          action={{ ...manufactureFormPopup.action }}
          onClose={toggleManufacturePopup}
          title={manufactureFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddManufactureWmsForm
            onClose={toggleManufacturePopup}
            isEditMode={manufactureFormPopup?.data?.isEditMode}
            existingData={manufactureFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default ManufactureWmsPage;
