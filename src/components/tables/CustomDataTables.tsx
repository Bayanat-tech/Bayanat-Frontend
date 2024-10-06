import { InboxOutlined } from '@ant-design/icons';
import {
  CardContent,
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
// import { tableCellClasses } from '@mui/material/TableCell';
// import { styled } from '@mui/material/styles';
import { flexRender, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import TablePaginationActions from 'components/third-party/ReactTablePagination';
import { useEffect, useState } from 'react';
import { IReactTable } from './interfaces/tableInterface';

export const rowsPerPageOptions: number[] = [20, 50, 100];

const CustomDataTable = (props: IReactTable) => {
  const { columns, data, onPaginationChange = () => {}, hasPagination = true } = props;
  const [page, setPage] = useState<number>(0);
  const [rowsPerPage, setRowsPerPage] = useState<number>(rowsPerPageOptions[0]);

  // Avoid a layout jump when reaching the last page with empty rows.
  // const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - data.length) : 0;
  const tableInstance = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: props?.count,
    initialState: { pagination: { pageIndex: page, pageSize: rowsPerPage } },
    manualPagination: true
  });

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
  useEffect(() => {
    if (props.toggleFilter !== null) {
      setRowsPerPage(20);
      setPage(0);
      onPaginationChange(0, 20);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.toggleFilter]);
  return (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 700 }}>
        <TableHead>
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
                SelectProps={{
                  inputProps: {
                    'aria-label': 'rows per page'
                  },
                  native: true
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
