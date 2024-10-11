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
import { TCountry } from './types/country-wms.types';

import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import AddPrincipalWmsForm from 'components/forms/AddPrincipalWmsForm';
import GmServiceInstance from 'service/wms/services.gm_wms';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';

const PrincipalWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [principalFormPopup, setPrincipalFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullScreen: true,
      maxWidth: 'md'
    },
    title: 'Add Country',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TCountry>[]>(
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
        accessorFn: (row) => row.country_code,
        id: 'country_code',
        header: () => <span>Country Code</span>
      },
      {
        accessorFn: (row) => row.country_name,
        id: 'country_name',
        header: () => <span>Country Name</span>
      },
      {
        accessorFn: (row) => row.country_gcc,
        id: 'country_gcc',
        header: () => <span>Country GCC</span>
      },
      {
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <span>Company Code</span>
      },
      {
        accessorFn: (row) => row.short_desc,
        id: 'short_desc',
        header: () => <span>Short Description</span>
      },
      {
        accessorFn: (row) => row.nationality,
        id: 'nationality',
        header: () => <span>Nationality</span>
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
    isFetching: isCountryFetchLoading,
    refetch: refetchCountryData
  } = useQuery({
    queryKey: ['country_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditCountry = (existingData: TCountry) => {
    setPrincipalFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Country',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const togglePrincipalPopup = (refetchData?: boolean) => {
    if (principalFormPopup.action.open === true && refetchData) {
      refetchCountryData();
    }
    setPrincipalFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TCountry) => {
    actionType === 'edit' && handleEditCountry(rowOriginal);
  };
  const handleDeleteCountry = async () => {
    await GmServiceInstance.deleteCountry(Object.keys(rowSelection));
    setRowSelection({});
    refetchCountryData();
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
            onClick={handleDeleteCountry}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => togglePrincipalPopup()}>
          Country
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="country_code"
        data={countryData?.tableData || []}
        columns={columns}
        count={countryData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isCountryFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!principalFormPopup && principalFormPopup.action.open && (
        <UniversalDialog
          action={{ ...principalFormPopup.action }}
          onClose={togglePrincipalPopup}
          title={principalFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddPrincipalWmsForm
            onClose={togglePrincipalPopup}
            // isEditMode={principalFormPopup?.data?.isEditMode}
            // existingData={principalFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default PrincipalWmsPage;
