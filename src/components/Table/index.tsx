/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import styles from "./table.module.css";
import {
  MdArrowDownward,
  MdChevronLeft,
  MdKeyboardArrowRight,
  MdOutlineFirstPage,
  MdOutlineLastPage,
} from "react-icons/md";
import SearchInput from "../SearchInput";

interface TableProps {
  rows: any[];
  columns: {
    id: string;
    label: string;
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
  enableClientSidePagination?: boolean;
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
  enableSearch?: boolean;
  searchValue?: string;
  searchKey?: string;
  searchHandleChange?: (value: string) => void;
  enableCustomNoDataComponent?: boolean;
  customNoDataComponent?: () => ReactNode;
}

const Table: React.FC<TableProps> = ({
  rows,
  columns,
  tableWidth = "100%",
  tableHeight = "70vh",
  enableStickyHeader = true,
  enablePagination = true,
  enableSelectionRows = true,
  enableSorting = true,
  enableRowsPerPage = true,
  enableClientSidePagination = true,
  tableContainerStyle = {},
  tableHeaderStyle = {},
  tableFooterStyle = {},
  currentPage = 1,
  setCurrentPage = () => {},
  rowsPerPage = 20,
  setRowsPerPage = () => {},
  setSelectedRows = () => {},
  rowsPerPageOptions = [],
  count = 0,
  enableSearch = true,
  searchValue = "",
  searchKey = "",
  searchHandleChange = () => {},
  enableCustomNoDataComponent = false,
  customNoDataComponent = () => {
    return <></>;
  },
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
  const [selectedRowsPerPage, setSelectedRowsPerPage] = useState<
    Record<string, Array<string | number>>
  >({});

  const dataSource = !enableClientSidePagination
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
    if (!enableClientSidePagination) {
      setServerSideData(sortedData);
      setTotalPages(count);
    } else {
      const startIndex = (currentPage - 1) * rowsPerPage;
      const paginatedClientData = sortedData.slice(
        startIndex,
        startIndex + rowsPerPage
      );
      setClientSideData(
        searchKey && searchValue
          ? paginatedClientData?.filter((data) => {
              const getNestedValue = (obj: any, path: string) => {
                return path?.split("__")?.reduce((data, id) => {
                  return data && data[id];
                }, obj);
              };

              const valueFromResponse = getNestedValue(data, searchKey)
                ?.toString()
                ?.toLowerCase();

              return valueFromResponse?.includes(
                searchValue?.toString()?.toLowerCase()
              );
            })
          : paginatedClientData
      );

      setTotalPages(sortedData.length);
    }
  }, [
    currentPage,
    rowsPerPage,
    enableClientSidePagination,
    sortedData,
    count,
    searchKey,
    searchValue,
  ]);

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
    const currentSelectedRows = selectedRowsPerPage?.[currentPage] ?? [];
    const selectedIndex = currentSelectedRows.indexOf(id);
    let newSelectedRows: Array<string | number>;

    if (selectedIndex === -1) {
      newSelectedRows = [...currentSelectedRows, id];
    } else {
      newSelectedRows = currentSelectedRows.filter((row: any) => row !== id);
    }

    setSelectedRowsPerPage((prev: any) => ({
      ...prev,
      [currentPage]: newSelectedRows,
    }));
  };

  const handleSelectAllRows = () => {
    const currentSelectedRows = selectedRowsPerPage[currentPage] || [];
    if (currentSelectedRows.length === dataSource.length) {
      setSelectedRowsPerPage((prev: any) => ({
        ...prev,
        [currentPage]: [],
      }));
    } else {
      setSelectedRowsPerPage((prev: any) => ({
        ...prev,
        [currentPage]: dataSource.map((row) => row.id),
      }));
    }
  };

  // Derived state for combined selected rows
  const combinedSelectedRows = useMemo(
    () =>
      Object.values(selectedRowsPerPage).reduce(
        (acc: any, rows) => acc.concat(rows),
        []
      ),
    [selectedRowsPerPage]
  );

  // You can use combinedSelectedRows in any way you need, for example, logging:
  useEffect(() => {
    setSelectedRows(combinedSelectedRows);
  }, [combinedSelectedRows, setSelectedRows]);

  const getSortIconClassName = (columnId: string) => {
    if (sortConfig && sortConfig.key === columnId) {
      return sortConfig.direction === "ascending"
        ? `${styles.sort_icon} ${styles.up}`
        : `${styles.sort_icon} ${styles.down}`;
    }
    return `${styles.sort_icon}`;
  };

  const renderPagination = () => {
    const isLastPage = currentPage * rowsPerPage >= totalPages;
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
              isLastPage ? totalPages : currentPage * rowsPerPage
            } of ${totalPages}`}
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
              currentPage < Math.ceil(totalPages / rowsPerPage) &&
              setCurrentPage(currentPage + 1)
            }
            className={
              currentPage >= Math.ceil(totalPages / rowsPerPage)
                ? styles.pagination_icon_disabled
                : styles.pagination_icon
            }
          />
          <MdOutlineLastPage
            onClick={() =>
              currentPage < Math.ceil(totalPages / rowsPerPage) &&
              setCurrentPage(Math.max(0, Math.ceil(totalPages / rowsPerPage)))
            }
            className={
              currentPage >= Math.ceil(totalPages / rowsPerPage)
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
    <div style={{ width: "100%" }}>
      {enableSearch && (
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            margin: "24px 0px",
          }}
        >
          <SearchInput
            value={searchValue}
            onChange={(value: string) => searchHandleChange(value)}
          />
        </div>
      )}
      <div
        className={styles.table_container}
        style={{ ...tableContainerStyle, width: tableWidth }}
      >
        <div className={styles.table_wrapper} style={{ height: tableHeight }}>
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
                        (dataSource.length > 0 &&
                          selectedRowsPerPage[currentPage]?.length ===
                            dataSource.length) ||
                        false
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
              {dataSource?.length > 0 ? (
                dataSource.map((row) => {
                  const getNestedValue = (obj: any, path: string) =>
                    path
                      .split("__")
                      .reduce((data, id) => data && data[id], obj);

                  return (
                    <tr key={row.id}>
                      {enableSelectionRows && (
                        <td>
                          <input
                            type="checkbox"
                            checked={
                              selectedRowsPerPage[currentPage]?.includes(
                                row.id
                              ) || false
                            }
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
                                  <div className={styles.tooltip}>
                                    {cellValue}
                                  </div>
                                )}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  );
                })
              ) : (
                <tr className={styles.no_data_row} style={{ border: "none" }}>
                  <td
                    colSpan={columns?.length + 1}
                    style={{
                      height: "100%",
                      textAlign: "center",
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        height: `calc(${tableHeight} - 10vh)`,
                      }}
                    >
                      {enableCustomNoDataComponent
                        ? customNoDataComponent()
                        : "No Data"}
                    </div>
                  </td>
                </tr>
              )}
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
    </div>
  );
};

export default Table;
