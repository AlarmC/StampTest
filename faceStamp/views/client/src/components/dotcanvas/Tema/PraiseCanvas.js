import React, { useRef, useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BiArrowBack } from 'react-icons/bi';
import { IoIosHome } from 'react-icons/io';
import domtoimage from 'dom-to-image-more';
import { Scrollbars } from 'react-custom-scrollbars'
import DotTest2 from './../DotTest2';
import Swal from "sweetalert2";
import style from "./../../../styles/custom.module.css";
import { FaStamp } from 'react-icons/fa';
import { RiImageAddLine } from 'react-icons/ri';
import { LuPipette } from 'react-icons/lu';
import { TfiPrinter } from 'react-icons/tfi'
import { MdToggleOn } from 'react-icons/md';
import { MdToggleOff } from 'react-icons/md';
import { TbArrowBack } from 'react-icons/tb';
import { AiOutlineDeliveredProcedure } from 'react-icons/ai';
import * as CommonAxios from "./../../CommonAxios";
import ProgressBar from '../../bar/ProgressBar';
import praise from '../../../assets/praise/praiseImg';
import ReactToPrint from "react-to-print";
import DrawTemaKonva from './DrawTemaKonva';
import TestTemaKonva from './TestTemaKonva';
import brush from "../../../assets/images/brush.png";
import eraser from "../../../assets/images/eraser.png";

const PraiseCanvas = () => {

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
    const [sizeBool, setSizeBool] = useState(false);    // 사이즈 계산 여부

    // 선택한 도장 사이즈에 맞도록 사이즈 계산
    useEffect(() => {
        if(dotinfo != undefined){
            let data = parseInt(dotinfo.size*10);
            let minus = 450 - data;
            setSize(data);
            setMgSize(minus/2);
            setSizeBool(true);
        }
    }, [dotinfo])

    const [testShape, setTestShape] = useState(null);           // 도장 유형 데이터
    const [selectShape, setSelectShape] = useState(null);       // 도장 유형 적용 데이터
    const [testNum, setTestNum] = useState(0);
    const [clipNum, setClipNum] = useState(100);

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
            }
            setImgNo(imgNo+1);
            setImgArr([...imgArr, data]);
            setSelectShape(null);
        }
    }, [selectShape])

    const [imageChg, setImageChg] = useState(false)

    const [selectedImage, setSelectedImage] = useState(null);   // 이미지 URL 주소
    const inputRef = useRef(null);
    const imgRef = useRef(null);

    // 우측 이미지 업로드시
    useEffect(() => {
        if(selectedImage != null){
            let data = {
                id: "bgimg",
                img: selectedImage,
                no: imgNo+1,
            }
            setImgNo(imgNo+1);
            // 기존에 적용된 도장 유형 or 업로드된 이미지가 있는 경우
            if(imgArr.length>0){
                let filter = imgArr.filter((item) => item.id == "bgimg");
                // 기존에 적용된 이미지가 있는 경우
                if(filter.length > 0){
                    let filter2 = imgArr.filter((item) => item.id != "bgimg");
                    setImgArr([...filter2, data]);
                // 기존에 적용된 이미지가 없는 경우
                } else {
                    setImgArr([...imgArr, data]);
                }
            // 기존에 도장 유형과 업로드된 이미지가 모두 없는 경우
            } else {
                setImgArr([data]);
            }
        }
    }, [selectedImage])

    const canvRef = useRef(null);
    const bgRef = useRef(null);
    const photoRef = useRef(null);
    const compRef = useRef(null);
    const printRef = useRef();
    const [position, setPosition] = useState({ x: 0, y: 0 });

    const [imgClick, setImgClick] = useState(false);

    const [lightValue, setLightValue] = useState(10);           // 이미지 밝기
    const [contrastValue, setContrastValue] = useState(10);     // 이미지 대비

    const [testLight, setTestLight] = useState(10);             // 이미지 밝기 적용 전 데이터
    const [testCon, setTestCon] = useState(10);                 // 이미지 대비 적용 전 데이터

    const [imgModify, setImgModify] = useState(false);

    const [imgSwtch, setImgSwtch] = useState(false);

    const [imgWidth, setImgWidth] = useState(450);
    const [imgHeight, setImgHeight] = useState(450);
    const [imgLoad, setImgLoad] = useState(false);
    
    const [beforeImg, setBeforeImg] = useState(null);
    const [convtImg, setConvtImg] = useState(null);
    const [convtSwtch, setConvtSwtch] = useState(false);

    const [selectObj, setSelectObj] = useState(null);
    const [cvtData, setCvtData] = useState(null);

    const [printBool, setPrintBool] = useState(false);

    const [compImg, setCompImg] = useState(null);

    const [insertNum, setInsertNum] = useState(null);


    useEffect(() => {}, [lightValue, contrastValue, imgHeight, imgWidth, convtSwtch, imgLoad, compImg, imgArr, mgSize])


    const chgLight = (type) => {
        if(type == "+"){
            let data = lightValue + 1;
            if(data > 15){
                data = 15
            }
            setLightValue(data);
        } else if(type == "-"){
            let data = lightValue - 1;
            if(data < 5){
                data = 5
            }
            setLightValue(data);
        }
    }

    const chgContrast = (type) => {
        if(type == "+"){
            let data = contrastValue + 1;
            if(data > 15){
                data = 15
            }
            setContrastValue(data);
        } else if(type == "-"){
            let data = contrastValue - 1;
            if(data < 5){
                data = 5
            }
            setContrastValue(data);
        }
    }

    const uptValue = (result) => {
        if(result[0] == "light"){
            setLightValue(result[1]);
        } else if(result[0] == "contrast") {
            setContrastValue(result[1]);
        } else {
            let data = result[1];
            if(data < 1){
                data = 1;
            } else if(data > 10){
                data = 10;
            }
            setLineWeight(parseInt(data));
        }
    }


    // 이미지 업로드 div 클릭
    const handleDivClick = () => {
        inputRef.current.value = null;
        inputRef.current.click();
    };

    // 이미지 불러오기
    const handleImageUpload = (event) => {
        const file = event.target.files[0];
        const reader = new FileReader();

        reader.onload = () => {
            const imageDataURL = reader.result;
            setSelectedImage(imageDataURL);
        };

        if (file) {
            reader.readAsDataURL(file);
        }
    };

    const [drawingMode, setDrawingMode] = useState(false);      // 그리기 도구 (그림모드 or 지우기모드 둘 중 하나가 on이면 true)
    const [modeName, setModeName] = useState("");               // 그리기 도구명 ( 그림모드 or 지우기모드 )

    const [drawSwtch, setDrawSwtch] = useState(false); // 그림모드or지우기모드 스위치

    const [lineColor, setLineColor] = useState("black");        // 선 색상
    const [lineWeight, setLineWeight] = useState(1);            // 선 굵기

    const [linesToDelete, setLinesToDelete] = useState(0);      // 삭제할 선

    useEffect(() => {
        // if(drawingMode != null){
        // }
        setDrawSwtch(drawingMode)
    }, [drawingMode])

    const zeroCanv = () => {
        setLinesToDelete((prevValue) => prevValue + 1); // 선 하나씩 삭제를 요청
    }


    const chgDrawMode = (data) => {
        if(data == "draw"){
            setDrawingMode(true);
            setModeName("draw");
        } else if(data == "erase"){
            setDrawingMode(true);
            setModeName("erase");
        } else if(data == "off"){
            setDrawingMode(false);
            setModeName("");
        }
    }


    // 페이스도장 변환 시작
    const convertImg = () => {
        // setImgModify(true);
        if(imgArr.length > 0){
            setCvtData(1);
            setImageChg(false)
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
            imgPixelate("comp");
        }
    }
    // dom-to-image-more 이용
    const imgPixelate = (type) => {
        // 변환후 전체 포함한 이미지 스크린샷
        if(type == "comp"){
            const bgNode = compRef.current;
            const origin = bgNode.style.margin;
            bgNode.style.margin = "0";
            // domtoimage.toPng 메소드를 사용하여 이미지를 캡처합니다.
            domtoimage.toPng(bgNode)
                .then((dataUrl) => {
                    let data = {
                        id: "last",
                        img: dataUrl,
                        no: imgNo+1,
                    }
                    setBeforeImg(null);
                    setImgNo(imgNo+1);
                    setImgArr([...imgArr, data]);
                    bgNode.style.margin = origin;
                })
                .catch((error) => {
                    // 이미지 캡처에 실패한 경우 이곳에서 오류 처리를 합니다.
                    console.error('Image capture failed:', error);
                });
        // 변환전 이미지 스크린샷
        } else if(type == "before"){
            const bgNode = bgRef.current;
            // domtoimage.toPng 메소드를 사용하여 이미지를 캡처합니다.
            domtoimage.toPng(bgNode)
                .then((dataUrl) => {
                    // 이미지를 성공적으로 캡처한 경우 dataUrl이 반환됩니다.
                    // dataUrl을 사용하여 이미지를 처리하거나 표시합니다.
                    // if(type == "comp"){
                    //     setCompImg(dataUrl);
                    //     Swal.close();
                    // } else {
                    // }
                    setConvtImg(dataUrl);
                })
                .catch((error) => {
                    // 이미지 캡처에 실패한 경우 이곳에서 오류 처리를 합니다.
                    console.error('Image capture failed:', error);
                });
        } else {
            setBeforeImg(type);
        }
    }

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


    const handleImgClick = (e) => {
        if(selectedImage != null){
            setImgClick(!imgClick);
        } else {
            Swal.fire({
                icon: 'error',
                title: '알림',
                text: '배경 선택에 사용할 이미지를 업로드 해 주세요.',
                confirmButtonText: '확인',
            }).then((res) => {
                if(res.isConfirmed){

                }
            })
        }
            
    }

    const uptObj = (data) => { setSelectObj(data) }
    const uptBg = (data) => { setImgClick(data); }

    // 이미지 사이즈 비율에 맞게 적용
    useEffect(() => {
        if(imgRef.current != null){
            if(sizeBool){
                const { naturalWidth, naturalHeight } = imgRef.current;
                const imgRatio = naturalWidth / naturalHeight;
                console.log(settingSize);
                if(imgRatio > 1){
                    let lengths = settingSize * imgRatio;
                    let pos = (lengths-settingSize)/2;
                    setImgWidth(lengths);
                    setImgHeight(settingSize);
                    setPosition({x: pos, y: 0})
                    // let lengths = 450 / imgRatio;
                    // let pos = (450-lengths)/2;
                    // setImgWidth(settingSize);
                    // setImgHeight(lengths);
                    // setPosition({x: 0, y: pos})
                } else if(imgRatio < 1) {
                    let lengths = settingSize * imgRatio;
                    let pos = (settingSize-lengths)/2;
                    setImgWidth(lengths);
                    setImgHeight(settingSize);
                    setPosition({x: pos, y: 0})
                }
                setImgLoad(true);
            }
        }
    }, [selectedImage, sizeBool])

    useEffect(() => {
        if(beforeImg != null){
            setTimeout(() => {
                imgPixelate("before");
            }, 1000);
        }
    }, [beforeImg])

    useEffect(() => {
        if(convtImg != null){
            setConvtSwtch(true);
            setTimeout(() => {
                imgPixelate("comp");
            }, 1000)
            // Swal.close();
        }
    }, [convtImg])

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
                <div className={style.dot_menu_title}>칭찬 도장</div>
                <div className={style.dot_shape_div} style={{height: "300px"}}>
                    <Scrollbars thumbsize={125}>
                        <img src={praise.img1} onClick={() => setTestShape(praise.img1)} />
                        <img src={praise.img2} onClick={() => setTestShape(praise.img2)} />
                        <img src={praise.img3} onClick={() => setTestShape(praise.img3)} />
                        <img src={praise.img4} onClick={() => setTestShape(praise.img4)} />
                        <img src={praise.img5} onClick={() => setTestShape(praise.img5)} />
                    </Scrollbars>
                </div>
                <div className={style.dot_shape_btn_area}>
                    <button onClick={() => cancelShape()}>취 소</button>
                    <button onClick={() => submitShape()}>적 용</button>
                </div>
                <hr style={{marginTop:"20px"}}></hr>
                <div className={style.dot_menu_title}>그리기 도구</div>
                <div className={style.dot_edit_area}>
                    <div>
                        <div>그림모드</div>
                        <div className={style.dot_edit_toggle}>
                            {drawingMode && modeName == "draw" ?
                                <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => chgDrawMode("off")}/>
                            :
                                <MdToggleOff size={30} onClick={() => chgDrawMode("draw")}/>
                            }
                        </div>
                    </div>
                    <div>
                        <div>색상</div>
                        <div className='dot_color_btn'>
                            <span>검은색</span>
                            <div style={lineColor == "black" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setLineColor("black")} />
                            <span>흰색</span>
                            <div style={lineColor == "white" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setLineColor("white")} />
                        </div>
                    </div>
                    <div className={style.pg_bar}>
                        <span>선굵기</span>
                        <ProgressBar value={lineWeight} min={1} max={10} setValue={uptValue} type={"weight"} />
                    </div>
                    <div>
                        <div>지우기모드</div>
                        <div className={style.dot_edit_toggle}>
                            {drawingMode && modeName == "erase" ?
                                <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => chgDrawMode("off")}/>
                                    :
                                <MdToggleOff size={30} onClick={() => chgDrawMode("erase")}/>
                            }
                        </div>
                    </div>
                    <div>
                        <div>되돌리기</div>
                        <div className={style.dot_edit_button}>
                            <div style={{width:"30px", height:"30px", borderRadius:"50%", border:"1px solid rgb(35,172,160)", background:"white"}}>
                                <TbArrowBack size={24} color={"rgb(35,172,160)"} onClick={() => zeroCanv()}/>
                            </div>
                        </div>
                    </div>
                </div>
            </>
            }
            </div>
            <div className={style.canvas_area} style={{minWidth: "700px", minHeight: "700px", padding:"125px", position:"relative"}}>
                <div className={style.stamp_canvas} ref={compRef} style={{width:`${settingSize}px`, height: `${settingSize}px`, minWidth:`${settingSize}px`, minHeight:`${settingSize}px`, margin:`${mgSize}px`, boxSizing:'border-box'}}>
                    
                    <div className={style.clip_path_area} ref={bgRef} style={imgModify ? {overflow: "unset", width:`${settingSize}px`, height:`${settingSize}px`} : (imgClick ? {overflow: "hidden", width:`${settingSize}px`, height:`${settingSize}px`} : {overflow: "hidden", pointerEvents:"none", width:`${settingSize}px`, height:`${settingSize}px`})}>
                        {convtSwtch == false ?
                            <div className='img_scale' 
                                style={{
                                    width:`${settingSize}px`, height:`${settingSize}px`, position: "relative",
                                }}>
                                <img className='stamp_img' src={selectedImage} ref={imgRef} 
                                    style={imgLoad == false ? {
                                        filter:`grayscale(1) brightness(${imgSwtch ? testLight/10 : lightValue/10}) contrast(${imgSwtch ? testCon/10 : contrastValue/10})`,
                                        height:`${settingSize}px`, display: "none"
                                    }
                                    :
                                    {
                                        filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`,
                                        width:`${settingSize}px`, height:`${settingSize}px`, display: "none"
                                    }}
                                />
                                {beforeImg != null &&
                                    <img className='stamp_img' src={beforeImg}
                                        style={{
                                            filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`,
                                            width:`${settingSize}px`, height:`${settingSize}px`
                                        }}
                                    />
                                }

                            </div>
                        :
                            // 하프톤 작업
                            <div style={clipNum > 100 ? {position:"relative", clipPath: `circle(43% at 50% 43%)`} : {position:"relative", clipPath: `circle(${clipNum}%)`}}>
                                <DotTest2 img={convtImg} startPrint={printBool}/>
                            </div>
                        }
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
                    style={convtSwtch == false ? (drawSwtch ? 
                        (modeName == "draw" ?
                            {cursor: `url(${brush}),auto`, filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`} :
                            {cursor: `url(${eraser}),auto`, filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`}
                        )
                        :
                        {filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`} 
                    )
                    : null}
                >
                    <DrawTemaKonva 
                        sw={imgWidth} sh={imgHeight} pos={position} arrData={imgArr} showSize={settingSize}
                        objValue={selectObj} uptObj={uptObj} bgChg={imgClick} uptBg={uptBg} former={imgModify}
                        convert={cvtData} pixelate={imgPixelate} imgMove={imageChg} users={user} endEvt={endEvent}
                        mode={modeName} bool={drawingMode} color={lineColor} linesDelete={linesToDelete} lineWeight={lineWeight}
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
                </div>
                <div className={style.chg_dom} style={{pointerEvents:"none"}}>
                    <TestTemaKonva arrData={testData} showSize={settingSize} />
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
                        <div className={style.dot_btn_div} onClick={handleDivClick}>
                            <div className={style.dot_menu_btn} style={{background: "rgb(35,172,160)"}}>
                                <RiImageAddLine size="50" color="white" />
                                <input style={{display:"none"}} type="file" ref={inputRef} accept="image/*" onChange={handleImageUpload} />
                            </div>
                            <div style={{color:"rgb(35,172,160)", margin: "10px auto"}}>이미지 업로드</div>
                        </div>
                        <div className={style.dot_btn_div} onClick={handleImgClick}>
                            <div className={style.dot_menu_btn} style={imgClick ? {background:"rgb(91, 91, 91)"} : {background:"white"}}>
                                <LuPipette size="50" color={imgClick ? "white" : "rgb(91, 91, 91)"} />
                            </div>
                            <div style={{margin: "10px auto"}}>배경색 변경</div>
                        </div>
                        <div className={style.dot_btn_div} onClick={convertImg}>
                            <div className={style.dot_menu_btn} style={{background: "red"}}>
                                <FaStamp size="50" color="white" />
                            </div>
                            <div style={{color:"red", margin: "10px auto"}}>페이스도장 변환</div>
                        </div>
                    </div>
                    {selectedImage != null &&
                    <>
                        <div className={style.dot_tema_menu_title}>
                            <hr></hr>
                            <div>밝기/대비 조정</div>
                        </div>
                        <div className={style.dot_tema_pg_area}>
                            <div className={style.pg_line}>
                                <span>밝기</span>
                                <button onClick={()=>chgLight("-")}>-</button>
                                <ProgressBar value={lightValue} min={5} max={15} setValue={uptValue} type={"light"} />
                                <button onClick={()=>chgLight("+")}>+</button>
                            </div>
                            <div className={style.pg_line}>
                                <span>대비</span>
                                <button onClick={()=>chgContrast("-")}>-</button>
                                <ProgressBar value={contrastValue} min={5} max={15} setValue={uptValue} type={"contrast"} />
                                <button onClick={()=>chgContrast("+")}>+</button>
                            </div>
                            <div className={style.pg_line}>
                                <span>이미지 조정</span>
                                {imageChg ?
                                    <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setImageChg(false)}/>
                                :
                                    <MdToggleOff size={30} onClick={() => setImageChg(true)}/>
                                }
                            </div>
                        </div>
                    </>
                    }
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

export default PraiseCanvas;