/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { CSSProperties, useEffect, useMemo, useState } from "react";
import styles from "./table.module.css";
import {
  MdArrowDownward,
  MdChevronLeft,
  MdKeyboardArrowRight,
  MdOutlineFirstPage,
  MdOutlineLastPage,
} from "react-icons/md";

interface TableProps {
  rows: any[];
  columns: {
    id: string;
    label: string;
    width?: number;
    truncate?: {
      enable: boolean;
      length: number;
    };
    render?: (prop: any) => any;
  }[];
  tableWidth?: string;
  tableHeight?: string;
  enableStickyHeader?: boolean;
  enablePagination?: boolean;
  enableSelectionRows?: boolean;
  enableSorting?: boolean;
  enableRowsPerPage?: boolean;
  enableServerSidePagination?: boolean;
  tableContainerStyle?: CSSProperties;
  tableHeaderStyle?: CSSProperties;
  tableFooterStyle?: CSSProperties;
  currentPage?: number;
  setCurrentPage?: (prop: number) => void;
  rowsPerPage?: number;
  setRowsPerPage?: React.Dispatch<React.SetStateAction<number>>;
  selectedRows?: Array<string | number>;
  setSelectedRows?: React.Dispatch<
    React.SetStateAction<Array<string | number>>
  >;
  rowsPerPageOptions?: number[];
  count?: number;
}

const TableComponent: React.FC<TableProps> = ({
  rows,
  columns,
  tableWidth,
  tableHeight,
  enableStickyHeader = true,
  enablePagination = true,
  enableSelectionRows = true,
  enableSorting = true,
  enableRowsPerPage = true,
  enableServerSidePagination = false,
  tableContainerStyle = {},
  tableHeaderStyle = {},
  tableFooterStyle = {},
  currentPage = 1,
  setCurrentPage = () => {},
  rowsPerPage = 20,
  setRowsPerPage = () => {},
  selectedRows = [],
  setSelectedRows = () => {},
  rowsPerPageOptions = [],
  count = 0,
}) => {
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: "ascending" | "descending";
  } | null>(null);

  const [clientSideData, setClientSideData] = useState<any[]>([]);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [serverSideData, setServerSideData] = useState<any[]>([]);
  const [tooltipCell, setTooltipCell] = useState<{
    rowId: string | number;
    columnId: string;
  } | null>(null);

  const dataSource = enableServerSidePagination
    ? serverSideData
    : clientSideData;

  const sortedData = useMemo(() => {
    if (!sortConfig) return rows;
    return [...rows].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? -1 : 1;
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === "ascending" ? 1 : -1;
      }
      return 0;
    });
  }, [rows, sortConfig]);

  useEffect(() => {
    if (enableServerSidePagination) {
      setServerSideData(sortedData);
      setTotalPages(count);
    } else {
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedClientData = sortedData.slice(
        startIndex,
        startIndex + rowsPerPage
      );
      setClientSideData(paginatedClientData);
      setTotalPages(Math.ceil(sortedData.length / rowsPerPage));
    }
  }, [currentPage, rowsPerPage, enableServerSidePagination, sortedData, count]);

  const handleSort = (key: string) => {
    let direction: "ascending" | "descending" = "ascending";
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === "ascending"
    ) {
      direction = "descending";
    }
    setSortConfig({ key, direction });
  };

  const handleRowSelection = (id: string | number) => {
    const selectedIndex = selectedRows.indexOf(id);
    let newSelectedRows: Array<string | number>;

    if (selectedIndex === -1) {
      newSelectedRows = [...selectedRows, id];
    } else {
      newSelectedRows = selectedRows.filter((row) => row !== id);
    }

    setSelectedRows(newSelectedRows);
  };

  const handleSelectAllRows = () => {
    if (selectedRows.length === dataSource.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(dataSource.map((row) => row.id));
    }
  };

  const getSortIconClassName = (columnId: string) => {
    if (sortConfig && sortConfig.key === columnId) {
      return sortConfig.direction === "ascending"
        ? `${styles.sort_icon} ${styles.up}`
        : `${styles.sort_icon} ${styles.down}`;
    }
    return `${styles.sort_icon}`;
  };

  const renderPagination = () => {
    const isLastPage = currentPage === totalPages;
    return (
      <div className={styles.pagination}>
        {enableRowsPerPage && rowsPerPageOptions.length > 1 && (
          <div className={styles.row}>
            <p>Rows per page:</p>
            <select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              {rowsPerPageOptions.map((value: number) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </div>
        )}
        <div className={styles.row}>
          <p>
            {`${(currentPage - 1) * rowsPerPage + 1}-${
              isLastPage ? sortedData.length : currentPage * rowsPerPage
            } of ${sortedData.length}`}
          </p>
        </div>
        <div className={styles.pagination_actions}>
          <MdOutlineFirstPage
            onClick={() => currentPage !== 1 && setCurrentPage(1)}
            className={
              currentPage === 1
                ? styles.pagination_icon_disabled
                : styles.pagination_icon
            }
          />
          <MdChevronLeft
            onClick={() => currentPage !== 1 && setCurrentPage(currentPage - 1)}
            className={
              currentPage === 1
                ? styles.pagination_icon_disabled
                : styles.pagination_icon
            }
          />
          <MdKeyboardArrowRight
            onClick={() =>
              currentPage < totalPages && setCurrentPage(currentPage + 1)
            }
            className={
              currentPage === totalPages
                ? styles.pagination_icon_disabled
                : styles.pagination_icon
            }
          />
          <MdOutlineLastPage
            onClick={() =>
              currentPage < totalPages && setCurrentPage(totalPages)
            }
            className={
              currentPage === totalPages
                ? styles.pagination_icon_disabled
                : styles.pagination_icon
            }
          />
        </div>
      </div>
    );
  };

  const handleMouseEnter = (rowId: string | number, columnId: string) => {
    setTooltipCell({ rowId, columnId });
  };

  const handleMouseLeave = () => {
    setTooltipCell(null);
  };

  return (
    <div className={styles.table_container} style={tableContainerStyle}>
      <div
        className={styles.table_wrapper}
        style={{ width: tableWidth, height: tableHeight }}
      >
        <table className={styles.table}>
          <thead
            className={
              enableStickyHeader
                ? `${styles.header} ${styles.header_sticky}`
                : styles.header
            }
          >
            <tr>
              {enableSelectionRows && (
                <th className={styles.header_cell} style={tableHeaderStyle}>
                  <input
                    type="checkbox"
                    onChange={handleSelectAllRows}
                    checked={
                      dataSource.length > 0 &&
                      selectedRows.length === dataSource.length
                    }
                  />
                </th>
              )}
              {columns.map((column) => (
                <th
                  key={column.id}
                  onClick={() => enableSorting && handleSort(column.id)}
                  className={styles.header_cell}
                  style={tableHeaderStyle}
                >
                  <div className={styles.row}>
                    {column.label}
                    {sortConfig?.key === column.id && enableSorting && (
                      <div className={getSortIconClassName(column.id)}>
                        <MdArrowDownward className={styles.sort_icon} />
                      </div>
                    )}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((row) => {
              const getNestedValue = (obj: any, path: string) =>
                path.split("__").reduce((data, id) => data && data[id], obj);

              return (
                <tr key={row.id}>
                  {enableSelectionRows && (
                    <td>
                      <input
                        type="checkbox"
                        checked={selectedRows.includes(row.id)}
                        onChange={() => handleRowSelection(row.id)}
                      />
                    </td>
                  )}
                  {columns.map((column) => {
                    const cellValue = getNestedValue(row, column.id);
                    const shouldTruncate =
                      column?.truncate?.enable &&
                      typeof cellValue === "string" &&
                      cellValue.length > column.truncate.length;

                    const truncatedText = shouldTruncate
                      ? `${cellValue.slice(0, column?.truncate?.length)}...`
                      : "";

                    return (
                      <td key={column.id}>
                        <div
                          className={styles.tooltip_wrapper}
                          onMouseEnter={() =>
                            shouldTruncate &&
                            handleMouseEnter(row.id, column.id)
                          }
                          onMouseLeave={handleMouseLeave}
                        >
                          <span>
                            {column.render
                              ? column.render(row)
                              : truncatedText || cellValue}
                          </span>
                          {tooltipCell &&
                            tooltipCell.rowId === row.id &&
                            tooltipCell.columnId === column.id && (
                              <div className={styles.tooltip}>{cellValue}</div>
                            )}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div
        className={
          enablePagination
            ? styles.footer
            : `${styles.footer} ${styles.footer_disabled}`
        }
        style={tableFooterStyle}
      >
        {renderPagination()}
      </div>
    </div>
  );
};

export default TableComponent;
