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
import wedding from '../../../assets/wedding/weddingImg';
import ReactToPrint from "react-to-print";
import TextDualKonva from './TextDualKonva';
import TestTemaKonva from './TestTemaKonva';
import TextKonva from './TextKonva';

const WeddingCanvas = () => {

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

    const [selectedImage, setSelectedImage] = useState(null);   // 이미지 URL 주소
    const inputRef = useRef(null);
    const imgRef = useRef(null);

    // 우측 이미지(배경 이미지) 업로드시
    useEffect(() => {
        if(selectedImage != null){
            let data = {
                id: "bgimg",
                img: selectedImage,
                no: imgNo+1,
                type: "img"
            }
            setImgNo(imgNo+1);
            // 기존에 적용된 도장 유형 or 업로드된 이미지가 있는 경우
            if(imgArr.length>0){
                let filter = imgArr.filter((item) => item.id == "bgimg");
                // 기존에 적용된 배경 이미지가 있는 경우
                if(filter.length > 0){
                    let filter2 = imgArr.filter((item) => item.id != "bgimg");
                    setImgArr([...filter2, data]);
                // 기존에 적용된 배경 이미지가 없는 경우
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

    const [fontFamily, setFontFamily] = useState("Jua");        // 폰트종류
    const [fontsize, setFontsize] = useState(35);               // 폰트사이즈
    const [fontData, setFontData] = useState("");               // 입력한 내용
    const [fontcolor, setFontcolor] = useState("black");        // 폰트 색상(검, 흰)
    const [fontstroke, setFontstroke] = useState(false);        // 폰트 윤곽선
    const [fontsys, setFontsys] = useState("horizon");          // 폰트 모양(가로/세로)
    const [fontCurve, setFontCurve] = useState(false);          // 폰트 곡선 유무
    const [fontOption, setFontOption] = useState(1);            // 폰트 곡선 방향(1: 위/왼 , 2: 아래/오른)
    const [textArr, setTextArr] = useState([]);                 // 곡선 글자 배열

    const fontChange = (e, type) => {
        if(type == "family"){
            setFontFamily(e.target.value);
        } else if(type == "size"){
            let data = e.target.value;
            if (/^[0-9]*$/.test(data)) {
                if(data != ""){
                    let parseData = parseInt(data);
                    if(parseData > 50 || parseData < 1){
                        parseData = fontsize;
                    }
                    setFontsize(parseData);
                } else {
                    setFontsize(0);
                }
            }
        } else if(type == "data"){
            setFontData(e.target.value);
        }
    }

    const [ konvaNum, setKonvaNum ] = useState(0);

    const submitText = () => {
        let data = {
            id: imgNo +1,
            family: fontFamily,
            size: fontsize,
            contents: fontData,
            color: fontcolor,
            stroke: fontstroke,
            fontsys: fontsys,
            curve: fontCurve,
            option: fontOption,
            type:"text"
        }
        setImgArr([...imgArr, data]);
        // if(fontCurve == true){
        //     setTextArr([...textArr, data]);
        // } else {
        //     setImgArr([...imgArr, data]);
        // }
        // 선택한 데이터 초기화
        setKonvaNum(konvaNum+1);
        setImgNo(imgNo+1);
        setFontFamily("Jua");
        setFontsize(35);
        setFontData("");
        setFontstroke(false);
        setFontsys("horizon");
        setFontCurve(false);
        setFontOption(1); 
    }

    const cancelText = () => {
        
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
                        type: "img",
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
                <div className={style.dot_menu_title}>웨딩 도장</div>
                <div className={style.dot_shape_div} style={{height: "200px"}}>
                    <Scrollbars thumbsize={125}>
                        <img src={wedding.img1} onClick={() => setTestShape(wedding.img1)} />
                        <img src={wedding.img2} onClick={() => setTestShape(wedding.img2)} />
                        <img src={wedding.img3} onClick={() => setTestShape(wedding.img3)} />
                        <img src={wedding.img4} onClick={() => setTestShape(wedding.img4)} />
                        <img src={wedding.img5} onClick={() => setTestShape(wedding.img5)} />
                        <img src={wedding.img6} onClick={() => setTestShape(wedding.img6)} />
                        <img src={wedding.img7} onClick={() => setTestShape(wedding.img7)} />
                        <img src={wedding.img8} onClick={() => setTestShape(wedding.img8)} />
                    </Scrollbars>
                </div>
                <div className={style.dot_shape_btn_area}>
                    <button onClick={() => cancelShape()}>취 소</button>
                    <button onClick={() => submitShape()}>적 용</button>
                </div>
                <hr style={{marginTop:"20px"}}></hr>
                <div className={style.dot_menu_title}>글자 정보</div>
                <div className={style.dot_flex_div}>
                    <div>서체</div>
                    <select style={{fontFamily:"Jua"}} value={fontFamily} onChange={(e) => fontChange(e, "family")}>
                        <option value={"Jua"} style={{fontFamily:"Jua"}}>주아</option>
                        <option value={"Hanna"} style={{fontFamily:"Hanna"}}>한나는 열한살</option>
                        <option value={"Nanum Gothic"} style={{fontFamily:"Nanum Gothic"}}>나눔고딕</option>
                        <option value={"Nanum Square"} style={{fontFamily:"Nanum Square"}}>나눔스퀘어</option>
                        <option value={"Nanum Myeongjo"} style={{fontFamily:"Nanum Myeongjo"}}>나눔명조</option>
                        <option value={"Monsori"} style={{fontFamily:"Monsori"}}>몬소리</option>
                        <option value={"GodoMaum"} style={{fontFamily:"GodoMaum"}}>고도마음체</option>
                    </select>
                </div>
                <div className={style.dot_flex_div}>
                    <div>크기</div>
                    <input type="text" style={{width: "60px", textAlign: "center"}} value={fontsize} onChange={(e) => fontChange(e, "size")} />
                </div>
                <div className={style.dot_flex_div}>
                    <div>내용</div>
                    <input type="text" style={{width: "150px", paddingLeft: "10px"}} value={fontData} onChange={(e) => fontChange(e, "data")} />
                </div>
                <div className={style.dot_edit_area}>
                    <div>
                        <div>색상</div>
                        <div className='dot_color_btn'>
                            <span>검은색</span>
                            <div style={fontcolor == "black" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontcolor("black")} />
                            <span>흰색</span>
                            <div style={fontcolor == "white" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontcolor("white")} />
                        </div>
                    </div>
                    <div>
                        <div>윤곽선</div>
                        <div className={style.dot_edit_toggle}>
                            {fontstroke ?
                                <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setFontstroke(false)}/>
                            :
                                <MdToggleOff size={30} onClick={() => setFontstroke(true)}/>
                            }
                        </div>
                    </div>
                </div>
                <hr></hr>
                <div className={style.dot_menu_title}>글자 모양</div>
                <div className={style.dot_edit_area}>
                    <div className={style.dot_font_style}>
                        <span>가로쓰기</span>
                        <div style={fontsys == "horizon" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontsys("horizon")} />
                        <span>세로쓰기</span>
                        <div style={fontsys == "vertical" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontsys("vertical")} />
                    </div>
                    <div>
                        <div>곡선쓰기</div>
                        <div className={style.dot_edit_toggle}>
                            {fontCurve ?
                                <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setFontCurve(false)}/>
                            :
                                <MdToggleOff size={30} onClick={() => setFontCurve(true)}/>
                            }
                        </div>
                    </div>
                    {fontCurve && 
                        <div className={style.dot_font_style}>
                            {fontsys == "horizon" ?
                                <span>위</span> : <span>왼쪽</span>
                            }
                            <div style={fontOption == 1 ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontOption(1)} />
                            {fontsys == "horizon" ?
                                <span>아래</span> : <span>오른쪽</span>
                            }
                            <div style={fontOption == 2 ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setFontOption(2)} />
                        </div>
                    }
                </div>
                <div className={style.dot_shape_btn_area}>
                    <button onClick={() => cancelText()}>취 소</button>
                    <button onClick={() => submitText()}>적 용</button>
                </div>
            </>
            }
            </div>
            <div className={style.canvas_area} style={{minWidth: "700px", minHeight: "700px", padding:"125px", position:"relative"}}>
                <div className={style.stamp_canvas} ref={compRef} style={{width:`${settingSize}px`, height: `${settingSize}px`, padding:`${mgSize}px`}}>
                    
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
                    style={convtSwtch == false ? 
                        {filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`} 
                    : null}
                >
                    {/* <DrawTemaKonva 
                        sw={imgWidth} sh={imgHeight} pos={position} arrData={imgArr} showSize={settingSize}
                        objValue={selectObj} uptObj={uptObj} bgChg={imgClick} uptBg={uptBg} former={imgModify}
                        convert={cvtData} pixelate={imgPixelate} imgMove={imageChg} users={user} endEvt={endEvent}
                        mode={modeName} bool={drawingMode} color={lineColor} linesDelete={linesToDelete} lineWeight={lineWeight}
                    /> */}
                    <TextDualKonva 
                        sw={imgWidth} sh={imgHeight} pos={position} arrData={imgArr} ips={mgSize} showSize={settingSize}
                        objValue={selectObj} uptObj={uptObj} bgChg={imgClick} uptBg={uptBg} former={imgModify}
                        convert={cvtData} pixelate={imgPixelate} imgMove={imageChg} users={user} endEvt={endEvent}
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
                <div className={style.chg_dom} style={{pointerEvents:"none"}}>
                    {fontData != "" &&
                        <TextKonva showSize={settingSize} family={fontFamily} fontsize={fontsize} fontdata={fontData} fontcolor={fontcolor} fontstroke={fontstroke} fontsys={fontsys} curveBool={fontCurve} curveOption={fontOption} />
                    }
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

export default WeddingCanvas;