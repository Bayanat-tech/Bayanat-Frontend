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

//import AddCountryWmsForm from 'components/forms/AddCountryWmsForm';
import AddDepartmentWmsForm from 'components/forms/AddDepartmentWmsForm';

import { TAvailableActionButtons } from 'types/types.actionButtonsGroups';
import ActionButtonsGroup from 'components/buttons/ActionButtonsGroup';
import GmServiceInstance from 'service/wms/services.gm_wms';
//import { TCountry } from './types/country-wms.types';
import { TDepartment } from './types/department-wms.types';

const DepartmentWmsPage = () => {
  //--------------constants----------
  const { permissions, user_permission } = useAuth();
  const location = useLocation();
  const pathNameList = getPathNameList(location.pathname);
  const { app } = useSelector((state: any) => state.menuSelectionSlice);
  const [paginationData, setPaginationData] = useState({ page: 0, rowsPerPage: rowsPerPageOptions[0] });
  const [searchData, setSearchData] = useState<ISearch>();
  const [toggleFilter, setToggleFilter] = useState<boolean | null>(null);
  const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

  const [departmentFormPopup, setDepartmentFormPopup] = useState<TUniversalDialogProps>({
    action: {
      open: false,
      fullWidth: true,
      maxWidth: 'sm'
    },
    title: 'Add Department',
    data: { existingData: {}, isEditMode: false }
  });
  const columns = useMemo<ColumnDef<TDepartment>[]>(
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
        accessorFn: (row) => row.dept_code,
        id: 'dept_code',
        header: () => <span>Department Code</span>
      },
      {
        accessorFn: (row) => row.dept_name,
        id: 'dept_name',
        header: () => <span>Department Name</span>
      },
      //   {
      //     accessorFn: (row) => row.country_gcc,
      //     id: 'country_gcc',
      //     header: () => <span>Country GCC</span>
      //   },
      // {
      //   accessorFn: (row) => row.company_code,
      //   id: 'company_code',
      //   header: () => <span>Company Code</span>
      // },
      {
        accessorFn: (row) => row.div_code,
        id: 'div_code',
        header: () => <span>Division Code</span>
      },
      {
        accessorFn: (row) => row.jobno_seq,
        id: 'jobno_seq',
        header: () => <span>JobNo Sequence</span>
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
    data: departmentData,
    isFetching: isDepartmentFetchLoading,
    refetch: refetchDepartmentData
  } = useQuery({
    queryKey: ['department_data', searchData, paginationData],
    queryFn: () => WmsSerivceInstance.getMasters(app, pathNameList[pathNameList.length - 1], paginationData, searchData),
    enabled: user_permission?.includes(permissions?.[app.toUpperCase()]?.children[pathNameList[3]?.toUpperCase()]?.serial_number)
  });
  //-------------handlers---------------
  const handleChangePagination = (page: number, rowsPerPage: number) => {
    setPaginationData({ page, rowsPerPage });
  };

  const handleEditDepartment = (existingData: TDepartment) => {
    setDepartmentFormPopup((prev) => {
      return {
        action: { ...prev.action, open: !prev.action.open },
        title: 'Edit Department',
        data: { existingData, isEditMode: true }
      };
    });
  };

  const toggleDepartmentPopup = (refetchData?: boolean) => {
    if (departmentFormPopup.action.open === true && refetchData) {
      refetchDepartmentData();
    }
    setDepartmentFormPopup((prev) => {
      return { ...prev, action: { ...prev.action, open: !prev.action.open } };
    });
  };

  const handleActions = (actionType: string, rowOriginal: TDepartment) => {
    actionType === 'edit' && handleEditDepartment(rowOriginal);
  };
  const handleDeleteDepartment = async () => {
    await GmServiceInstance.deleteDepartment(Object.keys(rowSelection));
    setRowSelection({});
    refetchDepartmentData();
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
            onClick={handleDeleteDepartment}
            color="error"
            hidden={!Object.keys(rowSelection).length}
            startIcon={<DeleteOutlined />}
          >
            Delete
          </Button>
        }
        <Button startIcon={<PlusOutlined />} variant="shadow" onClick={() => toggleDepartmentPopup()}>
          Department
        </Button>
      </div>
      <CustomDataTable
        rowSelection={rowSelection}
        setRowSelection={setRowSelection}
        row_id="dept_code"
        data={departmentData?.tableData || []}
        columns={columns}
        count={departmentData?.count}
        onPaginationChange={handleChangePagination}
        isDataLoading={isDepartmentFetchLoading}
        toggleFilter={toggleFilter}
      />
      {departmentFormPopup.action.open === true && (
        <UniversalDialog
          action={{ ...departmentFormPopup.action }}
          onClose={toggleDepartmentPopup}
          title={departmentFormPopup.title}
          hasPrimaryButton={false}
        >
          <AddDepartmentWmsForm
            onClose={toggleDepartmentPopup}
            isEditMode={departmentFormPopup?.data?.isEditMode}
            existingData={departmentFormPopup.data.existingData}
          />
        </UniversalDialog>
      )}
    </div>
  );
};

export default DepartmentWmsPage;
