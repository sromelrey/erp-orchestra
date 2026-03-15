"use client";

import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  emptyMessage?: string;
  expandedRow?: (row: T) => React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = "No results.",
  expandedRow,
}: DataTableProps<T>) {
  const [expandedRows, setExpandedRows] = useState<Set<string | number>>(
    new Set(),
  );

  const toggleRow = (key: string | number) => {
    setExpandedRows((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(key)) {
        newSet.delete(key);
      } else {
        newSet.add(key);
      }
      return newSet;
    });
  };

  // Add expand toggle column if expandedRow is provided
  const tableColumns = expandedRow
    ? [
        {
          header: "",
          className: "w-8",
          cell: (row: T) => {
            const key = keyExtractor(row);
            const isExpanded = expandedRows.has(key);
            return (
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => toggleRow(key)}
              >
                {isExpanded ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </Button>
            );
          },
        },
        ...columns,
      ]
    : columns;

  return (
    <div className="rounded-xl bg-white shadow-sm ring-1 ring-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            {tableColumns.map((column, index) => (
              <TableHead key={index} className={column.className}>
                {column.header}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.length ? (
            data.map((row) => {
              const key = keyExtractor(row);
              const isExpanded = expandedRows.has(key);

              return (
                <React.Fragment key={key}>
                  <TableRow>
                    {tableColumns.map((column, index) => (
                      <TableCell key={index} className={column.className}>
                        {column.cell
                          ? column.cell(row)
                          : "accessorKey" in column && column.accessorKey
                            ? String(row[column.accessorKey] ?? "")
                            : null}
                      </TableCell>
                    ))}
                  </TableRow>
                  {expandedRow && isExpanded && (
                    <TableRow>
                      <TableCell
                        colSpan={tableColumns.length}
                        className="p-0 bg-gray-50"
                      >
                        <div className="p-4">{expandedRow(row)}</div>
                      </TableCell>
                    </TableRow>
                  )}
                </React.Fragment>
              );
            })
          ) : (
            <TableRow>
              <TableCell
                colSpan={tableColumns.length}
                className="h-24 text-center"
              >
                {emptyMessage}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
