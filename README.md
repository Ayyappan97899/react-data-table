# react-lite-table

`react-lite-table` is a flexible, lightweight, and feature-rich React component for displaying tabular data. It includes functionalities such as sorting, searching, pagination, and row selection, making it suitable for a variety of use cases.

## Features

- **Pagination:** Divide your data into pages to handle large datasets efficiently.
- **Sorting:** Organize your table data by sorting columns in ascending or descending order.
- **Row Selection:** Select individual rows or all rows on the current page.
- **Search:** Includes a search box to filter table data, with support for nested data and automatic delay to improve performance.
- **Custom No Data Message:** Displays a custom message or component when there's no data to show.
- **Fully Customizable:** Customize styles and behaviors with extensive props.
- **Responsive Design:** Adapts to different screen sizes.

## Installation

Install the package using npm:
```js
npm install react-lite-table
```

## Quick Start

Here’s a simple example of how to use `Table`:

```jsx
import React, { useState } from "react";
import Table from "react-lite-table";

const App = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");

  // Note: To access values from nested objects, use double underscores "__" in the column id.
  const columns = [
    { id: "name", label: "Name" },
    { id: "age", label: "Age" },
    { id: "address__city", label: "City" },
  ];

  const rows = [
    { id: 1, name: "John Doe", age: 25, address: { city: "New York" } },
    { id: 2, name: "Smith", age: 30, address: { city: "San Francisco" } },
    { id: 3, name: "David", age: 31, address: { city: "San Francisco" } },
    { id: 4, name: "Miller", age: 32, address: { city: "San Francisco" } },
    { id: 5, name: "Parker", age: 27, address: { city: "San Francisco" } },
    { id: 6, name: "William", age: 24, address: { city: "San Francisco" } },
    { id: 7, name: "Johny", age: 32, address: { city: "San Francisco" } },
    { id: 8, name: "Peter", age: 30, address: { city: "San Francisco" } },
    { id: 9, name: "Jack", age: 19, address: { city: "San Francisco" } },
    { id: 10, name: "Johnson", age: 24, address: { city: "San Francisco" } },
    // More rows...
  ];

  const searchHandleChange = (value) => {
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
      <Table
        columns={columns}
        rows={rows || []}
        tableWidth="100%"
        tableHeight="70vh"
        enableClientSidePagination={true}
        count={rows.length}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        rowsPerPage={rowsPerPage}
        setRowsPerPage={setRowsPerPage}
        selectedRows={selectedRows}
        setSelectedRows={setSelectedRows}
        searchKey="name"
        searchValue={searchValue}
        searchHandleChange={searchHandleChange}
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

```
## Advanced Usage with API Integration

Here’s an example of how to integrate `Table` with an API to fetch data:

```jsx
import React, { useEffect, useState } from "react";
import Table from "react-lite-table";

const App: React.FC = () => {
  const [list, setList] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(20);
  const [selectedRow, setSelectedRow] = useState(null);
  const [selectedRows, setSelectedRows] = useState([]);
  const [searchValue, setSearchValue] = useState("");

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
      truncate: {
        enable: true,
        length: 40,
      },
    },
    {
      id: "thumbnail__alt_text",
      label: "Description",
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
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="20px" // Adjusting the height
                viewBox="0 96 960 960"
                width="20px" // Adjusting the width
              >
                <path d="M480 856q-25 0-42.5-17.5T420 796q0-25 17.5-42.5T480 736q25 0 42.5 17.5T540 796q0 25-17.5 42.5T480 856Zm0-240q-25 0-42.5-17.5T420 556q0-25 17.5-42.5T480 496q25 0 42.5 17.5T540 556q0 25-17.5 42.5T480 616Zm0-240q-25 0-42.5-17.5T420 316q0-25 17.5-42.5T480 256q25 0 42.5 17.5T540 316q0 25-17.5 42.5T480 376Z" />
              </svg>
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
      `https://api.artic.edu/api/v1/artworks/search?q=&limit=${rowsPerPage}&page=${currentPage}&q=${searchValue}`
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
      <Table
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
        searchKey="thumbnail__alt_text"
        searchValue={searchValue}
        searchHandleChange={searchHandleChange}
      />
    </div>
  );
};

export default App;

```

## Table Properties

### `rows`

- **Type**: `any[]`
- **Default**: `[]`
- **Description**: The data to display in the table. Each item is an object representing a row.

### `columns`

- **Type**: `{ id: string; label: string; truncate?: { enable: boolean; length: number; }; render?: (row: any) => any; }[]`
- **Default**: `[]`
- **Description**: Defines the columns of the table. Each column object should include `id`, `label`, `truncate`, and `render` properties.

### `tableWidth`

- **Type**: `string`
- **Default**: `100%`
- **Description**: Width of the table container.

### `tableHeight`

- **Type**: `string`
- **Default**: `70vh`
- **Description**: Height of the table container.

### `tableContainerStyle`

- **Type**: `CSSProperties`
- **Default**: `{}`
- **Description**: Custom styles for the table container.

### `tableHeaderStyle`

- **Type**: `CSSProperties`
- **Default**: `{}`
- **Description**: Custom styles for the table header.

### `tableFooterStyle`

- **Type**: `CSSProperties`
- **Default**: `{}`
- **Description**: Custom styles for the table footer.

### `enableStickyHeader`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to keep the table header fixed while scrolling.

### `enablePagination`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to enable pagination controls.

### `enableClientSidePagination`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to handle pagination on the client side.

### `count`

- **Type**: `number`
- **Default**: `0`
- **Description**: Total number of rows, used for server-side pagination.

### `currentPage`

- **Type**: `number`
- **Default**: `1`
- **Description**: The current page number for pagination.

### `setCurrentPage`

- **Type**: `Dispatch<number>`
- **Description**: Function to update the current page number.

### `enableRowsPerPage`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to enable the option to select rows per page.

### `rowsPerPage`

- **Type**: `number`
- **Default**: `20`
- **Description**: Number of rows per page.

### `setRowsPerPage`

- **Type**: `React.Dispatch<React.SetStateAction<number>>`
- **Description**: Function to update the number of rows per page.

### `rowsPerPageOptions`

- **Type**: `number[]`
- **Default**: `[]`
- **Description**: Options for selecting the number of rows per page.

### `enableSelectionRows`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to enable row selection.

### `selectedRows`

- **Type**: `Array<string | number>`
- **Default**: `[]`
- **Description**: Array of selected row IDs.

### `setSelectedRows`

- **Type**: `React.Dispatch<React.SetStateAction<Array<string | number>>>`
- **Default**: `() => {}`
- **Description**: Function to update the selected rows.

### `enableSorting`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to enable column sorting.

### `enableSearch`

- **Type**: `boolean`
- **Default**: `true`
- **Description**: Whether to display the search box.

### `searchKey`

- **Type**: `string`
- **Default**: `""`
- **Description**: Key for nested search (use `__` for nested fields).

### `searchValue`

- **Type**: `string`
- **Default**: `""`
- **Description**: The current value of the search input.

### `searchHandleChange`

- **Type**: `(value: string) => void`
- **Description**: Function to handle changes in the search input.

### `enableCustomNoDataComponent`

- **Type**: `boolean`
- **Default**: `false`
- **Description**: Whether to use a custom component when there is no data.

### `customNoDataComponent`

- **Type**: `() => ReactNode`
- **Default**: `() => <></>`
- **Description**: Function to render a custom no data component.
