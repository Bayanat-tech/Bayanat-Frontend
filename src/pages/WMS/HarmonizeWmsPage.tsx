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
import { THarmonize } from './types/harmonize-wms.types';

import AddHarmonizeWmsForm from 'components/forms/AddHarmonizeWmsForm';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import GmServiceInstance from 'service/wms/services.gm_wms';

const HarmonizeWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [countryFormPopup, setHarmonizeFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Harmonize',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<THarmonize>[]>(
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
        accessorFn: (row) => row.harm_code,
        id: 'harm_code',
        header: () => <span>Harmonize Code</span>
      },
      {
        accessorFn: (row) => row.harm_desc,
        id: 'harm_dec',
        header: () => <span>Harmonize Name</span>
      },
      {
        accessorFn: (row) => row.uom,
        id: 'uom',
        header: () => <span>Uom</span>
      },
      {
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <span>Company Code</span>
      },
      {
        accessorFn: (row) => row.permit_reqd,
        id: 'permit_reqd',
        header: () => <span>Permit Reqd</span>
      },
      
      {
        accessorFn: (row) => row.short_desc,
        id: 'short_desc',
        header: () => <span>Short Description</span>
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
    data: countryData,
    isFetching: isHarmonizeFetchLoading,
    refetch: refetchHarmonizeData
  } = useQuery({
    queryKey: ['country_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditHarmonize = (existingData: THarmonize) => {
    setHarmonizeFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Harmonize',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleHarmonizePopup = (refetchData?: boolean) => {
    if (countryFormPopup.action.open === true && refetchData) {
      refetchHarmonizeData();
    }
    setHarmonizeFormPopup((prev) => {
      return { ...prev, data: { isEditMode: false, existingData: {} }, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: THarmonize) => {
    actionType === 'edit' && handleEditHarmonize(rowOriginal);
  };
  const handleDeleteHarmonize = async () => {
    await GmServiceInstance.deleteHarmonize(Object.keys(rowSelection));
    setRowSelection({});
    refetchHarmonizeData();
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
            onClick={handleDeleteHarmonize}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleHarmonizePopup()}>
          Harmonize
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="harm_code"
        data={countryData?.tableData || []}
        columns={columns}
        count={countryData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isHarmonizeFetchLoading}
        toggleFilter={toggleFilter}
        hasPagination={true}
      />
      {!!countryFormPopup && countryFormPopup.action.open && (
        <UniversalDialog
          action={{ ...countryFormPopup.action }}
          onClose={toggleHarmonizePopup}
          title={countryFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddHarmonizeWmsForm
            onClose={toggleHarmonizePopup}
            isEditMode={countryFormPopup?.data?.isEditMode}
            existingData={countryFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default HarmonizeWmsPage;
