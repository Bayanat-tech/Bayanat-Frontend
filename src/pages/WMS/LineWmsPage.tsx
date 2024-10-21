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

// import Pick Wave Table
import { TLine } from './types/Line-wms.types';

//import pickwave Form
import AddLineWmsForm from 'components/forms/AddLineWmsForm';

//import GM
import GmServiceInstance from 'service/wms/services.gm_wms';

const LineWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [LineFormPopup, setLineFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Line',
    data: { existingData: {}, isEditMode: false }
  });
  // First need to add TLine in WMS/TYPES
  const columns = useMemo<ColumnDef<TLine>[]>(
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
        //second add all the col names + use Query

        accessorFn: (row) => row.line_code,
        id: 'line_code',
        header: () => <span>Line Code</span>
      },
      {
        accessorFn: (row) => row.line_name,
        id: 'line_name',
        header: () => <span>Line Name</span>
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
    data: line_data,
    isFetching: isLineFetchLoading,
    refetch: refetchLineData
  } = useQuery({
    queryKey: ['line_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });

  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditLine = (existingData: TLine) => {
    setLineFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Line',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleLinePopup = (refetchData?: boolean) => {
    if (LineFormPopup.action.open === true && refetchData) {
      refetchLineData();
    }
    setLineFormPopup((prev) => {
      return { ...prev, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TLine) => {
    actionType === 'edit' && handleEditLine(rowOriginal);
  };
  const handleDeleteLine = async () => {
    await GmServiceInstance.deleteLine(Object.keys(rowSelection));
    setRowSelection({});
    refetchLineData();
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
            onClick={handleDeleteLine}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }

        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleLinePopup()}>
          Pick Wave
        </Button>
      </div>

      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="line_code"
        data={line_data?.tableData || []}
        columns={columns}
        count={line_data?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isLineFetchLoading}
        toggleFilter={toggleFilter}
      />

      {LineFormPopup.action.open === true && (
        <UniversalDialog
          action={{ ...LineFormPopup.action }}
          onClose={toggleLinePopup}
          title={LineFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddLineWmsForm
            onClose={toggleLinePopup}
            isEditMode={LineFormPopup?.data?.isEditMode}
            existingData={LineFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default LineWmsPage;
