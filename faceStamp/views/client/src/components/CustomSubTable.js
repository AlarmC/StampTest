import React, { useEffect } from "react";
import { useTable, usePagination, useRowSelect, useSortBy } from "react-table";


const CustomSubTable = ({ columns, data }) => {
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        prepareRow,
        rows,
        state: { pageIndex, pageSize }, // pageIndex : 현재 페이지( 0 ~ 총페이지-1 ex) 1페이지 : 0 )
    } = useTable(
        { columns, data, initialState: { pageIndex: 0, pageSize: 10} },
        useSortBy,
        usePagination,
        useRowSelect,
    );



    return (
        <>
            <table className="event_log" {...getTableProps()}>
                <thead>
                {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                        {headerGroup.headers.map((column) => (
                            <th {...column.getHeaderProps()}>{column.render("Header")}</th>
                        ))}
                    </tr>
                ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                        {row.cells.map((cell) => (
                            <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                        ))}
                        </tr>
                    );
                    })}
                </tbody>
                {/* <tbody {...getTableBodyProps()}>
                {page.map((row) => {
                    prepareRow(row);
                    return (
                        <tr {...row.getRowProps()}>
                            {row.cells.map((cell, index) => {
                                if(index ===0){
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    )
                                } else {
                                    return (
                                        <td {...cell.getCellProps()}>{cell.render("Cell")}</td>
                                    )
                                }
                            })}
                        </tr>
                    );
                })}
                </tbody> */}
            </table>
            {/* <div style={{textAlign:"center"}}>
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
                            margin: "0 3px",
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
                                    margin: "0 3px",
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
            </div> */}
        </>
    );
}

export default CustomSubTable;