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
import { BsCircle } from "react-icons/bs";
import { BsImage } from "react-icons/bs";
import { GiPalette } from "react-icons/gi";
import { RxText } from "react-icons/rx";
import { FaStamp } from 'react-icons/fa';
import { RiImageAddLine } from 'react-icons/ri';
import { MdToggleOn } from 'react-icons/md';
import { MdToggleOff } from 'react-icons/md';
import { TbArrowBack } from 'react-icons/tb';
import { LuPipette } from 'react-icons/lu';
import { TfiPrinter } from 'react-icons/tfi'
import { AiOutlineDeliveredProcedure } from 'react-icons/ai';
import * as CommonAxios from "./../../CommonAxios";
import ProgressBar from '../../bar/ProgressBar';
import faceShape from '../../../assets/faceShape/faceShape';
import faceIcon from '../../../assets/faceIcon/faceIcon';
import ReactToPrint from "react-to-print";
import TemaDualKonva from './TemaDualKonva';
import TestTemaKonva from './TestTemaKonva';

const CustomCanvas = () => {

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

    const [selectMenu, setSelectMenu] = useState(null);         // 우측 메뉴 선택 데이터

    const [settingSize, setSize ] = useState(450);      // 선택된 사이즈별 중앙 원의 크기
    const [mgSize, setMgSize] = useState(0);            // 선택된 사이즈별 중앙 원의 padding 및 margin값
    const [sizeBool, setSizeBool] = useState(false);    // 사이즈 계산 여부

    const settingMenu = (data) => {
        setSelectMenu(data);
    }

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

    const [imgOption, setImgOption] = useState(1);              // 이미지 타입 종류

    const [testShape, setTestShape] = useState(null);           // 도장 유형 데이터
    const [selectShape, setSelectShape] = useState(null);       // 도장 유형 적용 데이터
    const [testNum, setTestNum] = useState(0);
    const [clipNum, setClipNum] = useState(100);

    const [testData, setTestData] = useState([]);
    const [imgArr, setImgArr] = useState([]);                   // 실질적 이미지+도장유형 배열
    const [imgNo, setImgNo] = useState(0);                      // 이미지 고유 번호

    const cancelShape = () => {
        setTestData([]);
        setTestShape(null);
    }
    const submitShape = () => {
        setSelectShape(testShape);
        setTestShape(null);
        setTestData([]);
    }

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

    useEffect(() => {
        if(selectedImage != null){
            let data = {
                id: "bgimg",
                img: selectedImage,
                no: imgNo+1,
            }
            setImgNo(imgNo+1);
            if(imgArr.length>0){
                let filter = imgArr.filter((item) => item.id == "bgimg");
                if(filter.length > 0){
                    let filter2 = imgArr.filter((item) => item.id != "bgimg");
                    setImgArr([...filter2, data]);
                } else {
                    setImgArr([...imgArr, data]);
                }
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

    const [insertNum, setInsertNum] = useState(null);


    useEffect(() => {}, [lightValue, contrastValue, imgHeight, imgWidth, convtSwtch, imgLoad,  imgArr, mgSize])


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

    const chgOption = (e) => {
        setImgOption(e.target.value)
    }

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


    return (
        <>
            <div className={style.dot_left_menu}>
            {selectMenu && selectMenu == "shape" &&
                    <>
                        <hr></hr>
                        <div className={style.dot_menu_title}>맞춤틀 선택</div>
                        <div className={style.dot_shape_div}>
                            <Scrollbars thumbsize={125}>
                                <img src={faceShape.img1} onClick={() => setTestShape(faceShape.img1)} />
                                <img src={faceShape.img2} onClick={() => setTestShape(faceShape.img2)} />
                                <img src={faceShape.img3} onClick={() => setTestShape(faceShape.img3)} />
                                <img src={faceShape.img4} onClick={() => setTestShape(faceShape.img4)} />
                                <img src={faceShape.img5} onClick={() => setTestShape(faceShape.img5)} />
                                <img src={faceShape.img6} onClick={() => setTestShape(faceShape.img6)} />
                                <img src={faceShape.img7} onClick={() => setTestShape(faceShape.img7)} />
                                <img src={faceShape.img8} onClick={() => setTestShape(faceShape.img8)} />
                                <img src={faceShape.img9} onClick={() => setTestShape(faceShape.img9)} />
                                <img src={faceShape.img10} onClick={() => setTestShape(faceShape.img10)} />
                                <img src={faceShape.img11} onClick={() => setTestShape(faceShape.img11)} />
                                <img src={faceShape.img12} onClick={() => setTestShape(faceShape.img12)} />
                                <img src={faceShape.img13} onClick={() => setTestShape(faceShape.img13)} />
                                <img src={faceShape.img14} onClick={() => setTestShape(faceShape.img14)} />
                                <img src={faceShape.img15} onClick={() => setTestShape(faceShape.img15)} />
                                <img src={faceShape.img16} onClick={() => setTestShape(faceShape.img16)} />
                                <img src={faceShape.img17} onClick={() => setTestShape(faceShape.img17)} />
                                <img src={faceShape.img18} onClick={() => setTestShape(faceShape.img18)} />
                                <img src={faceShape.img19} onClick={() => setTestShape(faceShape.img19)} />
                                <img src={faceShape.img20} onClick={() => setTestShape(faceShape.img20)} />
                                <img src={faceShape.img21} onClick={() => setTestShape(faceShape.img21)} />
                                <img src={faceShape.img22} onClick={() => setTestShape(faceShape.img22)} />
                            </Scrollbars>
                        </div>
                        <div className={style.dot_shape_btn_area}>
                            <button onClick={() => cancelShape()}>취 소</button>
                            <button onClick={() => submitShape()}>적 용</button>
                        </div>
                    </>
                }
                { selectMenu && selectMenu == "image" &&
                    <>
                        <hr></hr>
                        <div className={style.dot_menu_title}>밝기/대비 조정</div>
                        <div className='pg_line'>
                            <span>밝기</span>
                            <button onClick={()=>chgLight("-")}>-</button>
                                <ProgressBar value={testLight} min={5} max={15} setValue={uptValue} type={"light"} />
                            <button onClick={()=>chgLight("+")}>+</button>
                        </div>
                        <div className='pg_line' style={{marginBottom: "25px"}}>
                            <span>대비</span>
                            <button onClick={()=>chgContrast("-")}>-</button>
                                <ProgressBar value={testCon} min={5} max={15} setValue={uptValue} type={"contrast"} />
                            <button onClick={()=>chgContrast("+")}>+</button>
                        </div>
                        <hr></hr>
                        <div className={style.dot_menu_title}>이미지 영역 편집</div>
                        <div className={style.dot_edit_area}>
                            <div>
                                <div>이미지 조정</div>
                                <div className={style.dot_edit_toggle}>
                                    {imgModify ?
                                        <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setImgModify(false)}/>
                                    :
                                        <MdToggleOff size={30} onClick={() => setImgModify(true)}/>
                                    }
                                </div>
                            </div>
                            <div>
                                상/하 반전
                                <div className={style.dot_image_toggle}>
                                    {testVt == 1 ?
                                        <MdToggleOff size={30} onClick={() => setTestVt(-1)}/>
                                    :
                                        <MdToggleOn size={30} color={"rgb(35,172,160)"} onClick={() => setTestVt(1)}/>
                                    }
                                </div>
                            </div>
                            <div>
                                좌/우 반전
                                <div className={style.dot_image_toggle}>
                                    {testHz == 1 ?
                                        <MdToggleOff size={30} onClick={() => setTestHz(-1)}/>
                                    :
                                        <MdToggleOn size={30} color={"rgb(35,172,160)"} onClick={() => setTestHz(1)}/>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={style.dot_shape_btn_area}>
                            <button onClick={() => cancelImage()}>취 소</button>
                            <button onClick={() => submitImage()}>적 용</button>
                        </div>
                    </>
                }
                {selectMenu && selectMenu == "drawing" &&
                    <>
                        <hr></hr>
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
                            <div>
                                <div>배경색 변경</div>
                                <div className={style.dot_edit_button2} onClick={handleImgClick}>
                                    <div style={imgClick ? {background:"rgb(91, 91, 91)"} : {background:"white"}}>
                                        <LuPipette size={20} color={imgClick ? "white" : "rgb(91, 91, 91)"} />
                                    </div>
                                </div>
                            </div>
                        </div>
                        <hr></hr>
                        <div className={style.dot_menu_title}>아이콘 리스트</div>
                        <div className={style.dot_shape_div3}>
                            <Scrollbars thumbsize={125}>
                                <img src={faceIcon.img1} onClick={() => tempSelectImg(faceIcon.img1)} />
                                <img src={faceIcon.img2} onClick={() => tempSelectImg(faceIcon.img2)} />
                                <img src={faceIcon.img3} onClick={() => tempSelectImg(faceIcon.img3)} />
                                <img src={faceIcon.img4} onClick={() => tempSelectImg(faceIcon.img4)} />
                                <img src={faceIcon.img5} onClick={() => tempSelectImg(faceIcon.img5)} />
                                <img src={faceIcon.img6} onClick={() => tempSelectImg(faceIcon.img6)} />
                                <img src={faceIcon.img7} onClick={() => tempSelectImg(faceIcon.img7)} />
                                <img src={faceIcon.img8} onClick={() => tempSelectImg(faceIcon.img8)} />
                                <img src={faceIcon.img9} onClick={() => tempSelectImg(faceIcon.img9)} />
                                <img src={faceIcon.img10} onClick={() => tempSelectImg(faceIcon.img10)} />
                                <img src={faceIcon.img11} onClick={() => tempSelectImg(faceIcon.img11)} />
                                <img src={faceIcon.img12} onClick={() => tempSelectImg(faceIcon.img12)} />
                                <img src={faceIcon.img13} onClick={() => tempSelectImg(faceIcon.img13)} />
                                <img src={faceIcon.img14} onClick={() => tempSelectImg(faceIcon.img14)} />
                                <img src={faceIcon.img15} onClick={() => tempSelectImg(faceIcon.img15)} />
                                <img src={faceIcon.img16} onClick={() => tempSelectImg(faceIcon.img16)} />
                                <img src={faceIcon.img17} onClick={() => tempSelectImg(faceIcon.img17)} />
                                <img src={faceIcon.img18} onClick={() => tempSelectImg(faceIcon.img18)} />
                                <img src={faceIcon.img19} onClick={() => tempSelectImg(faceIcon.img19)} />
                                <img src={faceIcon.img20} onClick={() => tempSelectImg(faceIcon.img20)} />
                                <img src={faceIcon.img21} onClick={() => tempSelectImg(faceIcon.img21)} />
                                <img src={faceIcon.img22} onClick={() => tempSelectImg(faceIcon.img22)} />
                                <img src={faceIcon.img23} onClick={() => tempSelectImg(faceIcon.img23)} />
                                <img src={faceIcon.img24} onClick={() => tempSelectImg(faceIcon.img24)} />
                                <img src={faceIcon.img25} onClick={() => tempSelectImg(faceIcon.img25)} />
                                <img src={faceIcon.img26} onClick={() => tempSelectImg(faceIcon.img26)} />
                                <img src={faceIcon.img27} onClick={() => tempSelectImg(faceIcon.img27)} />
                                <img src={faceIcon.img28} onClick={() => tempSelectImg(faceIcon.img28)} />
                                <img src={faceIcon.img29} onClick={() => tempSelectImg(faceIcon.img29)} />
                            </Scrollbars>
                        </div>
                        <div className={style.dot_edit_area}>
                            <div>
                                <div>색상</div>
                                <div className='dot_color_btn'>
                                    <span>검은색</span>
                                    <div style={iconColor == "black" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setIconColor("black")} />
                                    <span>흰색</span>
                                    <div style={iconColor == "white" ? {border: "5px solid rgb(35,172,160)"} : {border : "1px solid rgb(35,172,160)"}} onClick={() => setIconColor("white")} />
                                </div>
                            </div>
                            <div>
                                <div>윤곽선</div>
                                <div className={style.dot_edit_toggle}>
                                    {iconStroke ?
                                        <MdToggleOn color={"rgb(35,172,160)"} size={30} onClick={() => setIconStroke(false)}/>
                                    :
                                        <MdToggleOff size={30} onClick={() => setIconStroke(true)}/>
                                    }
                                </div>
                            </div>
                        </div>
                        <div className={style.dot_shape_btn_area}>
                            <button onClick={() => cancelDraw()}>취 소</button>
                            <button onClick={() => submitDraw()}>적 용</button>
                        </div>
                    </>
                }
                {selectMenu && selectMenu == "text" &&
                    <>
                        <hr></hr>
                        <div className={style.dot_menu_title}>글자 정보</div>
                        <div className={style.dot_flex_div}>
                            <div>서체</div>
                            <select style={{fontFamily:"Jua"}} onChange={(e) => fontChange(e, "family")}>
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
                            <input type="text" style={{width: "150px", paddingLeft: "10px"}} onChange={(e) => fontChange(e, "data")} />
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
                </div>
                <div className={style.chg_dom} ref={canvRef} style={convtSwtch == false ? {filter:`grayscale(1) brightness(${lightValue/10}) contrast(${contrastValue/10})`} : null}>
                    <TemaDualKonva 
                        sw={imgWidth} sh={imgHeight} pos={position} arrData={imgArr} ips={mgSize} showSize={settingSize}
                        objValue={selectObj} uptObj={uptObj} bgChg={imgClick} uptBg={uptBg} former={imgModify}
                        convert={cvtData} pixelate={imgPixelate} imgMove={imageChg} users={user} endEvt={endEvent}
                    />
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
                <Link to="/dotset/custom">
                    <div className={style.btn_area}>
                        <div className={style.btn_circle}>
                            <BiArrowBack size={30} color={"white"} />
                        </div>
                        <div>이전으로</div>
                    </div>
                </Link>
                <div className={style.dot_tema_menu_title}>
                    <hr></hr>
                    <div>메뉴</div>
                </div>
                {convtSwtch == false ? 
                <>
                    <div className={style.style_btn_area}>
                        <div className={style.style_btn} style={selectMenu == "shape" ? { backgroundColor: "rgb(91, 91, 91)", color:"white"} : null} onClick={() => settingMenu("shape")}>
                            <div className={style.style_btn_icon} style={selectMenu == "shape" ? { border:"2px solid white"} : null}>
                                <BsCircle size={40} />
                            </div>
                            <span>맞춤틀 선택</span>
                        </div>
                        <div className={style.style_btn} style={ selectShape ? null : {display:"none"}} onClick={handleDivClick}>
                            <div className={style.style_btn_icon}>
                                <RiImageAddLine size={36} color={"white"} />
                            </div>
                            <span>이미지 업로드</span>
                            <input style={{display:"none"}} type="file" ref={inputRef} accept="image/*" onChange={handleImageUpload} />
                        </div>
                        <div className={style.style_btn} style={selectMenu == "image" ? { backgroundColor: "rgb(91, 91, 91)", color:"white"} : null} onClick={() => settingMenu("image")}>
                            <div className={style.style_btn_icon} style={selectMenu == "image" ? { backgroundColor:"white" } : null}>
                                <BsImage size={36} color={selectMenu == "image" ? "rgb(91, 91, 91)" : "white"} />
                            </div>
                            <span>이미지 도구</span>
                        </div>
                        <div className={style.style_btn} style={selectMenu == "drawing" ? { backgroundColor: "rgb(91, 91, 91)", color:"white"} : null} onClick={() => settingMenu("drawing")}>
                            <div className={style.style_btn_icon} style={selectMenu == "drawing" ? { backgroundColor:"white" } : null}>
                                <GiPalette size={40} color={selectMenu == "drawing" ? "rgb(91, 91, 91)" : "white"} />
                            </div>
                            <span>그리기 도구</span>
                        </div>
                        <div className={style.style_btn} style={selectMenu == "text" ? { backgroundColor: "rgb(91, 91, 91)", color:"white"} : null} onClick={() => settingMenu("text")}>
                            <div className={style.style_btn_icon} style={selectMenu == "text" ? { backgroundColor:"white" } : null}>
                                <RxText size={40} color={selectMenu == "text" ? "rgb(91, 91, 91)" : "white"} />
                            </div>
                            <span>글자 도구</span>
                        </div>
                        <div className={style.style_btn} onClick={convertImg}>
                            <div className={style.style_btn_icon}>
                                <FaStamp size={30} color={"white"} />
                            </div>
                            <span>페이스도장 변환</span>
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

export default CustomCanvas;