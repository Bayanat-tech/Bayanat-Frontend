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
import { TAccountsetup } from './types/accountsetup-wms.types';

import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import AddAccountsetupWmsForm from 'components/forms/AddAccountSetupHrForm';
import { FormattedMessage } from 'react-intl';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import accountsetupServiceInstance from 'service/GM/service.accountsetup_wms';

const AccountsetupWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [accountsetupFormPopup, setAccountsetupFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: <FormattedMessage id="Add Accountsetup" />,
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TAccountsetup>[]>(
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
        accessorFn: (row) => row.ac_code,
        id: 'ac_code',
        header: () => <FormattedMessage id="Account Code" />
      },
      {
        accessorFn: (row) => row.ac_name,
        id: 'ac_name',
        header: () => <FormattedMessage id="Account Name" />
      },

      {
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <FormattedMessage id="Company Code" />
      },
      {
        accessorFn: (row) => row.bank_name,
        id: 'bank_name',
        header: () => <FormattedMessage id="Bank Name" />
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
    data: accountsetupData,
    isFetching: isAccountsetupFetchLoading,
    refetch: refetchAccountsetupData
  } = useQuery({
    queryKey: ['ac_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditAccountsetup = (existingData: TAccountsetup) => {
    setAccountsetupFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: <FormattedMessage id="Edit Accountsetup" />,

        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleAccountsetupPopup = (refetchData?: boolean) => {
    if (accountsetupFormPopup.action.open === true && refetchData) {
      refetchAccountsetupData();
    }
    setAccountsetupFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TAccountsetup) => {
    actionType === 'edit' && handleEditAccountsetup(rowOriginal);
  };
  const handleDeleteAccountsetup = async () => {
    await accountsetupServiceInstance.deleteAccountsetup(Object.keys(rowSelection));
    setRowSelection({});
    refetchAccountsetupData();
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
            onClick={handleDeleteAccountsetup}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            <FormattedMessage id="Delete" />
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleAccountsetupPopup()}>
          <FormattedMessage id="Accountsetup" />
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="ac_code"
        data={accountsetupData?.tableData || []}
        columns={columns}
        count={accountsetupData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isAccountsetupFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!accountsetupFormPopup && accountsetupFormPopup.action.open && (
        <UniversalDialog
          action={{ ...accountsetupFormPopup.action }}
          onClose={toggleAccountsetupPopup}
          title={accountsetupFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddAccountsetupWmsForm
            onClose={toggleAccountsetupPopup}
            isEditMode={accountsetupFormPopup?.data?.isEditMode}
            existingData={accountsetupFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default AccountsetupWmsPage;
