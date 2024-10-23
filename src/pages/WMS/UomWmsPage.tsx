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
import { TUom } from './types/uom-wms.type';
import AddUomWmsForm from 'components/forms/AddUomWmsForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import GmServiceInstance from 'service/wms/services.gm_wms';

const UomWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [countryFormPopup, setUomFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Uom',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TUom>[]>(
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
        accessorFn: (row) => row.uom_code,
        id: 'uom_code',
        header: () => <span>Uom Code</span>
      },
      {
        accessorFn: (row) => row.uom_name,
        id: 'uom_name',
        header: () => <span>Uom Name</span>
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
    data: countryData,
    isFetching: isUomFetchLoading,
    refetch: refetchUomData
  } = useQuery({
    queryKey: ['country_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditUom = (existingData: TUom) => {
    setUomFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Uom',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleUomPopup = (refetchData?: boolean) => {
    if (countryFormPopup.action.open === true && refetchData) {
      refetchUomData();
    }
    setUomFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TUom) => {
    actionType === 'edit' && handleEditUom(rowOriginal);
  };
  const handleDeleteUom = async () => {
    await GmServiceInstance.deleteUom(Object.keys(rowSelection));
    setRowSelection({});
    refetchUomData();
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
            onClick={handleDeleteUom}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleUomPopup()}>
          Uom
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="uom_code"
        data={countryData?.tableData || []}
        columns={columns}
        count={countryData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isUomFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!countryFormPopup && countryFormPopup.action.open && (
        <UniversalDialog
          action={{ ...countryFormPopup.action }}
          onClose={toggleUomPopup}
          title={countryFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddUomWmsForm
            onClose={toggleUomPopup}
            isEditMode={countryFormPopup?.data?.isEditMode}
            existingData={countryFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default UomWmsPage;
