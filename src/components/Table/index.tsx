/* eslint-disable @typescript-eslint/no-explicit-any */
import React, {
  CSSProperties,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import SearchInput from "../SearchInput";
import styled from "styled-components";

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

// styles

const TableContainer = styled.div`
  font-family: "Maven Pro", sans-serif;
  border-radius: 8px;
  border: 1px solid #cdcdcd;
  width: 100%;
  overflow: hidden;
  position: relative;
`;

const TableWrapper = styled.div`
  width: 100%;
  overflow-x: auto; /* Enable horizontal scrolling for small screens */
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
`;

const TableHeader = styled.thead`
  background: #f5f6f8;
  border-bottom: 1px solid #cdcdcd;
`;

const HeaderCell = styled.th`
  padding: 12px;
  text-align: left;
  white-space: nowrap; /* Prevent text from wrapping */
  font-size: 14px;
  font-weight: 500;
  color: #282828;
  width: auto;

  &:first-child {
    width: 40px; /* Adjust width for checkbox column */
    text-align: center;
  }

  &:not(:first-child) {
    width: calc(
      (100% - 40px) / 3
    ); /* Distribute the remaining width equally among other columns */
  }
`;

const Cell = styled.td`
  padding: 12px;
  text-align: left;
  white-space: nowrap; /* Prevent text from wrapping */
  color: #333333;
  font-size: 14px;

  &:first-child {
    width: 40px; /* Adjust width for checkbox column */
    text-align: center;
  }

  &:not(:first-child) {
    width: calc(
      (100% - 40px) / 3
    ); /* Distribute the remaining width equally among other columns */
  }
`;

const TableRow = styled.tr`
  border-bottom: 1px solid #cdcdcd;

  &:hover {
    background-color: #f1f1f1;
  }
`;

const Select = styled.select`
  margin-left: 10px;
  border: 1px solid #cdcdcd;
  background: #ffffff;
  border-radius: 4px;
  padding: 3px;
  outline: none;
`;

const Checkbox = styled.input.attrs({ type: "checkbox" })`
  width: 16px;
  height: 16px;
  margin: 0;
  cursor: pointer;
`;

const Footer = styled.div<{ disabled: boolean }>`
  display: ${(props) => (!props.disabled ? "none" : "flex")};
  justify-content: flex-end;
  align-items: center;
  gap: 24px;
  padding: 14px;
  font-size: 14px;
  position: sticky;
  bottom: 0;
  background: #ffffff;
`;

const Pagination = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 24px;
`;

const PaginationActions = styled.div`
  display: flex;
  gap: 10px;
`;

const PaginationIcon = styled.div<{ disabled: boolean }>`
  color: ${(props) => (props.disabled ? "#0000008a" : "#000000")};
  cursor: ${(props) => (props.disabled ? "not-allowed" : "pointer")};
  opacity: ${(props) => (props.disabled ? 0.5 : 1)};
`;

const SortIcon = styled.div<{ direction: "up" | "down" }>`
  transition: transform 0.3s ease;
  width: 14px;
  height: 12px;
  cursor: pointer;
  transform: ${(props) =>
    props.direction === "up" ? "rotate(180deg)" : "rotate(0deg)"};
`;

const FlexRow = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`;

const Tooltip = styled.div`
  background: #333333;
  margin-top: 1px;
  padding: 8px;
  color: white;
  border-radius: 4px;
  box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.5);
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 1;
  word-spacing: normal;
  white-space: normal;
  overflow-wrap: break-word;
  max-width: 300px;
  opacity: 0; /* Hidden by default */
  visibility: hidden; /* Prevents interaction when hidden */
  transition: opacity 0.3s ease; /* Smooth transitions */
  transform: translateY(10px); /* Start slightly lower */
`;

const TooltipWrapper = styled.div`
  position: relative;
  display: inline-block;

  &:hover ${Tooltip} {
    opacity: 1; /* Fade in */
    visibility: visible; /* Make visible on hover */
    transform: translateY(0); /* Move to original position */
  }
`;

const NoDataRow = styled.tr`
  &:hover {
    background-color: #ffffff;
  }
`;

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

  const renderPagination = () => {
    const isLastPage = currentPage * rowsPerPage >= totalPages;
    return (
      <Pagination>
        {enableRowsPerPage && rowsPerPageOptions.length > 1 && (
          <FlexRow>
            <p style={{ margin: "0px" }}>Rows per page:</p>
            <Select
              value={rowsPerPage}
              onChange={(e) => setRowsPerPage(Number(e.target.value))}
            >
              {rowsPerPageOptions.map((value: number) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </Select>
          </FlexRow>
        )}
        <FlexRow>
          <p style={{ margin: "0px" }}>
            {`${(currentPage - 1) * rowsPerPage + 1}-${
              isLastPage ? totalPages : currentPage * rowsPerPage
            } of ${totalPages}`}
          </p>
        </FlexRow>
        <PaginationActions>
          <PaginationIcon
            disabled={currentPage === 1}
            onClick={() => currentPage !== 1 && setCurrentPage(1)}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ fontSize: "20px" }}
            >
              <path fill="none" d="M24 0v24H0V0h24z" opacity=".87"></path>
              <path d="M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41zM6 6h2v12H6V6z"></path>
            </svg>
          </PaginationIcon>

          <PaginationIcon
            disabled={currentPage === 1}
            onClick={() => currentPage !== 1 && setCurrentPage(currentPage - 1)}
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ fontSize: "20px" }}
            >
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M15.41 7.41 14 6l-6 6 6 6 1.41-1.41L10.83 12z"></path>
            </svg>
          </PaginationIcon>

          <PaginationIcon
            disabled={currentPage >= Math.ceil(totalPages / rowsPerPage)}
            onClick={() =>
              currentPage < Math.ceil(totalPages / rowsPerPage) &&
              setCurrentPage(currentPage + 1)
            }
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ fontSize: "20px" }}
            >
              <path fill="none" d="M0 0h24v24H0V0z"></path>
              <path d="M8.59 16.59 13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path>
            </svg>
          </PaginationIcon>

          <PaginationIcon
            disabled={currentPage >= Math.ceil(totalPages / rowsPerPage)}
            onClick={() =>
              currentPage < Math.ceil(totalPages / rowsPerPage) &&
              setCurrentPage(Math.max(0, Math.ceil(totalPages / rowsPerPage)))
            }
          >
            <svg
              stroke="currentColor"
              fill="currentColor"
              stroke-width="0"
              viewBox="0 0 24 24"
              height="1em"
              width="1em"
              xmlns="http://www.w3.org/2000/svg"
              style={{ fontSize: "20px" }}
            >
              <path fill="none" d="M0 0h24v24H0V0z" opacity=".87"></path>
              <path d="M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41zM16 6h2v12h-2V6z"></path>
            </svg>
          </PaginationIcon>
        </PaginationActions>
      </Pagination>
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
      <TableContainer style={{ ...tableContainerStyle, width: tableWidth }}>
        <TableWrapper style={{ height: tableHeight }}>
          <StyledTable>
            <TableHeader
              style={
                enableStickyHeader
                  ? { position: "sticky", top: 0, zIndex: 1 }
                  : {}
              }
            >
              <TableRow>
                {enableSelectionRows && (
                  <HeaderCell style={tableHeaderStyle}>
                    <Checkbox
                      type="checkbox"
                      onChange={handleSelectAllRows}
                      checked={
                        (dataSource.length > 0 &&
                          selectedRowsPerPage[currentPage]?.length ===
                            dataSource.length) ||
                        false
                      }
                    />
                  </HeaderCell>
                )}
                {columns.map((column) => (
                  <HeaderCell
                    key={column.id}
                    onClick={() => enableSorting && handleSort(column.id)}
                    style={tableHeaderStyle}
                  >
                    <FlexRow>
                      {column.label}
                      {sortConfig?.key === column.id && enableSorting && (
                        <SortIcon
                          direction={
                            sortConfig.direction === "ascending" ? "up" : "down"
                          }
                        >
                          <svg
                            stroke="currentColor"
                            fill="currentColor"
                            stroke-width="0"
                            viewBox="0 0 24 24"
                            height="1em"
                            width="1em"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path fill="none" d="M0 0h24v24H0V0z"></path>
                            <path d="m20 12-1.41-1.41L13 16.17V4h-2v12.17l-5.58-5.59L4 12l8 8 8-8z"></path>
                          </svg>
                        </SortIcon>
                      )}
                    </FlexRow>
                  </HeaderCell>
                ))}
              </TableRow>
            </TableHeader>
            <tbody>
              {dataSource?.length > 0 ? (
                dataSource.map((row) => {
                  const getNestedValue = (obj: any, path: string) =>
                    path
                      .split("__")
                      .reduce((data, id) => data && data[id], obj);

                  return (
                    <TableRow key={row.id}>
                      {enableSelectionRows && (
                        <Cell>
                          <Checkbox
                            type="checkbox"
                            checked={
                              selectedRowsPerPage[currentPage]?.includes(
                                row.id
                              ) || false
                            }
                            onChange={() => handleRowSelection(row.id)}
                          />
                        </Cell>
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
                          <Cell key={column.id}>
                            <TooltipWrapper
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
                                  <Tooltip>{cellValue}</Tooltip>
                                )}
                            </TooltipWrapper>
                          </Cell>
                        );
                      })}
                    </TableRow>
                  );
                })
              ) : (
                <NoDataRow>
                  <Cell
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
                  </Cell>
                </NoDataRow>
              )}
            </tbody>
          </StyledTable>
        </TableWrapper>
        <Footer disabled={enablePagination} style={tableFooterStyle}>
          {renderPagination()}
        </Footer>
      </TableContainer>
    </div>
  );
};

export default Table;
