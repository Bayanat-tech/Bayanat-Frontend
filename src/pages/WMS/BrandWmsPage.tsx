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
import { TBrand } from './types/brand-wms.types';

import AddBrandWmsForm from 'components/forms/AddBrandWmsForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import GmServiceInstance from 'service/wms/services.gm_wms';

const BrandWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [brandFormPopup, setBrandFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Brand',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TBrand>[]>(
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
        accessorFn: (row) => row.brand_code,
        id: 'brand_code',
        header: () => <span>Brand Code</span>
      },
      {
        accessorFn: (row) => row.brand_name,
        id: 'brand_name',
        header: () => <span>Brand Name</span>
      },

      {
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <span>Company Code</span>
      },
      //   {
      //     accessorFn: (row) => row.short_desc,
      //     id: 'short_desc',
      //     header: () => <span>Short Description</span>
      //   },
      //   {
      //     accessorFn: (row) => row.nationality,
      //     id: 'nationality',
      //     header: () => <span>Nationality</span>
      //   },
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
    data: brandData,
    isFetching: isBrandFetchLoading,
    refetch: refetchBrandData
  } = useQuery({
    queryKey: ['brand_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditBrand = (existingData: TBrand) => {
    setBrandFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Brand',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleBrandPopup = (refetchData?: boolean) => {
    if (brandFormPopup.action.open === true && refetchData) {
      refetchBrandData();
    }
    setBrandFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TBrand) => {
    actionType === 'edit' && handleEditBrand(rowOriginal);
  };
  const handleDeleteBrand = async () => {
    await GmServiceInstance.deleteBrand(Object.keys(rowSelection));
    setRowSelection({});
    refetchBrandData();
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
            onClick={handleDeleteBrand}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleBrandPopup()}>
          Brand
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="brand_code"
        data={brandData?.tableData || []}
        columns={columns}
        count={brandData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isBrandFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!brandFormPopup && brandFormPopup.action.open && (
        <UniversalDialog
          action={{ ...brandFormPopup.action }}
          onClose={toggleBrandPopup}
          title={brandFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddBrandWmsForm
            onClose={toggleBrandPopup}
            isEditMode={brandFormPopup?.data?.isEditMode}
            existingData={brandFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default BrandWmsPage;
