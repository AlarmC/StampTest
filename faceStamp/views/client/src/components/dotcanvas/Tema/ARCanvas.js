import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from 'react-icons/bi';
import { IoIosHome } from 'react-icons/io';
import domtoimage from 'dom-to-image-more';
import { Scrollbars } from 'react-custom-scrollbars'
import Swal from "sweetalert2";
import style from "./../../../styles/custom.module.css";
import { FaStamp } from 'react-icons/fa';
import { TfiPrinter } from 'react-icons/tfi'
import { AiOutlineDeliveredProcedure } from 'react-icons/ai';
import * as CommonAxios from "./../../CommonAxios";
import arImg from '../../../assets/arstamp/arImage'
import ReactToPrint from "react-to-print";
import ARKonva from './ARKonva';
import TestARKonva from './TestARKonva';

const ARCanvas = () => {

    const navigate = useNavigate();

    const { user, dotinfo } = useSelector(({ user, dotinfo }) => ({
        user: user.user,
        dotinfo: dotinfo.dotinfo,
    }));

    useEffect(() => {
        if(user == null){
            navigate("/dotlogin");
        }
    }, [])

    const [settingSize, setSize ] = useState(450);      // 선택된 사이즈별 중앙 원의 크기
    const [mgSize, setMgSize] = useState(0);            // 선택된 사이즈별 중앙 원의 padding 및 margin값

    // 선택한 도장 사이즈에 맞도록 사이즈 계산
    useEffect(() => {
        if(dotinfo != undefined){
            let data = parseInt(dotinfo.size*10);
            let minus = 450 - data;
            setSize(data);
            setMgSize(minus/2);
        }
    }, [dotinfo])

    const [testShape, setTestShape] = useState(null);           // 도장 유형 데이터
    const [selectShape, setSelectShape] = useState(null);       // 도장 유형 적용 데이터
    const [testNum, setTestNum] = useState(0);

    const [testData, setTestData] = useState([]);
    const [imgArr, setImgArr] = useState([]);                   // 실질적 이미지+도장유형 배열
    const [imgNo, setImgNo] = useState(0);                      // 이미지 고유 번호

    // 도장 유형 취소
    const cancelShape = () => {
        setTestData([]);
        setTestShape(null);
    }
    // 도장 유형 적용
    const submitShape = () => {
        setSelectShape(testShape);
        setTestShape(null);
        setTestData([]);
    }

    // 도장 유형 선택시
    useEffect(() => {
        if(testShape != null){
            let no = testNum + 1;
            let data = {
                id: "test_" + no,
                img: testShape,
                type: "img"
            }
            setTestData([data]);
            setTestNum(testNum+1);
        }
    }, [testShape])

    // 도장 유형 선택 후 적용
    useEffect(() => {
        if(selectShape != null){
            let no = imgNo + 1;
            let data = {
                id: "shape_" + no,
                img: selectShape,
                no: imgNo+1,
                type: "img"
            }
            setImgNo(imgNo+1);
            setImgArr([...imgArr, data]);
            setSelectShape(null);
        }
    }, [selectShape])

    const [imageChg, setImageChg] = useState(false)

    const canvRef = useRef(null);
    const bgRef = useRef(null);
    const compRef = useRef(null);
    const printRef = useRef();
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [imgClick, setImgClick] = useState(false);

    const [imgModify, setImgModify] = useState(false);

    const [imgLoad, setImgLoad] = useState(false);
    
    const [beforeImg, setBeforeImg] = useState(null);
    const [convtImg, setConvtImg] = useState(null);
    const [convtSwtch, setConvtSwtch] = useState(false);

    const [selectObj, setSelectObj] = useState(null);
    const [cvtData, setCvtData] = useState(null);

    const [compImg, setCompImg] = useState(null);

    const [insertNum, setInsertNum] = useState(null);


    useEffect(() => {}, [convtSwtch, imgLoad, compImg, imgArr, mgSize])




    // 페이스도장 변환 시작
    const convertImg = () => {
        // setImgModify(true);
        if(imgArr.length > 0){
            setCvtData(1);
            setImageChg(false)
            setConvtSwtch(true);
            Swal.fire({
                text: '이미지 변환 중입니다',
                showConfirmButton: false,
                showCancelButton: false,
            });
            Swal.showLoading();
        } else {
            Swal.fire({
                text: '이미지 변환 중입니다',
                showConfirmButton: false,
                showCancelButton: false,
            });
            Swal.showLoading();
            // imgPixelate("comp");
        }
    }
    // dom-to-image-more 이용
    // const imgPixelate = (type) => {
    //     // 변환후 전체 포함한 이미지 스크린샷
    //     if(type == "comp"){
    //         const bgNode = compRef.current;
    //         const origin = bgNode.style.margin;
    //         bgNode.style.margin = "0";
    //         // domtoimage.toPng 메소드를 사용하여 이미지를 캡처합니다.
    //         domtoimage.toPng(bgNode)
    //             .then((dataUrl) => {
    //                 let data = {
    //                     id: "last",
    //                     img: dataUrl,
    //                     no: imgNo+1,
    //                 }
    //                 setBeforeImg(null);
    //                 setImgNo(imgNo+1);
    //                 setImgArr([...imgArr, data]);
    //                 bgNode.style.margin = origin;
    //             })
    //             .catch((error) => {
    //                 // 이미지 캡처에 실패한 경우 이곳에서 오류 처리를 합니다.
    //                 console.error('Image capture failed:', error);
    //             });
    //     // 변환전 이미지 스크린샷
    //     } else if(type == "before"){
    //         const bgNode = bgRef.current;
    //         // domtoimage.toPng 메소드를 사용하여 이미지를 캡처합니다.
    //         domtoimage.toPng(bgNode)
    //             .then((dataUrl) => {
    //                 // 이미지를 성공적으로 캡처한 경우 dataUrl이 반환됩니다.
    //                 // dataUrl을 사용하여 이미지를 처리하거나 표시합니다.
    //                 // if(type == "comp"){
    //                 //     setCompImg(dataUrl);
    //                 //     Swal.close();
    //                 // } else {
    //                 // }
    //                 setConvtImg(dataUrl);
    //             })
    //             .catch((error) => {
    //                 // 이미지 캡처에 실패한 경우 이곳에서 오류 처리를 합니다.
    //                 console.error('Image capture failed:', error);
    //             });
    //     } else {
    //         setBeforeImg(type);
    //     }
    // }

    const endEvent = (type) => {
        console.log(type);
        if(type == "success"){
            Swal.fire({
                title: "업데이트 완료",
                icon: "success",
                confirmButtonText: "확인",
                }).then((res) => {
                    if (res.isConfirmed) {
                        Swal.close();
                    }
                });
        } else {
            Swal.close();
        }
    }


    const uptObj = (data) => { setSelectObj(data) }

    const sendStamp = () => {

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
                                list_no : insertNum,
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

    const [printImg, setPrintImg] = useState(null);

    const catchImg = (data) => {
        setPrintImg(data);
    }


    return (
        <>
            <div className={style.dot_left_menu}>
            {convtSwtch == false &&
            <>
                <hr></hr>
                <div className={style.dot_menu_title}>AR 도장</div>
                <div className={style.dot_shape_div} style={{height: "480px"}}>
                    <Scrollbars thumbsize={125}>
                        <img src={arImg.img1} onClick={() => setTestShape(arImg.img1)} />
                        <img src={arImg.img2} onClick={() => setTestShape(arImg.img2)} />
                        <img src={arImg.img3} onClick={() => setTestShape(arImg.img3)} />
                        <img src={arImg.img4} onClick={() => setTestShape(arImg.img4)} />
                        <img src={arImg.img5} onClick={() => setTestShape(arImg.img5)} />
                        <img src={arImg.img6} onClick={() => setTestShape(arImg.img6)} />
                        <img src={arImg.img7} onClick={() => setTestShape(arImg.img7)} />
                        <img src={arImg.img8} onClick={() => setTestShape(arImg.img8)} />
                        <img src={arImg.img9} onClick={() => setTestShape(arImg.img9)} />
                        <img src={arImg.img10} onClick={() => setTestShape(arImg.img10)} />
                        <img src={arImg.img11} onClick={() => setTestShape(arImg.img11)} />
                        <img src={arImg.img12} onClick={() => setTestShape(arImg.img12)} />
                        <img src={arImg.img13} onClick={() => setTestShape(arImg.img13)} />
                        <img src={arImg.img14} onClick={() => setTestShape(arImg.img14)} />
                        <img src={arImg.img15} onClick={() => setTestShape(arImg.img15)} />
                        <img src={arImg.img16} onClick={() => setTestShape(arImg.img16)} />
                        <img src={arImg.img17} onClick={() => setTestShape(arImg.img17)} />
                        <img src={arImg.img18} onClick={() => setTestShape(arImg.img18)} />
                        <img src={arImg.img19} onClick={() => setTestShape(arImg.img19)} />
                        <img src={arImg.img20} onClick={() => setTestShape(arImg.img20)} />
                        <img src={arImg.img21} onClick={() => setTestShape(arImg.img21)} />
                        <img src={arImg.img22} onClick={() => setTestShape(arImg.img22)} />
                        <img src={arImg.img23} onClick={() => setTestShape(arImg.img23)} />
                        <img src={arImg.img24} onClick={() => setTestShape(arImg.img24)} />
                        <img src={arImg.img25} onClick={() => setTestShape(arImg.img25)} />
                        <img src={arImg.img26} onClick={() => setTestShape(arImg.img26)} />
                        <img src={arImg.img27} onClick={() => setTestShape(arImg.img27)} />
                        <img src={arImg.img28} onClick={() => setTestShape(arImg.img28)} />
                    </Scrollbars>
                </div>
                <div className={style.dot_shape_btn_area}>
                    <button onClick={() => cancelShape()}>취 소</button>
                    <button onClick={() => submitShape()}>적 용</button>
                </div>
            </>
            }
            </div>
            <div className={style.canvas_area} style={{minWidth: "700px", minHeight: "700px", padding:"125px", position:"relative"}}>
                <div className={style.stamp_canvas} ref={compRef} style={{width:`${settingSize}px`, height: `${settingSize}px`, padding:`${mgSize}px`}}>
                    
                    <div className={style.clip_path_area} ref={bgRef} style={imgModify ? {overflow: "unset", width:`${settingSize}px`, height:`${settingSize}px`} : (imgClick ? {overflow: "hidden", width:`${settingSize}px`, height:`${settingSize}px`} : {overflow: "hidden", pointerEvents:"none", width:`${settingSize}px`, height:`${settingSize}px`})}>
                        
                    </div>
                    {/* <div className={style.stamp_div} style={imgModify ? {filter:"contrast(0.1)", width:`${settingSize}px`, height:`${settingSize}px`, marginTop:`${mgSize}px`} : { width:`${settingSize}px`, height:`${settingSize}px`, marginTop:`${mgSize}px`}}  ref={photoRef}>
                        {testShape ?
                            <img src={testShape} />
                            :
                            (selectShape &&
                                <img src={selectShape} />
                            )
                        }
                    </div> */}
                </div>
                <div className={style.chg_dom} ref={canvRef} 
                    style={convtSwtch == false ? 
                        {filter:`grayscale(1)`} 
                    : null}
                >
                    {testShape == null &&
                    <>
                        <ARKonva 
                            pos={position} arrData={imgArr} showSize={settingSize}
                            objValue={selectObj} uptObj={uptObj} bgChg={imgClick} former={imgModify}
                            convert={cvtData} users={user} endEvt={endEvent}
                            sendImg={catchImg}
                        />
                        <div className='dot_print_area'>
                            <div className='dot_preview_dom' ref={printRef} style={
                                dotinfo.size == 45 ? {width:"186px", height:"186px"} : 
                                (dotinfo.size == 38 ? {width:"159px", height:"159px"} : 
                                (dotinfo.size == 26 ? {width:"114px", height:"114px"} :
                                (dotinfo.size == 23 ? {width:"103px", height:"103px"} :
                                (dotinfo.size == 18 ? {width:"84px", height:"84px"} :
                                {width:"76px", height:"76px"}))))}>
                                    {printImg != null &&
                                    <img src={printImg} style={
                                        dotinfo.size == 45 ? {width:"170px", height:"170px"} : 
                                        (dotinfo.size == 38 ? {width:"143px", height:"143px"} : 
                                        (dotinfo.size == 26 ? {width:"98px", height:"98px"} :
                                        (dotinfo.size == 23 ? {width:"87px", height:"87px"} :
                                        (dotinfo.size == 18 ? {width:"68px", height:"68px"} :
                                        {width:"60px", height:"60px"}))))} 
                                    />
                                    }
                            </div>
                        </div>
                    </>
                    }
                </div>
                <div className={style.chg_dom} style={{pointerEvents:"none"}}>
                    <TestARKonva arrData={testData} showSize={settingSize} />
                </div>
            </div>
            <div className={style.dot_right_menu}>
                <Link to="/">
                    <div className={style.btn_area}>
                        <div className={style.btn_circle}>
                            <IoIosHome size={30} color={"white"} />
                        </div>
                        <div>메인으로</div>
                    </div>
                </Link>
                <Link to="/dotset/tema">
                    <div className={style.btn_area}>
                        <div className={style.btn_circle}>
                            <BiArrowBack size={30} color={"white"} />
                        </div>
                        <div>이전으로</div>
                    </div>
                </Link>
                <div className={style.dot_tema_menu_title}>
                    <hr></hr>
                    <div>도장 편집하기</div>
                </div>
                {convtSwtch == false ? 
                <>
                    <div className={style.dot_btn_area}>
                        <div className={style.dot_btn_div} onClick={convertImg}>
                            <div className={style.dot_menu_btn} style={{background: "red"}}>
                                <FaStamp size="50" color="white" />
                            </div>
                            <div style={{color:"red", margin: "10px auto"}}>페이스도장 변환</div>
                        </div>
                    </div>
                </>
                :
                (user && user.ur_mode == 1 ?
                    <>
                        <div className='dot_btn_area' style={{justifyContent : "normal", position:"fixed", bottom: "50px", right:"10px"}}>
                            <div className='dot_btn_div' onClick={()=> sendStamp()}>
                                <div className='dot_menu_btn' style={{background: "red"}}>
                                    <AiOutlineDeliveredProcedure size="60" color="white" />
                                </div>
                                <div style={{color:"red", margin: "10px auto"}}>도장 전송하기</div>
                            </div>
                        </div>
                    </>
                :
                    <>
                        <div className='dot_btn_area' style={{justifyContent : "normal", position:"fixed", bottom: "50px", right:"10px"}}>
                            <ReactToPrint trigger={()=>
                                <div className='dot_btn_div'>
                                    <div className='dot_menu_btn' style={{background: "red"}}>
                                        <TfiPrinter size="60" color="white" />
                                    </div>
                                    <div style={{color:"red", margin: "10px auto"}}>도장 출력하기</div>
                                </div>}
                                content={() => printRef.current}
                            />
                        </div>
                    </>
                )}
            </div>
        </>
    );


    

}

export default ARCanvas;