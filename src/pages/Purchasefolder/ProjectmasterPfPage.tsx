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
import PfSerivceInstance from 'service/service.purhaseflow';

import { useSelector } from 'store';
import { TUniversalDialogProps } from 'types/types.UniversalDialog';
import { getPathNameList } from 'utils/functions';

import AddProjectmasterPfForm from 'components/forms/Purchaseflow/AddProjectmasterPfForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import GmPfServiceInstance from 'service/Purchaseflow/services.purchaseflow';
import { TVProjectmaster } from './type/projectmaster-pf-types';

const ProjectmasterPfPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [ProjectmasterFormPopup, setProjectmasterFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Projectmaster',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TVProjectmaster>[]>(
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
        accessorFn: (row) => row.project_code,
        id: 'project_code',
        header: () => <span>Project Code</span>
      },
      {
        accessorFn: (row) => row.project_name,
        id: 'project_name',
        header: () => <span>Project Name</span>
      },
      {
        accessorFn: (row) => row.div_name,
        id: 'div_name',
        header: () => <span>Company Name</span>
      },
      {
        accessorFn: (row) => row.total_project_cost,
        id: 'total_project_cost',
        header: () => <span>Total Project Cost</span>
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
  console.log(
    'page',
    permissions,
    app.toUpperCase(),
    permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number
  );

  //----------- useQuery--------------
  const {
    data: ProjectmasterData,
    isFetching: isProjectmasterFetchLoading,
    refetch: refetchProjectmasterData
  } = useQuery({
    queryKey: ['Projectmaster_data', searchData, paginationData],
    queryFn: () => PfSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number),
    staleTime: 10000
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditProjectmaster = (existingData: TVProjectmaster) => {
    setProjectmasterFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Projectmaster',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleProjectmasterPopup = (refetchData?: boolean) => {
    if (ProjectmasterFormPopup.action.open === true && refetchData) {
      refetchProjectmasterData();
    }
    setProjectmasterFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TVProjectmaster) => {
    actionType === 'edit' && handleEditProjectmaster(rowOriginal);
  };
  const handleDeleteProjectmaster = async () => {
    await GmPfServiceInstance.deleteProjectmaster(Object.keys(rowSelection));
    setRowSelection({});
    refetchProjectmasterData();
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
            onClick={handleDeleteProjectmaster}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleProjectmasterPopup()}>
          Projectmaster
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="div_code"
        data={ProjectmasterData?.tableData || []}
        columns={columns}
        count={ProjectmasterData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isProjectmasterFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!ProjectmasterFormPopup && ProjectmasterFormPopup.action.open && (
        <UniversalDialog
          action={{ ...ProjectmasterFormPopup.action }}
          onClose={toggleProjectmasterPopup}
          title={ProjectmasterFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddProjectmasterPfForm
            onClose={toggleProjectmasterPopup}
            isEditMode={ProjectmasterFormPopup?.data?.isEditMode}
            existingData={ProjectmasterFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default ProjectmasterPfPage;
