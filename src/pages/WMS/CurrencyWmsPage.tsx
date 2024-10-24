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
import AddCurrencyWmsForm from 'components/forms/AddCurrencyWmsForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
//import GmServiceInstance from 'service/wms/services.gm_wms';
import currencyServiceInstance from 'service/GM/service.currency_wms';
//import { TCountry } from './types/country-wms.types';
import { TCurrency } from './types/currency-wms.types';

const CurrencyWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [currencyFormPopup, setCurrencyFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Currency',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TCurrency>[]>(
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
        accessorFn: (row) => row.curr_code,
        id: 'curr_code',
        header: () => <span>Currency Code</span>
      },
      {
        accessorFn: (row) => row.curr_name,
        id: 'curr_name',
        header: () => <span>Currency Name</span>
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
        accessorFn: (row) => row.division,
        id: 'division',
        header: () => <span>Division Code</span>
      },
      {
        accessorFn: (row) => row.ex_rate,
        id: 'ex_rate',
        header: () => <span>Exchange Rate</span>
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
    data: currencyData,
    isFetching: isCurrencyFetchLoading,
    refetch: refetchCurrencyData
  } = useQuery({
    queryKey: ['currency_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditCurrency = (existingData: TCurrency) => {
    setCurrencyFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Currency',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleCurrencyPopup = (refetchData?: boolean) => {
    if (currencyFormPopup.action.open === true && refetchData) {
      refetchCurrencyData();
    }
    setCurrencyFormPopup((prev) => {
      return { ...prev, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TCurrency) => {
    actionType === 'edit' && handleEditCurrency(rowOriginal);
  };
  const handleDeleteCurrency = async () => {
    await currencyServiceInstance.deleteCurrency(Object.keys(rowSelection));
    setRowSelection({});
    refetchCurrencyData();
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
            onClick={handleDeleteCurrency}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleCurrencyPopup()}>
          Currency
        </Button>
      </div>
      <CustomDataTable
        tableActions={['export', 'import']}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="curr_code"
        data={currencyData?.tableData || []}
        columns={columns}
        count={currencyData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isCurrencyFetchLoading}
        toggleFilter={toggleFilter}
      />
      {currencyFormPopup.action.open === true && (
        <UniversalDialog
          action={{ ...currencyFormPopup.action }}
          onClose={toggleCurrencyPopup}
          title={currencyFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddCurrencyWmsForm
            onClose={toggleCurrencyPopup}
            isEditMode={currencyFormPopup?.data?.isEditMode}
            existingData={currencyFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default CurrencyWmsPage;
