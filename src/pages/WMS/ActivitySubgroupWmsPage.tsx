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
import { TActivitysubgroup } from './types/activitysubgroup-wms';

import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import AddActivitySubgroupWmsForm from 'components/forms/AddActivitySubgroupWmsForm';
import countryServiceInstance from 'service/GM/service.country_wms';
import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';

const ActivitySubgroupWmsPage = () => {
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
    title: 'Add Activity Subgroup',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TActivitysubgroup>[]>(
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
        accessorFn: (row) => row.activity_subgroup_code,
        id: 'activity_subgroup_code',
        header: () => <span>Activity Subgroup Code</span>
      },
      {
        accessorFn: (row) => row.act_subgroup_name,
        id: 'act_subgroup_name',
        header: () => <span>Subgroup Name</span>
      },
      {
        accessorFn: (row) => row.mandatory_flag,
        id: 'mandatory_flag',
        header: () => <span>Mandatory Flag</span>
      },
      {
        accessorFn: (row) => row.company_code,
        id: 'company_code',
        header: () => <span>Company Code</span>
      },
      {
        accessorFn: (row) => row.act_group_code,
        id: 'act_group_code',
        header: () => <span>Act Group Code</span>
      },
      {
        accessorFn: (row) => row.validate_flag,
        id: 'validate_flag',
        header: () => <span>Validate Flag</span>
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

  const handleEditCountry = (existingData: TActivitysubgroup) => {
    setCountryFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Activity Subgroup',
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

  const handleActions = (actionType: string, rowOriginal: TActivitysubgroup) => {
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
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleCountryPopup()}>
          Activity Subgroup
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="activity_subgroup_code"
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
          <AddActivitySubgroupWmsForm
            onClose={toggleCountryPopup}
            isEditMode={countryFormPopup?.data?.isEditMode}
            existingData={countryFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default ActivitySubgroupWmsPage;
