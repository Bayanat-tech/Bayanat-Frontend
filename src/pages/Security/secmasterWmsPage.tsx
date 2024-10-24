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
import { TSecmaster } from './type/flowmaster-sec-types';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
//import GmServiceInstance from 'service/wms/services.gm_wms';
import salesmanServiceInstance from 'service/GM/service.salesman_wms';
import AddSecLoginSecForm from 'components/forms/Security/AddSecLoginSecForm';

const SecmasterWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [secroleFormPopup, setCountryFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Sec Login User Creation',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TSecmaster>[]>(
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
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <span>Company Code</span>
      },
      {
        accessorFn: (row) => row.id,
        id: 'id',
        header: () => <span>User ID</span>
      },
      {
        accessorFn: (row) => row.username,
        id: 'username',
        header: () => <span>Username</span>
      },
      {
        accessorFn: (row) => row.contact_no,
        id: 'contact_no',
        header: () => <span> Contact No </span>
      },
      {
        accessorFn: (row) => row.email_id,
        id: 'email_id',
        header: () => <span>Email ID</span>
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
    data: secmasterData,
    isFetching: issecrollmasterfetchLoading,
    refetch: refetchSalesmanData
  } = useQuery({
    queryKey: ['SecLogin', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditsecrollmaster = (existingData: TSecmaster) => {
    setCountryFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit  Sec Login',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleCountryPopup = (refetchData?: boolean) => {
    if (secroleFormPopup.action.open === true && refetchData) {
      refetchSalesmanData();
    }
    setCountryFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TSecmaster) => {
    actionType === 'edit' && handleEditsecrollmaster(rowOriginal);
  };
  const handleDeleteSecrollmaster = async () => {
    await salesmanServiceInstance.deletesalesman(Object.keys(rowSelection));
    setRowSelection({});
    refetchSalesmanData();
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
            onClick={() => handleDeleteSecrollmaster}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleCountryPopup()}>
          AddRole
        </Button>
      </div>
      <CustomDataTable
        tableActions={['export', 'import']}
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="id"
        data={secmasterData?.tableData || []}
        columns={columns}
        count={secmasterData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={issecrollmasterfetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!secroleFormPopup && secroleFormPopup.action.open && (
        <UniversalDialog
          action={{ ...secroleFormPopup.action }}
          onClose={toggleCountryPopup}
          title={secroleFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddSecLoginSecForm
            onClose={toggleCountryPopup}
            isEditMode={secroleFormPopup?.data?.isEditMode}
            existingData={secroleFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default SecmasterWmsPage;
