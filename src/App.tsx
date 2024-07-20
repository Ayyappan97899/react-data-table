/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from "react";
import TableComponent from "./components/Table";
import { MdOutlineMoreVert } from "react-icons/md";

const App: React.FC = () => {
  const [list, setList] = useState<{
    data: [];
    pagination: {
      current_page: number;
      limit: number;
      total: number;
    };
  }>({
    data: [],
    pagination: {
      current_page: 1,
      limit: 20,
      total: 100,
    },
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState<number>(10);
  const [selectedRow, setSelectedRow] = useState<any | null>(null);
  const [selectedRows, setSelectedRows] = useState<Array<string | number>>([]);
  const [searchValue, setSearchValue] = useState<string>("");

  const actions = [
    {
      label: "Edit",
      onClick: (values: any) => {
        console.log("edit", values);
      },
    },
    {
      label: "Delete",
      onClick: (values: any) => {
        console.log("delete", values);
      },
    },
    {
      label: "View",
      onClick: (values: any) => {
        console.log("view", values);
      },
    },
  ];

  const columns = [
    { id: "id", label: "Id" },
    {
      id: "title",
      label: "Title",
      width: 300,
      truncate: {
        enable: true,
        length: 40,
      },
    },
    {
      id: "thumbnail__alt_text",
      label: "Description",
      width: 300,
      truncate: {
        enable: true,
        length: 40,
      },
    },
    {
      id: "api_model",
      label: "Model",
    },
    {
      id: "_score",
      label: "Score",
    },
    {
      id: "action",
      label: "Action",
      render: (values: any) => {
        const isOpen = selectedRow?.id === values.id;

        return (
          <div style={{ position: "relative" }}>
            <div
              onClick={() => {
                setSelectedRow(isOpen ? null : values);
              }}
              style={{ cursor: "pointer" }}
            >
              <MdOutlineMoreVert style={{ fontSize: "18px" }} />
            </div>

            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  background: "#fff",
                  border: "1px solid #ccc",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                  padding: "10px",
                  zIndex: 99,
                  marginTop: "5px",
                  borderRadius: "5px",
                  transition: "opacity 0.3s ease",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "6px",
                  }}
                >
                  {actions.map((action) => (
                    <span
                      key={action.label}
                      onClick={() => action.onClick(values)}
                      style={{ fontSize: "12px", cursor: "pointer" }}
                    >
                      {action.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  useEffect(() => {
    fetch(
      `https://api.artic.edu/api/v1/artworks/search?q=&limit=${20}&page=${currentPage}&q=${searchValue}`
    )
      .then((response) => response.json())
      .then((json) =>
        setList({
          ...json,
          pagination: {
            ...json.pagination,
            total: 100,
          },
        })
      );
  }, [currentPage, rowsPerPage, searchValue]);

  const searchHandleChange = (value: string) => {
    setSearchValue(value);
  };

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <TableComponent
        columns={columns}
        rows={list?.data || []}
        tableWidth="100%"
        tableHeight="70vh"
        enableClientSidePagination={false}
        count={list?.pagination?.total}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        rowsPerPageOptions={[20]}
        searchValue={searchValue}
        searchHandleChange={searchHandleChange}
        searchKey="title"
        enableCustomNoDataComponent
        customNoDataComponent={() => {
          return (
            <img
              style={{ width: "240px", height: "240px", objectFit: "cover" }}
              src="https://static.vecteezy.com/system/resources/previews/009/007/126/non_2x/document-file-not-found-search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
            />
          );
        }}
      />
    </div>
  );
};

export default App;
