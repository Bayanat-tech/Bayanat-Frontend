import { EllipsisOutlined, InboxOutlined, UploadOutlined } from '@ant-design/icons';
import {
  CardContent,
  IconButton,
  Menu,
  MenuItem,
  Paper,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  Typography
} from '@mui/material';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import TablePaginationActions from 'components/third-party/ReactTablePagination';
import { ReactNode, useEffect, useState } from 'react';
import { IReactTable } from './interfaces/tableInterface';
import { getPathNameList } from 'utils/functions';
import { useLocation } from 'react-router';
import FileUploadServiceInstance from 'service/services.files';

//------interface---
interface ActionButton {
  title: ReactNode | string;
  icon: ReactNode;
  key: string;
  handler: () => void; // Assuming handler is a function that takes no arguments and returns void
}

// Define the type for the tableActionButtons object
type TableActionButtons = {
  [key: string]: ActionButton;
};
export const rowsPerPageOptions: number[] = [20, 50, 100];
const ITEM_HEIGHT = 48;

const CustomDataTable = (props: IReactTable) => {
  const { columns, data, onPaginationChange = () => {}, hasPagination = true, rowSelection, setRowSelection, row_id, tableActions } = props;

  const [page, setPage] = useState<number>(0);
  const location = useLocation(),
    pathNameList = getPathNameList(location.pathname);

  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const tableInstance = useReactTable({
    onRowSelectionChange: setRowSelection,
    state: {
      rowSelection
    },
    enableSorting: true,
    getRowId: (row) => row[row_id as string],

    enableRowSelection: true,
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: props?.count,
    initialState: { pagination: { pageIndex: page, pageSize: rowsPerPage } },
    manualPagination: true
  });
  //------------------functions------------
  const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
    event?.preventDefault();
    setPage(newPage);
    onPaginationChange(newPage, rowsPerPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    onPaginationChange(0, parseInt(event.target.value, 10));
  };
  const handleImport = () => {};

  const tableActionButtons: TableActionButtons = {
    export: {
      key: 'export',
      title: 'Export',
      icon: <UploadOutlined />,
      handler: () => FileUploadServiceInstance.exportFile(pathNameList[pathNameList.length - 1])
    },
    import: { key: 'import', title: 'import', icon: <UploadOutlined />, handler: handleImport }
  };
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  //-----------------useEffects------------
  useEffect(() => {
    if (props.toggleFilter !== null) {
      setRowsPerPage(20);
      setPage(0);
      onPaginationChange(0, 20);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.toggleFilter]);

  return (
    <TableContainer component={Paper} className="border border-gray-200" elevation={0}>
      <div className="flex justify-end">
        <div>
          <IconButton
            aria-label="more"
            id="long-button"
            aria-controls={open ? 'long-menu' : undefined}
            aria-expanded={open ? 'true' : undefined}
            aria-haspopup="true"
            onClick={handleClick}
          >
            <EllipsisOutlined rotate={90} />
          </IconButton>
          <Menu
            id="long-menu"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left'
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'left'
            }}
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            slotProps={{
              paper: {
                style: {
                  maxHeight: ITEM_HEIGHT * 4.5,
                  width: '20ch'
                }
              }
            }}
          >
            {tableActions
              ?.map((eachAction) => tableActionButtons[eachAction as keyof typeof tableActionButtons])
              .filter((option) => option) // Filter out undefined values
              .map((option) => (
                <MenuItem
                  key={option.key}
                  onClick={() => {
                    option?.handler();
                    handleClose();
                  }}
                >
                  {option.title}
                </MenuItem>
              ))}
          </Menu>
        </div>
      </div>
      <Table sx={{ minWidth: 700 }}>
        <TableHead className="bg-stone-200">
          {tableInstance.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableCell key={header.id}>
                    {header.isPlaceholder ? null : <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>}
                  </TableCell>
                );
              })}
            </TableRow>
          ))}
        </TableHead>
        {props?.isDataLoading ? (
          <TableBody>
            <TableCell colSpan={12}>
              <Stack>
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={50} />
                <Skeleton height={90} />
              </Stack>
            </TableCell>
          </TableBody>
        ) : (
          <>
            {data.length ? (
              <TableBody>
                {tableInstance.getRowModel().rows.map((row) => {
                  return (
                    <TableRow hover key={row.id}>
                      {row.getVisibleCells().map((cell) => {
                        return <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>;
                      })}
                    </TableRow>
                  );
                })}
              </TableBody>
            ) : (
              <TableRow>
                <TableCell colSpan={12}>
                  <CardContent className="flex justify-center w-full">
                    <Stack className="mt-4">
                      <InboxOutlined style={{ width: 50, height: 20, transform: 'scale(3)', color: 'GrayText' }} />
                      <Typography color={'GrayText'}>No Data</Typography>
                    </Stack>
                  </CardContent>
                </TableCell>
              </TableRow>
            )}
          </>
        )}
        {hasPagination && (
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={rowsPerPageOptions}
                colSpan={12}
                count={props?.count || data.length}
                rowsPerPage={rowsPerPage}
                page={page}
                slotProps={{
                  select: {
                    inputProps: {
                      'aria-label': 'rows per page'
                    },
                    native: true
                  }
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        )}
      </Table>
    </TableContainer>
  );
};

export default CustomDataTable;
