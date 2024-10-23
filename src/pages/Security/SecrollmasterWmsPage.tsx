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
import { Tsecrollmaster } from './type/flowmaster-sec-types';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import GmServiceInstance from 'service/wms/services.gm_wms';
import AddSecRoleWmsForm from 'components/forms/Security/AddSecRoleSecForm';

const SecrollmasterWmsPage = () => {
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
    title: 'Add Role Master',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<Tsecrollmaster>[]>(
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
        accessorFn: (row) => row.role_id,
        id: 'role_id',
        header: () => <span>Role ID</span>
      },
      {
        accessorFn: (row) => row.role_desc,
        id: 'role_desc',
        header: () => <span>Role Description</span>
      },
      {
        accessorFn: (row) => row.remarks,
        id: 'row.remarks',
        header: () => <span>Remarks</span>
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
    data: secrollmasterData,
    isFetching: issecrollmasterfetchLoading,
    refetch: refetchSalesmanData
  } = useQuery({
    queryKey: ['salesman_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditsecrollmaster = (existingData: Tsecrollmaster) => {
    setCountryFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit  Role Master',
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

  const handleActions = (actionType: string, rowOriginal: Tsecrollmaster) => {
    actionType === 'edit' && handleEditsecrollmaster(rowOriginal);
  };
  const handleDeleteSecrollmaster = async () => {
    await GmServiceInstance.deletesalesman(Object.keys(rowSelection));
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
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="salesman_code"
        data={secrollmasterData?.tableData || []}
        columns={columns}
        count={secrollmasterData?.count}
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
          <AddSecRoleWmsForm
            onClose={toggleCountryPopup}
            isEditMode={secroleFormPopup?.data?.isEditMode}
            existingData={secroleFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default SecrollmasterWmsPage;
