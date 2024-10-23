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
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import AddPrincipalWmsForm from 'components/forms/AddPrincipalWmsForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import { TPrincipalWms } from './types/principal-wms.types';

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
      fullScreen: true
    },
    title: 'Add Principal',
    data: { prin_code: '', isEditMode: false }
  });

  const columns = useMemo<ColumnDef<TPrincipalWms>[]>(
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
        accessorFn: (row) => row.prin_code,
        id: 'prin_code',
        header: () => <span>Code</span>
      },
      {
        accessorFn: (row) => row.prin_name,
        id: 'prin_name',
        header: () => <span>Name</span>
      },

      {
        accessorFn: (row) => row.prin_status,
        id: 'prin_status',
        header: () => <span>Status</span>
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
    data: principalData,
    isFetching: isPrincipalFetchLoading,
    refetch: refetchPrincipalData
  } = useQuery({
    queryKey: ['principal_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  // const handleEditPrincipal = (existingData: TPrincipalWms) => {
  //   setPrincipalFormPopup((prev) => {
  //     return {
  //       action: { ...prev.action, open: !prev.action.open },
  //       title: 'Edit Principal',
  //       data: { prin_code: existingData.prin_code, isEditMode: true }
  //     };
  //   });
  // };

  // const togglePrincipalPopup = (refetchData?: boolean) => {
  //   if (principalFormPopup.action.open === true && refetchData) {
  //     refetchPrincipalData();
  //   }
  //   setPrincipalFormPopup((prev) => {
  //     return { ...prev, data: { isEditMode: false, prin_code: '' }, action: { ...prev.action, open: !prev.action.open } };
  //   });
  // };
  const handleTogglePopup = (existingData?: TPrincipalWms, refetchData?: boolean) => {
    if (principalFormPopup.action.open && refetchData) {
      refetchPrincipalData();
    }
    setPrincipalFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: `${!!existingData && Object.keys(existingData).length > 0 ? 'Edit' : 'Add'} Principal`,
        data: {
          prin_code: existingData?.prin_code || '',
          isEditMode: !!existingData
        }
      };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TPrincipalWms) => {
    actionType === 'edit' && handleTogglePopup(rowOriginal);
  };
  const handleDeletePrincipal = async () => {
    console.log(rowSelection);

    await WmsSerivceInstance.deleteMasters('wms', 'principal', Object.keys(rowSelection));
    setRowSelection({});
    refetchPrincipalData();
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
            onClick={handleDeletePrincipal}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => handleTogglePopup()}>
          Principal
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="prin_code"
        data={principalData?.tableData || []}
        columns={columns}
        count={principalData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isPrincipalFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!principalFormPopup && principalFormPopup.action.open && (
        <UniversalDialog
          action={{ ...principalFormPopup.action }}
          onClose={handleTogglePopup}
          title={principalFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddPrincipalWmsForm
            onClose={(existingData, refetchData) => handleTogglePopup(existingData, refetchData)}
            isEditMode={principalFormPopup?.data?.isEditMode}
            prin_code={principalFormPopup.data.prin_code}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default PrincipalWmsPage;
