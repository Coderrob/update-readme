import { table, TableColumn, TableEntry, TableRow } from 'ts-markdown';

export function isError(error: unknown): error is Error {
  return error instanceof Error;
}

export function createTable(
  headers: TableColumn[],
  rows: TableRow[]
): TableEntry {
  return table({ columns: headers, rows: rows });
}
