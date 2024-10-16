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
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';

// import Port Table
import { TPort } from './types/Port-wms.types';

//import GM
import GmServiceInstance from 'service/wms/services.gm_wms';

// import form
import AddPortWmsForm from 'components/forms/AddPortWmsForm';

const PortWmsPage = () => {
  //--------------constants----------

  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [PortFormPopup, setPortFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Port',
    data: { existingData: {}, isEditMode: false }
  });

  // First need to add TPort in WMS/TYPES
  const columns = useMemo<ColumnDef<TPort>[]>(
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
        accessorFn: (row) => row.port_code,
        id: 'port_code',
        header: () => <span>Port Code</span>
      },
      {
        accessorFn: (row) => row.port_name,
        id: 'port_name',
        header: () => <span>Port Name</span>
      },
      {
        accessorFn: (row) => row.trp_mode,
        id: 'trp_mode',
        header: () => <span>TRP Mode</span>
      },
      {
        accessorFn: (row) => row.country_code,
        id: 'country_code',
        header: () => <span>Country Code</span>
      },
      {
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <span>Company Code</span>
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
    data: Port_data,
    isFetching: isPortFetchLoading,
    refetch: refetchPortData
  } = useQuery({
    queryKey: ['Port_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditPort = (existingData: TPort) => {
    setPortFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Port',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const togglePortPopup = (refetchData?: boolean) => {
    if (PortFormPopup.action.open === true && refetchData) {
      refetchPortData();
    }
    setPortFormPopup((prev) => {
      return { ...prev, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TPort) => {
    actionType === 'edit' && handleEditPort(rowOriginal);
  };

  const handleDeletePort = async () => {
    await GmServiceInstance.deletePort(Object.keys(rowSelection));
    setRowSelection({});
    refetchPortData();
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
          // Delete Button
          <Button
            variant="outlined"
            onClick={handleDeletePort}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }

        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => togglePortPopup()}>
          Port
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="Port_code"
        data={Port_data?.tableData || []}
        columns={columns}
        count={Port_data?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isPortFetchLoading}
        toggleFilter={toggleFilter}
      />
      {PortFormPopup.action.open === true && (
        <UniversalDialog
          action={{ ...PortFormPopup.action }}
          onClose={togglePortPopup}
          title={PortFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddPortWmsForm
            onClose={togglePortPopup}
            isEditMode={PortFormPopup?.data?.isEditMode}
            existingData={PortFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
      ;
    </div>
  );
};

export default PortWmsPage;
