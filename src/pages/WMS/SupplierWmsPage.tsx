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
//import AddCountryWmsForm from 'components/forms/AddCountryWmsForm';
import AddSupplierWmsForm from 'components/forms/AddSupplierWmsForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import supplierServiceInstance from 'service/GM/service.supplier_wms';
//import { TCountry } from './types/country-wms.types';
import { TSupplier } from './types/supplier-wms.types';

const SupplierWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [supplierFormPopup, setSupplierFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Supplier',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TSupplier>[]>(
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
        accessorFn: (row) => row.supp_code,
        id: 'supp_code',
        header: () => <span>Supplier Code</span>
      },
      {
        accessorFn: (row) => row.supp_name,
        id: 'supp_name',
        header: () => <span>Supplier Name</span>
      },
      //   {
      //     accessorFn: (row) => row.country_gcc,
      //     id: 'country_gcc',
      //     header: () => <span>Country GCC</span>
      //   },
      // {
      //   accessorFn: (row) => row.company_code,
      //   id: 'company_code',
      //   header: () => <span>Company Code</span>
      // },
      {
        accessorFn: (row) => row.supp_addr1,
        id: 'supp_addr1',
        header: () => <span>Address</span>
      },
      {
        accessorFn: (row) => row.supp_city,
        id: 'supp_city',
        header: () => <span>City</span>
      },

      {
        accessorFn: (row) => row.country_code,
        id: 'country_code',
        header: () => <span>Country</span>
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
    data: supplierData,
    isFetching: isSupplierFetchLoading,
    refetch: refetchSupplierData
  } = useQuery({
    queryKey: ['supplier_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditSupplier = (existingData: TSupplier) => {
    setSupplierFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Supplier',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleSupplierPopup = (refetchData?: boolean) => {
    if (supplierFormPopup.action.open === true && refetchData) {
      refetchSupplierData();
    }
    setSupplierFormPopup((prev) => {
      return { ...prev, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TSupplier) => {
    actionType === 'edit' && handleEditSupplier(rowOriginal);
  };
  const handleDeleteSupplier = async () => {
    await supplierServiceInstance.deleteSupplier(Object.keys(rowSelection));
    setRowSelection({});
    refetchSupplierData();
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
            onClick={handleDeleteSupplier}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleSupplierPopup()}>
          Supplier
        </Button>
      </div>
      <CustomDataTable
        tableActions={['export', 'import']}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="supp_code"
        data={supplierData?.tableData || []}
        columns={columns}
        count={supplierData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isSupplierFetchLoading}
        toggleFilter={toggleFilter}
      />
      {supplierFormPopup.action.open === true && (
        <UniversalDialog
          action={{ ...supplierFormPopup.action }}
          onClose={toggleSupplierPopup}
          title={supplierFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddSupplierWmsForm
            onClose={toggleSupplierPopup}
            isEditMode={supplierFormPopup?.data?.isEditMode}
            existingData={supplierFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default SupplierWmsPage;
