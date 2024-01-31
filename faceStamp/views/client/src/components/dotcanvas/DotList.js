import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import styles from "./../../styles/list.module.css";
import { useDispatch, useSelector } from "react-redux";
import { getList } from '../../modules/list';
import * as CommonAxios from "./../CommonAxios";

const DotList = () => {

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const { user, list } = useSelector(({ user, list }) => ({
        user: user.user,
        list: list.list,
    }));


    useEffect(() => {
        if(user != null){
            let data = {
                id: user.ur_id
            }
            dispatch(getList(data));
        }
    }, [])


    useEffect(() => {
    }, [list])

    const [currentPage, setCurrentPage] = useState(1);
    const [showItems, setShowItems] = useState(10);

    const [insertNum, setInsertNum] = useState(null);


    // 현재 페이지에 보여줄 아이템들을 반환
    const getCurrentItems = () => {
        const startIndex = (currentPage - 1) * showItems;
        const endIndex = Math.min(startIndex + showItems, list.length);
        return list.slice(startIndex, endIndex);
    };

    // 페이지 숫자를 최대 다섯 개까지 보여주기 위한 함수
    const getPageNumbers = () => {
        const totalPageCount = Math.ceil(list.length / showItems);
        if (totalPageCount <= 5) {
        return Array.from({ length: totalPageCount }, (_, index) => index + 1);
        } else {
        const leftBoundary = Math.max(1, currentPage - 2);
        const rightBoundary = Math.min(totalPageCount, currentPage + 2);

        if (currentPage <= 3) {
            return Array.from({ length: 5 }, (_, index) => index + 1);
        } else if (currentPage >= totalPageCount - 2) {
            return Array.from({ length: 5 }, (_, index) => totalPageCount - 4 + index);
        } else {
            return Array.from({ length: 5 }, (_, index) => leftBoundary + index);
        }
        }
    };

    // 페이지 변경을 처리하는 함수
    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    // 이전 페이지로 이동
    const handlePrevPage = () => {
        setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
    };

    // 다음 페이지로 이동
    const handleNextPage = () => {
        setCurrentPage((prevPage) =>
        Math.min(prevPage + 1, Math.ceil(list.length / showItems))
        );
    };
    
    const deleteImage = (noValue) => {
        let sendData ={
            no: noValue,
        }
        let data = {
            id: user.ur_id
        }

        CommonAxios.CommonAxios(
            process.env.REACT_APP_HOSTDONAME + "/api/delete_image_list",
            sendData,
            function (result) {
                if (result.messageinfo.state == "ok") {
                    Swal.fire({
                        icon: 'success',
                        title: '이미지가 삭제되었습니다.',
                        confirmButtonText: '확인',
                    }).then((res) => {
                        if(res.isConfirmed){
                            dispatch(getList(data));
                        }
                    })
                } else {

                }
            }
        );
    }

    const sendStamp = (noValue) => {


        let sendData = {
        }

        CommonAxios.CommonAxios(
            process.env.REACT_APP_HOSTDONAME + "/api/select_charged_list",
            sendData,
            function (result) {
                if (result.messageinfo.state == "ok") {
                    var getData = result.messageinfo.message;
                    let nameArr = getData.map(data => ({value: data.no , text: data.user_name}));

                    Swal.fire({
                        title: "전달받을 회원을 선택해주세요.",
                        input: "select",
                        inputOptions: {
                            ...nameArr.reduce((acc, option) => {
                                acc[option.value] = option.text;
                                return acc;
                            }, {})
                        }, 
                        inputPlaceholder: '선택해주세요.',
                        showCancelButton: "true",
                        cancelButtonText: "취소",
                    }).then(result => {
                        if(result.isConfirmed){
                            const nameValue = result.value;
                            const selectedArr = getData.filter((data) => data.no == nameValue);
                            let sendData2 = {
                                user: selectedArr[0].user_id,
                                list_no : noValue,
                            }
                            sendToCharged(sendData2)

                        }
                    })
                } else {

                }
            }
        );
    }

    const sendToCharged = (data) => {
        CommonAxios.CommonAxios(
            process.env.REACT_APP_HOSTDONAME + "/api/send_list",
            data,
            function (result) {
                if (result.messageinfo.state == "ok") {
                    Swal.fire({
                        title: "전송 성공",
                        icon: 'success',
                        confirmButtonText: "확인",
                    }).then((res) => {
                        if (res.isConfirmed) {
                        }
                    });
                } else {
                    Swal.fire({
                        title: "전송 실패",
                        icon: 'error',
                        confirmButtonText: "확인",
                    }).then((res) => {
                        if (res.isConfirmed) {
                        }
                    });
                }
            }
        );
    }

    return(
        <div className={styles.list_container}>
            <div className={styles.list_header}>
                <div className={styles.list_header_title}>
                    <span>도장리스트 {">"} 제작물 리스트</span>
                </div>
            </div>
            <div className={styles.list_contents}>
                {list && list.length > 0 && 
                    getCurrentItems().map((item) => {
                        return(
                            <div className={styles.list_image_frame}>
                                <div className={styles.frame_header}>
                                    <div className={styles.frame_image_num}>{item.no}</div>
                                    <button onClick={() => deleteImage(item.no)}>삭 제</button>
                                </div>
                                <div className={styles.frame_contents}>
                                    <div>
                                        <img src={process.env.REACT_APP_HOSTDONAME + `/${item.image_producer}/` + item.image_name} />
                                    </div>
                                </div>
                                <div className={styles.frame_footer}>
                                    <div className={styles.footer_header}>
                                        <div className={styles.footer_header_title}>
                                            {item.image_type == "quick" ? "빠른제작" : "맞춤제작"}
                                        </div>
                                    </div>
                                    <div className={styles.footer_size_area}>
                                        {item.image_type == "quick" ?
                                            <>
                                                <div className={styles.dot_style_circle}>{item.image_style}</div>
                                                <div className={styles.dot_size_circle}>{item.image_size}</div>
                                                <hr></hr>
                                                <span>사이즈/mm</span>
                                            </>
                                            :
                                            <>
                                                <div className={styles.dot_size_circle2}>{item.image_size + "x" +item.image_size}</div>
                                                <hr></hr>
                                                <span>사이즈/mm</span>
                                            </>
                                        }
                                    </div>
                                    {user && user.ur_mode == 1 ?
                                    <button onClick={() => sendStamp(item.no)}>전 송</button>
                                    :
                                    <button onClick={() => navigate("/dotprint")}>출 력</button>
                                    }
                                </div>
                            </div>
                        )
                    })
                }
            </div>
            <div className={styles.list_pagination}>
                {list && list.length > 0 &&
                <>
                    <button onClick={handlePrevPage}>{'<'}</button>
                    {getPageNumbers().map((pageNumber) => (
                        <button
                            key={pageNumber}
                            onClick={() => handlePageChange(pageNumber)}
                            className={currentPage === pageNumber ? styles.selectedPage : ''}
                        >
                            {pageNumber}
                        </button>
                    ))}
                    <button onClick={handleNextPage}>{'>'}</button>
                </>
                }
            </div>
        </div>
    )

}

export default DotList;