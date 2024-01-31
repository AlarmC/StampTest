import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useTable, usePagination, useRowSelect, useSortBy } from "react-table";
import styles from "./../styles/admin.module.css";

function CustomMainTable({ columns, data, chkValue, setChkValue, linkData }) {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    rows,
    //   canPreviousPage,
    //   canNextPage,
    pageOptions,
    pageCount, // 총 페이지
    gotoPage,
    //   nextPage,
    //   previousPage,
    //   setPageSize,
    state: { pageIndex, pageSize }, // pageIndex : 현재 페이지( 0 ~ 총페이지-1 ex) 1페이지 : 0 )
  } = useTable(
    { columns, data, initialState: { pageIndex: 0, pageSize: 10} },
    useSortBy,
    usePagination,
    useRowSelect,
    (hooks) => {
      hooks.visibleColumns.push((columns) => [
        {
          id: "selection",
          // getToggleAllPageRowsSelectedProps : 페이지에 보여지는 row 전체 선택
          // getToggleAllRowsSelectedProps : 모든 row 전체 선택
          Header: ({ getToggleAllPageRowsSelectedProps }) => (
            <div>
              <IndeterminateCheckbox {...getToggleAllPageRowsSelectedProps()} page={page}/>
            </div>
          ),
          Cell: ({ row }) => (
            <div>
              <IndeterminateCheckbox {...row.getToggleRowSelectedProps()} row={row}/>
            </div>
          ),
        },
        ...columns,
      ]);
    }
  );


  const setupValue = (e) => {
    let data = e.target.value;
    if (e.target.checked) {
      setChkValue([...chkValue, data]);
    } else {
      setChkValue(chkValue.filter((value) => value !== data));
    }
  }

  const setupAllValue = (e) => {
    let arr = page.map((item) => item.original.no);
    if (e.target.checked) {
      setChkValue([...arr])
    } else {
      setChkValue([]);
    }
  }

  const sendData = (data) => {
    linkData(data);
  }

  //체크박스 옵션
  const IndeterminateCheckbox = forwardRef(
    ({ row, rows, indeterminate, ...rest }, ref) => {
      const defaultRef = useRef();
      const resolvedRef = ref || defaultRef;

      useEffect(() => {
        if (resolvedRef.current) {
          resolvedRef.current.indeterminate = indeterminate;
        }
      }, [resolvedRef, indeterminate]);
      
      return (
        <>
        {row != undefined ?
          <input
            type="checkbox"
            ref={resolvedRef}
            {...rest}
            style={{ width: "32px" }}
            value={row.original.no}
            onClick={setupValue}
          />
        :
          <input
            id="hd_chk"
            type="checkbox"
            ref={resolvedRef}
            {...rest}
            style={{ width: "32px" }}
            onClick={setupAllValue}
          />
        }
        </>
      );
    }
  );

  useEffect(() => {}, [pageIndex]);

  return (
    <>
      <table
        className="table_style"
        {...getTableProps()}
        style={{ width: "100%", textAlign :"center" }}
      >
        <thead style={{ borderTop: "1px solid black", borderBottom:"1px solid black", height: "48px", fontSize:"16px", color:"#7f7f7f"}}>
          {headerGroups.map((headerGroup) => (
            <tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <th {...column.getHeaderProps()}>{column.render("Header")}</th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody {...getTableBodyProps()}>
          {page.map((row) => {
            prepareRow(row);
            return (
              <tr {...row.getRowProps()} className="table_row" style={{borderBottom: "1px solid rgb(224,224,224)", height:"50px"}}
              >
                {row.cells.map((cell, index) => {
                  if(index ===0){
                    return (
                      <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                    )
                  } else {
                    return (
                      <td style={{cursor:"pointer"}} {...cell.getCellProps()} onDoubleClick={() => sendData(row.original)}>{cell.render("Cell")}</td>
                    )
                  }
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.table_pagination} style={{textAlign:"center"}}>
        {pageIndex >= 10 && (
          <button onClick={() => gotoPage(Math.floor(pageIndex / 10) * 10 - 1)}>
            {"<"}
          </button>
        )}
        {pageOptions.map((page, index) => {
          if (pageIndex < 10 && index < 10) {
            return (
              <button
                key={index}
                onClick={() => gotoPage(index)}
                style={{
                  fontWeight: pageIndex === index ? "bold" : "normal",
                }}
              >
                {index + 1}
              </button>
            );
          } else if (pageIndex >= 10) {
            const currentPageGroup = Math.floor(pageIndex / 10); // 현재 페이지 그룹 번호 계산
            const startPageIndex = currentPageGroup * 10; // 현재 페이지 그룹의 첫 번째 페이지 인덱스
            const endPageIndex = Math.min(startPageIndex + 10, pageCount); // 현재 페이지 그룹의 마지막 페이지 인덱스
            if (index >= startPageIndex && index < endPageIndex) {
              return (
                <button
                  key={index}
                  onClick={() => gotoPage(index)}
                  style={{
                    fontWeight: pageIndex === index ? "bold" : "normal",
                  }}
                >
                  {index + 1}
                </button>
              );
            }
          }
          return null;
        })}
        {Math.floor(pageIndex / 10) < Math.floor(pageCount / 10) && (
          <button onClick={() => gotoPage(Math.floor(pageIndex / 10 + 1) * 10)}>
            {">"}
          </button>
        )}
      </div>
    </>
  );
}

export default CustomMainTable;
