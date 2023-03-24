import React, { useMemo } from "react";
import { useTable, useGlobalFilter, usePagination } from "react-table";

const GlobalFilter = ({ globalFilter, setGlobalFilter }) => {
  return (
    <div>
      <input
        className="form-control"
        value={globalFilter || ""}
        onChange={(e) => setGlobalFilter(e.target.value || undefined)}
        placeholder="Procurar..."
      />
    </div>
  );
};

const Pagination = (props) => {
  return (
    <div className="pagination-container ms-2 d-flex">
      <ul className="pagination">
        <li className={`page-item ${!props.canPreviousPage && `disabled`}`}>
          <button className={`page-link`} onClick={() => props.previousPage()} disabled={!props.canPreviousPage}>
            Anterior
          </button>
        </li>
        {Array.from(Array(props.pageCount).keys()).map((page, index) => (
          <li className={`page-item ${page === props.pageIndex && `disabled`}`} key={`page-${index + 1}`}>
            <button
              className="page-link"
              onClick={() => {
                props.gotoPage(page);
              }}
            >
              {page + 1}
            </button>
          </li>
        ))}
        <li className={`page-item ${!props.canNextPage && `disabled`}`}>
          <button className="page-link" onClick={() => props.nextPage()}>
            Próxima
          </button>
        </li>
      </ul>
      {/* <span>
        | Go to page:{" "}
        <input
          type="number"
          className="form-control"
          defaultValue={props.pageIndex + 1}
          onChange={(e) => {
            const page = e.target.value ? Number(e.target.value) - 1 : 0;
            props.gotoPage(page);
          }}
          style={{ width: "100px" }}
        />
      </span>{" "}
      <select
        value={props.pageSize}
        className="form-select"
        onChange={(e) => {
          props.setPageSize(Number(e.target.value));
        }}
      >
        {[5, 10, 20, 30, 40, 50].map((pageSize) => (
          <option key={pageSize} value={pageSize}>
            Show {pageSize}
          </option>
        ))}
      </select> */}
    </div>
  );
};

const Table = ({ data, columns }) => {
  const memoData = useMemo(() => data, [data]);
  const memoColumns = useMemo(() => columns || Object.keys(data[0]).map((header) => ({ Header: header, accessor: header })), [columns, data]);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    state: { globalFilter, pageIndex, pageSize },
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    setGlobalFilter,
  } = useTable({ columns: memoColumns, data: memoData, initialState: { pageIndex: 0, pageSize: 5 } }, useGlobalFilter, usePagination);

  const filteredRows = rows.filter((row) =>
    Object.values(row.values).some((cellValue) =>
      String(cellValue)
        .toLowerCase()
        .includes((globalFilter || "").toLowerCase())
    )
  );

  return (
    <div className="table-responsive">
      <div className="d-flex my-2 mx-1">
        <GlobalFilter globalFilter={globalFilter} setGlobalFilter={setGlobalFilter} />
        <Pagination
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageIndex={pageIndex}
          pageCount={pageCount}
          pageSize={pageSize}
          pageOptions={pageOptions}
          gotoPage={gotoPage}
          nextPage={nextPage}
          previousPage={previousPage}
          setPageSize={setPageSize}
        />
      </div>
      <table className="table table-striped" {...getTableProps()}>
        <thead>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th
                  {...column.getHeaderProps([
                    {
                      className: column.className, // pay attention to this
                      style: column.style,
                      // set here your other custom props
                    },
                  ])}
                >
                  {column.render("Header")}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {filteredRows.length > 0 ? (
            page.map((row, i) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()}>
                  {row.cells.map((cell) => {
                    return (
                      <td
                        {...cell.getCellProps([
                          {
                            className: cell.column.className, // pay attention to this
                            style: cell.column.style,
                            // set here your other custom props
                          },
                        ])}
                      >
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan={memoColumns.length}>Nenhum resultado encontrado.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
