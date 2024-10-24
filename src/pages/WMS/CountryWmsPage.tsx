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
import { TCountry } from './types/country-wms.types';

import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import AddCountryWmsForm from 'components/forms/AddCountryWmsForm';
import { FormattedMessage } from 'react-intl';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import countryServiceInstance from 'service/GM/service.country_wms';

const CountryWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [countryFormPopup, setCountryFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: <FormattedMessage id="Add Country" />,
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
        header: () => <FormattedMessage id="Country Code" />
      },
      {
        accessorFn: (row) => row.country_name,
        id: 'country_name',
        header: () => <FormattedMessage id="Country Name" />
      },
      {
        accessorFn: (row) => row.country_gcc,
        id: 'country_gcc',
        header: () => <FormattedMessage id="Country GCC" />
      },
      {
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <FormattedMessage id="Company Code" />
      },
      {
        accessorFn: (row) => row.short_desc,
        id: 'short_desc',
        header: () => <FormattedMessage id="Short Description" />
      },
      {
        accessorFn: (row) => row.nationality,
        id: 'nationality',
        header: () => <FormattedMessage id="Nationality" />
      },
      {
        id: 'actions',
        header: () => <FormattedMessage id="Actions" />,

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
    setCountryFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: <FormattedMessage id="Edit Country" />,

        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleCountryPopup = (refetchData?: boolean) => {
    if (countryFormPopup.action.open === true && refetchData) {
      refetchCountryData();
    }
    setCountryFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TCountry) => {
    actionType === 'edit' && handleEditCountry(rowOriginal);
  };
  const handleDeleteCountry = async () => {
    await countryServiceInstance.deleteCountry(Object.keys(rowSelection));
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
            <FormattedMessage id="Delete" />
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleCountryPopup()}>
          <FormattedMessage id="Country" />
        </Button>
      </div>
      <CustomDataTable
        tableActions={['export', 'import']}
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
      {!!countryFormPopup && countryFormPopup.action.open && (
        <UniversalDialog
          action={{ ...countryFormPopup.action }}
          onClose={toggleCountryPopup}
          title={countryFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddCountryWmsForm
            onClose={toggleCountryPopup}
            isEditMode={countryFormPopup?.data?.isEditMode}
            existingData={countryFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default CountryWmsPage;
