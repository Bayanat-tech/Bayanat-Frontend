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
import { TSecmodulemaster } from './type/flowmaster-sec-types';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
//import GmServiceInstance from 'service/wms/services.gm_wms';
import salesmanServiceInstance from 'service/GM/service.salesman_wms';
import AddSecModuleSecForm from 'components/forms/Security/AddSecModuleSecForm';

const SecmodulemasterWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [secmoduleFormPopup, setSecmoduleFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Sec Module Creation',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TSecmodulemaster>[]>(
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
        accessorFn: (row) => row.app_code,
        id: 'app Code',
        header: () => <span>APP Code</span>
      },
      {
        accessorFn: (row) => row.serial_no,
        id: 'Serial No',
        header: () => <span>Serial No</span>
      },
      {
        accessorFn: (row) => row.level1,
        id: 'level1',
        header: () => <span>Level1</span>
      },
      {
        accessorFn: (row) => row.level2,
        id: 'level2',
        header: () => <span>Level2</span>
      },
      {
        accessorFn: (row) => row.level3,
        id: 'level3',
        header: () => <span>Level3</span>
      },
      {
        accessorFn: (row) => row.position,
        id: 'position',
        header: () => <span>Position</span>
      },
      {
        accessorFn: (row) => row.url_path,
        id: 'url_path',
        header: () => <span>Url Path</span>
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
    data: secmodulemasterData,
    isFetching: issecrollmasterfetchLoading,
    refetch: refetchSalesmanData
  } = useQuery({
    queryKey: ['secmodule', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditsecrollmaster = (existingData: TSecmodulemaster) => {
    setSecmoduleFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit  Sec Module',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleCountryPopup = (refetchData?: boolean) => {
    if (secmoduleFormPopup.action.open === true && refetchData) {
      refetchSalesmanData();
    }
    setSecmoduleFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TSecmodulemaster) => {
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
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="serial_no"
        data={secmodulemasterData?.tableData || []}
        columns={columns}
        count={secmodulemasterData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={issecrollmasterfetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!secmoduleFormPopup && secmoduleFormPopup.action.open && (
        <UniversalDialog
          action={{ ...secmoduleFormPopup.action }}
          onClose={toggleCountryPopup}
          title={secmoduleFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddSecModuleSecForm
            onClose={toggleCountryPopup}
            isEditMode={secmoduleFormPopup?.data?.isEditMode}
            existingData={secmoduleFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default SecmodulemasterWmsPage;
