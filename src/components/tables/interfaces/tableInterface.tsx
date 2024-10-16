import { ColumnDef, OnChangeFn, RowSelectionState } from '@tanstack/react-table';

export interface IReactTable {
  count?: number;
  columns: ColumnDef<any>[];
  data: Array<any>;
  toggleFilter?: boolean | null;
  onPaginationChange?: (arg0: number, arg1: number) => void;
  isDataLoading?: boolean;
  hasPagination?: boolean;
  rowSelection?: RowSelectionState;
  setRowSelection?: OnChangeFn<RowSelectionState> | undefined;
  row_id?: string;
}
